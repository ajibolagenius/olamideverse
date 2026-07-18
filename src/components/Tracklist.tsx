"use client";

import { useState } from "react";
import EmbedFrame from "./EmbedFrame";
import type { Track } from "@/lib/content";

/**
 * Track rows + a shared "now playing" embed frame. Selecting a row loads
 * its embed; the active row reads white against the paper page.
 */
export default function Tracklist({ tracks }: { tracks: Track[] }) {
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <ol className="border-t-2 border-ink">
        {tracks.map((track) => {
          const active = nowPlaying?.num === track.num;
          return (
            <li key={track.num}>
              <button
                type="button"
                onClick={() => setNowPlaying(track)}
                aria-pressed={active}
                className={`flex w-full items-center gap-4 border-b-2 border-ink px-2 py-3 text-left transition-colors ${
                  active ? "bg-white" : "hover:bg-paper-dim"
                }`}
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
                <span
                  aria-hidden
                  className="grid size-8 place-items-center border-2 border-ink bg-danfo"
                >
                  <svg viewBox="0 0 16 16" className="size-2.5 fill-ink">
                    <path d="M3 1l11 7-11 7z" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="lg:sticky lg:top-24">
        {nowPlaying ? (
          <EmbedFrame
            title={nowPlaying.title}
            youtubeId={nowPlaying.youtubeId}
            spotifyId={nowPlaying.spotifyTrackId}
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
