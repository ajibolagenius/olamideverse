"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AudiogramCard from "@/components/AudiogramCard";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/FilterChips";
import ShareSnippet from "@/components/ShareSnippet";
import ShareToStory from "@/components/ShareToStory";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Era, Snippet } from "@/lib/content-schema";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { SITE_URL } from "@/lib/site";
import { ArrowRight, CassetteTape, Disc, Waveform } from "@phosphor-icons/react";

/**
 * Renders an authentic physical Cassette J-Card inlay package for a snippet.
 */
function CassetteCard({
  snippet,
  accent,
}: {
  snippet: Snippet;
  accent: AccentName;
}) {
  const palette = ACCENTS[accent];
  const href = `/snippets/${snippet.id}`;
  const absoluteUrl = `${SITE_URL}${href}`;
  const catalogCode = `MC-${snippet.year}-${snippet.id.slice(0, 4).toUpperCase()}`;

  return (
    <article
      className="group relative isolate flex flex-col justify-between border-3 border-ink bg-white shadow-paste transition-all hover:shadow-print"
      data-tilt="0.4"
      style={{ rotate: "0.4deg" }}
    >
      {/* Misregistration accent edge */}
      <div
        className="pointer-events-none absolute -bottom-1.5 -right-1.5 -z-10 h-full w-full border-2 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
        style={{ borderColor: palette.solid }}
        aria-hidden="true"
      />

      <div>
        {/* Cassette Spine Bar */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-4 py-2 text-[0.68rem] font-mono font-bold uppercase tracking-wider text-ink"
          style={{ backgroundColor: palette.solid, color: palette.onSolid }}
        >
          <div className="flex items-center gap-1.5">
            <CassetteTape weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>{catalogCode}</span>
          </div>
          <span className="tracking-widest">SIDE A · STEREO</span>
        </div>

        {/* Cassette Shell Window & Spools Graphic */}
        <div className="border-b-2 border-ink bg-[#1F1B18] p-3 text-paper">
          <div className="mx-auto flex max-w-[280px] items-center justify-between rounded-sm border border-paper/30 bg-[#12100E] px-4 py-2.5 shadow-inner">
            {/* Left Spool */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper/40 bg-white/10">
              <Disc weight={OV_ICON_WEIGHT} className="h-6 w-6 text-paper/80" />
            </div>

            {/* Magnetic Tape Ribbon Window */}
            <div className="flex flex-1 flex-col items-center px-3">
              <div className="h-4 w-full rounded-xs border border-paper/30 bg-[#2A2420] relative overflow-hidden flex items-center justify-center">
                <span className="font-mono text-[0.55rem] font-bold tracking-widest text-paper/60 uppercase">
                  TAPE 15 IPS
                </span>
              </div>
              <span className="mt-1 font-mono text-[0.55rem] tracking-wider text-paper/50">
                0 · 50 · 100
              </span>
            </div>

            {/* Right Spool */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper/40 bg-white/10">
              <Disc weight={OV_ICON_WEIGHT} className="h-6 w-6 text-paper/80" />
            </div>
          </div>
        </div>

        {/* J-Card Paper Liner Notes */}
        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2 border-b border-ink/15 pb-2">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-oxide">
              YBNL ARCHIVAL VOICE-NOTE
            </span>
            <span className="font-mono text-xs font-bold text-ink-soft">
              {snippet.year}
            </span>
          </div>

          <h3 className="font-display mt-3 text-2xl uppercase tracking-tight text-ink">
            {snippet.track}
          </h3>

          <blockquote className="mt-3 border-l-3 pl-3 text-[1.1rem] font-display uppercase leading-snug text-ink" style={{ borderColor: palette.solid }}>
            “{snippet.quote}”
          </blockquote>

          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            {snippet.note}
          </p>
        </div>
      </div>

      {/* Cassette Package Footer */}
      <div className="mt-auto border-t-2 border-ink bg-paper-dim p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[0.72rem] font-mono font-bold uppercase text-ink-soft">
            <Link
              href={`/albums/${snippet.albumSlug}`}
              className="text-ink underline decoration-danfo underline-offset-2 hover:text-oxide"
            >
              {snippet.albumTitle}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ShareSnippet url={absoluteUrl} title={snippet.track} compact />
            <ShareToStory
              storyUrl={`/snippets/${snippet.id}/story`}
              title={snippet.track}
              compact
            />
            <Link
              href={href}
              className="inline-flex items-center gap-1 border-2 border-ink bg-white px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-paste-sm transition-colors hover:bg-danfo"
            >
              <span>Deck</span>
              <ArrowRight weight="bold" className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The Snippets Broadcast Studio — offering physical Cassette J-Card and
 * high-contrast Broadcast Soundcard views with instant filtering.
 */
export default function SnippetGrid({
  snippets,
  eras,
}: {
  snippets: Snippet[];
  eras: Era[];
}) {
  const [view, setView] = useState<"cassettes" | "cards">("cassettes");
  const [eraFilter, setEraFilter] = useState("all");
  const [query, setQuery] = useState("");

  const accentByEra = useMemo(
    () => new Map(eras.map((e) => [e.slug, e.accent as AccentName])),
    [eras],
  );

  const eraOptions = useMemo(() => {
    const present = new Set(snippets.map((s) => s.era));
    return [
      { value: "all", label: "All eras" },
      ...eras
        .filter((e) => present.has(e.slug))
        .map((e) => ({ value: e.slug, label: e.title })),
    ];
  }, [eras, snippets]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return snippets.filter((s) => {
      if (eraFilter !== "all" && s.era !== eraFilter) return false;
      if (!needle) return true;
      return `${s.track} ${s.quote} ${s.note} ${s.albumTitle} ${s.year}`
        .toLowerCase()
        .includes(needle);
    });
  }, [snippets, eraFilter, query]);

  return (
    <div className="space-y-8">
      {/* View Switcher & Search Bar */}
      <div className="flex flex-col gap-5 border-2 border-ink bg-white p-5 shadow-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
            BROADCAST PRESENTATION
          </span>

          {/* Accessible View Mode Switcher */}
          <div
            role="group"
            id="ov-snippets-switcher"
            data-tour="snippets-switcher"
            aria-label="Snippet presentation view"
            className="flex items-center gap-2 border border-ink bg-paper-dim p-1 shadow-paste-sm"
          >
            <button
              type="button"
              aria-pressed={view === "cassettes"}
              onClick={() => setView("cassettes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                view === "cassettes"
                  ? "bg-danfo text-ink shadow-paste-sm"
                  : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              <CassetteTape weight={OV_ICON_WEIGHT} className="h-4 w-4" />
              <span>Cassette J-Cards</span>
            </button>
            <button
              type="button"
              aria-pressed={view === "cards"}
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                view === "cards"
                  ? "bg-danfo text-ink shadow-paste-sm"
                  : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              <Waveform weight={OV_ICON_WEIGHT} className="h-4 w-4" />
              <span>Broadcast Soundcards</span>
            </button>
          </div>
        </div>

        {/* Filter Chips & Text Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips
            label="Filter snippets by era"
            options={eraOptions}
            value={eraFilter}
            onChange={setEraFilter}
          />
          <label className="shrink-0 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft">
            <span className="mr-2.5">Find a quote</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Eni Duro, Bobo, Rock…"
              className="w-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-semibold normal-case tracking-normal text-ink placeholder:text-ink-soft/70 lg:w-64"
            />
          </label>
        </div>
      </div>

      {/* Results Count & Subtitle */}
      <div className="flex items-center justify-between text-[0.8rem] font-mono font-bold tracking-wider uppercase text-ink-soft">
        <span>
          {filtered.length} {filtered.length === 1 ? "snippet" : "snippets"} available for broadcast
        </span>
        <span className="text-[0.7rem] hidden sm:inline">
          {view === "cassettes" ? "Physical Inlay Sleeves" : "Audiogram Equalizer Posters"}
        </span>
      </div>

      {/* Main Grid View */}
      {filtered.length === 0 ? (
        <EmptyState message="No broadcast snippet matches that search query yet." />
      ) : view === "cassettes" ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((snippet) => (
            <CassetteCard
              key={snippet.id}
              snippet={snippet}
              accent={accentByEra.get(snippet.era) ?? "danfo"}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((snippet) => (
            <AudiogramCard
              key={snippet.id}
              snippet={snippet}
              accent={accentByEra.get(snippet.era) ?? "danfo"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
