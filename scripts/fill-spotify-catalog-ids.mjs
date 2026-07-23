/**
 * Match catalogue songs (documented / lore) to Spotify track IDs via Search API.
 *
 * Status promotion on high-confidence match:
 *   documented → verified
 *   lore       → documented  (never jump lore straight to verified)
 *
 * Default is dry-run. Pass --apply to write content/songs/catalog.json.
 *
 * Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
 * Usage:
 *   npm run fill:spotify-catalog
 *   npm run fill:spotify-catalog -- --apply
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "content", "songs", "catalog.json");
const reportPath = path.join(root, "scripts", "out", "spotify-catalog-candidates.json");
const apply = process.argv.includes("--apply");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET (set in .env.local).",
  );
  process.exit(1);
}

function normalizeTitle(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/feat\.?|ft\.?/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Host / credited artist from a catalogue `artists` string, for search bias. */
function hostArtistHint(artists) {
  if (!artists) return null;
  const raw = String(artists)
    .replace(/^featuring\s+/i, "")
    .replace(/\s+ft\.?\s+/i, " ")
    .split(/[,&]/)[0]
    .trim();
  if (!raw || /^olamide$/i.test(raw)) return null;
  return raw;
}

function artistsIncludeOlamide(track) {
  const names = (track.artists || []).map((a) => a.name.toLowerCase());
  return names.some((n) => n.includes("olamide"));
}

function titleConfidence(localTitle, spotifyTitle) {
  const want = normalizeTitle(localTitle);
  const got = normalizeTitle(spotifyTitle);
  if (!want || !got) return "none";
  if (want === got) return "exact";
  // Near-exact: one contains the other and shorter side is substantial.
  const shorter = want.length <= got.length ? want : got;
  const longer = want.length <= got.length ? got : want;
  if (shorter.length >= 4 && longer.includes(shorter)) {
    const ratio = shorter.length / longer.length;
    if (ratio >= 0.7) return "near";
  }
  return "none";
}

async function getAccessToken() {
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.access_token;
}

async function searchTracks(token, query) {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "10");
  url.searchParams.set("market", "NG");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 429) {
    const retry = Number(res.headers.get("retry-after") || "2");
    await sleep((retry + 0.5) * 1000);
    return searchTracks(token, query);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify search ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.tracks?.items ?? [];
}

/**
 * Pick a single high-confidence track, or null with a reason for the report.
 */
function pickMatch(entry, tracks) {
  const withOlamide = tracks.filter(artistsIncludeOlamide);
  if (withOlamide.length === 0) {
    return { accept: false, reason: "no_olamide_artist", candidates: tracks.slice(0, 5) };
  }

  const scored = withOlamide
    .map((t) => ({
      track: t,
      conf: titleConfidence(entry.title, t.name),
    }))
    .filter((x) => x.conf === "exact" || x.conf === "near");

  if (scored.length === 0) {
    return {
      accept: false,
      reason: "title_mismatch",
      candidates: withOlamide.slice(0, 5),
    };
  }

  // Prefer exact over near; if multiple exact with different IDs → ambiguous.
  const exact = scored.filter((x) => x.conf === "exact");
  const pool = exact.length > 0 ? exact : scored;
  const uniqueIds = new Set(pool.map((x) => x.track.id));
  if (uniqueIds.size > 1) {
    return {
      accept: false,
      reason: "ambiguous",
      candidates: pool.map((x) => x.track).slice(0, 5),
    };
  }

  const best = pool[0];
  return {
    accept: true,
    confidence: best.conf,
    track: best.track,
  };
}

function summarizeCandidate(track) {
  return {
    id: track.id,
    name: track.name,
    artists: (track.artists || []).map((a) => a.name).join(", "),
    album: track.album?.name,
    url: track.external_urls?.spotify,
  };
}

function nextStatus(current) {
  if (current === "documented") return "verified";
  if (current === "lore") return "documented";
  return current;
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const entries = catalog.entries ?? [];

const token = await getAccessToken();

const accepted = [];
const rejected = [];
const skipped = [];

for (const entry of entries) {
  if (entry.spotifyTrackId) {
    skipped.push({ id: entry.id, reason: "already_has_id" });
    continue;
  }
  if (entry.status !== "documented" && entry.status !== "lore") {
    skipped.push({ id: entry.id, reason: `status_${entry.status}` });
    continue;
  }

  const host = hostArtistHint(entry.artists);
  const queries = [];
  // Primary: title + Olamide
  queries.push(`track:"${entry.title}" artist:Olamide`);
  // Features: also try host artist
  if (entry.type === "feature" && host) {
    queries.push(`track:"${entry.title}" artist:${host} Olamide`);
  }
  // Broader fallback without track: quote if the quoted search returns nothing useful
  queries.push(`${entry.title} Olamide`);

  let decision = null;
  let usedQuery = null;
  for (const q of queries) {
    const tracks = await searchTracks(token, q);
    await sleep(350);
    const pick = pickMatch(entry, tracks);
    if (pick.accept) {
      decision = pick;
      usedQuery = q;
      break;
    }
    // Keep the most informative rejection from the last query.
    decision = pick;
    usedQuery = q;
  }

  if (decision?.accept) {
    const statusTo = nextStatus(entry.status);
    accepted.push({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      statusFrom: entry.status,
      statusTo,
      confidence: decision.confidence,
      query: usedQuery,
      spotifyTrackId: decision.track.id,
      spotify: summarizeCandidate(decision.track),
    });
  } else {
    rejected.push({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      status: entry.status,
      artists: entry.artists,
      reason: decision?.reason ?? "no_results",
      query: usedQuery,
      candidates: (decision?.candidates || []).map(summarizeCandidate),
    });
  }
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  apply,
  counts: {
    accepted: accepted.length,
    rejected: rejected.length,
    skipped: skipped.length,
    documentedToVerified: accepted.filter(
      (a) => a.statusFrom === "documented" && a.statusTo === "verified",
    ).length,
    loreToDocumented: accepted.filter(
      (a) => a.statusFrom === "lore" && a.statusTo === "documented",
    ).length,
  },
  accepted,
  rejected,
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `${apply ? "APPLY" : "DRY-RUN"} — accepted ${accepted.length}, rejected ${rejected.length}, skipped ${skipped.length}`,
);
console.log(
  `  documented→verified: ${report.counts.documentedToVerified}`,
);
console.log(`  lore→documented: ${report.counts.loreToDocumented}`);
console.log(`Report: ${path.relative(root, reportPath)}`);

if (apply && accepted.length > 0) {
  const byId = new Map(accepted.map((a) => [a.id, a]));
  for (const entry of entries) {
    const hit = byId.get(entry.id);
    if (!hit) continue;
    entry.spotifyTrackId = hit.spotifyTrackId;
    entry.status = hit.statusTo;
  }
  catalog.entries = entries;
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${accepted.length} updates to content/songs/catalog.json`);
} else if (apply) {
  console.log("Nothing to apply.");
} else {
  console.log("Re-run with --apply to write accepted matches.");
}
