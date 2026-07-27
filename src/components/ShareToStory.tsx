"use client";

import { useId, useState } from "react";

/**
 * Shares the generated vertical story image (a file, not a link) for a
 * snippet — distinct from ShareSnippet, which shares the page URL.
 */
export default function ShareToStory({
  storyUrl,
  title,
  compact = false,
}: {
  storyUrl: string;
  title: string;
  compact?: boolean;
}) {
  const liveId = useId();
  const [status, setStatus] = useState<"idle" | "busy" | "shared" | "downloaded" | "failed">(
    "idle",
  );

  async function shareStory() {
    setStatus("busy");
    try {
      const response = await fetch(storyUrl);
      const blob = await response.blob();
      const file = new File([blob], `${title}-story.png`, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: `${title} · OlamideVerse`,
            text: "A snippet from the OlamideVerse archive",
          });
          setStatus("shared");
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            setStatus("idle");
            return;
          }
          throw err;
        }
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = `${title}-story.png`;
        anchor.click();
        URL.revokeObjectURL(objectUrl);
        setStatus("downloaded");
      }
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2200);
  }

  const statusText =
    status === "shared"
      ? "Shared"
      : status === "downloaded"
        ? "Image downloaded"
        : status === "failed"
          ? "Couldn't share — try again"
          : "";

  const btn = compact
    ? "border-2 border-ink px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink transition-transform hover:-translate-x-px hover:-translate-y-px"
    : "border-3 border-ink px-4 py-2.5 text-xs font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5";

  return (
    <div className={compact ? "flex flex-wrap items-center gap-1.5" : "flex flex-wrap items-center gap-2"}>
      <button
        type="button"
        onClick={shareStory}
        disabled={status === "busy"}
        className={`${btn} bg-paper disabled:opacity-60`}
      >
        {status === "busy" ? "Preparing…" : "Share to story"}
      </button>
      <span id={liveId} className="sr-only" aria-live="polite">
        {statusText}
      </span>
    </div>
  );
}
