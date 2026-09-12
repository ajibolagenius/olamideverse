"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import EmbedFrame from "@/components/EmbedFrame";
import {
  hasAnyEmbed,
  resolveEmbed,
  type EmbedBlock,
  type EmbedSource,
} from "@/lib/embeds";

/**
 * One player for the whole site, mounted in `(site)/layout.tsx`.
 *
 * The point is *where* this lives, not what it does. A layout is not
 * re-rendered when you navigate between its child routes, so the iframe it
 * holds is never unmounted and the audio never stops — which is the one
 * thing a per-page `EmbedFrame` cannot do.
 *
 * Chrome is the dock /songs already had, hoisted up a level rather than
 * redesigned; it sits bottom-right on desktop instead of in a reserved
 * column, because every other route needs the same dock and none of them
 * reserve one.
 *
 * Still embeds only. This holds a third-party iframe; it never touches a
 * media stream, and there is deliberately no autoplay — the reader presses
 * play inside the provider's own player, where the licence is.
 */

export type PlayerTrack = EmbedSource & {
  id: string;
  title: string;
  /** Second line in the dock — album, or credit line. */
  subtitle?: string;
};

type PlayerApi = {
  track: PlayerTrack | null;
  /** Load a track. Selecting the one already playing stops it. */
  toggle: (track: PlayerTrack) => void;
  play: (track: PlayerTrack) => void;
  stop: () => void;
};

const NOOP: PlayerApi = {
  track: null,
  toggle: () => {},
  play: () => {},
  stop: () => {},
};

const PlayerContext = createContext<PlayerApi>(NOOP);

/**
 * Safe outside the provider (admin, /lab) — returns a no-op rather than
 * throwing, so a shared component can be reused there without crashing.
 */
export function usePlayer(): PlayerApi {
  return useContext(PlayerContext);
}

export default function PlayerProvider({
  blocks = [],
  children,
}: {
  blocks?: EmbedBlock[];
  children: React.ReactNode;
}) {
  const [track, setTrack] = useState<PlayerTrack | null>(null);

  const play = useCallback((next: PlayerTrack) => setTrack(next), []);
  const stop = useCallback(() => setTrack(null), []);
  const toggle = useCallback((next: PlayerTrack) => {
    setTrack((current) => (current?.id === next.id ? null : next));
  }, []);

  const api = useMemo<PlayerApi>(
    () => ({ track, toggle, play, stop }),
    [track, toggle, play, stop],
  );

  // The dock is fixed over the bottom of the page, so the footer needs room
  // to clear it — otherwise its links sit underneath and can't be reached.
  useEffect(() => {
    document.body.classList.toggle("ov-dock-open", Boolean(track));
    return () => document.body.classList.remove("ov-dock-open");
  }, [track]);

  const embed = resolveEmbed(track, blocks);

  return (
    <PlayerContext.Provider value={api}>
      {children}

      {track ? (
        <div
          role="region"
          aria-label="Now playing"
          className="ov-player-dock fixed inset-x-0 bottom-0 z-30 border-t-3 border-ink bg-paper p-3 shadow-[0_-8px_0_0_rgba(24,20,16,0.08)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[min(22rem,calc(100vw-2.5rem))] sm:border-3 sm:shadow-paste-sm"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
              Now playing
            </p>
            <button
              type="button"
              onClick={stop}
              className="border-2 border-ink bg-white px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.04em] uppercase hover:bg-danfo"
            >
              Stop
            </button>
          </div>

          <div aria-live="polite" aria-atomic="true">
            <p className="mb-1 truncate font-display text-lg leading-tight">
              {track.title}
            </p>
            {track.subtitle ? (
              <p className="mb-3 truncate text-[0.72rem] tracking-[0.04em] uppercase text-ink-soft">
                {track.subtitle}
              </p>
            ) : null}
            {hasAnyEmbed(track) ? (
              <EmbedFrame title={track.title} {...embed} provider="youtubemusic" />
            ) : (
              <div className="border-3 border-dashed border-ink-soft bg-paper-dim p-4 text-sm leading-relaxed text-ink-soft">
                Documented in the catalogue — no stable embed ID yet. Nothing is
                hosted here.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </PlayerContext.Provider>
  );
}
