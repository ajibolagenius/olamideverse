import type { CSSProperties } from "react";
import { ACCENTS, type AccentName } from "@/lib/accents";

/**
 * Duotone archival-photo placeholder — every photo slot on the site carries
 * the duotone-shift treatment once real, credited imagery is sourced.
 */
export default function PhotoPlaceholder({
  accent,
  label,
  className = "min-h-[280px]",
}: {
  accent: AccentName;
  label: string;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`ov-duotone relative grid place-items-center border-[3px] border-ink bg-[#2A241D] ${className}`}
      style={{ "--ov-duotone-color": a.solid } as CSSProperties}
    >
      <span className="max-w-[24ch] px-6 text-center text-sm text-ink-muted">{label}</span>
      <span aria-hidden className="ov-duotone-overlay" />
    </div>
  );
}
