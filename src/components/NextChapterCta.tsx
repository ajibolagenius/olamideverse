import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import { ACCENTS } from "@/lib/accents";
import type { Era } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function NextChapterCta({ nextEra }: { nextEra: Era }) {
  const accent = ACCENTS[nextEra.accent];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <SectionLabel>Next chapter</SectionLabel>
      <Link
        href={`/eras/${nextEra.slug}`}
        className="ov-paste-up group flex flex-wrap items-center justify-between gap-4 border-[3px] border-ink bg-(--tint) px-7 py-6 shadow-paste-sm transition-colors hover:bg-(--solid) hover:text-paper"
        style={
          {
            "--tint": accent.tint,
            "--solid": accent.solid,
          } as CSSProperties
        }
      >
        <span>
          <span className="block text-xs font-bold tracking-[0.08em] uppercase">
            Era {String(nextEra.order).padStart(2, "0")} · Live now
          </span>
          <span className="ov-icon-inline font-display text-display-md">
            {nextEra.title} ({nextEra.years})
            <ArrowRight className="ov-icon" size={28} weight={OV_ICON_WEIGHT} aria-hidden />
          </span>
        </span>
        <span className="max-w-[36ch] text-sm">{nextEra.heroBadge}</span>
      </Link>
    </section>
  );
}
