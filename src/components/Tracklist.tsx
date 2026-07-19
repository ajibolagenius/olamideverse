"use client";

import { useState } from "react";
import EmbedFrame from "./EmbedFrame";
import PlaylistButton from "@/components/fanzone/PlaylistButton";
import type { Track } from "@/lib/content-schema";

function slugifyTrack(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function trackHasEmbed(track: Track): boolean {
  return Boolean(track.spotifyTrackId || track.youtubeId);
}

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
  blockedYoutube = [],
  blockedSpotify = [],
}: {
  tracks: Track[];
  albumSlug: string;
  albumTitle: string;
  albumYear: number;
  spotifyAlbumId?: string;
  blockedYoutube?: string[];
  blockedSpotify?: string[];
}) {
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const albumBlocked =
    !!spotifyAlbumId && blockedSpotify.includes(spotifyAlbumId);
  const activeTrackEmbed = nowPlaying && trackHasEmbed(nowPlaying);

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
              <PlaylistButton
                trackId={`track:${albumSlug}:${slugifyTrack(track.title)}`}
                title={track.title}
                subtitle={`${albumTitle} · ${albumYear}`}
              />
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
                <svg viewBox="0 0 16 16" className="size-2.5 fill-ink">
                  <path d="M3 1l11 7-11 7z" />
                </svg>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-5">
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
    </div>
  );
}
