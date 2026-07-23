"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
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
          favorited ? "bg-danfo shadow-paste-sm" : "bg-white hover:bg-danfo-tint"
        }`}
      >
        {favorited ? "Favorited" : "Favorite"}
      </button>
      <Modal
        open={showPicker && !fanState.fan}
        onClose={() => setShowPicker(false)}
        title="Pick a handle"
      >
        <HandlePicker
          fanState={fanState}
          prompt="Save a fan handle to favorite eras and albums."
          onSaved={() => {
            setShowPicker(false);
            doToggle();
          }}
        />
      </Modal>
    </div>
  );
}
