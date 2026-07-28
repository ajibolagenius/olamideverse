/**
 * Upload scripts/out/playlist-cover.jpg as the cover for a Spotify playlist.
 *
 * Needs scopes: ugc-image-upload, playlist-modify-public, playlist-modify-private
 * Redirect URI: http://127.0.0.1:8888/callback
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-spotify-playlist-cover.mjs
 *   node --env-file=.env.local scripts/upload-spotify-playlist-cover.mjs --playlist-id=ID
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";

const root = process.cwd();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const PORT = 8888;
const SCOPES = [
  "ugc-image-upload",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");
const DEFAULT_PLAYLIST_ID = "4Furgn9AXjpGhkl6dUlLyC";
const playlistId =
  process.argv.find((a) => a.startsWith("--playlist-id="))?.slice(
    "--playlist-id=".length,
  ) || DEFAULT_PLAYLIST_ID;
const coverPath = path.join(root, "scripts/out/playlist-cover.jpg");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");
  process.exit(1);
}
if (!fs.existsSync(coverPath)) {
  console.error(`Missing cover image at ${coverPath}`);
  process.exit(1);
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

async function main() {
  const jpg = fs.readFileSync(coverPath);
  if (jpg.length >= 256 * 1024) {
    throw new Error(`Cover JPEG is ${jpg.length} bytes; Spotify max is 256 KB`);
  }

  const code = await waitForAuthCode();
  const token = await exchangeCode(code);

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/images`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "image/jpeg",
      },
      body: jpg.toString("base64"),
    },
  );

  if (!res.ok && res.status !== 202) {
    throw new Error(`Cover upload failed: ${res.status} ${await res.text()}`);
  }

  console.log(`Cover uploaded (HTTP ${res.status}) for playlist ${playlistId}`);
  console.log(`https://open.spotify.com/playlist/${playlistId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
