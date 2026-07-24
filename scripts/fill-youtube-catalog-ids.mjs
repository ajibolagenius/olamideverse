/**
 * Match catalogue songs (documented / lore) to YouTube video IDs.
 * Use when Spotify Search is rate-limited — /songs already embeds YouTube.
 *
 * Status promotion on high-confidence match:
 *   documented → verified
 *   lore       → documented
 *
 * Default dry-run. Pass --apply to write content/songs/catalog.json.
 * Resumes from scripts/out/youtube-catalog-progress.json.
 *
 * Usage:
 *   npm run fill:youtube-catalog
 *   npm run fill:youtube-catalog -- --apply
 *   npm run fill:youtube-catalog -- --reset
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "content", "songs", "catalog.json");
const outDir = path.join(root, "scripts", "out");
const reportPath = path.join(outDir, "youtube-catalog-candidates.json");
const progressPath = path.join(outDir, "youtube-catalog-progress.json");
const apply = process.argv.includes("--apply");
const reset = process.argv.includes("--reset");
const REQUEST_GAP_MS = 1100;

function normalizeTitle(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    // strip fancy unicode letters used in lyric videos
    .replace(/[\u{1D400}-\u{1D7FF}]/gu, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/\[.*?\]/g, " ")
    .replace(/feat\.?|ft\.?/g, " ")
    .replace(/official\s*(music\s*)?video|official\s*audio|lyrics?|audio|visuali[sz]er/g, " ")
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

function channelBonus(owner) {
  const o = (owner || "").toLowerCase().trim();
  if (!o) return 0;
  if (o === "olamide" || o.includes("olamide vevo")) return 3;
  if (o.includes("ybnl") || o.includes("empire")) return 2;
  if (o.includes("vevo")) return 1;
  return 0;
}

function titleConfidence(localTitle, videoTitle) {
  const want = normalizeTitle(localTitle);
  const got = normalizeTitle(videoTitle);
  if (!want || !got) return "none";
  if (want === got) return "exact";
  // video titles often "Artist - Title …"
  const parts = got.split(/\s+-\s+/).map((p) => p.trim());
  for (const p of parts) {
    if (p === want) return "exact";
  }
  const shorter = want.length <= got.length ? want : got;
  const longer = want.length <= got.length ? got : want;
  if (shorter.length >= 4 && longer.includes(shorter)) {
    const ratio = shorter.length / longer.length;
    if (ratio >= 0.55) return "near";
  }
  return "none";
}

function videoMentionsOlamide(video) {
  const blob = `${video.title} ${video.owner}`.toLowerCase();
  return blob.includes("olamide");
}

async function searchYouTube(query) {
  const url =
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`YouTube search ${res.status}`);
  const html = await res.text();
  const m = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return [];
  let data;
  try {
    data = JSON.parse(m[1]);
  } catch {
    return [];
  }

  const vids = [];
  function walk(o) {
    if (!o || typeof o !== "object") return;
    if (o.videoRenderer?.videoId) {
      const v = o.videoRenderer;
      const title =
        v.title?.runs?.map((r) => r.text).join("") ||
        v.title?.simpleText ||
        "";
      const owner =
        v.ownerText?.runs?.map((r) => r.text).join("") ||
        v.longBylineText?.runs?.map((r) => r.text).join("") ||
        "";
      vids.push({ id: v.videoId, title, owner });
    }
    for (const k of Object.keys(o)) walk(o[k]);
  }
  walk(data);

  const uniq = [];
  const seen = new Set();
  for (const v of vids) {
    if (seen.has(v.id)) continue;
    seen.add(v.id);
    uniq.push(v);
  }
  return uniq;
}

function pickMatch(entry, videos) {
  const scored = [];
  for (const v of videos) {
    if (!videoMentionsOlamide(v)) continue;
    const conf = titleConfidence(entry.title, v.title);
    if (conf === "none") continue;
    scored.push({
      video: v,
      conf,
      score: (conf === "exact" ? 10 : 5) + channelBonus(v.owner),
    });
  }
  if (scored.length === 0) {
    return {
      accept: false,
      reason: "no_confident_match",
      candidates: videos.slice(0, 5),
    };
  }
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  // Ambiguous if another result ties on score with a different video id
  const ties = scored.filter((s) => s.score === best.score);
  const ids = new Set(ties.map((t) => t.video.id));
  if (ids.size > 1) {
    return {
      accept: false,
      reason: "ambiguous",
      candidates: ties.map((t) => t.video).slice(0, 5),
    };
  }
  // Require official-ish channel OR exact title for apply-level confidence
  if (best.conf !== "exact" && channelBonus(best.video.owner) < 2) {
    return {
      accept: false,
      reason: "weak_channel",
      candidates: scored.slice(0, 5).map((s) => s.video),
    };
  }
  return { accept: true, confidence: best.conf, video: best.video };
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

function writeReport(progress) {
  fs.mkdirSync(outDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    apply,
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
  if (e.youtubeId || e.spotifyTrackId) {
    progress.skipped.push({ id: e.id, reason: "already_has_embed" });
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

for (let i = 0; i < todo.length; i++) {
  const entry = todo[i];
  const n = i + 1;
  process.stdout.write(`[${n}/${todo.length}] ${entry.id} … `);

  const host = hostArtistHint(entry.artists);
  const queries = [`${entry.title} Olamide`];
  if (entry.type === "feature" && host) {
    queries.unshift(`${host} ${entry.title} Olamide`);
  }

  let decision = null;
  let usedQuery = null;
  for (const q of queries) {
    const videos = await searchYouTube(q);
    await sleep(REQUEST_GAP_MS);
    const pick = pickMatch(entry, videos);
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
      youtubeId: decision.video.id,
      youtube: {
        id: decision.video.id,
        title: decision.video.title,
        owner: decision.video.owner,
        url: `https://www.youtube.com/watch?v=${decision.video.id}`,
      },
    });
    console.log(`OK → ${statusTo} (${decision.confidence}) ${decision.video.owner}`);
  } else {
    progress.rejected.push({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      status: entry.status,
      artists: entry.artists,
      reason: decision?.reason ?? "no_results",
      query: usedQuery,
      candidates: (decision?.candidates || []).slice(0, 5),
    });
    console.log(`skip (${decision?.reason ?? "no_results"})`);
  }

  done.add(entry.id);
  progress.doneIds = [...done];
  if (n % 5 === 0 || n === todo.length) saveProgress(progress);
}

progress.doneIds = [...done];
saveProgress(progress);
const report = writeReport(progress);

console.log(
  `\nAccepted ${report.counts.accepted}, rejected ${report.counts.rejected}, skipped ${report.counts.skipped}`,
);
console.log(`  documented→verified: ${report.counts.documentedToVerified}`);
console.log(`  lore→documented: ${report.counts.loreToDocumented}`);
console.log(`Report: ${path.relative(root, reportPath)}`);

if (apply && progress.accepted.length > 0) {
  const byId = new Map(progress.accepted.map((a) => [a.id, a]));
  for (const entry of entries) {
    const hit = byId.get(entry.id);
    if (!hit || entry.youtubeId || entry.spotifyTrackId) continue;
    entry.youtubeId = hit.youtubeId;
    entry.status = hit.statusTo;
  }
  catalog.entries = entries;
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log("Wrote accepted matches to content/songs/catalog.json");
} else if (apply) {
  console.log("Nothing to apply.");
} else {
  console.log("Re-run with --apply to write accepted matches.");
}
