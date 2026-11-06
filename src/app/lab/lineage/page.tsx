import type { Metadata } from "next";
import Link from "next/link";
import LineageBlueprint from "@/components/lab/LineageBlueprint";
import { getInfluenceGraph } from "@/lib/content";

export const metadata: Metadata = {
  title: "YBNL Lineage Blueprint · Lab · OlamideVerse",
  description:
    "Prototype 04 exploring an archival architectural blueprint family tree for the influence and dynasty network.",
};

export default async function LineageLabPage() {
  const graph = await getInfluenceGraph();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
          <span className="bg-danfo px-2 py-0.5 font-bold text-ink border border-ink">
            PROTOTYPE 04
          </span>
          <span>DYNASTIC BLUEPRINT EXPERIMENT</span>
        </div>
        <h1 className="mt-3 font-display text-display-lg uppercase tracking-tight leading-none text-ink">
          YBNL Lineage Blueprint
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">
          Reimagining the /influence network as an architectural archival blueprint and detective
          dossier file. Maps the lineage from Coded Tunes to YBNL Nation to the modern Empire era.
        </p>
      </div>

      <LineageBlueprint graph={graph} />

      {/* Footer Nav */}
      <div className="mt-16 border-t-2 border-ink pt-6 flex items-center justify-between">
        <Link
          href="/lab"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
        >
          ← Back to Lab Index
        </Link>
        <span className="font-mono text-xs uppercase text-ink-muted">
          Prototype 04: Lineage Blueprint
        </span>
      </div>
    </div>
  );
}
