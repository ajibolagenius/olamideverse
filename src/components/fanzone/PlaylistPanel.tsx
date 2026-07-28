"use client";

import { Check, LinkSimple, Playlist, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/ui/Modal";
import { banner, notify } from "@/lib/feedback";
import { addToPlaylist, removeFromPlaylist } from "@/lib/fanzone/mutations";
import type { PlaylistRow } from "@/lib/fanzone/queries";
import { useFan } from "@/lib/fanzone/useFan";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import HandlePicker from "./HandlePicker";

type SharedTrack = { track_id: string; title: string; subtitle?: string };

const IMPORT_BANNER_ID = "playlist-import";

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
  const fanState = useFan();
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState<SharedTrack[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const sharedRef = useRef(shared);
  const importingRef = useRef(importing);

  useEffect(() => {
    sharedRef.current = shared;
    importingRef.current = importing;
  }, [shared, importing]);

  useEffect(() => {
    // window.location is only available post-mount — SSR and the client's
    // first paint both render `shared: null` (no mismatch), and this
    // reveals the import banner right after if a ?playlist= link was opened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShared(readSharedTracks(new Set(initialPlaylist.map((p) => p.track_id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runImport = useCallback(async (tracks: SharedTrack[]) => {
    setImporting(true);
    try {
      const added: PlaylistRow[] = [];
      for (const track of tracks) {
        const row = await addToPlaylist(track.track_id, track.title, track.subtitle);
        added.push({
          id: row.id,
          track_id: track.track_id,
          title: track.title,
          subtitle: track.subtitle ?? null,
        });
      }
      setPlaylist((p) => [...p, ...added]);
      setShared(null);
      banner.dismiss(IMPORT_BANNER_ID);
      notify.success(
        `Imported ${added.length} track${added.length === 1 ? "" : "s"}`,
      );
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Couldn't import playlist.");
    }
    setImporting(false);
  }, []);

  const requestImport = useCallback(() => {
    const tracks = sharedRef.current;
    if (!tracks || importingRef.current) return;
    if (!fanState.fan) {
      setShowPicker(true);
      return;
    }
    void runImport(tracks);
  }, [fanState.fan, runImport]);

  useEffect(() => {
    if (!shared) {
      banner.dismiss(IMPORT_BANNER_ID);
      return;
    }
    const count = shared.length;
    banner.show({
      id: IMPORT_BANNER_ID,
      variant: "info",
      message: `A shared playlist has ${count} track${count === 1 ? "" : "s"} you don't have yet.${
        fanState.fan ? "" : " Sign in to import."
      }`,
      action: {
        label: fanState.fan
          ? importing
            ? "Importing…"
            : "Add to my playlist"
          : "Sign in to import",
        onClick: requestImport,
      },
    });
  }, [shared, fanState.fan, importing, requestImport]);

  useEffect(() => {
    return () => {
      banner.dismiss(IMPORT_BANNER_ID);
    };
  }, []);

  const copyShareLink = async () => {
    const payload: SharedTrack[] = playlist.map((p) => ({
      track_id: p.track_id,
      title: p.title,
      subtitle: p.subtitle ?? undefined,
    }));
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?playlist=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      notify.info("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("Couldn't copy — try again");
    }
  };

  return (
    <div>
      {playlist.length === 0 ? (
        <EmptyState
          icon={Playlist}
          message="No playlist yet — add tracks from an album's tracklist to see them here."
        />
      ) : (
        <div className="ov-paste-up border-3 border-ink bg-white shadow-paste">
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
                  const previous = playlist;
                  setPlaylist((p) => p.filter((x) => x.id !== item.id));
                  try {
                    await removeFromPlaylist(item.track_id);
                    notify.success("Removed from playlist");
                  } catch (err) {
                    setPlaylist(previous);
                    notify.error(
                      err instanceof Error ? err.message : "Couldn't remove track.",
                    );
                  }
                }}
                className="ov-btn ov-btn-ghost ov-icon-inline px-2.5 py-1 text-[0.62rem]"
              >
                <X className="ov-icon" size={12} weight={OV_ICON_WEIGHT} aria-hidden />
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
          className="ov-btn ov-btn-ghost ov-icon-inline mt-3 px-3.5 py-2 text-xs"
        >
          {copied ? (
            <Check className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          ) : (
            <LinkSimple className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          )}
          {copied ? "Link copied!" : "Copy share link"}
        </button>
      ) : null}

      <Modal
        open={showPicker && !fanState.fan}
        onClose={() => setShowPicker(false)}
        title="Fan account"
      >
        <HandlePicker
          fanState={fanState}
          prompt="Sign in to import this shared playlist."
          onSaved={() => {
            setShowPicker(false);
            if (shared) void runImport(shared);
          }}
        />
      </Modal>
    </div>
  );
}
