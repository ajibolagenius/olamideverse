import Link from "next/link";

/**
 * Compact cross-links into the archive extras — used on era chapters so the
 * lineage and geography hang off the spine instead of living in silos.
 */
export default function RelatedArchive({
  eraTitle,
}: {
  eraTitle: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
      <div className="border-[3px] border-ink bg-white p-6 shadow-paste-sm">
        <p className="mb-2 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Keep following the fabric
        </p>
        <h2 className="font-display mb-3 text-2xl">
          Around {eraTitle}
        </h2>
        <p className="mb-5 max-w-[52ch] text-sm leading-relaxed text-ink-soft">
          Jump from this chapter into the people, places, and shareable bars
          that sit beside it.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <li>
            <Link
              href="/influence"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Influence graph →
            </Link>
          </li>
          <li>
            <Link
              href="/impact"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Impact map →
            </Link>
          </li>
          <li>
            <Link
              href="/snippets"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Audiogram snippets →
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
