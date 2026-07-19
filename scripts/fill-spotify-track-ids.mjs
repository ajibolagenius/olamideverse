/**
 * Fill spotifyTrackId on every album tracklist row from Spotify embed metadata.
 *
 * Usage: node scripts/fill-spotify-track-ids.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const albumsDir = path.join(root, "content", "albums");

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

async function fetchAlbumTracks(albumId) {
    const res = await fetch(`https://open.spotify.com/embed/album/${albumId}`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            Accept: "text/html",
        },
    });
    if (!res.ok) throw new Error(`embed ${albumId} → ${res.status}`);
    const html = await res.text();
    const match = html.match(
        /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    );
    let trackList;
    if (match) {
        trackList = JSON.parse(match[1])?.props?.pageProps?.state?.data?.entity
            ?.trackList;
    }
    if (!trackList) {
        const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(
            (m) => m[1],
        );
        for (const s of scripts.reverse()) {
            if (!s.includes("trackList")) continue;
            try {
                const j = JSON.parse(s);
                trackList = j?.props?.pageProps?.state?.data?.entity?.trackList;
                if (trackList) break;
            } catch {
                /* keep looking */
            }
        }
    }
    if (!Array.isArray(trackList) || trackList.length === 0) {
        throw new Error(`No trackList for album ${albumId}`);
    }
    return trackList
        .filter((t) => t?.uri?.startsWith("spotify:track:"))
        .map((t) => ({
            id: t.uri.replace("spotify:track:", ""),
            title: t.title || "",
        }));
}

function matchTrackId(localTitle, spotifyTracks, used) {
    const want = normalizeTitle(localTitle);
    let best = null;
    let bestScore = 0;
    for (let i = 0; i < spotifyTracks.length; i++) {
        if (used.has(i)) continue;
        const got = normalizeTitle(spotifyTracks[i].title);
        if (!got) continue;
        if (got === want) return i;
        if (got.includes(want) || want.includes(got)) {
            const score = Math.min(got.length, want.length);
            if (score > bestScore) {
                bestScore = score;
                best = i;
            }
        }
    }
    return best;
}

const files = fs.readdirSync(albumsDir).filter((f) => f.endsWith(".mdx"));
let totalTracks = 0;
let filled = 0;
let unmatched = 0;

for (const file of files) {
    const full = path.join(albumsDir, file);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);
    const albumId = parsed.data?.embeds?.spotifyAlbumId;
    const tracklist = parsed.data?.tracklist;
    if (!albumId || !Array.isArray(tracklist)) {
        console.warn(`skip ${file}: missing album id or tracklist`);
        continue;
    }

    const spotifyTracks = await fetchAlbumTracks(albumId);
    const used = new Set();
    let albumFilled = 0;

    for (let i = 0; i < tracklist.length; i++) {
        totalTracks++;
        const track = tracklist[i];
        // Prefer order when lengths match and title is close; else fuzzy match.
        let idx = -1;
        if (
            spotifyTracks.length === tracklist.length &&
            !used.has(i) &&
            (normalizeTitle(spotifyTracks[i].title).includes(
                normalizeTitle(track.title).slice(0, 8),
            ) ||
                normalizeTitle(track.title).includes(
                    normalizeTitle(spotifyTracks[i].title).slice(0, 8),
                ))
        ) {
            idx = i;
        } else {
            idx = matchTrackId(track.title, spotifyTracks, used);
        }
        if (idx == null || idx < 0) {
            unmatched++;
            console.warn(`  unmatched ${file} #${track.num} ${track.title}`);
            continue;
        }
        used.add(idx);
        track.spotifyTrackId = spotifyTracks[idx].id;
        albumFilled++;
        filled++;
    }

    const out = matter.stringify(parsed.content.replace(/^\n/, ""), parsed.data);
    fs.writeFileSync(full, out.endsWith("\n") ? out : `${out}\n`);
    console.log(
        `${file}: ${albumFilled}/${tracklist.length} (spotify had ${spotifyTracks.length})`,
    );

    // Be polite to Spotify embed CDN
    await new Promise((r) => setTimeout(r, 350));
}

console.log(`\nDone. Filled ${filled}/${totalTracks}. Unmatched ${unmatched}.`);
