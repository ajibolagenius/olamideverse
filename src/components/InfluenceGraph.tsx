"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  INFLUENCE_ROLE_LABEL,
  type InfluenceGraph as InfluenceGraphData,
  type InfluenceNode,
} from "@/lib/content-schema";

const ROLE_FILL: Record<InfluenceNode["role"], string> = {
  center: "#F5B301",
  mentor: "#1F2A63",
  peer: "#C8451B",
  mentee: "#2F5233",
  collaborator: "#8C4A1E",
  influence: "#3A332B",
};

const ROLE_TEXT: Record<InfluenceNode["role"], string> = {
  center: "#181410",
  mentor: "#F4EFE6",
  peer: "#F4EFE6",
  mentee: "#F4EFE6",
  collaborator: "#F4EFE6",
  influence: "#F4EFE6",
};

export default function InfluenceGraph({ graph }: { graph: InfluenceGraphData }) {
  const reactId = useId();
  const [activeId, setActiveId] = useState(
    () => graph.nodes.find((n) => n.role === "center")?.id ?? graph.nodes[0]?.id,
  );

  const byId = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );
  const active = activeId ? byId.get(activeId) : undefined;

  const linked = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>([activeId]);
    for (const edge of graph.edges) {
      if (edge.from === activeId) ids.add(edge.to);
      if (edge.to === activeId) ids.add(edge.from);
    }
    return ids;
  }, [activeId, graph.edges]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] lg:items-start">
      <div
        className="ov-paste-up border-[3px] border-ink bg-paper-dim shadow-paste"
        data-tilt="-0.4"
        style={{ rotate: "-0.4deg" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="block h-auto w-full"
          role="img"
          aria-labelledby={`${reactId}-title`}
        >
          <title id={`${reactId}-title`}>
            Influence graph — Olamide at the center, connected to mentors, peers,
            mentees and collaborators
          </title>
          <rect width="100" height="100" fill="#F4EFE6" />
          {/* Paste-up grid */}
          {[25, 50, 75].map((g) => (
            <g key={g} opacity={0.12}>
              <line x1={g} y1={0} x2={g} y2={100} stroke="#181410" strokeWidth={0.2} />
              <line x1={0} y1={g} x2={100} y2={g} stroke="#181410" strokeWidth={0.2} />
            </g>
          ))}
          {graph.edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const lit =
              activeId === edge.from ||
              activeId === edge.to ||
              (linked.has(edge.from) && linked.has(edge.to));
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={lit ? "#181410" : "#B8AFA0"}
                strokeWidth={lit ? 0.55 : 0.25}
                strokeDasharray={edge.label === "peer" ? "1.2 0.8" : undefined}
              />
            );
          })}
          {graph.nodes.map((node) => {
            const selected = node.id === activeId;
            const dimmed = activeId && !linked.has(node.id);
            const r = node.role === "center" ? 5.2 : 3.6;
            return (
              <g key={node.id} opacity={dimmed ? 0.35 : 1}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={selected ? r + 1.1 : r}
                  fill={ROLE_FILL[node.role]}
                  stroke="#181410"
                  strokeWidth={selected ? 0.7 : 0.4}
                  className="cursor-pointer"
                  onClick={() => setActiveId(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected}
                  aria-label={`${node.name}, ${INFLUENCE_ROLE_LABEL[node.role]}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(node.id);
                    }
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + r + 3.2}
                  textAnchor="middle"
                  fill="#181410"
                  fontSize={node.role === "center" ? 2.8 : 2.2}
                  fontWeight={700}
                  className="pointer-events-none"
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="border-[3px] border-ink bg-white p-6 shadow-paste-sm">
        {active ? (
          <>
            <p
              className="mb-3 inline-block px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase"
              style={{
                background: ROLE_FILL[active.role],
                color: ROLE_TEXT[active.role],
              }}
            >
              {INFLUENCE_ROLE_LABEL[active.role]}
            </p>
            <h2 className="font-display mb-3 text-3xl">{active.name}</h2>
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
          </>
        ) : (
          <p className="text-ink-soft">Select a node to read the lineage note.</p>
        )}

        <ul className="mt-8 flex flex-wrap gap-2 border-t-2 border-ink pt-5">
          {(Object.keys(ROLE_FILL) as InfluenceNode["role"][])
            .filter((role) => role !== "center")
            .map((role) => (
              <li
                key={role}
                className="flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.04em] uppercase text-ink-soft"
              >
                <span
                  className="inline-block size-2.5 border border-ink"
                  style={{ background: ROLE_FILL[role] }}
                  aria-hidden
                />
                {INFLUENCE_ROLE_LABEL[role]}
              </li>
            ))}
        </ul>

        <div
          role="listbox"
          aria-label="People in the graph"
          className="mt-5 flex flex-wrap gap-1.5"
        >
          {graph.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              role="option"
              aria-selected={node.id === activeId}
              onClick={() => setActiveId(node.id)}
              className={`border-2 border-ink px-2 py-1 text-[0.68rem] font-bold tracking-[0.04em] uppercase ${
                node.id === activeId
                  ? "bg-ink text-paper"
                  : "bg-paper-dim text-ink hover:bg-white"
              }`}
            >
              {node.name}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
