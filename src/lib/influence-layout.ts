/**
 * Auto-layout for the Influence hub (non-roster nodes around Olamide).
 * JSON x/y remain available as optional overrides via `useManual`.
 */
import type { InfluenceNode } from "@/lib/content-schema";

const RING_RADIUS: Partial<Record<InfluenceNode["role"], number>> = {
  mentor: 28,
  influence: 34,
  peer: 22,
  collaborator: 38,
};

const ROLE_ORDER: InfluenceNode["role"][] = [
  "mentor",
  "influence",
  "peer",
  "collaborator",
];

export type Point = { x: number; y: number };

/** Hub nodes: everyone except YBNL roster signees (signedYear). */
export function hubNodes(nodes: InfluenceNode[]): InfluenceNode[] {
  return nodes.filter((n) => n.role === "center" || n.signedYear == null);
}

/** YBNL roster: nodes with a signing year, chronological. */
export function rosterNodes(nodes: InfluenceNode[]): InfluenceNode[] {
  return nodes
    .filter((n) => typeof n.signedYear === "number")
    .sort((a, b) => (a.signedYear ?? 0) - (b.signedYear ?? 0) || a.name.localeCompare(b.name));
}

/**
 * Place non-center hub nodes on role rings around (50,50).
 * Stable order within each ring: alphabetical.
 */
export function layoutHub(nodes: InfluenceNode[]): Map<string, Point> {
  const positions = new Map<string, Point>();
  const center = nodes.find((n) => n.role === "center");
  if (center) positions.set(center.id, { x: 50, y: 50 });

  for (const role of ROLE_ORDER) {
    const ring = nodes
      .filter((n) => n.role === role)
      .sort((a, b) => a.name.localeCompare(b.name));
    if (ring.length === 0) continue;
    const radius = RING_RADIUS[role] ?? 30;
    // Offset start angle so rings don't stack labels on the same spoke.
    const start = ROLE_ORDER.indexOf(role) * 0.35;
    ring.forEach((node, i) => {
      const angle = start + (i / ring.length) * Math.PI * 2 - Math.PI / 2;
      positions.set(node.id, {
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
      });
    });
  }

  return positions;
}
