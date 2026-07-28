"use client";

import { Heart, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { notify } from "@/lib/feedback";
import { removeFavorite } from "@/lib/fanzone/mutations";
import type { FavoriteRow } from "@/lib/fanzone/queries";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { safeInternalHref } from "@/lib/security/urls";

export default function FavoritesList({ initialFavorites }: { initialFavorites: FavoriteRow[] }) {
  const [favorites, setFavorites] = useState(initialFavorites);

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
      {favorites.map((fav) => {
        const href = safeInternalHref(fav.href);
        return (
        <div
          key={fav.id}
          className="ov-paste-up flex items-center justify-between gap-3 border-3 border-ink bg-white px-3.5 py-3 shadow-paste-sm"
        >
          {href ? (
            <Link href={href} className="ov-link-underline font-bold">
              {fav.label}
              <small className="block text-xs font-normal tracking-[0.04em] uppercase text-ink-soft">
                {fav.kind}
              </small>
            </Link>
          ) : (
            <span className="font-bold">
              {fav.label}
              <small className="block text-xs font-normal tracking-[0.04em] uppercase text-ink-soft">
                {fav.kind}
              </small>
            </span>
          )}
          <button
            type="button"
            aria-label={`Remove ${fav.label} from favorites`}
            onClick={async () => {
              const previous = favorites;
              setFavorites((f) => f.filter((x) => x.id !== fav.id));
              try {
                await removeFavorite(fav.target_id);
                notify.success("Removed from favorites");
              } catch (err) {
                setFavorites(previous);
                notify.error(
                  err instanceof Error ? err.message : "Couldn't remove favorite.",
                );
              }
            }}
            className="grid size-6 place-items-center border-2 border-ink bg-paper"
          >
            <X size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          </button>
        </div>
      );
      })}
    </div>
  );
}
