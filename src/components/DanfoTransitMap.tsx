"use client";

import { useState } from "react";
import { Bus, Ticket } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import type { ImpactPlace } from "@/lib/content-schema";

interface DanfoTransitMapProps {
  places: ImpactPlace[];
}

export default function DanfoTransitMap({ places }: DanfoTransitMapProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(
    places[0]?.id ?? "bariga-roots",
  );
  const [selectedLine, setSelectedLine] = useState<"all" | "lagos" | "world">("all");

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) ?? places[0];

  const filteredPlaces = places.filter((p) => {
    if (selectedLine === "lagos") return p.map === "lagos" || p.city.toLowerCase().includes("lagos");
    if (selectedLine === "world") return p.map === "world" || !p.city.toLowerCase().includes("lagos");
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Transit Line Filters & Station Board Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-white p-4 shadow-print">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-paste-sm">
            <Bus weight={OV_ICON_WEIGHT} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg uppercase tracking-wide">
                Danfo Route Schematic
              </span>
              <span className="border border-ink bg-ink px-1.5 py-0.2 text-[0.65rem] font-bold uppercase text-paper">
                STREET CORRIDOR
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              Bariga Origin → Surulere & Mainland → Global Stages
            </p>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div className="flex items-center gap-1.5 border border-ink bg-paper p-1">
          {(
            [
              { id: "all", label: "All Locations" },
              { id: "lagos", label: "Lagos Landmarks" },
              { id: "world", label: "Diaspora & Global" },
            ] as const
          ).map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() => setSelectedLine(line.id)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedLine === line.id
                  ? "bg-ink text-danfo shadow-paste-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {line.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Vector Route Schematic + Conductor Ticket Punch */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Vector Transit Schematic Board */}
        <div className="lg:col-span-7 border-2 border-ink bg-white p-6 shadow-print">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              ROUTE SCHEMATIC · BARIGA TO THE WORLD
            </span>
            <span className="font-mono text-[0.65rem] text-ink-muted">CULTURAL GEOGRAPHY</span>
          </div>

          {/* Stylized SVG Subway/Transit Map Graphic */}
          <div className="relative aspect-16/10 w-full overflow-hidden border border-ink/20 bg-paper/50 p-4">
            <svg
              viewBox="0 0 800 500"
              className="h-full w-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#181410" strokeWidth="0.5" strokeOpacity="0.08" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Transit Route Line 1: Danfo Yellow (Bariga to Island) */}
              <path
                d="M 100 380 L 220 380 L 320 280 L 480 280 L 560 200 L 700 200"
                fill="none"
                stroke="#F5B301"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 100 380 L 220 380 L 320 280 L 480 280 L 560 200 L 700 200"
                fill="none"
                stroke="#181410"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Transit Route Line 2: Oxide Red (OLIC Surulere Branch) */}
              <path
                d="M 220 380 L 280 440 L 420 440 L 480 280"
                fill="none"
                stroke="#C8451B"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Transit Route Line 3: Adire Indigo (Global Flight Path) */}
              <path
                d="M 480 280 L 560 200 L 620 100 L 740 100"
                fill="none"
                stroke="#1F2A63"
                strokeWidth="6"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Stop Nodes */}
              {[
                { id: "bariga", name: "BARIGA (ORIGIN 01)", x: 100, y: 380, color: "#F5B301" },
                { id: "coded-tunes", name: "CODED TUNES LAB", x: 220, y: 380, color: "#F5B301" },
                { id: "teslim", name: "TESLIM BALOGUN (OLIC)", x: 350, y: 440, color: "#C8451B" },
                { id: "eko-hotel", name: "EKO CONVENTION CTR", x: 480, y: 280, color: "#F5B301" },
                { id: "london-o2", name: "INDIGO AT THE O2", x: 620, y: 100, color: "#1F2A63" },
                { id: "usa-arena", name: "NORTH AMERICA TOUR", x: 740, y: 100, color: "#1F2A63" },
              ].map((stop) => (
                <g key={stop.id} className="cursor-pointer">
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="8"
                    fill="#FFFFFF"
                    stroke="#181410"
                    strokeWidth="3"
                  />
                  <circle cx={stop.x} cy={stop.y} r="4" fill={stop.color} />
                  <text
                    x={stop.x}
                    y={stop.y - 14}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold uppercase fill-ink"
                  >
                    {stop.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Station Departure Board */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Archive Locations ({filteredPlaces.length} Landmarks)
              </span>
              <span className="text-[0.65rem] font-mono text-ink-muted">SELECT LANDMARK</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto pr-1">
              {filteredPlaces.map((place) => {
                const isSelected = selectedPlaceId === place.id;
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`flex items-start justify-between border p-2 text-left transition-all ${
                      isSelected
                        ? "border-ink bg-danfo text-ink shadow-paste-sm"
                        : "border-ink/20 bg-paper hover:border-ink hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-display text-xs uppercase">{place.name}</div>
                      <div className="text-[0.68rem] text-ink-soft">
                        {place.city} · {place.kind}
                      </div>
                    </div>
                    {place.year && (
                      <span className="font-mono text-[0.68rem] font-bold">{place.year}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: The Conductor Ticket Punch Card */}
        <div className="lg:col-span-5">
          {selectedPlace && (
            <div className="relative border-2 border-ink bg-white p-6 shadow-paste">
              {/* Notched Ticket Cutouts */}
              <div
                className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-r-2 border-ink bg-paper"
                aria-hidden="true"
              />
              <div
                className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-l-2 border-ink bg-paper"
                aria-hidden="true"
              />

              {/* Ticket Header */}
              <div className="border-b-2 border-dashed border-ink/30 pb-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink">
                  <Ticket weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
                  <span>YBNL GEOGRAPHIC ARCHIVE</span>
                </div>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-wide">
                  {selectedPlace.name}
                </h3>
                <p className="font-mono text-xs uppercase text-ink-soft">
                  ZONE: {selectedPlace.region} · {selectedPlace.city}
                </p>
              </div>

              {/* Ticket Punch Data */}
              <div className="py-5 space-y-4">
                <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Landmark Category
                  </span>
                  <span className="border border-ink bg-paper px-2 py-0.5 text-xs font-bold uppercase">
                    {selectedPlace.kind}
                  </span>
                </div>

                {selectedPlace.year && (
                  <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Historical Milestone Year
                    </span>
                    <span className="font-mono text-sm font-bold">{selectedPlace.year}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Coordinates (WGS84)
                  </span>
                  <span className="font-mono text-xs tabular-nums text-ink">
                    {selectedPlace.lat.toFixed(4)}°N, {selectedPlace.lng.toFixed(4)}°E
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Curatorial Notes
                  </span>
                  <p className="text-xs leading-relaxed text-ink-soft bg-paper p-3 border border-ink/20">
                    {selectedPlace.blurb}
                  </p>
                </div>
              </div>

              {/* Conductor Punch Stamp Bottom Bar */}
              <div className="border-t-2 border-dashed border-ink/30 pt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase text-ink-soft">
                <span>RECORD: CULTURAL GEOGRAPHY</span>
                <span className="border border-ink bg-danfo px-1.5 py-0.5 font-bold text-ink">
                  STATUS: VERIFIED
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
