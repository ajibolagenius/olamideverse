"use client";

import { useState } from "react";
import EmbedFrame from "./EmbedFrame";
import PlaylistButton from "@/components/fanzone/PlaylistButton";
import type { Track } from "@/lib/content-schema";

function slugifyTrack(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Track rows + a shared "now playing" embed frame. Selecting a row loads
 * its embed; the active row reads white against the paper page. The
 * playlist-add button is a sibling of the row's select-button, not nested
 * inside it — a <button> can't validly contain another <button>.
 */
export default function Tracklist({
  tracks,
  albumSlug,
  albumTitle,
  albumYear,
  blockedYoutube = [],
  blockedSpotify = [],
}: {
  tracks: Track[];
  albumSlug: string;
  albumTitle: string;
  albumYear: number;
  blockedYoutube?: string[];
  blockedSpotify?: string[];
}) {
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);

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
                aria-label={`Play ${track.title}`}
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
        {nowPlaying ? (
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
        ) : (
          <div className="border-2 border-dashed border-ink-soft p-6 text-center text-sm text-ink-soft">
            Select a track to load its player.
          </div>
        )}
      </div>
    </div>
  );
}
