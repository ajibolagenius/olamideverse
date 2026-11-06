"use client";

import { useState } from "react";
import { TreeStructure, Folder } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import type { InfluenceGraph } from "@/lib/content-schema";

interface LineageBlueprintProps {
  graph: InfluenceGraph;
}

export default function LineageBlueprint({ graph }: LineageBlueprintProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("olamide");
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>("all");

  const selectedNode =
    graph.nodes.find((n) => n.id === selectedNodeId) ?? graph.nodes[0];

  const filteredNodes = graph.nodes.filter((node) => {
    if (activeRoleFilter === "all") return true;
    if (activeRoleFilter === "roster") return !!node.signedYear;
    if (activeRoleFilter === "mentor") return node.role === "mentor";
    if (activeRoleFilter === "peer") return node.role === "peer" || node.role === "collaborator";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Blueprint Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-[#1F2A63] text-paper p-4 shadow-print">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-paper bg-danfo text-ink shadow-paste-sm">
            <TreeStructure weight={OV_ICON_WEIGHT} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg uppercase tracking-wide text-danfo">
                YBNL Dynasty Lineage
              </span>
              <span className="border border-paper bg-[#12193F] px-1.5 py-0.2 font-mono text-[0.65rem] uppercase">
                ARCHIVE SCHEMATIC
              </span>
            </div>
            <p className="text-xs text-adire-tint">
              Dynastic connections linking mentors, foundational signees, and second-generation stars
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 border border-paper/30 bg-[#12193F] p-1 font-mono text-xs">
          {[
            { id: "all", label: "Complete Lineage" },
            { id: "roster", label: "Signed Roster" },
            { id: "mentor", label: "Founding Mentors" },
            { id: "peer", label: "Peers & Collaborators" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveRoleFilter(tab.id)}
              className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors ${
                activeRoleFilter === tab.id
                  ? "bg-danfo text-ink shadow-paste-sm"
                  : "text-adire-tint hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Canvas & Dossier File */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Blue-grid Architectural Canvas */}
        <div className="lg:col-span-8 border-4 border-ink bg-[#17224d] p-6 shadow-print text-paper">
          <div className="flex items-center justify-between border-b border-paper/20 pb-3 mb-6 font-mono text-xs text-adire-tint">
            <span>CURATED LINEAGE · CODED TUNES TO YBNL TO EMPIRE</span>
            <span className="text-danfo">{filteredNodes.length} NODES MAPPED</span>
          </div>

          {/* Blueprint Nodes Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCenter = node.role === "center";
              const isSigned = !!node.signedYear;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`group relative border-2 p-3 text-left transition-all ${
                    isSelected
                      ? "border-danfo bg-[#243373] shadow-paste-sm -translate-y-0.5"
                      : isCenter
                      ? "border-danfo/80 bg-[#1e2a60] hover:bg-[#243373]"
                      : "border-paper/20 bg-[#131b3e] hover:border-paper/60 hover:bg-[#1a2554]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-adire-tint">
                      {node.role}
                    </span>
                    {isSigned && (
                      <span className="border border-danfo/50 bg-danfo/10 px-1 font-mono text-[0.55rem] text-danfo">
                        ’{String(node.signedYear).slice(2)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-display text-base uppercase tracking-wide group-hover:text-danfo transition-colors">
                    {node.name}
                  </div>
                  <div className="mt-1 text-[0.68rem] text-adire-tint line-clamp-2">
                    {node.blurb}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Blueprint Footer Rule */}
          <div className="mt-6 border-t border-paper/20 pt-3 flex items-center justify-between font-mono text-[0.65rem] text-adire-tint">
            <span>RELATIONSHIP: HISTORICAL & COLLABORATIVE</span>
            <span>VERIFIED ARCHIVE ROSTER</span>
          </div>
        </div>

        {/* Right: Archival Dossier Card */}
        <div className="lg:col-span-4">
          {selectedNode && (
            <div className="border-2 border-ink bg-white p-6 shadow-paste">
              {/* Dossier Tab Top */}
              <div className="border-b-2 border-ink pb-4">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
                  <Folder weight={OV_ICON_WEIGHT} className="h-4 w-4 text-adire" />
                  <span>RECORD REF: {selectedNode.id.toUpperCase()}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-ink">
                  {selectedNode.name}
                </h3>
                <span className="inline-block mt-1 border border-ink bg-paper px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink">
                  ROLE: {selectedNode.role}
                </span>
              </div>

              {/* Dossier Field Records */}
              <div className="py-4 space-y-3.5 text-xs">
                {selectedNode.signedYear && (
                  <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                    <span className="font-bold uppercase tracking-wider text-ink-muted">
                      Signed to YBNL
                    </span>
                    <span className="font-mono font-bold text-ink">
                      {selectedNode.signedYear}
                    </span>
                  </div>
                )}

                {selectedNode.departedYear && (
                  <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                    <span className="font-bold uppercase tracking-wider text-ink-muted">
                      Alumni Departure
                    </span>
                    <span className="font-mono font-bold text-oxide">
                      {selectedNode.departedYear} (Alumni)
                    </span>
                  </div>
                )}

                {selectedNode.eraSlug && (
                  <div className="flex justify-between items-baseline border-b border-ink/10 pb-2">
                    <span className="font-bold uppercase tracking-wider text-ink-muted">
                      Associated Era
                    </span>
                    <span className="font-mono text-ink uppercase">
                      {selectedNode.eraSlug}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <span className="font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Archival Summary
                  </span>
                  <p className="bg-paper p-3 border border-ink/20 leading-relaxed text-ink-soft">
                    {selectedNode.blurb}
                  </p>
                </div>
              </div>

              {/* Dossier Stamp */}
              <div className="border-t-2 border-ink pt-3 flex items-center justify-between font-mono text-[0.65rem] uppercase text-ink-soft">
                <span>RECORD: CULTURAL LINEAGE</span>
                <span className="border border-ink bg-danfo px-1.5 py-0.5 font-bold text-ink">
                  ARCHIVE NOTE
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
