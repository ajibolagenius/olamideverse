"use client";

import { useMemo, useState } from "react";
import AlbumCard from "./AlbumCard";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import VinylCrate from "./VinylCrate";
import type { Album, Era } from "@/lib/content-schema";
import { Disc, SquaresFour } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

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
  const [viewMode, setViewMode] = useState<"cards" | "crate">("cards");

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
      {/* View Switcher & Filter Toolbar */}
      <div className="mb-8 flex flex-col gap-5 border-b-2 border-ink/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          label="Filter by era"
          value={eraFilter}
          onChange={setEraFilter}
          options={[
            { value: "all", label: "All eras" },
            ...eras.map((era) => ({ value: era.slug, label: era.title })),
          ]}
        />

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* View Mode Switcher */}
          <div
            role="group"
            aria-label="View format"
            className="flex items-center border-2 border-ink bg-white p-0.5 shadow-print"
          >
            <button
              type="button"
              aria-pressed={viewMode === "cards"}
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === "cards"
                  ? "bg-ink text-paper shadow-print"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <SquaresFour size={15} weight={OV_ICON_WEIGHT} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "crate"}
              onClick={() => setViewMode("crate")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === "crate"
                  ? "bg-danfo text-ink shadow-print"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Disc size={15} weight={OV_ICON_WEIGHT} />
              <span>Vinyl Crate</span>
            </button>
          </div>

          {/* Sort order toggle */}
          <div
            role="group"
            aria-label="Sort order"
            className="flex gap-3 text-[0.72rem] font-bold tracking-[0.04em] uppercase"
          >
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                onClick={() => setSort(option)}
                className={`border-b-3 pb-0.5 ${
                  sort === option
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-soft hover:border-danfo"
                }`}
              >
                {option} first
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between font-mono text-[0.78rem] uppercase tracking-wider text-ink-soft">
        <span>
          Showing {shown.length} {shown.length === 1 ? "release" : "releases"}
        </span>
        <span className="hidden sm:inline-block">
          {viewMode === "crate" ? "Physical Record Sleeve Mode" : "Cardboard Cover Grid Mode"}
        </span>
      </div>

      {shown.length === 0 ? (
        <EmptyState />
      ) : viewMode === "crate" ? (
        <VinylCrate albums={shown} erasBySlug={erasBySlug} />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((album, i) => (
            <AlbumCard
              key={album.slug}
              album={album}
              era={erasBySlug.get(album.era)!}
              priority={i === 0}
              showFavorite={showFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
