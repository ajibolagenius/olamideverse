"use client";

import { useMemo, useState } from "react";
import AlbumCard from "./AlbumCard";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import type { Album, Era } from "@/lib/content-schema";

export default function AlbumGrid({
  albums,
  eras,
  showFavorites = false,
}: {
  albums: Album[];
  eras: Era[];
  showFavorites?: boolean;
}) {
  const [eraFilter, setEraFilter] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const erasBySlug = useMemo(
    () => new Map(eras.map((era) => [era.slug, era])),
    [eras],
  );

  const shown = useMemo(() => {
    const filtered =
      eraFilter === "all" ? albums : albums.filter((a) => a.era === eraFilter);
    return [...filtered].sort((a, b) =>
      sort === "newest" ? b.year - a.year : a.year - b.year,
    );
  }, [albums, eraFilter, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <FilterChips
          label="Filter by era"
          value={eraFilter}
          onChange={setEraFilter}
          options={[
            { value: "all", label: "All eras" },
            ...eras.map((era) => ({ value: era.slug, label: era.title })),
          ]}
        />
        <div
          role="group"
          aria-label="Sort order"
          className="flex gap-4 text-[0.72rem] font-bold tracking-[0.04em] uppercase"
        >
          {(["newest", "oldest"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={sort === option}
              onClick={() => setSort(option)}
              className={`border-b-[3px] pb-0.5 ${
                sort === option
                  ? "border-ink"
                  : "border-transparent text-ink-soft hover:border-danfo"
              }`}
            >
              {option} first
            </button>
          ))}
        </div>
      </div>
      <p className="mb-5 text-[0.8rem] tracking-[0.1em] uppercase text-ink-soft">
        {shown.length} {shown.length === 1 ? "release" : "releases"}
      </p>
      {shown.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((album, i) => (
            <AlbumCard
              key={album.slug}
              album={album}
              era={erasBySlug.get(album.era)!}
              index={i}
              showFavorite={showFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
