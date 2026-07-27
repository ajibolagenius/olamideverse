"use client";

import { Eye } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { OV_ICON_WEIGHT } from "@/lib/icons";

function formatCount(n: number) {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/**
 * Paste-up style visitor counter for the site footer.
 * Counts unique browsers (cookie), not pageviews. Fetched client-side so
 * static pages stay static and the count stays fresh.
 */
export default function VisitorBadge() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/analytics/totals", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { visitors?: number } | null) => {
        if (data && typeof data.visitors === "number") {
          setVisitors(data.visitors);
        } else {
          setVisitors(0);
        }
      })
      .catch(() => setVisitors(0));
    return () => controller.abort();
  }, []);

  const label =
    visitors === null
      ? "Loading visitor count"
      : `${visitors.toLocaleString()} unique visitors`;

  return (
    <div
      className="ov-visitor-badge inline-flex shrink-0 items-center gap-2 border-3 border-danfo bg-[#221c16] px-3 py-1.5 text-paper shadow-[3px_3px_0_#F5B301]"
      title={label}
      aria-label={label}
      aria-live="polite"
    >
      <Eye className="ov-icon text-danfo" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
      <span className="font-display text-lg leading-none tracking-wide text-danfo">
        {visitors === null ? "—" : formatCount(visitors)}
      </span>
      <span className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-ink-muted">
        visitors
      </span>
    </div>
  );
}
