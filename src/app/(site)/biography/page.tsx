import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InlineMarkdown from "@/components/InlineMarkdown";
import PosterHero from "@/components/PosterHero";
import PullQuote from "@/components/PullQuote";
import SectionLabel from "@/components/ui/SectionLabel";
import { ACCENTS, type AccentName } from "@/lib/accents";
import { getBiography, getEras } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  return resolvePageMetadata({
    title: "Biography",
    description:
      biography?.heroIntro ??
      "The Olamide story, start to now — one narrative throughline across six eras.",
    path: "/biography",
  });
}

export default async function BiographyPage() {
  const [biography, eras] = await Promise.all([getBiography(), getEras()]);
  if (!biography) notFound();

  const accentByEra = new Map(eras.map((e) => [e.slug, e.accent] as const));

  return (
    <>
      <PosterHero
        eyebrow={biography.heroBadge}
        title={
          <>
            The <span className="text-danfo">Biography</span>
          </>
        }
        intro={biography.heroIntro}
      />

      {biography.quickFacts.length > 0 ? (
        <section className="mx-auto max-w-3xl px-5 pt-14 sm:px-8">
          <div
            className="ov-paste-up grid gap-5 border-3 border-ink bg-white p-7 shadow-paste-sm sm:grid-cols-2"
            data-tilt="0.4"
            style={{ rotate: "0.4deg" }}
          >
            {biography.quickFacts.map((fact) => (
              <div key={fact.label}>
                <p className="mb-1 text-[0.75rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
                  {fact.label}
                </p>
                <p className="text-[0.95rem] font-semibold leading-snug">{fact.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {biography.chapters.map((chapter, i) => {
        const accentName: AccentName = chapter.eraSlug
          ? (accentByEra.get(chapter.eraSlug) ?? "oxide")
          : "oxide";
        const accent = ACCENTS[accentName];
        return (
          <section
            key={chapter.heading}
            className="mx-auto max-w-3xl px-5 pt-16 sm:px-8"
            style={i === biography.chapters.length - 1 ? { paddingBottom: "1rem" } : undefined}
          >
            <SectionLabel>{chapter.years}</SectionLabel>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="ov-ink-wipe font-display text-4xl">{chapter.heading}</h2>
              {chapter.eraSlug ? (
                <Link
                  href={`/eras/${chapter.eraSlug}`}
                  className="ov-link-underline text-sm font-semibold whitespace-nowrap"
                  style={{ color: accent.solid }}
                >
                  Full era chapter →
                </Link>
              ) : null}
            </div>
            <div className="max-w-[65ch]">
              {chapter.body.map((p, j) => (
                <p key={j} className="mb-4 text-lg leading-relaxed">
                  <InlineMarkdown text={p} />
                </p>
              ))}
            </div>
            {chapter.pullQuote ? (
              <PullQuote
                accent={accentName}
                text={chapter.pullQuote}
                highlight={chapter.pullQuoteHighlight}
              />
            ) : null}
          </section>
        );
      })}

      <section className="mx-auto max-w-3xl px-5 pt-4 pb-16 sm:px-8">
        <SectionLabel>The throughline</SectionLabel>
        <h2 className="font-display mb-5 text-3xl">{biography.closingHeading}</h2>
        {biography.closingBody.map((p, i) => (
          <p key={i} className="mb-4 text-lg leading-relaxed text-ink-soft">
            <InlineMarkdown text={p} />
          </p>
        ))}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/eras" className="ov-btn ov-btn-danfo px-4 py-2 text-xs">
            Browse all eras →
          </Link>
          <Link href="/about" className="ov-btn ov-btn-ghost px-4 py-2 text-xs">
            About this archive →
          </Link>
        </div>
      </section>
    </>
  );
}
