import type { Metadata } from "next";
import Link from "next/link";
import DanfoTransitMap from "@/components/lab/DanfoTransitMap";
import { getImpactPlaces } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lagos Danfo Transit Map · Lab · OlamideVerse",
  description:
    "Prototype 02 exploring a Lagos Danfo and BRT transit-map aesthetic for the geographic impact archive.",
};

export default async function TransitLabPage() {
  const places = await getImpactPlaces();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
          <span className="bg-danfo px-2 py-0.5 font-bold text-ink border border-ink">
            PROTOTYPE 02
          </span>
          <span>CARTOGRAPHIC EXPERIMENT</span>
        </div>
        <h1 className="mt-3 font-display text-display-lg uppercase tracking-tight leading-none text-ink">
          Lagos Danfo Transit Map
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">
          Reimagining the /impact geographic archive as an authentic Lagos Danfo and BRT
          transit network. Features a 45° schematic vector route diagram, station departure board,
          and stamped conductor ticket stubs.
        </p>
      </div>

      {/* Main Interactive Map Component */}
      <DanfoTransitMap places={places} />

      {/* Footer Nav */}
      <div className="mt-16 border-t-2 border-ink pt-6 flex items-center justify-between">
        <Link
          href="/lab"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
        >
          ← Back to Lab Index
        </Link>
        <span className="font-mono text-xs uppercase text-ink-muted">
          Prototype 02: Transit Map
        </span>
      </div>
    </div>
  );
}
