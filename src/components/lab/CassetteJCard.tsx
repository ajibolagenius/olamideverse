"use client";

import { useState } from "react";
import { CaretDown, Disc, Sparkle } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import type { Album, Track } from "@/lib/content-schema";

interface CassetteJCardProps {
  album: Album;
  eraAccentHex?: string;
}

export default function CassetteJCard({
  album,
  eraAccentHex = "#F5B301",
}: CassetteJCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Divide tracks into Side A & Side B for cassette feel
  const tracks: Track[] = album.tracklist ?? [];
  const midPoint = Math.ceil(tracks.length / 2);
  const sideA: Track[] = tracks.slice(0, midPoint);
  const sideB: Track[] = tracks.slice(midPoint);

  return (
    <div className="group relative isolate border-2 border-ink bg-white shadow-print transition-all hover:shadow-paste">
      {/* Misregistration accent edge */}
      <div
        className="pointer-events-none absolute -bottom-1 -right-1 -z-10 h-full w-full border-2 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
        style={{ borderColor: eraAccentHex }}
        aria-hidden="true"
      />

      {/* Cassette Spine Bar */}
      <div
        className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink"
        style={{ backgroundColor: eraAccentHex }}
      >
        <div className="flex items-center gap-2">
          <Disc weight={OV_ICON_WEIGHT} className="h-4 w-4" />
          <span className="font-mono text-[0.7rem] tracking-widest">
            MC-{album.year}-{album.slug.slice(0, 4).toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-[0.68rem] tracking-wider">
          STEREO · {tracks.length} TRACKS
        </span>
      </div>

      {/* J-Card Main Front Panel */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 className="font-display text-2xl uppercase tracking-wide">
            {album.title}
          </h3>
          <span className="font-mono text-sm font-bold text-ink-soft tabular-nums">
            RELEASE {album.year}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
          {album.type} release · Official YBNL Nation cassette archive inlay sleeve.
        </p>

        {/* Foldout Toggle Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="mt-4 flex w-full items-center justify-between border border-ink bg-paper px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm transition-transform active:translate-y-0.5"
        >
          <span className="flex items-center gap-1.5">
            <Sparkle weight={OV_ICON_WEIGHT} className="h-3.5 w-3.5 text-danfo" />
            <span>{isOpen ? "Close Inlay Sleeve" : "Unfold J-Card Tracklist"}</span>
          </span>
          <CaretDown
            weight={OV_ICON_WEIGHT}
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Unfolded Inlay Tracklist (Side A / Side B) */}
        {isOpen && (
          <div className="mt-4 border-t-2 border-dashed border-ink/20 pt-4">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Side A */}
              <div className="border border-ink/20 bg-paper/60 p-3">
                <div className="border-b border-ink/20 pb-1 mb-2 flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-wider text-ink">
                    SIDE A · PROGRAM 1
                  </span>
                  <span className="font-mono text-[0.65rem] text-ink-soft">
                    {sideA.length} CUTS
                  </span>
                </div>
                <ol className="space-y-1.5 text-xs">
                  {sideA.map((t) => (
                    <li
                      key={t.num}
                      className="flex items-baseline justify-between text-ink hover:text-oxide transition-colors"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="font-mono text-[0.68rem] text-ink-soft tabular-nums">
                          {String(t.num).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{t.title}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Side B */}
              <div className="border border-ink/20 bg-paper/60 p-3">
                <div className="border-b border-ink/20 pb-1 mb-2 flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-wider text-ink">
                    SIDE B · PROGRAM 2
                  </span>
                  <span className="font-mono text-[0.65rem] text-ink-soft">
                    {sideB.length} CUTS
                  </span>
                </div>
                <ol className="space-y-1.5 text-xs">
                  {sideB.map((t) => (
                    <li
                      key={t.num}
                      className="flex items-baseline justify-between text-ink hover:text-oxide transition-colors"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="font-mono text-[0.68rem] text-ink-soft tabular-nums">
                          {String(t.num).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{t.title}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[0.65rem] font-mono uppercase text-ink-soft">
              <span>ALL COMPOSITIONS / YBNL EMPIRE</span>
              <span>INLAY SPEC: J-CARD-FOLDOUT-v1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
