"use client";

import { X } from "@phosphor-icons/react";
import type { ToastItem } from "@/lib/feedback/types";
import { dismissToast } from "@/lib/feedback/store";
import { OV_ICON_WEIGHT } from "@/lib/icons";

function toastClasses(variant: ToastItem["variant"]): string {
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

export default function Toast({ toast }: { toast: ToastItem }) {
  const assertive = toast.variant === "error";
  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={`ov-feedback-toast pointer-events-auto flex max-w-sm items-start gap-2 border-2 px-3 py-2.5 text-sm font-semibold shadow-paste-sm ${toastClasses(toast.variant)}`}
    >
      <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="shrink-0 opacity-80 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
      </button>
    </div>
  );
}
