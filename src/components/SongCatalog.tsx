"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import EmbedFrame from "./EmbedFrame";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import {
  CATALOG_SONG_TYPES,
  SONG_STATUS_LABEL,
  SONG_TYPE_LABEL,
  type Era,
  type Song,
  type SongStatus,
  type SongType,
} from "@/lib/content-schema";

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "album-track", label: SONG_TYPE_LABEL["album-track"] },
  ...CATALOG_SONG_TYPES.map((type) => ({
    value: type,
    label: SONG_TYPE_LABEL[type],
  })),
];

function songHasEmbed(song: Song): boolean {
  return Boolean(song.spotifyTrackId || song.youtubeId);
}

function statusClass(status: SongStatus): string {
  if (status === "verified") return "border-ink bg-danfo text-ink";
  if (status === "documented") return "border-ink bg-white text-ink";
  return "border-ink-soft bg-paper-dim text-ink-soft";
}

export default function SongCatalog({
  songs,
  eras,
}: {
  songs: Song[];
  eras: Era[];
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [eraFilter, setEraFilter] = useState("all");
  const [sort, setSort] = useState<"oldest" | "newest">("oldest");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeId, setActiveId] = useState<string | null>(null);

  const erasBySlug = useMemo(
    () => new Map(eras.map((era) => [era.slug, era])),
    [eras],
  );

  const shown = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const filtered = songs.filter((song) => {
      if (typeFilter !== "all" && song.type !== typeFilter) return false;
      if (eraFilter !== "all" && song.era !== eraFilter) return false;
      if (!q) return true;
      const haystack = [song.title, song.artists, song.note, song.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return [...filtered].sort((a, b) => {
      if (a.year !== b.year) {
        return sort === "oldest" ? a.year - b.year : b.year - a.year;
      }
      return a.title.localeCompare(b.title);
    });
  }, [songs, typeFilter, eraFilter, deferredQuery, sort]);

  const active = activeId
    ? (shown.find((s) => s.id === activeId) ??
      songs.find((s) => s.id === activeId) ??
      null)
    : null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-5">
        <FilterChips
          label="Filter by type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={TYPE_FILTER_OPTIONS}
        />
        <FilterChips
          label="Filter by era"
          value={eraFilter}
          onChange={setEraFilter}
          options={[
            { value: "all", label: "All eras" },
            ...eras.map((era) => ({ value: era.slug, label: era.title })),
          ]}
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5">
            <span className="text-[0.72rem] font-bold tracking-[0.04em] uppercase text-ink-soft">
              Search titles & credits
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Eni Duro, Konga, Otis…"
              className="border-[3px] border-ink bg-white px-3 py-2 text-sm outline-none focus:bg-paper-dim"
            />
          </label>
          <div
            role="group"
            aria-label="Sort order"
            className="flex gap-4 text-[0.72rem] font-bold tracking-[0.04em] uppercase"
          >
            {(["oldest", "newest"] as const).map((option) => (
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
      </div>

      <p className="mb-5 text-[0.8rem] tracking-[0.1em] uppercase text-ink-soft">
        {shown.length} {shown.length === 1 ? "entry" : "entries"}
      </p>

      {shown.length === 0 ? (
        <EmptyState message="Nothing matches those filters — try another era or clear search." />
      ) : (
        <ol className="border-t-[3px] border-ink">
          {shown.map((song) => {
            const era = erasBySlug.get(song.era);
            const activeRow = active?.id === song.id;
            const typeLabel = SONG_TYPE_LABEL[song.type as SongType];
            return (
              <li
                key={song.id}
                className={`border-b-2 border-ink px-2 py-2.5 transition-colors sm:px-3 ${
                  activeRow ? "bg-white" : "hover:bg-paper-dim"
                }`}
              >
                <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap sm:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveId((id) => (id === song.id ? null : song.id))
                    }
                    aria-pressed={activeRow}
                    className="flex min-w-0 flex-1 flex-col gap-1 py-0.5 text-left sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="w-12 shrink-0 font-display text-lg text-ink-soft tabular-nums">
                      {song.year}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">
                        {song.title}
                        {song.alsoSingle ? (
                          <span className="ml-2 text-[0.65rem] font-bold tracking-[0.06em] uppercase text-danfo">
                            also single
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs tracking-[0.04em] uppercase text-ink-soft">
                        {[
                          typeLabel,
                          song.artists,
                          song.note,
                          era?.title,
                          song.albumSlug ? `→ ${song.albumSlug}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </button>

                  <span
                    className={`shrink-0 border-2 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-[0.05em] uppercase ${statusClass(song.status)}`}
                  >
                    {SONG_STATUS_LABEL[song.status]}
                  </span>

                  {song.albumSlug ? (
                    <Link
                      href={`/albums/${song.albumSlug}`}
                      className="shrink-0 text-[0.7rem] font-bold tracking-[0.04em] uppercase underline decoration-2 underline-offset-2 hover:text-oxide"
                    >
                      Album
                    </Link>
                  ) : null}

                  {songHasEmbed(song) ? (
                    <button
                      type="button"
                      onClick={() => setActiveId(song.id)}
                      aria-label={`Play embed for ${song.title}`}
                      className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-danfo"
                    >
                      <svg viewBox="0 0 16 16" className="size-2.5 fill-ink">
                        <path d="M3 1l11 7-11 7z" />
                      </svg>
                    </button>
                  ) : (
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center border-2 border-dashed border-ink-soft text-[0.6rem] font-bold uppercase text-ink-soft"
                      title="No embed yet"
                    >
                      —
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {active && songHasEmbed(active) ? (
        <div className="mt-6">
          <EmbedFrame
            title={active.title}
            spotifyId={active.spotifyTrackId}
            youtubeId={active.youtubeId}
          />
        </div>
      ) : active ? (
        <div className="mt-6 border-2 border-dashed border-ink-soft p-6 text-center text-sm text-ink-soft">
          Documented in the catalogue — no stable embed ID yet. Nothing is
          hosted here.
        </div>
      ) : null}
    </div>
  );
}
