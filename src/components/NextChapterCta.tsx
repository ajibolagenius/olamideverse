import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import type { Era } from "@/lib/content";

export default function NextChapterCta({ nextEra }: { nextEra: Era }) {
  const accent = ACCENTS[nextEra.accent];
  return (
    <Link
      href={`/eras/${nextEra.slug}`}
      className="group mx-auto my-14 flex max-w-4xl flex-wrap items-center justify-between gap-3 border-[3px] border-ink px-5 py-4"
      style={{ background: accent.tint }}
    >
      <span>
        <span className="block text-xs font-bold tracking-[0.08em] uppercase text-adire">
          Era {String(nextEra.order).padStart(2, "0")} · Next chapter
        </span>
        <span className="font-display text-display-md">
          {nextEra.title} ({nextEra.years})
        </span>
      </span>
      <span className="text-sm font-bold tracking-[0.08em] uppercase group-hover:underline">
        Keep reading →
      </span>
    </Link>
  );
}
