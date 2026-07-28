"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/FilterChips";
import PosterGeneratorModal from "@/components/ui/PosterGeneratorModal";
import { accentText, type AccentName } from "@/lib/accents";
import type { Era, SlangTerm } from "@/lib/content-schema";

/**
 * The street-lingo lexicon — era filter plus a free-text match over term,
 * meaning and the record that carried it. Entries with an albumSlug link to
 * the album page; non-album singles and features fall through to the songs
 * catalogue, since those cuts have no page of their own.
 */
export default function SlangGrid({
  terms,
  eras,
}: {
  terms: SlangTerm[];
  eras: Era[];
}) {
  const [eraFilter, setEraFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [posterOpen, setPosterOpen] = useState(false);

  const accentByEra = useMemo(
    () => new Map(eras.map((e) => [e.slug, e.accent as AccentName])),
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
      return `${term.term} ${term.literal} ${term.meaning} ${term.songTitle}`
        .toLowerCase()
        .includes(needle);
    });
  }, [terms, eraFilter, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-3 border-ink bg-white p-5 shadow-print sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl uppercase tracking-[0.04em]">
            Print it like a paste-up
          </h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-soft">
            Set a term in the archive&rsquo;s poster type and copy the wall-flyer
            text for your own feed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPosterOpen(true)}
          className="ov-btn ov-btn-danfo shrink-0 px-4 py-2 text-xs"
        >
          Poster generator
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

      <p className="mb-5 text-[0.8rem] tracking-[0.1em] uppercase text-ink-soft">
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState message="No street term matches that search yet." />
      ) : (
        <div className="grid gap-7 md:grid-cols-2">
          {filtered.map((term) => {
            const accent = accentByEra.get(term.era) ?? "danfo";
            const href = term.albumSlug
              ? `/albums/${term.albumSlug}`
              : `/songs?q=${encodeURIComponent(term.songTitle)}`;
            return (
              <article
                key={term.id}
                className="ov-paste-up flex flex-col justify-between border-2 border-ink bg-white p-6 shadow-print"
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-3">
                    <h3 className="font-display text-3xl leading-none">{term.term}</h3>
                    <span className="text-xs font-semibold tracking-[0.06em] text-ink-soft">
                      /{term.phonetic}/
                    </span>
                  </div>
                  <p className="mt-3 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-oxide">
                    Literally: {term.literal}
                  </p>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink">
                    {term.meaning}
                  </p>
                  <p className="mt-3 border-l-3 border-adire bg-paper-dim p-3 text-sm leading-relaxed text-ink-soft">
                    {term.context}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 pt-3 text-[0.72rem] font-bold tracking-[0.06em] uppercase">
                  <span style={{ color: accentText(accent) }}>
                    {term.songTitle} · {term.year}
                  </span>
                  <Link href={href} className="underline underline-offset-2 hover:text-oxide">
                    {term.albumSlug ? "Album" : "Catalogue"} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <PosterGeneratorModal
        open={posterOpen}
        onClose={() => setPosterOpen(false)}
        defaultHeadline="Bariga to the world"
        defaultSubhead="YBNL Nation · street linguistics"
      />
    </div>
  );
}
