import type { CSSProperties } from "react";
import { ACCENTS, type AccentName } from "@/lib/accents";

/**
 * Placeholder cover in the vinyl-label motif — era-accent gradient, rotated
 * tape strip, duotone-shift overlay — until real, licensed artwork is
 * sourced in the content pass.
 */
export default function CoverArt({
  title,
  accent,
  className = "aspect-video",
}: {
  title: string;
  accent: AccentName;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`ov-duotone relative flex items-end ${className}`}
      style={
        {
          background: `linear-gradient(160deg, ${a.gradient[0]}, ${a.gradient[1]})`,
          "--ov-duotone-color": a.solid,
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="absolute -top-1 left-[34%] h-2.5 w-9 rotate-[-2deg] bg-paper/75"
      />
      <span className="font-display p-3 text-lg text-paper">{title}</span>
      <span aria-hidden className="ov-duotone-overlay" />
    </div>
  );
}
