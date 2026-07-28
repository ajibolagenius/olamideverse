/**
 * Apply curated YouTube Music matches into content/songs/catalog.json.
 *
 * Source: scripts/out/ytm-catalog-matches.json (copied from the YTM audit).
 * Writes youtubeId only; status promotion matches fill-youtube-catalog-ids:
 *   documented → verified
 *   lore       → documented
 *
 * Usage:
 *   node scripts/apply-ytm-catalog-ids.mjs
 *   node scripts/apply-ytm-catalog-ids.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "content", "songs", "catalog.json");
const matchesPath = path.join(root, "scripts", "out", "ytm-catalog-matches.json");
const reportPath = path.join(root, "scripts", "out", "ytm-catalog-apply-report.json");
const dryRun = process.argv.includes("--dry-run");

function nextStatus(current) {
  if (current === "documented") return "verified";
  if (current === "lore") return "documented";
  return current;
}

const matches = JSON.parse(fs.readFileSync(matchesPath, "utf8"));
const byId = new Map(matches.map((m) => [m.id, m]));

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const applied = [];
const skipped = [];

for (const entry of catalog.entries) {
  const match = byId.get(entry.id);
  if (!match) continue;

  if (entry.spotifyTrackId || entry.youtubeId) {
    skipped.push({
      id: entry.id,
      reason: entry.spotifyTrackId ? "has_spotify" : "has_youtube",
      videoId: match.videoId,
    });
    continue;
  }

  const prevStatus = entry.status;
  const status = nextStatus(prevStatus);
  applied.push({
    id: entry.id,
    title: entry.title,
    videoId: match.videoId,
    ytTitle: match.ytTitle,
    prevStatus,
    status,
    resultType: match.resultType,
  });

  if (!dryRun) {
    entry.youtubeId = match.videoId;
    entry.status = status;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  dryRun,
  source: "scripts/out/ytm-catalog-matches.json",
  counts: {
    matches: matches.length,
    applied: applied.length,
    skipped: skipped.length,
  },
  applied,
  skipped,
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (!dryRun) {
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(
  `${dryRun ? "Dry-run" : "Applied"}: ${applied.length} updated, ${skipped.length} skipped → ${reportPath}`,
);
