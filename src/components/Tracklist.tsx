"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import EmbedFrame from "./EmbedFrame";
import PlaylistButton from "@/components/fanzone/PlaylistButton";
import type { KeyBar, Track } from "@/lib/content-schema";

function slugifyTrack(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Key bar titles carry the track in quotes, sometimes with a credit tail —
 * `"Confam Ni" (ft. Wizkid)`. Pull the quoted part so a bar can be paired
 * with the track that's playing; bars that don't name a track simply never
 * light up.
 */
function keyBarTrackSlug(title: string): string | null {
  const quoted = title.match(/"([^"]+)"/);
  return quoted ? slugifyTrack(quoted[1]) : null;
}

function trackHasEmbed(track: Track): boolean {
  return Boolean(track.spotifyTrackId || track.youtubeId);
}

const SWIPE_THRESHOLD = 60;

/**
 * The whole tracklist section: track rows and a shared "now playing" embed
 * frame on the left, a sticky rail of key bars + credits on the right.
 * Defaults to the album Spotify player when present; selecting a track with
 * its own embed ID switches to that track, and tracks without IDs keep the
 * album player loaded. The rail lives here rather than on the album page
 * because highlighting the playing track's key bar needs the player state.
 */
export default function Tracklist({
  tracks,
  albumSlug,
  albumTitle,
  albumYear,
  spotifyAlbumId,
  keyBars = [],
  credits,
  showPlaylist = false,
  blockedYoutube = [],
  blockedSpotify = [],
}: {
  tracks: Track[];
  albumSlug: string;
  albumTitle: string;
  albumYear: number;
  spotifyAlbumId?: string;
  /** Album key bars — the one naming the playing track lights up in the rail. */
  keyBars?: KeyBar[];
  /** Credits paragraph, pinned under the key bars in the same rail. */
  credits?: string;
  showPlaylist?: boolean;
  blockedYoutube?: string[];
  blockedSpotify?: string[];
}) {
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef(0);
  const albumBlocked =
    !!spotifyAlbumId && blockedSpotify.includes(spotifyAlbumId);
  const activeTrackEmbed = nowPlaying && trackHasEmbed(nowPlaying);
  const embeddableTracks = tracks.filter(trackHasEmbed);
  const canSwipe = Boolean(activeTrackEmbed) && embeddableTracks.length > 1;

  // The bar naming the playing track lights up where it already sits — moving
  // it next to the player instead would make bars jump around on every skip.
  const activeKeyBar = useMemo(() => {
    if (!nowPlaying) return undefined;
    const slug = slugifyTrack(nowPlaying.title);
    return keyBars.find((kb) => keyBarTrackSlug(kb.title) === slug);
  }, [keyBars, nowPlaying]);

  function goToOffset(offset: number) {
    if (!nowPlaying) return;
    const index = embeddableTracks.findIndex((t) => t.num === nowPlaying.num);
    if (index === -1) return;
    const nextIndex =
      (index + offset + embeddableTracks.length) % embeddableTracks.length;
    setNowPlaying(embeddableTracks[nextIndex]);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!canSwipe || e.pointerType === "mouse") return;
    dragStartX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragX(e.clientX - dragStartX.current);
  }

  function onPointerEnd() {
    if (!dragging) return;
    setDragging(false);
    if (dragX <= -SWIPE_THRESHOLD) goToOffset(1);
    else if (dragX >= SWIPE_THRESHOLD) goToOffset(-1);
    setDragX(0);
  }

  return (
    <div className="grid gap-11 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div>
        <ol className="border-t-2 border-ink">
          {tracks.map((track) => {
            const active = nowPlaying?.num === track.num;
            return (
              <li
                key={track.num}
                className={`flex items-center gap-3 border-b-2 border-ink px-2 py-2 transition-colors ${
                  active ? "bg-white" : "hover:bg-paper-dim"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setNowPlaying(track)}
                  aria-pressed={active}
                  className="flex flex-1 items-center gap-4 py-1 text-left"
                >
                  <span className="font-display w-7 text-lg text-ink-soft">
                    {String(track.num).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{track.title}</span>
                    {track.note ? (
                      <small className="block text-xs tracking-[0.04em] uppercase text-ink-soft">
                        {track.note}
                      </small>
                    ) : null}
                  </span>
                </button>
                {showPlaylist ? (
                  <PlaylistButton
                    trackId={`track:${albumSlug}:${slugifyTrack(track.title)}`}
                    title={track.title}
                    subtitle={`${albumTitle} · ${albumYear}`}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => setNowPlaying(track)}
                  aria-label={
                    trackHasEmbed(track) || spotifyAlbumId
                      ? `Play ${track.title}`
                      : `${track.title} — player not available yet`
                  }
                  className="grid size-8 flex-shrink-0 place-items-center border-2 border-ink bg-danfo"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-2.5 fill-ink"
                    aria-hidden
                  >
                    <path d="M3 1l11 7-11 7z" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-5">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {nowPlaying
              ? `Now playing ${nowPlaying.title}`
              : "Select a track to load its player."}
          </p>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className={
              canSwipe
                ? "touch-pan-y transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
                : undefined
            }
            style={
              dragging
                ? {
                    transform: `translateX(${dragX}px)`,
                    opacity: 1 - Math.min(Math.abs(dragX) / 200, 0.5),
                    transition: "none",
                  }
                : undefined
            }
          >
            {activeTrackEmbed && nowPlaying ? (
              <EmbedFrame
                title={nowPlaying.title}
                youtubeId={
                  nowPlaying.youtubeId &&
                  !blockedYoutube.includes(nowPlaying.youtubeId)
                    ? nowPlaying.youtubeId
                    : undefined
                }
                spotifyId={
                  nowPlaying.spotifyTrackId &&
                  !blockedSpotify.includes(nowPlaying.spotifyTrackId)
                    ? nowPlaying.spotifyTrackId
                    : undefined
                }
                provider="youtubemusic"
                removed={
                  !(
                    (nowPlaying.spotifyTrackId &&
                      !blockedSpotify.includes(nowPlaying.spotifyTrackId)) ||
                    (nowPlaying.youtubeId &&
                      !blockedYoutube.includes(nowPlaying.youtubeId))
                  )
                }
              />
            ) : spotifyAlbumId ? (
              <EmbedFrame
                title={
                  nowPlaying
                    ? `${albumTitle} · ${nowPlaying.title}`
                    : albumTitle
                }
                spotifyId={spotifyAlbumId}
                spotifyType="album"
                removed={albumBlocked}
              />
            ) : (
              <div className="border-2 border-dashed border-ink-soft p-6 text-center text-sm text-ink-soft">
                {nowPlaying
                  ? "Embed coming in the content pass — no audio is hosted here."
                  : "Select a track to load its player."}
              </div>
            )}
          </div>
          {canSwipe ? (
            <p className="mt-2 text-center text-[0.7rem] tracking-[0.06em] uppercase text-ink-soft sm:hidden">
              Swipe for next track
            </p>
          ) : null}
        </div>
      </div>

      {keyBars.length > 0 || credits ? (
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
          {keyBars.length > 0 ? (
            <p className="-mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
              Key bars
            </p>
          ) : null}
          {keyBars.map((kb) => {
            const playing = kb === activeKeyBar;
            return (
              <div
                key={kb.title}
                className={`border-l-6 pl-4 transition-colors ${
                  playing
                    ? "border-danfo bg-danfo-tint/40 py-2"
                    : "border-oxide"
                }`}
              >
                <h3 className="mb-1.5 flex flex-wrap items-baseline gap-2 text-sm font-bold tracking-[0.04em] uppercase">
                  {kb.title}
                  {playing ? (
                    <span className="text-[0.65rem] font-bold tracking-[0.1em] text-oxide">
                      Now playing
                    </span>
                  ) : null}
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                  {kb.body}
                </p>
              </div>
            );
          })}
          {credits ? (
            <div className="ov-paste-up border-3 border-ink bg-white p-[18px] shadow-paste-sm">
              <h3 className="mb-2.5 text-xs font-bold tracking-[0.06em] uppercase">
                Credits
              </h3>
              <p className="text-[0.9rem] leading-relaxed text-ink-soft">
                {credits}
              </p>
            </div>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
