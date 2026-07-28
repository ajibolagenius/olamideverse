/**
 * Create a Spotify playlist from OlamideVerse verified Spotify track IDs.
 *
 * Requires user OAuth (playlist-modify-public / playlist-modify-private).
 * Redirect URI must be allowlisted on the Spotify app:
 *   http://127.0.0.1:8888/callback
 *
 * Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET (from .env.local)
 *
 * Usage:
 *   node --env-file=.env.local scripts/spotify/create-spotify-playlist.mjs
 *   node --env-file=.env.local scripts/spotify/create-spotify-playlist.mjs --private
 *   node --env-file=.env.local scripts/spotify/create-spotify-playlist.mjs --playlist-id=ID --replace
 *
 * Note (Feb 2026 Web API): add items via POST /playlists/{id}/items (not /tracks).
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";
import matter from "gray-matter";

const root = process.cwd();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const PORT = 8888;
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
].join(" ");
const EXPECTED_USER_ID = "yc7vmqu2y4bzzce0yksrjvogv";
const isPrivate = process.argv.includes("--private");
const replaceItems = process.argv.includes("--replace");
const playlistIdArg = process.argv
  .find((a) => a.startsWith("--playlist-id="))
  ?.slice("--playlist-id=".length);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");
  process.exit(1);
}

function collectVerifiedSpotifyTracks() {
  const albumsDir = path.join(root, "content", "albums");
  const catalog = JSON.parse(
    fs.readFileSync(path.join(root, "content/songs/catalog.json"), "utf8"),
  );
  const tracks = [];

  for (const f of fs.readdirSync(albumsDir).filter((x) => x.endsWith(".mdx"))) {
    const { data } = matter(fs.readFileSync(path.join(albumsDir, f), "utf8"));
    for (const t of data.tracklist || []) {
      if (t.spotifyTrackId) {
        tracks.push({
          title: t.title,
          year: data.year,
          album: data.title,
          type: "album-track",
          spotifyTrackId: String(t.spotifyTrackId),
        });
      }
    }
  }

  for (const e of catalog.entries || []) {
    if (e.spotifyTrackId) {
      tracks.push({
        title: e.title,
        year: e.year,
        album: e.albumSlug || null,
        type: e.type,
        spotifyTrackId: String(e.spotifyTrackId),
      });
    }
  }

  const byId = new Map();
  for (const t of tracks) {
    const prev = byId.get(t.spotifyTrackId);
    if (!prev) {
      byId.set(t.spotifyTrackId, t);
      continue;
    }
    if (prev.type !== "album-track" && t.type === "album-track") {
      byId.set(t.spotifyTrackId, t);
    }
  }

  return [...byId.values()].sort(
    (a, b) =>
      (a.year || 0) - (b.year || 0) ||
      String(a.title).localeCompare(String(b.title)),
  );
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

function waitForAuthCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, REDIRECT_URI);
        if (url.pathname !== "/callback") {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const error = url.searchParams.get("error");
        const code = url.searchParams.get("code");
        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Auth failed</h1><p>${error}</p>`);
          server.close();
          reject(new Error(`Spotify auth error: ${error}`));
          return;
        }
        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>Missing code</h1>");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>Authorized</h1><p>You can close this tab and return to the terminal.</p>",
        );
        server.close();
        resolve(code);
      } catch (err) {
        reject(err);
      }
    });
    server.listen(PORT, "127.0.0.1", () => {
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      authUrl.searchParams.set("client_id", CLIENT_ID);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
      authUrl.searchParams.set("scope", SCOPES);
      authUrl.searchParams.set("show_dialog", "true");
      console.log("Opening Spotify authorization in your browser…");
      console.log(authUrl.toString());
      openBrowser(authUrl.toString());
    });
    server.on("error", reject);
  });
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function spotifyFetch(accessToken, method, apiPath, body) {
  const res = await fetch(`https://api.spotify.com/v1${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`${method} ${apiPath} → ${res.status} ${await res.text()}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function main() {
  const tracks = collectVerifiedSpotifyTracks();
  console.log(`Collected ${tracks.length} unique Spotify-verified tracks.`);

  const code = await waitForAuthCode();
  const token = await exchangeCode(code);
  const me = await spotifyFetch(token.access_token, "GET", "/me");
  console.log(`Authenticated as ${me.display_name} (${me.id})`);

  if (me.id !== EXPECTED_USER_ID) {
    console.warn(
      `Warning: authenticated user (${me.id}) differs from expected (${EXPECTED_USER_ID}). Creating on the authenticated account.`,
    );
  }

  let playlist;
  if (playlistIdArg) {
    playlist = await spotifyFetch(
      token.access_token,
      "GET",
      `/playlists/${playlistIdArg}`,
    );
    console.log(`Reusing playlist: ${playlist.name} (${playlist.id})`);
  } else {
    playlist = await spotifyFetch(token.access_token, "POST", "/me/playlists", {
      name: "OlamideVerse — Verified",
      description:
        "Spotify-verified tracks from the OlamideVerse /songs catalogue (fan archive, not affiliated with Olamide or YBNL Nation).",
      public: !isPrivate,
    });
    console.log(`Created playlist: ${playlist.id}`);
  }

  const uris = tracks.map((t) => `spotify:track:${t.spotifyTrackId}`);
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100);
    // Feb 2026: /tracks renamed to /items
    // First chunk with --replace uses PUT to wipe previous contents.
    const method = replaceItems && i === 0 ? "PUT" : "POST";
    await spotifyFetch(
      token.access_token,
      method,
      `/playlists/${playlist.id}/items`,
      { uris: chunk },
    );
    console.log(
      `${method === "PUT" ? "Replaced with" : "Added"} tracks ${i + 1}–${i + chunk.length}`,
    );
  }

  const out = {
    playlistId: playlist.id,
    url:
      playlist.external_urls?.spotify ||
      `https://open.spotify.com/playlist/${playlist.id}`,
    trackCount: tracks.length,
    userId: me.id,
    createdAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.join(root, "scripts/spotify/out"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "scripts/spotify/out/spotify-playlist-result.json"),
    JSON.stringify(out, null, 2),
  );

  console.log("\nPlaylist created:");
  console.log(out.url || `https://open.spotify.com/playlist/${playlist.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
