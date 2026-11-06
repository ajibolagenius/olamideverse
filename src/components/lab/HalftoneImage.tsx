"use client";

import Image from "next/image";
import { useState } from "react";

interface HalftoneImageProps {
  src?: string;
  alt: string;
  caption?: string;
  accessionRef?: string;
  eraAccentHex?: string;
  className?: string;
}

export default function HalftoneImage({
  src,
  alt,
  caption,
  accessionRef = "ARCHIVE-EXP-2011",
  eraAccentHex = "#F5B301",
  className = "",
}: HalftoneImageProps) {
  const [isRaw, setIsRaw] = useState(false);

  return (
    <figure
      className={`group relative isolate border-2 border-ink bg-paper shadow-print transition-all hover:shadow-paste ${className}`}
    >
      {/* Plate misregistration visual offset cue on hover */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 translate-x-1 translate-y-1 border-2 border-transparent transition-all group-hover:border-ink/80 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
        style={{ borderColor: eraAccentHex }}
        aria-hidden="true"
      />

      {/* Header bar with archival accession stamp */}
      <div className="flex items-center justify-between border-b border-ink/20 bg-ink px-3 py-1.5 text-paper">
        <span className="font-mono text-[0.65rem] font-bold tracking-wider text-danfo">
          [{accessionRef}]
        </span>
        <button
          type="button"
          onClick={() => setIsRaw(!isRaw)}
          className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted hover:text-white transition-colors"
          title="Toggle Halftone Matrix"
        >
          {isRaw ? "Show Halftone" : "Raw Photo"}
        </button>
      </div>

      <div className="relative aspect-4/3 w-full overflow-hidden bg-ink">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className={`object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02] ${
              isRaw ? "contrast-100" : "contrast-125"
            }`}
          />
        ) : (
          /* High-contrast vector print placeholder simulating Bariga street archival graphic */
          <div className="flex h-full w-full flex-col items-center justify-center bg-ink p-6 text-center text-paper">
            <span className="font-display text-4xl uppercase tracking-wider text-danfo">
              YBNL ARCHIVE
            </span>
            <span className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-muted">
              BARIGA STREET RECORDING · 2011
            </span>
          </div>
        )}

        {/* SVG Halftone Dot-Matrix Pattern Overlay */}
        {!isRaw && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at center, #181410 1.5px, transparent 1.5px)`,
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />
        )}

        {/* Era accent duotone wash */}
        {!isRaw && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color opacity-35"
            style={{ backgroundColor: eraAccentHex }}
            aria-hidden="true"
          />
        )}
      </div>

      {caption && (
        <figcaption className="border-t border-ink/15 bg-white px-3 py-2 text-xs leading-relaxed text-ink-soft">
          <span className="font-bold uppercase tracking-wider text-ink mr-1.5">
            FIG. ARCHIVE ·
          </span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
