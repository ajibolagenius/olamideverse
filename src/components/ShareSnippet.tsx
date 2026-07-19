"use client";

import { useState } from "react";

/**
 * Copy / native-share for audiogram snippet URLs.
 * Shares the page link (with OG card) — never generates or hosts audio.
 */
export default function ShareSnippet({
  url,
  title,
  compact = false,
}: {
  url: string;
  title: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  async function share() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${title} · OlamideVerse`,
          text: "A snippet from the OlamideVerse archive",
          url,
        });
        setStatus("shared");
        window.setTimeout(() => setStatus("idle"), 2000);
        return;
      } catch (err) {
        // User cancelled — fall through to copy only if not AbortError.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // Clipboard blocked — leave idle.
    }
  }

  const label =
    status === "copied" ? "Copied" : status === "shared" ? "Shared" : "Share";

  return (
    <button
      type="button"
      onClick={share}
      className={
        compact
          ? "border-2 border-ink bg-danfo px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink transition-transform hover:-translate-x-px hover:-translate-y-px"
          : "border-[3px] border-ink bg-danfo px-4 py-2.5 text-xs font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      }
    >
      {label}
    </button>
  );
}
