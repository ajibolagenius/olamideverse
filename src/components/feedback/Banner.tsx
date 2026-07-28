"use client";

import { X } from "@phosphor-icons/react";
import type { BannerItem } from "@/lib/feedback/types";
import { dismissBanner } from "@/lib/feedback/store";
import { OV_ICON_WEIGHT } from "@/lib/icons";

function bannerClasses(variant: BannerItem["variant"]): string {
  switch (variant) {
    case "success":
      return "border-ink bg-palm text-paper";
    case "error":
      return "border-ink bg-oxide text-paper";
    case "warning":
      return "border-ink border-l-6 border-l-danfo bg-paper text-ink";
    default:
      return "border-ink border-l-6 border-l-danfo bg-paper text-ink";
  }
}

export default function Banner({ banner }: { banner: BannerItem }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`ov-feedback-banner flex w-full items-center gap-3 border-b-2 px-4 py-2.5 text-sm font-semibold ${bannerClasses(banner.variant)}`}
    >
      <p className="min-w-0 flex-1 leading-snug">{banner.message}</p>
      {banner.action ? (
        <button
          type="button"
          onClick={banner.action.onClick}
          className="shrink-0 border-2 border-current px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
        >
          {banner.action.label}
        </button>
      ) : null}
      {banner.dismissible ? (
        <button
          type="button"
          onClick={() => dismissBanner(banner.id)}
          className="shrink-0 opacity-80 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
