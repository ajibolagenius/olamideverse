"use client";

import { BookmarkSimple } from "@phosphor-icons/react";
import { useState, useSyncExternalStore } from "react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { isSaved, removeOffline, saveOffline, subscribeSaved } from "@/lib/offline";

const emptySnapshot = () => false;

/**
 * Device-local "save for offline" bookmark — no Fan Zone account needed.
 * Visually mirrors FavoriteButton but is a distinct, unrelated feature.
 */
export default function SaveOfflineButton({
  href,
  title,
  subtitle,
  kind,
  tone = "paper",
}: {
  href: string;
  title: string;
  subtitle: string;
  kind: "era" | "album";
  /** `ink` for dark hero backgrounds (era chapters). */
  tone?: "paper" | "ink";
}) {
  const saved = useSyncExternalStore(
    subscribeSaved,
    () => isSaved(href),
    emptySnapshot,
  );
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    if (saved) {
      await removeOffline(href);
    } else {
      await saveOffline({ href, title, subtitle, kind });
    }
    setPending(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1.5 text-[0.7rem] font-bold tracking-[0.05em] uppercase transition-colors disabled:opacity-60 ${
        saved
          ? "bg-danfo shadow-paste-sm"
          : tone === "ink"
            ? "bg-paper text-ink hover:bg-danfo"
            : "bg-white hover:bg-danfo-tint"
      }`}
    >
      <BookmarkSimple
        className="ov-icon"
        size={14}
        weight={saved ? "fill" : OV_ICON_WEIGHT}
        aria-hidden
      />
      {saved ? "Saved offline" : "Save offline"}
    </button>
  );
}
