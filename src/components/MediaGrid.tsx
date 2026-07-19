"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import { ACCENTS } from "@/lib/accents";
import type { Era, MediaItem } from "@/lib/content-schema";

const TYPE_LABEL: Record<MediaItem["type"], string> = {
  "music-video": "Music video",
  freestyle: "Freestyle",
  interview: "Interview",
  live: "Live",
};

function MediaCard({ item, era }: { item: MediaItem; era: Era }) {
  const accent = ACCENTS[era.accent];
  return (
    <article className="ov-paste-up border-[3px] border-ink bg-white shadow-paste-sm">
      <div className="flex items-center justify-between bg-ink px-3 py-1.5 text-[0.65rem] tracking-[0.06em] uppercase text-paper">
        <span>{TYPE_LABEL[item.type]}</span>
        <span className="text-danfo">{era.title}</span>
      </div>
      {item.youtubeId ? (
        <iframe
          title={`${item.title} — YouTube player`}
          src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div
          className="ov-duotone grid aspect-video place-items-center"
          style={
            {
              background: `linear-gradient(160deg, ${accent.gradient[0]}, ${accent.gradient[1]})`,
              "--ov-duotone-color": accent.solid,
            } as CSSProperties
          }
        >
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full border-2 border-paper"
          >
            <svg viewBox="0 0 16 16" className="size-3 fill-paper">
              <path d="M3 1l11 7-11 7z" />
            </svg>
          </span>
          <span aria-hidden className="ov-duotone-overlay" />
        </div>
      )}
      <div className="px-3 py-3">
        <h2 className="font-display text-lg">{item.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{item.note}</p>
        <p className="mt-2 text-xs tracking-[0.05em] uppercase text-ink-soft">
          {item.year} · via {item.source}
        </p>
      </div>
    </article>
  );
}

export default function MediaGrid({
  items,
  eras,
}: {
  items: MediaItem[];
  eras: Era[];
}) {
  const [eraFilter, setEraFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const erasBySlug = useMemo(
    () => new Map(eras.map((era) => [era.slug, era])),
    [eras],
  );

  const shown = items.filter(
    (item) =>
      (eraFilter === "all" || item.era === eraFilter) &&
      (typeFilter === "all" || item.type === typeFilter),
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3">
        <FilterChips
          label="Filter by era"
          value={eraFilter}
          onChange={setEraFilter}
          options={[
            { value: "all", label: "All eras" },
            ...eras.map((era) => ({ value: era.slug, label: era.title })),
          ]}
        />
        <FilterChips
          label="Filter by type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All types" },
            ...Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>
      {shown.length === 0 ? (
        <EmptyState message="No curated clips in this category yet — check back as the archive grows." />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <MediaCard key={item.id} item={item} era={erasBySlug.get(item.era)!} />
          ))}
        </div>
      )}
    </div>
  );
}
