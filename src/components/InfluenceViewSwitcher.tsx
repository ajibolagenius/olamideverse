"use client";

import { useState } from "react";
import InfluenceGraph from "@/components/InfluenceGraph";
import LineageBlueprint from "@/components/LineageBlueprint";
import { Graph, TreeStructure } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import type { InfluenceGraph as InfluenceGraphType } from "@/lib/content-schema";

interface InfluenceViewSwitcherProps {
  graph: InfluenceGraphType;
}

export default function InfluenceViewSwitcher({ graph }: InfluenceViewSwitcherProps) {
  const [view, setView] = useState<"blueprint" | "orbit">("blueprint");

  return (
    <div className="space-y-6">
      {/* Top View Mode Selector */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
          GRAPH PERSPECTIVE
        </span>
        <div
          role="group"
          id="ov-influence-switcher"
          data-tour="influence-switcher"
          aria-label="Influence graph view"
          className="flex items-center gap-2 border border-ink bg-white p-1 shadow-paste-sm"
        >
          <button
            type="button"
            aria-pressed={view === "blueprint"}
            onClick={() => setView("blueprint")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              view === "blueprint"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "text-ink-soft hover:text-ink hover:bg-paper"
            }`}
          >
            <TreeStructure weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Dynasty Lineage Matrix</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "orbit"}
            onClick={() => setView("orbit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              view === "orbit"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "text-ink-soft hover:text-ink hover:bg-paper"
            }`}
          >
            <Graph weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Orbit Graph</span>
          </button>
        </div>
      </div>

      {view === "blueprint" ? (
        <LineageBlueprint graph={graph} />
      ) : (
        <InfluenceGraph graph={graph} />
      )}
    </div>
  );
}
