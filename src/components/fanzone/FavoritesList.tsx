"use client";

import { useState } from "react";
import Link from "next/link";
import { removeFavorite } from "@/lib/fanzone/mutations";
import type { FavoriteRow } from "@/lib/fanzone/queries";
import EmptyState from "@/components/EmptyState";

export default function FavoritesList({ initialFavorites }: { initialFavorites: FavoriteRow[] }) {
  const [favorites, setFavorites] = useState(initialFavorites);

  if (favorites.length === 0) {
    return <EmptyState message="No favorites yet — favorite an era or album to see it here." />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="ov-paste-up flex items-center justify-between gap-3 border-[3px] border-ink bg-white px-3.5 py-3 shadow-paste-sm"
        >
          <Link href={fav.href} className="font-bold">
            {fav.label}
            <small className="block text-xs font-normal tracking-[0.04em] uppercase text-ink-soft">
              {fav.kind}
            </small>
          </Link>
          <button
            type="button"
            aria-label={`Remove ${fav.label} from favorites`}
            onClick={async () => {
              setFavorites((f) => f.filter((x) => x.id !== fav.id));
              await removeFavorite(fav.target_id);
            }}
            className="grid size-6 place-items-center border-2 border-ink bg-paper"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
