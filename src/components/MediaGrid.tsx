"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";
import { ACCENTS, accentChrome, type AccentName } from "@/lib/accents";
import type { Era, MediaItem } from "@/lib/content-schema";
import { FilmSlate, ListDashes } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

const TYPE_LABEL: Record<MediaItem["type"], string> = {
  "music-video": "Music video",
  freestyle: "Freestyle",
  interview: "Interview",
  live: "Live",
};

function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 1l11 7-11 7z" className="fill-current" />
    </svg>
  );
}

function MediaThumb({
  item,
  era,
  active,
  onSelect,
}: {
  item: MediaItem;
  era: Era;
  active: boolean;
  onSelect: () => void;
}) {
  const accent = ACCENTS[era.accent];
  const chrome = accentChrome(era.accent as AccentName);
  const playable = Boolean(item.youtubeId);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={
        playable
          ? `Play ${item.title}`
          : `${item.title} — no embed available`
      }
      className={`group flex w-full flex-col border-3 border-ink bg-white text-left shadow-paste-sm transition-all ${
        active
          ? "ring-3 ring-danfo bg-white shadow-paste"
          : "hover:-translate-y-1 hover:shadow-paste"
      }`}
    >
      <div className="relative aspect-video overflow-hidden border-b-3 border-ink bg-ink">
        {item.youtubeId ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbs; avoid next/image remotePatterns churn
          <img
            src={youtubeThumb(item.youtubeId)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              active ? "opacity-90" : ""
            }`}
          />
        ) : (
          <div
            className="ov-duotone grid h-full w-full place-items-center"
            style={
              {
                background: `linear-gradient(160deg, ${accent.gradient[0]}, ${accent.gradient[1]})`,
                "--ov-duotone-color": accent.solid,
              } as CSSProperties
            }
          >
            <span aria-hidden className="ov-duotone-overlay" />
            <span className="relative z-10 text-[0.65rem] font-bold tracking-[0.08em] uppercase text-paper">
              No embed
            </span>
          </div>
        )}

        {/* Play icon badge */}
        <span
          aria-hidden
          className={`absolute bottom-2 left-2 grid size-9 place-items-center border-2 border-ink shadow-print transition-colors ${
            active
              ? "bg-ink text-danfo"
              : "bg-danfo text-ink group-hover:bg-ink group-hover:text-danfo"
          }`}
        >
          <PlayGlyph className="size-3" />
        </span>

        {/* Top-Right Year & Admission Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className="border border-ink bg-paper px-1.5 py-0.5 font-mono text-[0.62rem] font-bold tracking-[0.06em] uppercase text-ink shadow-print">
            {item.year}
          </span>
        </div>

        {/* Top-Left Era Tag */}
        <div
          className="absolute top-2 left-2 border border-ink px-1.5 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-ink shadow-print"
          style={{ backgroundColor: chrome.bg, color: chrome.fg }}
        >
          CH. 0{era.order}
        </div>
      </div>

      {/* Lobby Card Metadata */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 bg-paper-dim/30">
        <div className="flex items-center justify-between gap-2 text-[0.62rem] font-bold tracking-[0.06em] uppercase">
          <span className="border border-ink/30 bg-white px-1 py-0.2 text-ink-soft">
            {TYPE_LABEL[item.type]}
          </span>
          <span className="text-ink-muted font-mono truncate">
            via {item.source}
          </span>
        </div>
        <span className="font-display text-[1.1rem] leading-tight text-ink group-hover:underline group-hover:decoration-danfo group-hover:decoration-2 group-hover:underline-offset-2">
          {item.title}
        </span>
        <p className="line-clamp-2 text-[0.78rem] leading-snug text-ink-soft mt-0.5">
          {item.note}
        </p>
      </div>
    </button>
  );
}

function CinemaPlayer({
  item,
  era,
  onClose,
}: {
  item: MediaItem;
  era: Era;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const chrome = accentChrome(era.accent as AccentName);

  useEffect(() => {
    closeRef.current?.focus();
  }, [item.id]);

  return (
    <div className="border-3 border-ink bg-ink text-paper shadow-paste">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Now screening {item.title}
      </p>

      {/* Cinema Marquee Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-danfo bg-danfo px-4 py-2.5 text-ink">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ink motion-safe:animate-ping" />
          <p className="font-mono text-[0.72rem] font-bold tracking-[0.12em] uppercase">
            LAGOS OUTDOOR CINEMA · PROJECTION BOOTH
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="border border-ink px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider"
            style={{ backgroundColor: chrome.bg, color: chrome.fg }}
          >
            {era.title}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border-2 border-ink bg-ink px-3 py-1 font-mono text-[0.68rem] font-bold tracking-[0.08em] uppercase text-danfo hover:bg-paper hover:text-ink shadow-print transition-colors"
          >
            Close Booth ✕
          </button>
        </div>
      </div>

      {/* Screen Viewport */}
      {item.youtubeId ? (
        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={item.youtubeId}
            title={`${item.title} — YouTube player`}
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1`}
            className="aspect-video w-full border-none"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="grid aspect-video place-items-center bg-paper-dim px-6 text-center text-sm text-ink-soft">
          Documented in the archive — no stable YouTube embed yet. Nothing is
          hosted here.
        </div>
      )}

      {/* Cinema Lobby Film Specs */}
      <div className="border-t-3 border-danfo bg-paper px-4 py-5 text-ink sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/20 pb-3">
          <h2 className="font-display text-2xl uppercase leading-none sm:text-3xl text-ink">
            {item.title}
          </h2>
          <div className="flex items-center gap-3 font-mono text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
            <span>RELEASE YEAR: {item.year}</span>
            <span>·</span>
            <span>SOURCE: {item.source}</span>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
          {item.note}
        </p>
        <div className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
          <span>THIRD-PARTY EMBED · YOUTUBE-NOCOOKIE</span>
          <span className="hidden sm:inline-block">Screened via YouTube · Not hosted here</span>
        </div>
      </div>
    </div>
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
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"wall" | "ledger">("wall");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cinemaRef = useRef<HTMLDivElement>(null);

  const erasBySlug = useMemo(
    () => new Map(eras.map((era) => [era.slug, era])),
    [eras],
  );

  const counts = useMemo(() => {
    const byType: Record<string, number> = {};
    for (const item of items) {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
    }
    return byType;
  }, [items]);

  const shown = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (eraFilter !== "all" && item.era !== eraFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (!q) return true;
      const haystack = [item.title, item.note, item.source, TYPE_LABEL[item.type]]
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
  }, [items, eraFilter, typeFilter, deferredQuery, sort]);

  const active =
    activeId == null
      ? null
      : (shown.find((item) => item.id === activeId) ??
        items.find((item) => item.id === activeId) ??
        null);

  const activeEra = active ? erasBySlug.get(active.era) : undefined;

  useEffect(() => {
    if (!activeId || !cinemaRef.current) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cinemaRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [activeId]);

  function selectItem(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <div className="mb-8 border-3 border-ink bg-white shadow-paste-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-3 border-ink bg-ink px-4 py-3 text-paper">
          <div>
            <p className="font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase text-danfo">
              BARIGA CINEMA ARCHIVE · 2010 — PRESENT
            </p>
            <p className="font-display text-2xl uppercase leading-none sm:text-3xl text-paper">
              Screening Catalog
            </p>
          </div>
          <p className="font-mono text-[0.72rem] tracking-[0.08em] uppercase text-ink-muted">
            {items.length} clips documented · embeds only
          </p>
        </div>

        <div className="flex flex-col gap-5 px-4 py-5 sm:px-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.72rem] font-bold tracking-[0.04em] uppercase text-ink-soft">
              Search titles, notes & sources
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wo, Motigbana, Phyno, Clarence…"
              className="border-3 border-ink bg-paper px-3 py-2.5 text-sm outline-none focus:bg-white shadow-print"
            />
          </label>

          <FilterChips
            label="Filter by type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: `All (${items.length})` },
              ...Object.entries(TYPE_LABEL).map(([value, label]) => ({
                value,
                label: `${label}${counts[value] ? ` (${counts[value]})` : ""}`,
              })),
            ]}
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

          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-4">
            <p className="text-[0.8rem] font-mono tracking-[0.1em] uppercase text-ink-soft">
              Showing {shown.length}{" "}
              {shown.length === 1 ? "clip" : "clips"}
              {query.trim() ? ` for “${query.trim()}”` : null}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* View Switcher */}
              <div
                role="group"
                aria-label="Screening view format"
                className="flex items-center border-2 border-ink bg-white p-0.5 shadow-print"
              >
                <button
                  type="button"
                  aria-pressed={viewMode === "wall"}
                  onClick={() => setViewMode("wall")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                    viewMode === "wall"
                      ? "bg-danfo text-ink shadow-print"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <FilmSlate size={15} weight={OV_ICON_WEIGHT} />
                  <span>Wall</span>
                </button>
                <button
                  type="button"
                  aria-pressed={viewMode === "ledger"}
                  onClick={() => setViewMode("ledger")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                    viewMode === "ledger"
                      ? "bg-ink text-paper shadow-print"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <ListDashes size={15} weight={OV_ICON_WEIGHT} />
                  <span>Ledger</span>
                </button>
              </div>

              {/* Sort Order */}
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
      </div>

      {active && activeEra ? (
        <div ref={cinemaRef} className="mb-8 scroll-mt-24">
          <CinemaPlayer
            item={active}
            era={activeEra}
            onClose={() => setActiveId(null)}
          />
        </div>
      ) : null}

      {shown.length === 0 ? (
        <EmptyState message="Nothing matches those filters — try another era or clear search." />
      ) : viewMode === "wall" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((item) => {
            const era = erasBySlug.get(item.era);
            if (!era) return null;
            return (
              <MediaThumb
                key={item.id}
                item={item}
                era={era}
                active={active?.id === item.id}
                onSelect={() => selectItem(item.id)}
              />
            );
          })}
        </div>
      ) : (
        /* Broadcast Ledger Table */
        <div className="overflow-x-auto border-3 border-ink bg-white shadow-paste-sm">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-12 border-b-2 border-ink bg-paper-dim px-4 py-2.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink-muted">
              <span className="col-span-2">Year</span>
              <span className="col-span-5">Title & Context</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Source</span>
              <span className="col-span-1 text-right">Action</span>
            </div>
            <div className="divide-y border-ink/15">
              {shown.map((item) => {
                const isSelected = active?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 items-center px-4 py-3 text-sm transition-colors ${
                      isSelected ? "bg-[#FFF9E6]" : "hover:bg-paper-dim/40"
                    }`}
                  >
                    <span className="col-span-2 font-mono text-xs font-bold text-ink-soft">
                      {item.year}
                    </span>
                    <div className="col-span-5 pr-4">
                      <span className="font-display text-base text-ink block leading-snug">
                        {item.title}
                      </span>
                      <span className="text-xs text-ink-muted line-clamp-1">{item.note}</span>
                    </div>
                    <span className="col-span-2 text-xs font-semibold text-ink-soft">
                      {TYPE_LABEL[item.type]}
                    </span>
                    <span className="col-span-2 font-mono text-xs text-ink-muted">
                      {item.source}
                    </span>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => selectItem(item.id)}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Close screening for" : "Screen"} ${item.title}`}
                        className={`border-2 border-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-print ${
                          isSelected
                            ? "bg-ink text-danfo"
                            : "bg-danfo text-ink hover:bg-ink hover:text-danfo"
                        }`}
                      >
                        {isSelected ? "Active" : "Screen"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
