"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import { usePlayer } from "@/components/player/PlayerDock";
import { hasAnyEmbed } from "@/lib/embeds";
import { accentChrome, type AccentName } from "@/lib/accents";
import {
  CATALOG_SONG_TYPES,
  SONG_STATUS_LABEL,
  SONG_TYPE_LABEL,
  type Era,
  type Song,
  type SongStatus,
  type SongType,
} from "@/lib/content-schema";
import { Folder, ListDashes, Play } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "album-track", label: SONG_TYPE_LABEL["album-track"] },
  ...CATALOG_SONG_TYPES.map((type) => ({
    value: type,
    label: SONG_TYPE_LABEL[type],
  })),
];

function statusClass(status: SongStatus): string {
  if (status === "verified") return "border-ink bg-danfo text-ink shadow-print";
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
  const player = usePlayer();
  const [typeFilter, setTypeFilter] = useState("all");
  const [eraFilter, setEraFilter] = useState("all");
  const [sort, setSort] = useState<"oldest" | "newest">("oldest");
  const [viewMode, setViewMode] = useState<"dossier" | "table">("dossier");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const erasBySlug = useMemo(
    () => new Map(eras.map((era) => [era.slug, era])),
    [eras],
  );

  const songSequenceMap = useMemo(() => {
    const map = new Map<string, number>();
    songs.forEach((song, i) => {
      map.set(song.id, i + 1);
    });
    return map;
  }, [songs]);

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

  const activeId = player.track?.id ?? null;

  /**
   * Hands the row to the site-wide dock rather than an embed of our own, so
   * the track keeps playing when the reader leaves /songs.
   */
  function selectSong(id: string) {
    const song = songs.find((s) => s.id === id);
    if (!song) return;
    player.toggle({
      id: song.id,
      title: song.title,
      subtitle: song.artists ?? undefined,
      spotifyTrackId: song.spotifyTrackId,
      youtubeId: song.youtubeId,
      appleMusicId: song.appleMusicId,
      audiomackUrl: song.audiomackUrl,
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-5 border-b-2 border-ink/20 pb-6">
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
              className="border-3 border-ink bg-white px-3 py-2 text-sm outline-none focus:bg-paper-dim shadow-print"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* View Mode Switcher */}
            <div
              role="group"
              aria-label="Catalogue view format"
              className="flex items-center border-2 border-ink bg-white p-0.5 shadow-print"
            >
              <button
                type="button"
                aria-pressed={viewMode === "dossier"}
                onClick={() => setViewMode("dossier")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  viewMode === "dossier"
                    ? "bg-danfo text-ink shadow-print"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Folder size={15} weight={OV_ICON_WEIGHT} />
                <span>Dossiers</span>
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "table"}
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  viewMode === "table"
                    ? "bg-ink text-paper shadow-print"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <ListDashes size={15} weight={OV_ICON_WEIGHT} />
                <span>Table</span>
              </button>
            </div>

            {/* Sort order toggle */}
            <div
              role="group"
              aria-label="Sort order"
              className="flex gap-3 text-[0.72rem] font-bold tracking-[0.04em] uppercase"
            >
              {(["oldest", "newest"] as const).map((option) => (
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
      </div>

      <div className="mb-5 flex items-center justify-between font-mono text-[0.78rem] uppercase tracking-wider text-ink-soft">
        <span>
          Showing {shown.length} {shown.length === 1 ? "entry" : "entries"}
        </span>
        <span className="hidden sm:inline-block">
          {viewMode === "dossier" ? "Manila Dossier Folder View" : "Ledger Table View"}
        </span>
      </div>

      <div className="min-w-0">
        {shown.length === 0 ? (
          <EmptyState message="Nothing matches those filters — try another era or clear search." />
        ) : viewMode === "dossier" ? (
          /* Manila Archival Folder Dossier Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((song) => {
              const era = erasBySlug.get(song.era);
              const activeRow = activeId === song.id;
              const typeLabel = SONG_TYPE_LABEL[song.type as SongType];
              const seq = songSequenceMap.get(song.id) ?? 1;
              const chrome = era
                ? accentChrome(era.accent as AccentName)
                : { bg: "#F5B301", fg: "#181410" };

              return (
                <div
                  key={song.id}
                  className={`ov-paste-up group relative flex flex-col border-3 border-ink bg-[#FAF8F2] p-4.5 transition-all ${
                    activeRow
                      ? "bg-white ring-3 ring-danfo shadow-paste"
                      : "hover:-translate-y-1 hover:shadow-paste-sm"
                  }`}
                >
                  {/* Top Manila Folder Tab */}
                  <div className="mb-3 flex items-center justify-between border-b-2 border-ink/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-ink-muted">
                        REC · #{song.year}-{String(seq).padStart(3, "0")}
                      </span>
                      <span className="border border-ink/20 bg-white px-1 py-0.2 font-mono text-[0.58rem] font-bold uppercase text-ink-soft">
                        {typeLabel}
                      </span>
                    </div>
                    <span
                      className="border border-ink/40 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: chrome.bg, color: chrome.fg }}
                    >
                      {era?.title}
                    </span>
                  </div>

                  {/* Main Song Heading & Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg uppercase tracking-tight text-ink group-hover:underline group-hover:decoration-danfo group-hover:decoration-2 group-hover:underline-offset-2">
                        {song.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-ink-soft shrink-0">
                        {song.year}
                      </span>
                    </div>

                    {song.alsoSingle ? (
                      <span className="mt-1 inline-block border border-danfo bg-[#FFF9E6] px-1.5 py-0.2 text-[0.6rem] font-bold uppercase tracking-wider text-ink">
                        Also Single Cut
                      </span>
                    ) : null}

                    {song.artists ? (
                      <p className="mt-1.5 text-xs font-semibold text-ink-soft">
                        Featuring: <span className="text-ink">{song.artists}</span>
                      </p>
                    ) : null}

                    {song.note ? (
                      <p className="mt-2 text-xs leading-relaxed text-ink-soft line-clamp-3">
                        {song.note}
                      </p>
                    ) : null}
                  </div>

                  {/* Footer Bar: Confidence Seal & Actions */}
                  <div className="mt-4 flex items-center justify-between border-t-2 border-ink/15 pt-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`border-2 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${statusClass(
                          song.status,
                        )}`}
                      >
                        {SONG_STATUS_LABEL[song.status]}
                      </span>

                      {song.albumSlug ? (
                        <Link
                          href={`/albums/${song.albumSlug}`}
                          className="text-[0.65rem] font-bold uppercase tracking-wider underline hover:text-oxide"
                        >
                          View Album →
                        </Link>
                      ) : null}
                    </div>

                    {hasAnyEmbed(song) ? (
                      <button
                        type="button"
                        onClick={() => selectSong(song.id)}
                        aria-label={`Play embed for ${song.title}`}
                        className={`flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                          activeRow
                            ? "bg-ink text-danfo shadow-print"
                            : "bg-danfo text-ink hover:bg-ink hover:text-danfo shadow-print"
                        }`}
                      >
                        <Play size={12} weight="fill" />
                        <span>{activeRow ? "Playing" : "Play"}</span>
                      </button>
                    ) : (
                      <span
                        className="border border-dashed border-ink/30 px-2 py-0.5 font-mono text-[0.62rem] text-ink-muted uppercase"
                        title="Archival record without active embed"
                      >
                        No Embed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Ledger Table View */
          <ol className="border-t-3 border-ink">
            {shown.map((song) => {
              const era = erasBySlug.get(song.era);
              const activeRow = activeId === song.id;
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
                      onClick={() => selectSong(song.id)}
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
                      className={`shrink-0 border-2 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-[0.05em] uppercase ${statusClass(
                        song.status,
                      )}`}
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

                    {hasAnyEmbed(song) ? (
                      <button
                        type="button"
                        onClick={() => selectSong(song.id)}
                        aria-label={`Play embed for ${song.title}`}
                        className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-danfo hover:bg-ink hover:text-danfo transition-colors shadow-print"
                      >
                        <Play size={12} weight="fill" />
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
      </div>
    </div>
  );
}
