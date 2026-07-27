"use client";

import { Books, Disc, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import EmptyState from "@/components/EmptyState";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { getSavedItems, removeOffline, subscribeSaved, type SavedItem } from "@/lib/offline";

const EMPTY: SavedItem[] = [];
const emptySnapshot = () => EMPTY;

export default function SavedList() {
  const items = useSyncExternalStore(subscribeSaved, getSavedItems, emptySnapshot);

  if (items.length === 0) {
    return (
      <EmptyState message="Nothing saved yet — look for 'Save offline' on an album or era page." />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.kind === "album" ? Disc : Books;
        return (
          <li
            key={item.href}
            className="flex items-center justify-between gap-3 border-3 border-ink bg-white p-4 shadow-paste-sm"
          >
            <Link href={item.href} className="ov-icon-inline min-w-0 flex-1">
              <Icon className="ov-icon shrink-0" size={18} weight={OV_ICON_WEIGHT} aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-display text-lg leading-tight">
                  {item.title}
                </span>
                <span className="block truncate text-xs tracking-[0.04em] uppercase text-ink-soft">
                  {item.subtitle}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => removeOffline(item.href)}
              aria-label={`Remove ${item.title} from saved`}
              className="ov-btn ov-btn-ghost ov-icon-inline shrink-0 px-2.5 py-1.5 text-xs"
            >
              <X className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
