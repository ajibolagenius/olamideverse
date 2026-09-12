/**
 * Where the song catalogue actually stands, per provider.
 *
 * The fill scripts each resume from their own progress file, so "not matched"
 * and "not yet attempted" look identical from the catalogue alone. This
 * cross-references both progress files so a blank row says which passes have
 * already given up on it — and nobody re-runs a search that has been run.
 *
 * Read-only. Usage: npm run report:coverage
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  } catch {
    return null;
  }
};

const { entries } = read("content/songs/catalog.json");
const spotifyProgress = read("scripts/spotify/out/spotify-catalog-progress.json");
const youtubeProgress = read("scripts/out/youtube-catalog-progress.json");

const spotifyDone = new Set(spotifyProgress?.doneIds ?? []);
const youtubeDone = new Set(youtubeProgress?.doneIds ?? []);

const count = (fn) => entries.filter(fn).length;
const playable = (e) =>
  e.spotifyTrackId || e.youtubeId || e.appleMusicId || e.audiomackUrl;

console.log(`Catalogue entries: ${entries.length}\n`);
console.log("Coverage by provider");
console.log(`  Spotify      ${count((e) => e.spotifyTrackId)}`);
console.log(`  YouTube/YTM  ${count((e) => e.youtubeId)}`);
console.log(`  Apple Music  ${count((e) => e.appleMusicId)}`);
console.log(`  Audiomack    ${count((e) => e.audiomackUrl)}`);
console.log(`\n  Playable at all      ${count(playable)}`);
console.log(`  More than one option ${count((e) => [e.spotifyTrackId, e.youtubeId, e.appleMusicId, e.audiomackUrl].filter(Boolean).length > 1)}`);

const blank = entries.filter((e) => !playable(e));
console.log(`\nNo embed: ${blank.length}`);

const byStatus = {};
for (const e of blank) byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
console.log(`  by status: ${JSON.stringify(byStatus)}`);

const unattempted = blank.filter(
  (e) => !spotifyDone.has(e.id) || !youtubeDone.has(e.id),
);
console.log(
  `  both automated passes exhausted: ${blank.length - unattempted.length}`,
);
console.log(`  still worth an automated pass: ${unattempted.length}`);
if (unattempted.length > 0) {
  for (const e of unattempted) {
    const missing = [
      spotifyDone.has(e.id) ? null : "spotify",
      youtubeDone.has(e.id) ? null : "youtube",
    ].filter(Boolean);
    console.log(`    ${e.id} — not tried: ${missing.join(", ")}`);
  }
}
