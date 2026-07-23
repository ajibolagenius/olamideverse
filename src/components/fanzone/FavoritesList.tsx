"use client";

import { Heart, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { removeFavorite } from "@/lib/fanzone/mutations";
import type { FavoriteRow } from "@/lib/fanzone/queries";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function FavoritesList({ initialFavorites }: { initialFavorites: FavoriteRow[] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [error, setError] = useState<string | null>(null);

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        message="No favorites yet — favorite an era or album to see it here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {error ? <p className="text-sm text-oxide">{error}</p> : null}
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="ov-paste-up flex items-center justify-between gap-3 border-[3px] border-ink bg-white px-3.5 py-3 shadow-paste-sm"
        >
          <Link href={fav.href} className="ov-link-underline font-bold">
            {fav.label}
            <small className="block text-xs font-normal tracking-[0.04em] uppercase text-ink-soft">
              {fav.kind}
            </small>
          </Link>
          <button
            type="button"
            aria-label={`Remove ${fav.label} from favorites`}
            onClick={async () => {
              const previous = favorites;
              setFavorites((f) => f.filter((x) => x.id !== fav.id));
              setError(null);
              try {
                await removeFavorite(fav.target_id);
              } catch (err) {
                setFavorites(previous);
                setError(err instanceof Error ? err.message : "Couldn't remove favorite.");
              }
            }}
            className="grid size-6 place-items-center border-2 border-ink bg-paper"
          >
            <X size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
