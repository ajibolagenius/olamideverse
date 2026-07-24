/**
 * Match catalogue songs (documented / lore) to Spotify track IDs via Search API.
 *
 * Status promotion on high-confidence match:
 *   documented → verified
 *   lore       → documented  (never jump lore straight to verified)
 *
 * Default is dry-run. Pass --apply to write content/songs/catalog.json.
 * Resumes from scripts/out/spotify-catalog-progress.json if present.
 *
 * Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
 * Usage:
 *   npm run fill:spotify-catalog
 *   npm run fill:spotify-catalog -- --apply
 *   npm run fill:spotify-catalog -- --reset   # clear progress and start fresh
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "content", "songs", "catalog.json");
const outDir = path.join(root, "scripts", "out");
const reportPath = path.join(outDir, "spotify-catalog-candidates.json");
const progressPath = path.join(outDir, "spotify-catalog-progress.json");
const apply = process.argv.includes("--apply");
const reset = process.argv.includes("--reset");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
/** Delay between Search calls — stay under Spotify rate limits. */
const REQUEST_GAP_MS = 800;
/** Soft 429 waits only; longer Retry-After aborts so we can resume later. */
const MAX_RETRY_WAIT_S = 30;

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

class RateLimitError extends Error {
  constructor(retryAfterS) {
    super(`Spotify rate limited (Retry-After: ${retryAfterS}s)`);
    this.retryAfterS = retryAfterS;
  }
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
    if (retry > MAX_RETRY_WAIT_S) {
      throw new RateLimitError(retry);
    }
    console.warn(`  429 — waiting ${retry}s…`);
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

function loadProgress() {
  if (reset && fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath);
    console.log("Cleared progress (--reset).");
  }
  if (!fs.existsSync(progressPath)) {
    return { accepted: [], rejected: [], skipped: [], doneIds: [] };
  }
  const p = JSON.parse(fs.readFileSync(progressPath, "utf8"));
  return {
    accepted: p.accepted ?? [],
    rejected: p.rejected ?? [],
    skipped: p.skipped ?? [],
    doneIds: p.doneIds ?? [],
  };
}

function saveProgress(progress) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    progressPath,
    `${JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }, null, 2)}\n`,
  );
}

function writeReport(progress, extra = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    apply,
    ...extra,
    counts: {
      accepted: progress.accepted.length,
      rejected: progress.rejected.length,
      skipped: progress.skipped.length,
      documentedToVerified: progress.accepted.filter(
        (a) => a.statusFrom === "documented" && a.statusTo === "verified",
      ).length,
      loreToDocumented: progress.accepted.filter(
        (a) => a.statusFrom === "lore" && a.statusTo === "documented",
      ).length,
    },
    accepted: progress.accepted,
    rejected: progress.rejected,
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const entries = catalog.entries ?? [];
const progress = loadProgress();
const done = new Set(progress.doneIds);

const todo = entries.filter((e) => {
  if (done.has(e.id)) return false;
  if (e.spotifyTrackId) {
    progress.skipped.push({ id: e.id, reason: "already_has_id" });
    done.add(e.id);
    return false;
  }
  if (e.status !== "documented" && e.status !== "lore") {
    progress.skipped.push({ id: e.id, reason: `status_${e.status}` });
    done.add(e.id);
    return false;
  }
  return true;
});

console.log(
  `${apply ? "APPLY" : "DRY-RUN"} — ${todo.length} remaining (${done.size} already processed)`,
);

let token = await getAccessToken();
let aborted = null;

try {
  for (let i = 0; i < todo.length; i++) {
    const entry = todo[i];
    const n = i + 1;
    process.stdout.write(`[${n}/${todo.length}] ${entry.id} … `);

    const host = hostArtistHint(entry.artists);
    const queries = [`track:"${entry.title}" artist:Olamide`];
    if (entry.type === "feature" && host) {
      queries.push(`track:"${entry.title}" artist:"${host}" Olamide`);
    }
    // One broader fallback only
    queries.push(`${entry.title} Olamide`);

    let decision = null;
    let usedQuery = null;
    for (const q of queries) {
      const tracks = await searchTracks(token, q);
      await sleep(REQUEST_GAP_MS);
      const pick = pickMatch(entry, tracks);
      if (pick.accept) {
        decision = pick;
        usedQuery = q;
        break;
      }
      decision = pick;
      usedQuery = q;
    }

    if (decision?.accept) {
      const statusTo = nextStatus(entry.status);
      progress.accepted.push({
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
      console.log(`OK → ${statusTo} (${decision.confidence})`);
    } else {
      progress.rejected.push({
        id: entry.id,
        title: entry.title,
        type: entry.type,
        status: entry.status,
        artists: entry.artists,
        reason: decision?.reason ?? "no_results",
        query: usedQuery,
        candidates: (decision?.candidates || []).map(summarizeCandidate),
      });
      console.log(`skip (${decision?.reason ?? "no_results"})`);
    }

    done.add(entry.id);
    progress.doneIds = [...done];
    // Checkpoint every entry so a rate-limit abort keeps work.
    if (n % 5 === 0 || n === todo.length) saveProgress(progress);
  }
} catch (err) {
  if (err instanceof RateLimitError) {
    aborted = err;
    saveProgress(progress);
    const hours = (err.retryAfterS / 3600).toFixed(1);
    console.error(
      `\nRate limited by Spotify (Retry-After ~${hours}h). Progress saved — re-run later to resume.`,
    );
  } else {
    saveProgress(progress);
    throw err;
  }
}

progress.doneIds = [...done];
saveProgress(progress);
const report = writeReport(progress, aborted ? { aborted: aborted.message } : {});

console.log(
  `\nAccepted ${report.counts.accepted}, rejected ${report.counts.rejected}, skipped ${report.counts.skipped}`,
);
console.log(`  documented→verified: ${report.counts.documentedToVerified}`);
console.log(`  lore→documented: ${report.counts.loreToDocumented}`);
console.log(`Report: ${path.relative(root, reportPath)}`);

if (aborted) {
  process.exit(2);
}

if (apply && progress.accepted.length > 0) {
  const byId = new Map(progress.accepted.map((a) => [a.id, a]));
  for (const entry of entries) {
    const hit = byId.get(entry.id);
    if (!hit || entry.spotifyTrackId) continue;
    entry.spotifyTrackId = hit.spotifyTrackId;
    entry.status = hit.statusTo;
  }
  catalog.entries = entries;
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote accepted matches to content/songs/catalog.json`);
} else if (apply) {
  console.log("Nothing to apply.");
} else if (!aborted) {
  console.log("Re-run with --apply to write accepted matches.");
}
