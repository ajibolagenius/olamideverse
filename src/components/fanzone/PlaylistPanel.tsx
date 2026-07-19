"use client";

import { useEffect, useState } from "react";
import { addToPlaylist, removeFromPlaylist } from "@/lib/fanzone/mutations";
import type { PlaylistRow } from "@/lib/fanzone/queries";
import EmptyState from "@/components/EmptyState";

type SharedTrack = { track_id: string; title: string; subtitle?: string };

/** Parses a shared-playlist link's ?playlist= param, dropping tracks already owned. */
function readSharedTracks(known: Set<string>): SharedTrack[] | null {
  const param = new URLSearchParams(window.location.search).get("playlist");
  if (!param) return null;
  try {
    const decoded: SharedTrack[] = JSON.parse(atob(param));
    const fresh = decoded.filter((t) => !known.has(t.track_id));
    return fresh.length > 0 ? fresh : null;
  } catch {
    return null; // malformed/old share link — ignore silently
  }
}

export default function PlaylistPanel({ initialPlaylist }: { initialPlaylist: PlaylistRow[] }) {
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState<SharedTrack[] | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    // window.location is only available post-mount — SSR and the client's
    // first paint both render `shared: null` (no mismatch), and this
    // reveals the import banner right after if a ?playlist= link was opened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShared(readSharedTracks(new Set(initialPlaylist.map((p) => p.track_id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyShareLink = async () => {
    const payload: SharedTrack[] = playlist.map((p) => ({
      track_id: p.track_id,
      title: p.title,
      subtitle: p.subtitle ?? undefined,
    }));
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?playlist=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const importShared = async () => {
    if (!shared) return;
    setImporting(true);
    for (const track of shared) {
      await addToPlaylist(track.track_id, track.title, track.subtitle);
    }
    setPlaylist((p) => [
      ...p,
      ...shared.map((t) => ({ id: crypto.randomUUID(), track_id: t.track_id, title: t.title, subtitle: t.subtitle ?? null })),
    ]);
    setShared(null);
    setImporting(false);
  };

  return (
    <div>
      {shared ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-[3px] border-ink bg-adire-tint px-4 py-3">
          <span className="text-sm">
            A shared playlist has {shared.length} track{shared.length === 1 ? "" : "s"} you don&apos;t have yet.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={importShared}
              disabled={importing}
              className="border-2 border-ink bg-danfo px-3 py-1.5 text-xs font-bold uppercase disabled:opacity-50"
            >
              Add to my playlist
            </button>
            <button
              type="button"
              onClick={() => setShared(null)}
              className="border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {playlist.length === 0 ? (
        <EmptyState message="No playlist yet — add tracks from an album's tracklist to see them here." />
      ) : (
        <div className="border-[3px] border-ink bg-white shadow-paste">
          {playlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 border-b-2 border-ink px-3.5 py-2.5 last:border-b-0"
            >
              <span className="text-sm font-semibold">
                {item.title}
                {item.subtitle ? (
                  <small className="block text-xs font-normal uppercase text-ink-soft">
                    {item.subtitle}
                  </small>
                ) : null}
              </span>
              <button
                type="button"
                onClick={async () => {
                  setPlaylist((p) => p.filter((x) => x.id !== item.id));
                  await removeFromPlaylist(item.track_id);
                }}
                className="border-2 border-ink bg-paper px-2.5 py-1 text-[0.62rem] font-bold uppercase"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {playlist.length > 0 ? (
        <button
          type="button"
          onClick={copyShareLink}
          className="mt-3 border-2 border-ink bg-white px-3.5 py-2 text-xs font-bold tracking-[0.05em] uppercase hover:bg-paper-dim"
        >
          {copied ? "Link copied!" : "Copy share link"}
        </button>
      ) : null}
    </div>
  );
}
