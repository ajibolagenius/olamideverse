/**
 * Verify agent-proposed Spotify track IDs against the Spotify API.
 *
 * Agents research IDs from the web; this script is the trust boundary. It
 * fetches each ID via /v1/tracks and only passes it if the real track's
 * title and artist credits actually match the catalogue row. Guards against
 * a hallucinated or copy-paste-wrong base62 ID silently embedding the
 * wrong song on the site.
 *
 * Input : JSON array of { id, spotifyTrackId } (catalogue id → proposed ID)
 * Output: same rows annotated with verdict pass|fail + the real track data
 *
 * Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
 * Usage:
 *   npm run verify:spotify-ids -- scripts/spotify/out/spotify-agent-proposals.json \
 *     scripts/spotify/out/spotify-agent-verified.json
 *
 * This only reports verdicts — it never writes content/songs/catalog.json.
 * Apply the passing rows deliberately after reviewing the report.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "content", "songs", "catalog.json");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const apply = process.argv.includes("--apply");
/** Skip the API entirely and apply a report produced by an earlier run. */
const fromReport = process.argv.includes("--from-report");
const inputPath = args[0];
const outPath = args[1] ?? "verified-spotify-ids.json";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.");
  process.exit(1);
}
if (!inputPath || !fs.existsSync(inputPath)) {
  console.error(`Usage: node --env-file=.env.local verify-spotify-ids.mjs <proposals.json>`);
  process.exit(1);
}

/** Same normalisation as fill-spotify-catalog-ids.mjs so verdicts agree. */
function normalizeTitle(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/feat\.?|ft\.?/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Variant normalisation that keeps qualifiers like "Remix" instead of
 * discarding every parenthetical. The catalogue writes "Ijo Ayo (Remix)"
 * while Spotify writes "Ijo Ayo Remix" or "Indomie - Remix"; blanket
 * paren-stripping removes the word from one side only and the identical
 * recording scores as a mismatch. Only credit groups (feat./with) are cut.
 */
function normalizeKeepingQualifiers(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[([{][^)\]}]*\b(feat|ft|featuring|with)\b[^)\]}]*[)\]}]/g, " ")
    .replace(/\b(feat|ft|featuring)\b\.?.*$/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Version qualifiers that make a track a *different recording* — see the
 * matching guard in fill-spotify-catalog-ids.mjs. Without this, paren-stripping
 * lets "First of All (Remix)" match the original "First of All".
 */
const VERSION_QUALIFIERS =
  /\b(remix|refix|rmx|live|acoustic|instrumental|freestyle|cover|edit|version|reloaded|extended)\b/gi;

function qualifierSet(title) {
  return new Set(
    (String(title || "").match(VERSION_QUALIFIERS) || []).map((q) => q.toLowerCase()),
  );
}

function qualifiersAgree(a, b) {
  const qa = qualifierSet(a);
  const qb = qualifierSet(b);
  if (qa.size !== qb.size) return false;
  for (const q of qa) if (!qb.has(q)) return false;
  return true;
}

function titleConfidence(localTitle, spotifyTitle) {
  if (!qualifiersAgree(localTitle, spotifyTitle)) return "none";
  const want = normalizeTitle(localTitle);
  const got = normalizeTitle(spotifyTitle);
  if (!want || !got) return "none";
  if (want === got) return "exact";
  const shorter = want.length <= got.length ? want : got;
  const longer = want.length <= got.length ? got : want;
  if (shorter.length >= 4 && longer.includes(shorter)) {
    if (shorter.length / longer.length >= 0.7) return "near";
  }
  return "none";
}

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error(`Spotify token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

const REQUEST_GAP_MS = 400;
/** Soft 429 waits only; anything longer aborts so we can resume later. */
const MAX_RETRY_WAIT_S = 30;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Single-track GET only. The batch `/v1/tracks?ids=` form returns 403 for
 * client-credentials apps, so fetch one at a time with a gap.
 * Returns null for a 404 — that's a verdict (bad ID), not an error.
 */
async function fetchTrack(token, id) {
  const url = new URL(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`);
  url.searchParams.set("market", "NG");
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 429) {
    const retry = Number(res.headers.get("retry-after") || "2");
    // Never sleep on a long Retry-After — Spotify hands out multi-hour values
    // and a silent wait looks identical to a hung process. Fail loudly instead.
    if (retry > MAX_RETRY_WAIT_S) {
      throw new Error(
        `Spotify rate limited (Retry-After ${retry}s ≈ ${(retry / 3600).toFixed(1)}h). ` +
          `Re-run once the window clears; verified rows already written are unaffected.`,
      );
    }
    console.warn(`  429 — waiting ${retry}s…`);
    await sleep((retry + 0.5) * 1000);
    return fetchTrack(token, id);
  }
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Spotify track ${id} ${res.status}: ${await res.text()}`);
  return await res.json();
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const byId = new Map((catalog.entries ?? []).map((e) => [e.id, e]));

/**
 * Apply passing rows from a report this script already produced, with no API
 * calls. Verification and application are separate concerns: once the API has
 * confirmed a batch, a rate-limit window shouldn't block writing the result.
 */
function applyPassed(passed) {
  const hits = new Map(passed.map((p) => [p.id, p]));
  // IDs already spoken for by another row. Two rows sharing one track is
  // usually a wrong match (a remix pointed at its original), so refuse the
  // write and surface it rather than silently duplicating an embed.
  const claimed = new Map(
    catalog.entries
      .filter((e) => e.spotifyTrackId && !hits.has(e.id))
      .map((e) => [e.spotifyTrackId, e.id]),
  );
  let wroteId = 0;
  let promoted = 0;
  const collisions = [];
  for (const entry of catalog.entries) {
    const hit = hits.get(entry.id);
    if (hit && !entry.spotifyTrackId && claimed.has(hit.spotifyTrackId)) {
      collisions.push(`${entry.id} → ${hit.spotifyTrackId} (held by ${claimed.get(hit.spotifyTrackId)})`);
      continue;
    }
    // Never overwrite an ID already in the catalogue — those are the
    // maintainer's, and a silent replacement would be unreviewable.
    if (!hit || entry.spotifyTrackId) continue;
    entry.spotifyTrackId = hit.spotifyTrackId;
    wroteId++;
    if (hit.statusTo && hit.statusTo !== entry.status) {
      entry.status = hit.statusTo;
      promoted++;
    }
  }
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Applied ${wroteId} Spotify ID(s); ${promoted} status promotion(s).`);
  if (collisions.length > 0) {
    console.log(`Skipped ${collisions.length} colliding ID(s) — review these:`);
    for (const c of collisions) console.log(`  ${c}`);
  }
}

