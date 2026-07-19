"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import {
  IMPACT_KIND_LABEL,
  type ImpactPlace,
} from "@/lib/content-schema";

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

type MapKey = ImpactPlace["map"];

function MapSilhouette({ map }: { map: MapKey }) {
  if (map === "lagos") {
    return (
      <g fill="#E9E2D3" stroke="#181410" strokeWidth={0.6}>
        <path d="M18 22 L78 18 L88 42 L82 78 L28 86 L12 54 Z" />
        <path
          d="M40 48 Q52 40 64 52 Q58 68 42 66 Q34 58 40 48 Z"
          fill="#D9DEF2"
          opacity={0.7}
        />
      </g>
    );
  }
  if (map === "nigeria") {
    return (
      <g fill="#E9E2D3" stroke="#181410" strokeWidth={0.55}>
        <path d="M22 18 L62 14 L78 28 L84 48 L72 78 L48 88 L28 80 L16 52 L18 30 Z" />
        <path
          d="M18 72 Q40 68 58 74 Q70 80 62 88 L30 90 Q16 82 18 72 Z"
          fill="#D3E0D5"
          opacity={0.65}
        />
      </g>
    );
  }
  return (
    <g fill="#E9E2D3" stroke="#181410" strokeWidth={0.45}>
      {/* Stylized continents — editorial silhouette, not cartographic accuracy */}
      <path d="M8 30 L28 22 L38 38 L30 58 L12 52 Z" />
      <path d="M40 28 L58 20 L72 34 L68 70 L52 82 L42 62 Z" />
      <path d="M74 34 L92 30 L96 48 L88 58 L76 50 Z" />
      <path d="M18 62 L34 58 L42 78 L28 88 L14 76 Z" opacity={0.85} />
    </g>
  );
}

export default function ImpactMap({ places }: { places: ImpactPlace[] }) {
  const [map, setMap] = useState<MapKey>("lagos");
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
              setMap(v as MapKey);
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
          className="ov-paste-up border-[3px] border-ink bg-paper shadow-paste"
          data-tilt="0.5"
          style={{ rotate: "0.5deg" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="block h-auto w-full"
            role="img"
            aria-label={`Impact map — ${map} view with ${filtered.length} places`}
          >
            <rect width="100" height="100" fill="#F4EFE6" />
            <MapSilhouette map={map} />
            {filtered.map((place) => {
              const selected = active?.id === place.id;
              return (
                <g key={place.id}>
                  <circle
                    cx={place.x}
                    cy={place.y}
                    r={selected ? 3.4 : 2.4}
                    fill={KIND_COLOR[place.kind]}
                    stroke="#181410"
                    strokeWidth={0.45}
                    className="cursor-pointer"
                    onClick={() => setActiveId(place.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected}
                    aria-label={`${place.name}, ${IMPACT_KIND_LABEL[place.kind]}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveId(place.id);
                      }
                    }}
                  />
                  {selected ? (
                    <text
                      x={place.x}
                      y={place.y - 4.5}
                      textAnchor="middle"
                      fill="#181410"
                      fontSize={2.4}
                      fontWeight={700}
                      style={{ fontFamily: "Archivo, sans-serif" }}
                    >
                      {place.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
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
            <p className="mb-4 text-sm tracking-[0.04em] uppercase text-ink-soft">
              {active.city}
              {active.region !== active.city ? ` · ${active.region}` : ""}
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
