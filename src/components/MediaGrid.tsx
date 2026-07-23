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
import { ACCENTS } from "@/lib/accents";
import type { Era, MediaItem } from "@/lib/content-schema";

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
      className={`group flex w-full flex-col border-[3px] border-ink bg-white text-left shadow-paste-sm transition-[transform,box-shadow,background-color] ${
        active
          ? "bg-danfo shadow-paste"
          : "hover:-translate-y-0.5 hover:shadow-paste"
      }`}
    >
      <div className="relative aspect-video overflow-hidden border-b-[3px] border-ink bg-ink">
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
        <span
          aria-hidden
          className={`absolute bottom-2 left-2 grid size-9 place-items-center border-2 border-ink transition-colors ${
            active
              ? "bg-ink text-danfo"
              : "bg-danfo text-ink group-hover:bg-ink group-hover:text-danfo"
          }`}
        >
          <PlayGlyph className="size-3" />
        </span>
        <span className="absolute top-2 right-2 border-2 border-ink bg-paper px-1.5 py-0.5 text-[0.62rem] font-bold tracking-[0.06em] uppercase text-ink">
          {item.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
        <div className="flex items-center justify-between gap-2 text-[0.62rem] font-bold tracking-[0.06em] uppercase">
          <span className={active ? "text-ink" : "text-ink-soft"}>
            {TYPE_LABEL[item.type]}
          </span>
          <span className={active ? "text-ink" : "text-oxide"}>
            {era.title}
          </span>
        </div>
        <h2 className="font-display text-[1.05rem] leading-tight text-ink">
          {item.title}
        </h2>
        <p className="line-clamp-2 text-[0.78rem] leading-snug text-ink-soft">
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
  return (
    <div className="border-[3px] border-ink bg-ink text-paper shadow-paste">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-danfo bg-danfo px-3 py-2 text-ink">
        <p className="text-[0.72rem] font-bold tracking-[0.08em] uppercase">
          Now screening · {TYPE_LABEL[item.type]} · {era.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-ink bg-ink px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.06em] uppercase text-danfo hover:bg-paper hover:text-ink"
        >
          Close
        </button>
      </div>
      {item.youtubeId ? (
        <iframe
          key={item.youtubeId}
          title={`${item.title} — YouTube player`}
          src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="grid aspect-video place-items-center bg-paper-dim px-6 text-center text-sm text-ink-soft">
          Documented in the archive — no stable YouTube embed yet. Nothing is
          hosted here.
        </div>
      )}
      <div className="border-t-[3px] border-danfo bg-paper px-4 py-4 text-ink sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl leading-none sm:text-3xl">
            {item.title}
          </h2>
          <p className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
            {item.year} · via {item.source}
          </p>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
          {item.note}
        </p>
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
      <div className="mb-8 border-[3px] border-ink bg-white shadow-paste-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-ink bg-ink px-4 py-3 text-paper">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-danfo">
              Screening wall
            </p>
            <p className="font-display text-2xl leading-none sm:text-3xl">
              Find a clip
            </p>
          </div>
          <p className="text-[0.72rem] tracking-[0.08em] uppercase text-ink-muted">
            {items.length} in the archive · embeds only
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
              className="border-[3px] border-ink bg-paper px-3 py-2.5 text-sm outline-none focus:bg-white"
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-4">
            <p className="text-[0.8rem] tracking-[0.1em] uppercase text-ink-soft">
              Showing {shown.length}{" "}
              {shown.length === 1 ? "clip" : "clips"}
              {query.trim() ? ` for “${query.trim()}”` : null}
            </p>
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
      ) : (
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
      )}
    </div>
  );
}
