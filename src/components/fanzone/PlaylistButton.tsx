"use client";

import { useEffect, useState } from "react";
import { useFan } from "@/lib/fanzone/useFan";
import { addToPlaylist, removeFromPlaylist } from "@/lib/fanzone/mutations";
import { createClient } from "@/lib/supabase/client";
import HandlePicker from "./HandlePicker";

/**
 * Icon-only, 36×36 to match the play-icon square it sits beside on a
 * track row. Wrapped by callers in a stopPropagation span so it doesn't
 * also trigger playback selection.
 */
export default function PlaylistButton({
  trackId,
  title,
  subtitle,
}: {
  trackId: string;
  title: string;
  subtitle?: string;
}) {
  const fanState = useFan();
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!fanState.fan) return;
    let cancelled = false;
    createClient()
      .from("playlist_items")
      .select("id")
      .eq("fan_id", fanState.fan.id)
      .eq("track_id", trackId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAdded(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [fanState.fan, trackId]);

  const doToggle = async () => {
    setPending(true);
    if (added) {
      await removeFromPlaylist(trackId);
      setAdded(false);
    } else {
      await addToPlaylist(trackId, title, subtitle);
      setAdded(true);
    }
    setPending(false);
  };

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => (fanState.fan ? doToggle() : setShowPicker(true))}
        disabled={pending}
        aria-pressed={added}
        aria-label={added ? `Remove ${title} from playlist` : `Add ${title} to playlist`}
        className={`grid size-9 place-items-center border-[3px] border-ink shadow-paste-sm disabled:opacity-60 ${
          added ? "bg-palm text-paper" : "bg-danfo text-ink"
        }`}
      >
        {added ? "✓" : "+"}
      </button>
      {showPicker && !fanState.fan ? (
        <div className="absolute top-full right-0 z-20 mt-2 w-72">
          <HandlePicker
            fanState={fanState}
            onSaved={() => {
              setShowPicker(false);
              doToggle();
            }}
          />
        </div>
      ) : null}
    </span>
  );
}
