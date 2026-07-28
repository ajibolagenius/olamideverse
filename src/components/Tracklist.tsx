"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import EmbedFrame from "./EmbedFrame";
import PlaylistButton from "@/components/fanzone/PlaylistButton";
import type { KeyBar, Track } from "@/lib/content-schema";

function slugifyTrack(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Key bar titles carry the track in quotes, sometimes with a credit tail —
 * `"Confam Ni" (ft. Wizkid)`. Pull the quoted part so a bar can be paired
 * with the track that's playing; bars that don't name a track just stay in
 * the list below.
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
 * Track rows + a shared "now playing" embed frame. Defaults to the album
 * Spotify player when present; selecting a track with its own embed ID
 * switches to that track. Tracks without IDs keep the album player loaded.
 */
export default function Tracklist({
  tracks,
  albumSlug,
  albumTitle,
  albumYear,
  spotifyAlbumId,
  keyBars = [],
  showPlaylist = false,
  blockedYoutube = [],
  blockedSpotify = [],
}: {
  tracks: Track[];
  albumSlug: string;
  albumTitle: string;
  albumYear: number;
  spotifyAlbumId?: string;
  /** Album key bars — the one naming the playing track pins under the player. */
  keyBars?: KeyBar[];
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

  // The bar for the playing track is pulled out under the player; the rest
  // stay in the list, so a bar is never on screen twice.
  const activeKeyBar = useMemo(() => {
    if (!nowPlaying) return undefined;
    const slug = slugifyTrack(nowPlaying.title);
    return keyBars.find((kb) => keyBarTrackSlug(kb.title) === slug);
  }, [keyBars, nowPlaying]);
  const restKeyBars = keyBars.filter((kb) => kb !== activeKeyBar);

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
                <svg viewBox="0 0 16 16" className="size-2.5 fill-ink" aria-hidden>
                  <path d="M3 1l11 7-11 7z" />
                </svg>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-5">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {nowPlaying ? `Now playing ${nowPlaying.title}` : "Select a track to load its player."}
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
              youtubeId={nowPlaying.youtubeId}
              spotifyId={nowPlaying.spotifyTrackId}
              removed={
                (!!nowPlaying.spotifyTrackId &&
                  blockedSpotify.includes(nowPlaying.spotifyTrackId)) ||
                (!!nowPlaying.youtubeId &&
                  blockedYoutube.includes(nowPlaying.youtubeId))
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

        {activeKeyBar ? (
          <div className="ov-paste-up mt-5 border-l-6 border-danfo bg-paper-dim p-4">
            <h3 className="mb-1.5 text-sm font-bold tracking-[0.04em] uppercase">
              {activeKeyBar.title}
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-ink-soft">
              {activeKeyBar.body}
            </p>
          </div>
        ) : null}
      </div>

      {restKeyBars.length > 0 ? (
        <div className="mt-9 flex flex-col gap-5">
          <p className="-mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            Key bars
          </p>
          {restKeyBars.map((kb) => (
            <div key={kb.title} className="border-l-6 border-oxide pl-4">
              <h3 className="mb-1.5 text-sm font-bold tracking-[0.04em] uppercase">
                {kb.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{kb.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
