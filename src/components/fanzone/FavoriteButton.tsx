"use client";

import { Heart } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useFan } from "@/lib/fanzone/useFan";
import { toggleFavorite } from "@/lib/fanzone/mutations";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import HandlePicker from "./HandlePicker";

export default function FavoriteButton({
  id,
  label,
  kind,
  href,
  tone = "paper",
}: {
  id: string;
  label: string;
  kind: "era" | "album";
  href: string;
  /** `ink` for dark hero backgrounds (era chapters). */
  tone?: "paper" | "ink";
}) {
  const fanState = useFan();
  const [favorited, setFavorited] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [trackedFanId, setTrackedFanId] = useState<string | null>(fanState.fan?.id ?? null);

  // Clear local favorited state when the fan signs out (render-time adjust).
  if ((fanState.fan?.id ?? null) !== trackedFanId) {
    setTrackedFanId(fanState.fan?.id ?? null);
    if (!fanState.fan) setFavorited(false);
  }

  useEffect(() => {
    if (!fanState.fan) return;
    let cancelled = false;
    createClient()
      .from("favorites")
      .select("id")
      .eq("fan_id", fanState.fan.id)
      .eq("target_id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setFavorited(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [fanState.fan, id]);

  const doToggle = async () => {
    setPending(true);
    setError(null);
    try {
      const next = await toggleFavorite(id, label, kind, href);
      setFavorited(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update favorite.");
    }
    setPending(false);
  };

  const handleClick = () => {
    if (!fanState.fan) {
      setShowPicker(true);
      return;
    }
    doToggle();
  };

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={favorited}
        className={`inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1.5 text-[0.7rem] font-bold tracking-[0.05em] uppercase transition-colors disabled:opacity-60 ${
          favorited
            ? "bg-danfo shadow-paste-sm"
            : tone === "ink"
              ? "bg-paper text-ink hover:bg-danfo"
              : "bg-white hover:bg-danfo-tint"
        }`}
      >
        <Heart
          className="ov-icon"
          size={14}
          weight={favorited ? "fill" : OV_ICON_WEIGHT}
          aria-hidden
        />
        {favorited ? "Favorited" : "Favorite"}
      </button>
      {error ? <p className="mt-1 max-w-[14rem] text-[0.65rem] text-oxide">{error}</p> : null}
      <Modal
        open={showPicker && !fanState.fan}
        onClose={() => setShowPicker(false)}
        title="Fan account"
      >
        <HandlePicker
          fanState={fanState}
          prompt="Sign in to favorite eras and albums."
          onSaved={() => {
            setShowPicker(false);
            doToggle();
          }}
        />
      </Modal>
    </div>
  );
}
