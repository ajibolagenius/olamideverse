"use client";

import { useState } from "react";
import DanfoTransitMap from "@/components/DanfoTransitMap";
import ImpactMap from "@/components/ImpactMap";
import { Bus, GlobeHemisphereWest } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import type { ImpactPlace } from "@/lib/content-schema";

interface ImpactViewSwitcherProps {
  places: ImpactPlace[];
}

export default function ImpactViewSwitcher({ places }: ImpactViewSwitcherProps) {
  const [view, setView] = useState<"transit" | "map">("transit");

  return (
    <div className="space-y-6">
      {/* Top View Mode Selector */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
          MAP PERSPECTIVE
        </span>
        <div
          role="group"
          aria-label="Impact map view"
          className="flex items-center gap-2 border border-ink bg-white p-1 shadow-paste-sm"
        >
          <button
            type="button"
            aria-pressed={view === "transit"}
            onClick={() => setView("transit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              view === "transit"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "text-ink-soft hover:text-ink hover:bg-paper"
            }`}
          >
            <Bus weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Danfo Route Map</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              view === "map"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "text-ink-soft hover:text-ink hover:bg-paper"
            }`}
          >
            <GlobeHemisphereWest weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Geographic Map</span>
          </button>
        </div>
      </div>

      {view === "transit" ? (
        <DanfoTransitMap places={places} />
      ) : (
        <ImpactMap places={places} />
      )}
    </div>
  );
}
