"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/FilterChips";
import PosterGeneratorModal from "@/components/ui/PosterGeneratorModal";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Era, SlangTerm } from "@/lib/content-schema";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { ArrowRight, Signpost, Table } from "@phosphor-icons/react";

/**
 * Returns distinct visual styling for the hand-painted Danfo signboards
 * based on the era's assigned accent palette.
 */
function getSignboardStyle(accent: AccentName) {
  switch (accent) {
    case "danfo":
      return {
        cardBg: "bg-danfo text-ink",
        dashedBorder: "border-ink/60",
        kicker: "text-ink/80",
        literal: "text-oxide",
        contextBox: "border-ink bg-white/80 text-ink",
        footerBorder: "border-ink/20",
        linkHover: "text-oxide hover:underline",
      };
    case "oxide":
      return {
        cardBg: "bg-oxide text-paper",
        dashedBorder: "border-paper/40",
        kicker: "text-danfo",
        literal: "text-danfo",
        contextBox: "border-danfo bg-black/25 text-paper/95",
        footerBorder: "border-paper/20",
        linkHover: "text-danfo hover:underline",
      };
    case "adire":
      return {
        cardBg: "bg-adire text-paper",
        dashedBorder: "border-paper/40",
        kicker: "text-danfo",
        literal: "text-danfo",
        contextBox: "border-danfo bg-black/25 text-paper/95",
        footerBorder: "border-paper/20",
        linkHover: "text-danfo hover:underline",
      };
    case "palm":
      return {
        cardBg: "bg-palm text-paper",
        dashedBorder: "border-paper/40",
        kicker: "text-danfo",
        literal: "text-danfo",
        contextBox: "border-danfo bg-black/25 text-paper/95",
        footerBorder: "border-paper/20",
        linkHover: "text-danfo hover:underline",
      };
    case "clay":
      return {
        cardBg: "bg-clay text-paper",
        dashedBorder: "border-paper/40",
        kicker: "text-danfo",
        literal: "text-danfo",
        contextBox: "border-danfo bg-black/25 text-paper/95",
        footerBorder: "border-paper/20",
        linkHover: "text-danfo hover:underline",
      };
    case "ink":
    default:
      return {
        cardBg: "bg-ink text-paper",
        dashedBorder: "border-danfo/60",
        kicker: "text-danfo",
        literal: "text-danfo",
        contextBox: "border-danfo bg-white/10 text-paper/95",
        footerBorder: "border-paper/20",
        linkHover: "text-danfo hover:underline",
      };
  }
}

/**
 * The street-lingo lexicon — featuring hand-painted Lagos Danfo bus signboards,
 * a structured dictionary ledger view, and instant era & text filtering.
 */
