"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import {
  IMPACT_KIND_LABEL,
  type ImpactPlace,
} from "@/lib/content-schema";
import type { ImpactMapKey } from "@/lib/impact-map";

const ImpactMapCanvas = dynamic(() => import("@/components/ImpactMapCanvas"), {
  ssr: false,
  loading: () => (
    <div
      className="grid h-[min(62vh,560px)] w-full place-items-center bg-paper-dim text-sm tracking-[0.06em] uppercase text-ink-soft"
      role="status"
    >
      Loading map…
    </div>
  ),
});

const MAPS = [
  { value: "lagos", label: "Lagos" },
  { value: "nigeria", label: "Nigeria" },
  { value: "world", label: "World" },
] as const;

const KIND_COLOR: Record<ImpactPlace["kind"], string> = {
  origin: "#F5B301",
  venue: "#1F2A63",
  concert: "#C8451B",
  cultural: "#2F5233",
  international: "#8C4A1E",
};

export default function ImpactMap({ places }: { places: ImpactPlace[] }) {
  const [map, setMap] = useState<ImpactMapKey>("lagos");
  const [kind, setKind] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (p.map !== map) return false;
      if (kind !== "all" && p.kind !== kind) return false;
      return true;
    });
  }, [places, map, kind]);

  const active =
    (activeId && filtered.find((p) => p.id === activeId)) || filtered[0];

  const kindOptions = useMemo(() => {
    const present = new Set(places.filter((p) => p.map === map).map((p) => p.kind));
    return [
      { value: "all", label: "All" },
      ...([...present] as ImpactPlace["kind"][]).map((k) => ({
        value: k,
        label: IMPACT_KIND_LABEL[k],
      })),
    ];
  }, [places, map]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:items-start">
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips
            label="Map region"
            options={[...MAPS]}
            value={map}
            onChange={(v) => {
              setMap(v as ImpactMapKey);
              setActiveId(null);
              setKind("all");
            }}
          />
          <FilterChips
            label="Place type"
            options={kindOptions}
            value={kind}
            onChange={(v) => {
              setKind(v);
              setActiveId(null);
            }}
          />
        </div>

        <div
          className="ov-paste-up overflow-hidden border-[3px] border-ink bg-paper shadow-paste"
          data-tilt="0.5"
          style={{ rotate: "0.5deg" }}
        >
          <ImpactMapCanvas
            mapKey={map}
            places={filtered}
            activeId={active?.id ?? null}
            onSelect={setActiveId}
          />
        </div>
        <p className="mt-2 text-[0.7rem] tracking-[0.04em] uppercase text-ink-soft">
          Real geography · pan & zoom · pins are editorial, not a live tour feed
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        {active ? (
          <div className="border-[3px] border-ink bg-white p-6 shadow-paste-sm">
            <p
              className="mb-3 inline-block px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase text-paper"
              style={{ background: KIND_COLOR[active.kind] }}
            >
              {IMPACT_KIND_LABEL[active.kind]}
              {active.year ? ` · ${active.year}` : ""}
            </p>
            <h2 className="font-display mb-1 text-3xl">{active.name}</h2>
            <p className="mb-1 text-sm tracking-[0.04em] uppercase text-ink-soft">
              {active.city}
              {active.region !== active.city ? ` · ${active.region}` : ""}
            </p>
            <p className="mb-4 text-[0.7rem] tracking-[0.04em] uppercase text-ink-soft">
              {Math.abs(active.lat).toFixed(4)}°{active.lat >= 0 ? "N" : "S"}
              {" · "}
              {Math.abs(active.lng).toFixed(4)}°{active.lng >= 0 ? "E" : "W"}
            </p>
            <p className="mb-5 text-[0.98rem] leading-relaxed text-ink-soft">
              {active.blurb}
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              {active.eraSlug ? (
                <Link
                  href={`/eras/${active.eraSlug}`}
                  className="underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  Era chapter →
                </Link>
              ) : null}
              {active.albumSlug ? (
                <Link
                  href={`/albums/${active.albumSlug}`}
                  className="underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  Related album →
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        <ol className="border-t-2 border-ink">
          {filtered.map((place) => {
            const selected = active?.id === place.id;
            return (
              <li key={place.id} className="border-b-2 border-ink">
                <button
                  type="button"
                  onClick={() => setActiveId(place.id)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-3 px-2 py-3 text-left transition-colors ${
                    selected ? "bg-white" : "hover:bg-paper-dim"
                  }`}
                >
                  <span
                    className="size-2.5 flex-shrink-0 border border-ink"
                    style={{ background: KIND_COLOR[place.kind] }}
                    aria-hidden
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">{place.name}</span>
                    <span className="text-xs tracking-[0.04em] uppercase text-ink-soft">
                      {IMPACT_KIND_LABEL[place.kind]}
                      {place.year ? ` · ${place.year}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
