"use client";

import { useEffect, useState } from "react";
import { useFan } from "@/lib/fanzone/useFan";
import { toggleFavorite } from "@/lib/fanzone/mutations";
import { createClient } from "@/lib/supabase/client";
import HandlePicker from "./HandlePicker";

export default function FavoriteButton({
  id,
  label,
  kind,
  href,
}: {
  id: string;
  label: string;
  kind: "era" | "album";
  href: string;
}) {
  const fanState = useFan();
  const [favorited, setFavorited] = useState(false);
  const [pending, setPending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Self-check status once the fan session resolves, rather than
  // threading favorite state through every page that renders a card.
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
    const next = await toggleFavorite(id, label, kind, href);
    setFavorited(next);
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
          favorited ? "bg-danfo" : "bg-white hover:bg-paper-dim"
        }`}
      >
        {favorited ? "Favorited" : "Favorite"}
      </button>
      {showPicker && !fanState.fan ? (
        <div className="mt-2 max-w-xs">
          <HandlePicker
            fanState={fanState}
            onSaved={() => {
              setShowPicker(false);
              doToggle();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