export default function SlangGrid({
  terms,
  eras,
}: {
  terms: SlangTerm[];
  eras: Era[];
}) {
  const [view, setView] = useState<"signboards" | "ledger">("signboards");
  const [eraFilter, setEraFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [posterOpen, setPosterOpen] = useState(false);

  const accentByEra = useMemo(
    () => new Map(eras.map((e) => [e.slug, e.accent as AccentName])),
    [eras],
  );

  const eraBySlug = useMemo(
    () => new Map(eras.map((e) => [e.slug, e])),
    [eras],
  );

  const eraOptions = useMemo(() => {
    const present = new Set(terms.map((t) => t.era));
    return [
      { value: "all", label: "All eras" },
      ...eras
        .filter((e) => present.has(e.slug))
        .map((e) => ({ value: e.slug, label: e.title })),
    ];
  }, [eras, terms]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return terms.filter((term) => {
      if (eraFilter !== "all" && term.era !== eraFilter) return false;
      if (!needle) return true;
      return `${term.term} ${term.literal} ${term.meaning} ${term.songTitle} ${term.context}`
        .toLowerCase()
        .includes(needle);
    });
  }, [terms, eraFilter, query]);

  return (
    <div className="space-y-8">
      {/* Paste-Up Poster Generator Banner */}
      <div className="flex flex-col gap-4 border-3 border-ink bg-white p-6 shadow-print sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl uppercase tracking-[0.04em] text-ink">
            Print it like a Lagos paste-up
          </h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-soft">
            Typeset any street term in the archive&rsquo;s authentic poster typography and
            export wall-flyer graphics for your feed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPosterOpen(true)}
          className="ov-btn ov-btn-danfo shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          Poster generator
        </button>
      </div>

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col gap-5 border-2 border-ink bg-white p-5 shadow-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
              VIEW PERSPECTIVE
            </span>
          </div>

          {/* Accessible View Mode Switcher */}
          <div
            role="group"
            id="ov-slang-switcher"
            data-tour="slang-switcher"
            aria-label="Street lingo presentation view"
            className="flex items-center gap-2 border border-ink bg-paper-dim p-1 shadow-paste-sm"
          >
            <button
              type="button"
              aria-pressed={view === "signboards"}
              onClick={() => setView("signboards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                view === "signboards"
                  ? "bg-danfo text-ink shadow-paste-sm"
                  : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              <Signpost weight={OV_ICON_WEIGHT} className="h-4 w-4" />
              <span>Danfo Signboards</span>
            </button>
            <button
              type="button"
              aria-pressed={view === "ledger"}
              onClick={() => setView("ledger")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                view === "ledger"
                  ? "bg-danfo text-ink shadow-paste-sm"
                  : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              <Table weight={OV_ICON_WEIGHT} className="h-4 w-4" />
              <span>Lexicon Ledger</span>
            </button>
          </div>
        </div>

        {/* Filter Chips & Text Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips
            label="Filter lingo by era"
            options={eraOptions}
            value={eraFilter}
            onChange={setEraFilter}
          />
          <label className="shrink-0 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft">
            <span className="mr-2.5">Find a term</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Shoki, Wó, Baddo…"
              className="w-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-semibold normal-case tracking-normal text-ink placeholder:text-ink-soft/70 lg:w-64"
            />
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-[0.8rem] font-mono font-bold tracking-wider uppercase text-ink-soft">
        <span>
          {filtered.length} {filtered.length === 1 ? "term" : "terms"} documented in circulation
        </span>
        <span className="text-[0.7rem] hidden sm:inline">
          {view === "signboards" ? "Hand-Painted Signboards" : "Lexicographical Ledger"}
        </span>
      </div>

      {/* Main View Area */}
      {filtered.length === 0 ? (
        <EmptyState message="No street term matches that search query yet." />
      ) : view === "signboards" ? (
        /* Danfo Hand-Painted Signboards Grid */
        <div className="grid gap-8 sm:grid-cols-2">
          {filtered.map((term, i) => {
            const accent = accentByEra.get(term.era) ?? "danfo";
            const style = getSignboardStyle(accent);
            const era = eraBySlug.get(term.era);
            const href = term.albumSlug
              ? `/albums/${term.albumSlug}`
              : `/songs?q=${encodeURIComponent(term.songTitle)}`;

            // Slight subtle rotation offset based on index (disabled if prefers-reduced-motion)
            const rotationClass =
              i % 3 === 0
                ? "-rotate-1 motion-safe:hover:rotate-0"
                : i % 3 === 1
                  ? "rotate-1 motion-safe:hover:rotate-0"
                  : "-rotate-0.5 motion-safe:hover:rotate-0";

            return (
              <article
                key={term.id}
                className={`border-4 border-ink p-5 sm:p-6 shadow-paste transition-transform ${rotationClass} ${style.cardBg} flex flex-col justify-between`}
              >
                <div className={`border-2 border-dashed ${style.dashedBorder} p-4 sm:p-5 flex flex-col justify-between h-full`}>
                  <div>
                    {/* Signboard Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/20 pb-2.5">
                      <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-widest ${style.kicker}`}>
                        LAGOS VERNACULAR // {term.year}
                      </span>
                      <span className="font-mono text-[0.68rem] font-bold tracking-wider">
                        /{term.phonetic}/
                      </span>
                    </div>

                    {/* Term Name */}
                    <h3 className="font-display mt-3 text-3xl sm:text-4xl uppercase tracking-tight leading-none">
                      {term.term}
                    </h3>

                    {/* Literal Translation */}
                    <p className={`mt-2 font-mono text-[0.72rem] font-bold uppercase tracking-wider ${style.literal}`}>
                      Literally: {term.literal}
                    </p>

                    {/* Street Meaning */}
                    <p className="mt-3 text-[0.95rem] font-semibold leading-relaxed">
                      {term.meaning}
                    </p>

                    {/* Context Roadside Tape Box */}
                    <div className={`mt-4 border-l-3 p-3 text-xs leading-relaxed ${style.contextBox}`}>
                      <span className="font-bold uppercase tracking-wider block mb-1 text-[0.65rem]">
                        CULTURAL CONTEXT & USAGE:
                      </span>
                      {term.context}
                    </div>
                  </div>

                  {/* Carrier Record Footer */}
                  <div className={`mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[0.72rem] font-bold tracking-wider uppercase ${style.footerBorder}`}>
                    <span className="font-mono">
                      {term.songTitle} · {term.year}
                      {era ? ` (${era.title})` : ""}
                    </span>
                    <Link
                      href={href}
                      className={`inline-flex items-center gap-1 font-bold ${style.linkHover}`}
                    >
                      <span>{term.albumSlug ? "View Album" : "Song Dossier"}</span>
                      <ArrowRight weight="bold" className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Lexicon Ledger Table View */
        <div className="overflow-x-auto border-2 border-ink bg-white shadow-print">
          <div className="min-w-[720px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 border-b-2 border-ink bg-paper-dim px-5 py-3 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-ink">
              <div className="col-span-3">Term & Phonetic</div>
              <div className="col-span-3">Literal Translation</div>
              <div className="col-span-4">Meaning & Context</div>
              <div className="col-span-2 text-right">Carrier Track</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-ink/15">
              {filtered.map((term) => {
                const accent = accentByEra.get(term.era) ?? "danfo";
                const era = eraBySlug.get(term.era);
                const href = term.albumSlug
                  ? `/albums/${term.albumSlug}`
                  : `/songs?q=${encodeURIComponent(term.songTitle)}`;

                return (
                  <div
                    key={term.id}
                    className="grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-paper-dim/60"
                  >
                    {/* Term & Phonetic */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: ACCENTS[accent].solid }}
                          aria-hidden="true"
                        />
                        <span className="font-display text-xl uppercase tracking-tight text-ink">
                          {term.term}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-ink-soft">
                        /{term.phonetic}/
                      </div>
                    </div>

                    {/* Literal Translation */}
                    <div className="col-span-3">
                      <span className="font-mono text-xs font-bold text-oxide">
                        {term.literal}
                      </span>
                    </div>

                    {/* Meaning & Context */}
                    <div className="col-span-4 space-y-1">
                      <p className="text-xs font-semibold leading-snug text-ink">
                        {term.meaning}
                      </p>
                      <p className="text-[0.72rem] leading-relaxed text-ink-soft line-clamp-2">
                        {term.context}
                      </p>
                    </div>

                    {/* Carrier Track & Link */}
                    <div className="col-span-2 text-right">
                      <div className="font-mono text-xs font-bold text-ink">
                        {term.songTitle}
                      </div>
                      <div className="font-mono text-[0.68rem] text-ink-soft">
                        {term.year} {era ? `· ${era.title}` : ""}
                      </div>
                      <Link
                        href={href}
                        className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-bold text-oxide hover:underline"
                      >
                        <span>{term.albumSlug ? "Album" : "Song"}</span>
                        <ArrowRight weight="bold" className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Poster Generator Modal */}
      <PosterGeneratorModal
        open={posterOpen}
        onClose={() => setPosterOpen(false)}
        defaultHeadline="Bariga to the world"
        defaultSubhead="YBNL Nation · street linguistics"
      />
    </div>
  );
}