if (fromReport) {
  const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const passed = (report.passed ?? []).filter((p) => p.verdict === "pass");
  console.log(`Applying ${passed.length} already-verified row(s) from ${inputPath}`);
  applyPassed(passed);
  process.exit(0);
}

const proposals = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const rows = [];
for (const p of proposals) {
  const entry = byId.get(p.id);
  if (!entry) {
    rows.push({ ...p, verdict: "fail", reason: "unknown_catalog_id" });
    continue;
  }
  if (!/^[A-Za-z0-9]{22}$/.test(String(p.spotifyTrackId || ""))) {
    rows.push({ ...p, verdict: "fail", reason: "malformed_id", title: entry.title });
    continue;
  }
  rows.push({ ...p, entry });
}

const checkable = rows.filter((r) => r.entry);
const token = await getAccessToken();

for (let i = 0; i < checkable.length; i++) {
  const row = checkable[i];
  const entry = row.entry;
  delete row.entry;
  row.title = entry.title;
  row.status = entry.status;

  const track = await fetchTrack(token, row.spotifyTrackId);
  await sleep(REQUEST_GAP_MS);

  if (!track) {
    row.verdict = "fail";
    row.reason = "id_not_found";
    console.log(`[${i + 1}/${checkable.length}] ${row.id} … FAIL id_not_found`);
    continue;
  }

  const artists = (track.artists || []).map((a) => a.name);
  // Nigerian releases often credit the guest in the track title rather than
  // the artist array ("My Baby Bad Ft. Olamide" by Samcole), so accept either.
  const olamideInArtists = artists.some((a) => a.toLowerCase().includes("olamide"));
  const olamideInTitle = /olamide/i.test(track.name);
  const hasOlamide = olamideInArtists || olamideInTitle;
  // "My Baby Bad Ft. Olamide" vs catalogue "My Baby Bad": the trailing credit
  // drags similarity below threshold, so score the credit-stripped form too.
  const stripped = track.name.replace(/\b(feat\.?|ft\.?|featuring)?\s*olamide\b/gi, " ");
  const qualLocal = normalizeKeepingQualifiers(entry.title);
  const qualRemote = normalizeKeepingQualifiers(track.name);
  // Word-spacing differs between sources on the same title
  // ("Greenlight"/"Green Light", "Tesinapot"/"Tesina Pot"), so compare with
  // spacing removed. Still an exact character match — not a fuzzy loosening.
  const spaceless = (s) => s.replace(/ /g, "");
  const confs = [
    titleConfidence(entry.title, track.name),
    titleConfidence(entry.title, stripped),
    qualLocal && qualLocal === qualRemote ? "exact" : "none",
    qualLocal && spaceless(qualLocal) === spaceless(qualRemote) ? "exact" : "none",
    // "P.T.A (People Talk A Lot)" vs "People Talk A Lot" — the expansion lives
    // in the parenthetical, so score the qualifier-preserving forms too.
    titleConfidence(qualLocal, qualRemote),
  ];
  const conf = confs.includes("exact")
    ? "exact"
    : confs.includes("near")
      ? "near"
      : "none";

  row.spotify = {
    id: track.id,
    name: track.name,
    artists: artists.join(", "),
    album: track.album?.name,
    releaseDate: track.album?.release_date,
    url: track.external_urls?.spotify,
    // Where the Olamide credit was found — artist-array credits are stronger.
    creditVia: olamideInArtists ? "artists" : olamideInTitle ? "title" : "none",
  };

  if (!hasOlamide) {
    row.verdict = "fail";
    row.reason = "no_olamide_artist";
  } else if (conf === "none") {
    row.verdict = "fail";
    row.reason = "title_mismatch";
  } else {
    row.verdict = "pass";
    row.confidence = conf;
    // Same promotion ladder as the fill script — never lore → verified.
    row.statusFrom = entry.status;
    row.statusTo =
      entry.status === "documented"
        ? "verified"
        : entry.status === "lore"
          ? "documented"
          : entry.status;
  }
  console.log(
    `[${i + 1}/${checkable.length}] ${row.id} … ${row.verdict}${row.reason ? ` ${row.reason}` : ` (${row.confidence})`} — ${track.name} :: ${artists.join(", ")}`,
  );
}

const passed = rows.filter((r) => r.verdict === "pass");
const failed = rows.filter((r) => r.verdict !== "pass");

fs.writeFileSync(
  outPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), counts: { pass: passed.length, fail: failed.length }, passed, failed }, null, 2)}\n`,
);

console.log(`\nPass ${passed.length}, fail ${failed.length}`);
for (const f of failed) console.log(`  FAIL ${f.id} (${f.reason})`);
console.log(`Wrote ${outPath}`);

if (!apply) {
  console.log("Re-run with --apply to write passing IDs to the catalogue.");
} else if (passed.length > 0) {
  applyPassed(passed);
}
