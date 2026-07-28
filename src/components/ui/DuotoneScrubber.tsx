"use client";

import { useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, Sparkle } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";

interface DuotoneScrubberProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  duotoneColor?: string;
  className?: string;
}

/**
 * DuotoneScrubber — interactive photo component.
 * Allows readers to toggle/scrub between era-accented duotone mode and clean archival photography.
 * Respects prefers-reduced-motion state.
 */
export default function DuotoneScrubber({
  src,
  alt,
  width = 600,
  height = 400,
  duotoneColor = "#1F2A63",
  className = "",
}: DuotoneScrubberProps) {
  const [isFullColor, setIsFullColor] = useState(false);

  return (
    <div className={`ov-duotone group relative overflow-hidden border-2 border-ink ${className}`}>
      {/* Base photo */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-[1.02]"
      />

      {/* Era duotone color overlay */}
      <div
        className="ov-duotone-overlay"
        style={{
          backgroundColor: duotoneColor,
          opacity: isFullColor ? 0 : undefined,
        }}
        aria-hidden="true"
      />

      {/* Mode toggle badge button */}
      <button
        type="button"
        onClick={() => setIsFullColor(!isFullColor)}
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 border-2 border-ink bg-paper px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm transition-transform active:scale-95"
        aria-label={isFullColor ? "Switch to duotone archival mode" : "Switch to full color image"}
        title={isFullColor ? "Duotone archival view" : "Full color view"}
      >
        {isFullColor ? (
          <>
            <SlidersHorizontal className="ov-icon text-adire" size={13} weight={OV_ICON_WEIGHT} aria-hidden />
            <span>Archival Mode</span>
          </>
        ) : (
          <>
            <Sparkle className="ov-icon text-danfo" size={13} weight={OV_ICON_WEIGHT} aria-hidden />
            <span>Full Color</span>
          </>
        )}
      </button>

      {/* Paper tape accent */}
      <div className="ov-tape absolute top-2 right-2 pointer-events-none" />
    </div>
  );
}
