import type { Metadata } from "next";
import Link from "next/link";
import CassetteBoombox from "@/components/lab/CassetteBoombox";

export const metadata: Metadata = {
  title: "Tactile Cassette Boombox & Vinyl Player · Lab · OlamideVerse",
  description:
    "Prototype 03 exploring physical cassette boombox and vinyl turntable packaging for the persistent player dock.",
};

export default function PlayerLabPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
          <span className="bg-danfo px-2 py-0.5 font-bold text-ink border border-ink">
            PROTOTYPE 03
          </span>
          <span>PHYSICAL MUSIC PACKAGING EXPERIMENT</span>
        </div>
        <h1 className="mt-3 font-display text-display-lg uppercase tracking-tight leading-none text-ink">
          Tactile Cassette Boombox Player
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">
          Reimagining the floating persistent player dock as an authentic West African
          dual-spool cassette boombox and 7-inch vinyl turntable deck with animated tape reels,
          Dolby NR toggles, and analog VU level indicators.
        </p>
      </div>

      <CassetteBoombox />

      {/* Footer Nav */}
      <div className="mt-16 border-t-2 border-ink pt-6 flex items-center justify-between">
        <Link
          href="/lab"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
        >
          ← Back to Lab Index
        </Link>
        <span className="font-mono text-xs uppercase text-ink-muted">
          Prototype 03: Boombox Player
        </span>
      </div>
    </div>
  );
}
