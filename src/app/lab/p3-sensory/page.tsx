import type { Metadata } from "next";
import Link from "next/link";
import P3SensoryLab from "@/components/lab/P3SensoryLab";

export const metadata: Metadata = {
  title: "Display P3 Gamut & Sensory Micro-Interactions · Lab · OlamideVerse",
  description:
    "Prototype 06 exploring Display P3 wide color gamut calibration and synthetic Web Audio analog tape clicks.",
};

export default function P3SensoryLabPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
          <span className="bg-danfo px-2 py-0.5 font-bold text-ink border border-ink">
            PROTOTYPE 06
          </span>
          <span>HARDWARE SENSORY & COLOR-4 ENGINE</span>
        </div>
        <h1 className="mt-3 font-display text-display-lg uppercase tracking-tight leading-none text-ink">
          Display P3 & Sensory Lab
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">
          Exploring wide-gamut Display P3 color calibration for Danfo Yellow on modern OLED screens,
          paired with an opt-in synthetic Web Audio analog cassette click engine.
        </p>
      </div>

      <P3SensoryLab />

      {/* Footer Nav */}
      <div className="mt-16 border-t-2 border-ink pt-6 flex items-center justify-between">
        <Link
          href="/lab"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
        >
          ← Back to Lab Index
        </Link>
        <span className="font-mono text-xs uppercase text-ink-muted">
          Prototype 06: P3 & Sensory
        </span>
      </div>
    </div>
  );
}
