/**
 * Self-check for the embed-ID validators in src/lib/security/urls.ts.
 *
 * These guard an iframe `src`, so a regression is a security regression, not
 * a cosmetic one. Node strips the TypeScript types, so this runs the real
 * module with no build step.
 *
 * Usage: npm run check:embed-ids
 */
import assert from "node:assert/strict";
import {
  safeAppleMusicId,
  safeAudiomackEmbedSrc,
  safeSpotifyId,
  safeYoutubeId,
} from "../src/lib/security/urls.ts";
import { hasAnyEmbed, resolveEmbed } from "../src/lib/embeds.ts";

// Real IDs from content/songs/catalog.json.
assert.equal(safeSpotifyId("7KhrNUSPwhxBsuOXVAKgg4"), "7KhrNUSPwhxBsuOXVAKgg4");
assert.equal(safeSpotifyId("short"), undefined);
assert.equal(safeSpotifyId("7KhrNUSPwhxBsuOXVAKgg4/../evil"), undefined);
assert.equal(safeSpotifyId(undefined), undefined);

assert.equal(safeYoutubeId("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(safeYoutubeId("_-aB3dEfGhI"), "_-aB3dEfGhI");
assert.equal(safeYoutubeId("dQw4w9WgXcQ?autoplay=1"), undefined);
assert.equal(safeYoutubeId("tooshort"), undefined);

assert.equal(safeAppleMusicId("1440857781"), "1440857781");
assert.equal(safeAppleMusicId("12"), undefined);
assert.equal(safeAppleMusicId("144085778a"), undefined);

assert.equal(
  safeAudiomackEmbedSrc("https://audiomack.com/song/olamide/eni-duro"),
  "https://audiomack.com/embed/song/olamide/eni-duro",
);
// Already-embed form is idempotent, and www is accepted.
assert.equal(
  safeAudiomackEmbedSrc("https://audiomack.com/embed/album/olamide/rapsodi"),
  "https://audiomack.com/embed/album/olamide/rapsodi",
);
assert.equal(
  safeAudiomackEmbedSrc("https://www.audiomack.com/song/olamide/eni-duro"),
  "https://audiomack.com/embed/song/olamide/eni-duro",
);
// Anything that could steer the frame elsewhere.
assert.equal(safeAudiomackEmbedSrc("https://evil.com/song/a/b"), undefined);
assert.equal(safeAudiomackEmbedSrc("https://audiomack.com.evil.com/song/a/b"), undefined);
assert.equal(safeAudiomackEmbedSrc("http://audiomack.com/song/a/b"), undefined);
assert.equal(safeAudiomackEmbedSrc("javascript:alert(1)"), undefined);
assert.equal(safeAudiomackEmbedSrc("https://audiomack.com/playlist/a/b"), undefined);
assert.equal(safeAudiomackEmbedSrc("https://audiomack.com/song/a"), undefined);
assert.equal(safeAudiomackEmbedSrc("https://audiomack.com/song/../../x/y"), undefined);

// --- resolveEmbed: the takedown kill-switch ---------------------------------

const song = {
  spotifyTrackId: "7KhrNUSPwhxBsuOXVAKgg4",
  youtubeId: "dQw4w9WgXcQ",
  appleMusicId: "1440857781",
  audiomackUrl: "https://audiomack.com/song/olamide/eni-duro",
};

assert.equal(resolveEmbed(song).removed, false);
assert.equal(resolveEmbed(song, []).spotifyId, song.spotifyTrackId);

// Blocking one provider leaves the others playable.
assert.equal(
  resolveEmbed(song, [{ provider: "spotify", embed_id: song.spotifyTrackId }]).spotifyId,
  undefined,
);
assert.equal(
  resolveEmbed(song, [{ provider: "spotify", embed_id: song.spotifyTrackId }]).youtubeId,
  song.youtubeId,
);
assert.equal(
  resolveEmbed(song, [{ provider: "spotify", embed_id: song.spotifyTrackId }]).removed,
  false,
);

// YouTube Music shares YouTube IDs — blocking either kills both.
assert.equal(
  resolveEmbed(song, [{ provider: "youtubemusic", embed_id: song.youtubeId }]).youtubeId,
  undefined,
);
assert.equal(
  resolveEmbed(song, [{ provider: "youtube", embed_id: song.youtubeId }]).youtubeId,
  undefined,
);

// A block only applies to its own ID, not to every row on that provider.
assert.equal(
  resolveEmbed(song, [{ provider: "spotify", embed_id: "someOtherTrackId22chr" }]).spotifyId,
  song.spotifyTrackId,
);

// `any` takes whatever ID it names, whichever provider holds it.
assert.equal(
  resolveEmbed(song, [{ provider: "any", embed_id: song.audiomackUrl }]).audiomackUrl,
  undefined,
);

// Every provider blocked → removed, which renders the takedown copy.
assert.equal(
  resolveEmbed(song, [
    { provider: "spotify", embed_id: song.spotifyTrackId },
    { provider: "youtube", embed_id: song.youtubeId },
    { provider: "applemusic", embed_id: song.appleMusicId },
    { provider: "audiomack", embed_id: song.audiomackUrl },
  ]).removed,
  true,
);

// A row that never had an embed is "coming in the content pass", not "removed".
assert.equal(hasAnyEmbed({}), false);
assert.equal(resolveEmbed({}).removed, false);
assert.equal(resolveEmbed(null).removed, false);

console.log("embed ID validators + kill-switch: all checks passed");
