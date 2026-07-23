"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import { eraMomentHref } from "@/lib/anchors";
import {
  hubNodes,
  layoutHub,
  rosterNodes as sortRoster,
} from "@/lib/influence-layout";
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

const ROSTER_FILTER = "ybnl-roster";

function isAlumni(node: InfluenceNode): boolean {
  return node.departedYear != null || node.alumni === true;
}

function rosterSpan(node: InfluenceNode): string | null {
  if (!node.signedYear) return null;
  if (node.departedYear) return `${node.signedYear}–${node.departedYear}`;
  if (node.alumni) return `from ${node.signedYear}`;
  return `${node.signedYear}–present`;
}

function isRosterNode(node: InfluenceNode): boolean {
  return typeof node.signedYear === "number";
}

export default function InfluenceGraph({ graph }: { graph: InfluenceGraphData }) {
  const reactId = useId();
  const [activeId, setActiveId] = useState(
    () => graph.nodes.find((n) => n.role === "center")?.id ?? graph.nodes[0]?.id,
  );
  const [roleFilter, setRoleFilter] = useState("all");

  const byId = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );
  const active = activeId ? byId.get(activeId) : undefined;

  const roster = useMemo(() => sortRoster(graph.nodes), [graph.nodes]);
  const hub = useMemo(() => hubNodes(graph.nodes), [graph.nodes]);
  const hubPositions = useMemo(() => layoutHub(hub), [hub]);

  const roleOptions = useMemo(() => {
    const present = new Set(graph.nodes.map((n) => n.role));
    return [
      { value: "all", label: "All" },
      ...(roster.length > 0 ? [{ value: ROSTER_FILTER, label: "YBNL roster" }] : []),
      ...([...present] as InfluenceNode["role"][])
        .filter((r) => r !== "center")
        .map((r) => ({ value: r, label: INFLUENCE_ROLE_LABEL[r] })),
    ];
  }, [graph.nodes, roster.length]);

  const rosterActive = roleFilter === ROSTER_FILTER;
  const hubFocus =
    roleFilter !== "all" &&
    roleFilter !== ROSTER_FILTER &&
    roleFilter !== "mentee";

  const linked = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>([activeId]);
    for (const edge of graph.edges) {
      if (edge.from === activeId) ids.add(edge.to);
      if (edge.to === activeId) ids.add(edge.from);
    }
    return ids;
  }, [activeId, graph.edges]);

  function nodeEmphasized(node: InfluenceNode): boolean {
    if (roleFilter === "all") return true;
    if (rosterActive) return isRosterNode(node) || node.role === "center";
    if (roleFilter === "mentee") return node.role === "mentee" || node.role === "center";
    return node.role === roleFilter || node.role === "center";
  }

  function applyFilter(next: string) {
    setRoleFilter(next);
    if (next === "all") return;
    if (next === ROSTER_FILTER) {
      if (active && !isRosterNode(active) && active.role !== "center") {
        setActiveId(roster[0]?.id ?? activeId);
      }
      return;
    }
    if (active && active.role !== next && active.role !== "center") {
      const first = graph.nodes.find((n) => n.role === next);
      if (first) setActiveId(first.id);
    }
  }

  const hubEdges = useMemo(() => {
    return graph.edges.filter((edge) => {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      if (!from || !to) return false;
      // Hub only draws edges among hub nodes (no roster spokes).
      return hub.some((n) => n.id === edge.from) && hub.some((n) => n.id === edge.to);
    });
  }, [graph.edges, byId, hub]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters — one strip for both compositions */}
      <div className="border-[3px] border-ink bg-white p-4 shadow-paste-sm sm:p-5">
        <p className="mb-2.5 text-[0.7rem] font-bold tracking-[0.08em] uppercase text-ink-soft">
          Filter
        </p>
        <FilterChips
          label="Influence roles and YBNL roster"
          options={roleOptions}
          value={roleFilter}
          onChange={applyFilter}
        />
        <ul className="mt-4 flex flex-wrap gap-2 border-t border-ink/20 pt-3">
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
      </div>

      {/* Split: timeline first on mobile (roster priority); hub left on desktop */}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        {/* YBNL roster timeline — hero of the page */}
        <section
          aria-labelledby={`${reactId}-roster-title`}
          className={`ov-paste-up order-1 border-[3px] border-ink bg-white shadow-paste lg:order-2 ${
            hubFocus ? "opacity-55" : ""
          }`}
          data-tilt="0.5"
          style={{ rotate: "0.5deg" }}
        >
          <header className="border-b-[3px] border-ink bg-palm px-4 py-3 text-paper sm:px-5">
            <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase opacity-90">
              Kingmaker lineage
            </p>
            <h2
              id={`${reactId}-roster-title`}
              className="font-display text-2xl tracking-tight sm:text-3xl"
            >
              YBNL roster
            </h2>
            <p className="mt-1 text-[0.78rem] leading-snug text-paper/85">
              Documented signees · {roster.length} acts · always on
            </p>
          </header>

          <ol className="relative max-h-[min(70vh,560px)] overflow-y-auto px-4 py-2 sm:px-5">
            <span
              className="absolute top-3 bottom-3 left-[1.35rem] w-[3px] bg-ink/20 sm:left-[1.6rem]"
              aria-hidden
            />
            {roster.map((node) => {
              const selected = node.id === activeId;
              const dim = !nodeEmphasized(node) && !selected;
              const span = rosterSpan(node);
              return (
                <li key={node.id} className="relative pl-8 sm:pl-10">
                  <span
                    className={`absolute top-4 left-[1.05rem] size-3 border-2 border-ink sm:left-[1.3rem] ${
                      selected ? "bg-danfo" : isAlumni(node) ? "bg-paper-dim" : "bg-palm"
                    }`}
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-pressed={selected}
                    className={`flex w-full flex-col gap-0.5 border-b border-ink/15 py-3.5 text-left transition-opacity ${
                      dim ? "opacity-35" : ""
                    } ${selected ? "bg-danfo-tint/40 -mx-2 px-2 sm:-mx-3 sm:px-3" : "hover:bg-paper-dim/80"}`}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-xl leading-none sm:text-2xl">
                        {node.name}
                      </span>
                      <span className="text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink-soft">
                        {span}
                        {isAlumni(node) ? " · alumni" : " · now"}
                      </span>
                    </span>
                    <span className="line-clamp-2 text-[0.82rem] leading-snug text-ink-soft">
                      {node.blurb}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Compact hub — mentors, peers, collaborators, influences */}
        <section
          aria-labelledby={`${reactId}-hub-title`}
          className={`ov-paste-up order-2 border-[3px] border-ink bg-paper-dim shadow-paste lg:order-1 ${
            rosterActive || roleFilter === "mentee" ? "opacity-55" : ""
          }`}
          data-tilt="-0.6"
          style={{ rotate: "-0.6deg" }}
        >
          <header className="flex items-end justify-between gap-3 border-b-[3px] border-ink bg-paper px-4 py-3 sm:px-5">
            <div>
              <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-ink-soft">
                Orbit
              </p>
              <h2
                id={`${reactId}-hub-title`}
                className="font-display text-2xl tracking-tight sm:text-3xl"
              >
                Mentors &amp; peers
              </h2>
            </div>
            <p className="hidden max-w-[12rem] text-right text-[0.68rem] leading-snug text-ink-soft sm:block">
              Who shaped the sound — separate from the signed roster
            </p>
          </header>

          <svg
            viewBox="0 0 100 100"
            className="block h-auto w-full min-h-[260px]"
            role="img"
            aria-labelledby={`${reactId}-hub-svg`}
          >
            <title id={`${reactId}-hub-svg`}>
              Influence hub — Olamide at the center with mentors, peers,
              collaborators and influences
            </title>
            <rect width="100" height="100" fill="#F4EFE6" />
            {/* Concentric guide rings */}
            {[22, 28, 34, 38].map((r) => (
              <circle
                key={r}
                cx={50}
                cy={50}
                r={r}
                fill="none"
                stroke="#181410"
                strokeWidth={0.15}
                opacity={0.12}
              />
            ))}
            {hubEdges.map((edge) => {
              const from = hubPositions.get(edge.from);
              const to = hubPositions.get(edge.to);
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
                  strokeWidth={lit ? 0.5 : 0.22}
                  strokeDasharray={edge.label === "peer" ? "1.2 0.8" : undefined}
                />
              );
            })}
            {hub.map((node) => {
              const pos = hubPositions.get(node.id);
              if (!pos) return null;
              const selected = node.id === activeId;
              const dimmed =
                (Boolean(activeId && !linked.has(node.id)) && roleFilter === "all") ||
                !nodeEmphasized(node);
              const r = node.role === "center" ? 6.2 : 4;
              return (
                <g key={node.id} opacity={dimmed && !selected ? 0.32 : 1}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={selected ? r + 1.1 : r}
                    fill={ROLE_FILL[node.role]}
                    stroke="#181410"
                    strokeWidth={selected ? 0.75 : 0.4}
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
                    x={pos.x}
                    y={pos.y + r + 3.2}
                    textAnchor="middle"
                    fill="#181410"
                    fontSize={node.role === "center" ? 2.5 : 1.9}
                    fontWeight={700}
                    className="ov-influence-label pointer-events-none"
                    style={{ fontFamily: "Archivo, sans-serif" }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="border-t-2 border-ink bg-paper px-3 py-2 text-[0.68rem] tracking-[0.04em] uppercase text-ink-soft sm:hidden">
            Tap a node — or the roster list above
          </p>
        </section>
      </div>

      {/* Shared detail — one reading pane for either composition */}
      <aside
        className="ov-paste-up border-[3px] border-ink bg-white p-5 shadow-paste-sm sm:p-6"
        data-tilt="-0.3"
        style={{ rotate: "-0.3deg" }}
        aria-live="polite"
      >
        {active ? (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <p
                className="inline-block px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase"
                style={{
                  background: ROLE_FILL[active.role],
                  color: ROLE_TEXT[active.role],
                }}
              >
                {INFLUENCE_ROLE_LABEL[active.role]}
              </p>
              {active.signedYear ? (
                <span className="inline-block border border-ink bg-paper-dim px-2 py-0.5 text-[0.68rem] font-bold tracking-[0.05em] uppercase text-ink">
                  YBNL · {rosterSpan(active)}
                  {isAlumni(active) ? " · alumni" : " · current"}
                </span>
              ) : null}
            </div>
            <h2 className="font-display mb-3 text-3xl sm:text-4xl">{active.name}</h2>
            <p className="mb-5 max-w-3xl text-[1rem] leading-relaxed text-ink-soft">
              {active.blurb}
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              {active.eraSlug && active.momentAnchor ? (
                <Link
                  href={eraMomentHref(active.eraSlug, active.momentAnchor)}
                  className="underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  Era moment →
                </Link>
              ) : active.eraSlug ? (
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
          <p className="text-ink-soft">Select a name from the roster or the hub.</p>
        )}
      </aside>
    </div>
  );
}
