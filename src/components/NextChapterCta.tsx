import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import type { Era } from "@/lib/content";

export default function NextChapterCta({ nextEra }: { nextEra: Era }) {
  const accent = ACCENTS[nextEra.accent];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
        Next chapter
      </p>
      <Link
        href={`/eras/${nextEra.slug}`}
        className="group flex flex-wrap items-center justify-between gap-4 border-[3px] border-ink bg-(--tint) px-7 py-6 transition-colors hover:bg-(--solid) hover:text-paper"
        style={
          {
            "--tint": accent.tint,
            "--solid": accent.solid,
          } as React.CSSProperties
        }
      >
        <span>
          <span className="block text-xs font-bold tracking-[0.08em] uppercase">
            Era {String(nextEra.order).padStart(2, "0")} · Live now
          </span>
          <span className="font-display text-display-md">
            {nextEra.title} ({nextEra.years}) →
          </span>
        </span>
        <span className="max-w-[36ch] text-sm">{nextEra.heroBadge}</span>
      </Link>
    </section>
  );
}
