"use client";

import { useId, useState } from "react";

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
  const liveId = useId();
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "failed">(
    "idle",
  );

  function flash(next: typeof status) {
    setStatus(next);
    window.setTimeout(() => setStatus("idle"), 2200);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("failed");
    }
  }

  async function shareNative() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${title} · OlamideVerse`,
          text: "A snippet from the OlamideVerse archive",
          url,
        });
        flash("shared");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  const statusText =
    status === "copied"
      ? "Link copied"
      : status === "shared"
        ? "Shared"
        : status === "failed"
          ? "Couldn't copy — try again"
          : "";

  const btn = compact
    ? "border-2 border-ink px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink transition-transform hover:-translate-x-px hover:-translate-y-px"
    : "border-[3px] border-ink px-4 py-2.5 text-xs font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5";

  return (
    <div className={compact ? "flex flex-wrap items-center gap-1.5" : "flex flex-wrap items-center gap-2"}>
      <button
        type="button"
        onClick={shareNative}
        className={`${btn} bg-danfo`}
      >
        Share
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={`${btn} bg-paper`}
      >
        {status === "copied" ? "Copied" : "Copy link"}
      </button>
      <span id={liveId} className="sr-only" aria-live="polite">
        {statusText}
      </span>
    </div>
  );
}
