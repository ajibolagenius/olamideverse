"use client";

import { useId, useState } from "react";
import Link from "next/link";
import CoverArt from "./CoverArt";
import { accentChrome, accentText, type AccentName } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, type Album, type Era } from "@/lib/content-schema";
import { ArrowRight, Disc } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

interface VinylCrateProps {
  albums: Album[];
  erasBySlug: Map<string, Era>;
}

export default function VinylCrate({ albums, erasBySlug }: VinylCrateProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeAlbum = albums[selectedIndex] ?? albums[0];
  const activeEra = activeAlbum ? erasBySlug.get(activeAlbum.era) : undefined;
  const listboxId = useId();

  if (!activeAlbum || !activeEra) return null;

  const activeChrome = accentChrome(activeEra.accent as AccentName);
  const activeText = accentText(activeEra.accent as AccentName);

  return (
    <div className="border-3 border-ink bg-paper p-5 sm:p-8 shadow-paste">
      {/* Crate Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-print">
            <Disc size={22} weight={OV_ICON_WEIGHT} className="animate-spin-slow" />
          </div>
          <div>
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink-muted">
              BARIGA CRATE ARCHIVE · NO. 01
            </span>
            <h3 className="font-display text-lg uppercase tracking-wide text-ink">
              12″ Heavyweight Vinyl Crate
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-ink-soft">
          <span className="border border-ink/30 bg-white px-2 py-0.5 shadow-print">
            {albums.length} PRESSINGS IN CRATE
          </span>
          <span className="hidden sm:inline-block text-ink-muted">
            USE ARROWS OR CLICK SPINES
          </span>
        </div>
      </div>

      {/* Main Crate Split: Left Interactive Record Spines, Right Record Preview Sleeve */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left: The Record Crate Stack (Spines lined up) */}
        <div className="lg:col-span-7">
          <div className="relative border-2 border-ink bg-oxide/10 p-3 sm:p-4 shadow-inner">
            {/* Wooden Crate Rim Stamp */}
            <div className="mb-2 flex items-center justify-between font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
              <span>◄ CRATE FRONT</span>
              <span>1200 RPM / LAGOS CUT ►</span>
            </div>

            {/* Crate Spines List */}
            <div
              id={listboxId}
              role="listbox"
              aria-label="Vinyl record spines in crate"
              className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-1 no-scrollbar"
            >
              {albums.map((album, idx) => {
                const era = erasBySlug.get(album.era);
                const isSelected = idx === selectedIndex;
                const chrome = era
                  ? accentChrome(era.accent as AccentName)
                  : { bg: "#F5B301", fg: "#181410" };

                return (
                  <button
                    key={album.slug}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedIndex(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group relative flex items-center justify-between border-2 border-ink px-3 py-2.5 text-left transition-all ${
                      isSelected
                        ? "translate-x-2 bg-white shadow-paste-sm border-ink z-10"
                        : "bg-paper-dim/90 hover:bg-white hover:translate-x-1"
                    }`}
                  >
                    {/* Era Spine Color Tag */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-2.5 border-r border-ink"
                      style={{ backgroundColor: chrome.bg }}
                      aria-hidden="true"
                    />

                    <div className="pl-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.65rem] font-bold text-ink-muted tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h4 className="font-display text-sm tracking-wide uppercase truncate text-ink group-hover:text-danfo">
                          {album.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[0.7rem] text-ink-soft">
                        <span className="font-mono">{album.year}</span>
                        <span>·</span>
                        <span>{ALBUM_TYPE_LABEL[album.type]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      <span
                        className="hidden sm:inline-block border border-ink/20 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: isSelected ? chrome.bg : "transparent", color: isSelected ? chrome.fg : "inherit" }}
                      >
                        {era?.title}
                      </span>
                      {isSelected ? (
                        <ArrowRight size={14} weight="bold" className="text-ink" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Crate Bottom Lip */}
            <div className="mt-2 border-t border-ink/20 pt-1 text-center font-mono text-[0.62rem] text-ink-muted uppercase tracking-widest">
              YBNL NATION & CODED TUNES HISTORICAL PRESSINGS
            </div>
          </div>
        </div>

        {/* Right: The Pull-out Gatefold Preview */}
        <div className="lg:col-span-5">
          <div className="relative border-3 border-ink bg-white p-5 shadow-paste">
            {/* Top Tape Accent */}
            <div className="ov-tape absolute -top-3.5 left-8 border border-ink/30 bg-[#FFF0A0] px-4 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-ink shadow-print">
              SLEEVE INSPECTOR
            </div>

            <div className="pt-2">
              {/* Cover Art with Vinyl Disc Peak */}
              <div className="relative mb-5 mx-auto max-w-[280px]">
                {/* Vinyl Disc Sticking Out Behind Sleeve */}
                <div
                  className="pointer-events-none absolute -right-6 top-3 h-48 w-48 rounded-full border-4 border-ink bg-[#141210] shadow-md transition-transform duration-500 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, #2C2622 25%, #141210 26%, #2C2622 45%, #141210 46%, #2C2622 70%, #141210 71%)",
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="h-16 w-16 rounded-full border-2 border-ink flex items-center justify-center text-[0.55rem] font-mono font-bold uppercase text-center p-1"
                    style={{ backgroundColor: activeChrome.bg, color: activeChrome.fg }}
                  >
                    SIDE A
                  </div>
                </div>

                {/* Main Cardboard Sleeve */}
                <div className="relative z-10 border-2 border-ink bg-white shadow-paste-sm">
                  <CoverArt
                    title={activeAlbum.title}
                    slug={activeAlbum.slug}
                    accent={activeEra.accent}
                    priority
                  />
                </div>
              </div>

              {/* Sleeve Metadata */}
              <div className="border-t-2 border-ink pt-4">
                <div className="flex items-center justify-between">
                  <span
                    className="border border-ink px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: activeChrome.bg, color: activeChrome.fg }}
                  >
                    {activeEra.title}
                  </span>
                  <span className="font-mono text-xs font-bold text-ink-muted">
                    {activeAlbum.year} · {ALBUM_TYPE_LABEL[activeAlbum.type]}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-ink">
                  {activeAlbum.title}
                </h3>

                {activeAlbum.producer ? (
                  <p className="mt-1 font-mono text-[0.72rem] text-ink-muted uppercase">
                    PRODUCED BY {activeAlbum.producer}
                  </p>
                ) : null}

                {activeEra.thesis ? (
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft line-clamp-3">
                    {activeEra.thesis}
                  </p>
                ) : null}

                {/* Key Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-y border-ink/15 py-2.5 font-mono text-[0.72rem]">
                  <div>
                    <span className="text-ink-muted">TRACKS:</span>{" "}
                    <span className="font-bold text-ink">
                      {activeAlbum.tracklist.length > 0
                        ? `${activeAlbum.tracklist.length} tracks`
                        : "Full LP"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-muted">ERA:</span>{" "}
                    <span className="font-bold" style={{ color: activeText }}>
                      CH. 0{activeEra.order}
                    </span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="mt-5">
                  <Link
                    href={`/albums/${activeAlbum.slug}`}
                    className="ov-btn ov-btn-danfo w-full justify-center px-4 py-3 text-xs uppercase tracking-wider"
                  >
                    <span>Open Sleeve Notes & Tracklist</span>
                    <ArrowRight size={16} weight={OV_ICON_WEIGHT} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
