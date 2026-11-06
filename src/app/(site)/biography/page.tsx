import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InlineMarkdown from "@/components/InlineMarkdown";
import PosterHero from "@/components/PosterHero";
import PullQuote from "@/components/PullQuote";
import SectionLabel from "@/components/ui/SectionLabel";
import { ACCENTS, type AccentName } from "@/lib/accents";
import { getBiography, getEras } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { resolvePageMetadata } from "@/lib/site";
import { ArrowRight, IdentificationCard, SealCheck } from "@phosphor-icons/react/ssr";

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
  const eraBySlug = new Map(eras.map((e) => [e.slug, e]));

  return (
    <>
      <PosterHero
        kickerLeft="OlamideVerse — Archival Biography"
        kickerRight="Living Narrative · 2010 — Present"
        eyebrow={biography.heroBadge}
        title={
          <>
            The <span className="text-danfo">Biography</span>
          </>
        }
        intro={biography.heroIntro}
      />

      {/* Archival Manuscript Folio Bar */}
      <section className="border-y-2 border-ink bg-white py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 text-[0.72rem] font-mono sm:px-8">
          <div className="flex items-center gap-2">
            <span className="bg-ink px-1.5 py-0.5 font-bold uppercase text-paper">
              DOC REF: BIO-BARIGA-01
            </span>
            <span className="font-semibold text-ink-soft hidden sm:inline">
              CLASSIFICATION: LIVING CHRONICLE
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <SealCheck weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
            <span className="font-bold uppercase tracking-wider">
              PRIMARY RECORD · 6 NARRATIVE CHAPTERS
            </span>
          </div>
        </div>
      </section>

      {/* Artist Identity Dossier (Quick Facts) */}
      {biography.quickFacts.length > 0 ? (
        <section className="mx-auto max-w-5xl px-5 pt-12 sm:px-8">
          <div
            className="ov-paste-up border-3 border-ink bg-white p-6 shadow-print sm:p-8"
            data-tilt="0.3"
            style={{ rotate: "0.3deg" }}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-paste-sm">
                  <IdentificationCard weight={OV_ICON_WEIGHT} className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg uppercase tracking-wide text-ink">
                    Artist Identity Dossier
                  </h2>
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink-soft">
                    Registry Code // YBNL-DOC-001
                  </p>
                </div>
              </div>
              <div className="border border-oxide bg-oxide/5 px-2.5 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-oxide">
                VERIFIED ARCHIVE FILE
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {biography.quickFacts.map((fact) => (
                <div key={fact.label} className="border-l-2 border-ink/20 pl-3">
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink-soft">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-[0.95rem] font-bold text-ink leading-snug">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Chapters Spread with Marginalia */}
      <div className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
        {biography.chapters.map((chapter, i) => {
          const accentName: AccentName = chapter.eraSlug
            ? (accentByEra.get(chapter.eraSlug) ?? "oxide")
            : "oxide";
          const accent = ACCENTS[accentName];
          const matchingEra = chapter.eraSlug ? eraBySlug.get(chapter.eraSlug) : undefined;

          return (
            <article key={chapter.heading} className="relative">
              {/* Desktop Marginalia Layout: Left Spine + Right Narrative */}
              <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 xl:grid-cols-[240px_1fr] xl:gap-14 items-start">
                {/* Left Spine: Marginalia & Timeline Stamps */}
                <aside
                  className="hidden lg:block sticky top-24 space-y-4 pt-1"
                  aria-label={`Marginalia for Chapter ${i + 1}`}
                >
                  <div className="border-l-3 pl-3" style={{ borderColor: accent.solid }}>
                    <div className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-ink-soft">
                      CHAPTER 0{i + 1}
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-bold text-ink">
                      {chapter.years}
                    </div>
                  </div>

                  {chapter.eraSlug ? (
                    <div>
                      <Link
                        href={`/eras/${chapter.eraSlug}`}
                        className="group inline-flex items-center gap-1.5 border border-ink bg-white px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-wider shadow-paste-sm transition-all hover:bg-danfo hover:text-ink"
                      >
                        <span>Era Dossier</span>
                        <ArrowRight
                          weight="bold"
                          className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  ) : null}

                  {/* Marginalia Annotation Card */}
                  <div className="border-l-2 border-oxide/80 bg-paper-dim/90 p-3 font-mono text-[0.72rem] leading-relaxed text-ink-soft shadow-paste-sm">
                    <span className="mb-1 block font-bold uppercase tracking-wider text-oxide text-[0.65rem]">
                      EDITOR NOTE [{matchingEra ? matchingEra.title.toUpperCase() : "CHRONICLE"}]:
                    </span>
                    {matchingEra?.thesis
                      ? matchingEra.thesis
                      : `Verified chapter documenting the ${chapter.heading} period in Nigerian street-hop.`}
                  </div>
                </aside>

                {/* Right Column: Narrative Content */}
                <div className="max-w-[65ch]">
                  {/* Mobile Chapter Ribbon */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-2 lg:hidden">
                    <div className="flex items-center gap-2">
                      <span className="bg-ink px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-paper">
                        CH. 0{i + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-ink">{chapter.years}</span>
                    </div>
                    {chapter.eraSlug ? (
                      <Link
                        href={`/eras/${chapter.eraSlug}`}
                        className="text-xs font-bold text-oxide hover:underline"
                        style={{ color: accent.solid }}
                      >
                        Era dossier →
                      </Link>
                    ) : null}
                  </div>

                  <SectionLabel className="hidden lg:block">{chapter.years}</SectionLabel>
                  <h2 className="ov-ink-wipe font-display mb-6 text-3xl sm:text-4xl uppercase tracking-tight text-ink">
                    {chapter.heading}
                  </h2>

                  <div className="space-y-4">
                    {chapter.body.map((p, j) => (
                      <p
                        key={j}
                        className={`text-lg leading-relaxed text-ink ${
                          j === 0 ? "font-medium" : "text-ink/90"
                        }`}
                      >
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
                </div>
              </div>

              {/* Chapter Perforation Line (between chapters) */}
              {i < biography.chapters.length - 1 ? (
                <div
                  className="my-14 flex items-center justify-center gap-4 text-ink/30"
                  aria-hidden="true"
                >
                  <div className="h-px flex-1 border-t-2 border-dashed border-ink/25" />
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-ink-soft">
                    CH. 0{i + 1} · CONTINUED
                  </span>
                  <div className="h-px flex-1 border-t-2 border-dashed border-ink/25" />
                </div>
              ) : (
                <div className="my-14" />
              )}
            </article>
          );
        })}

        {/* The Throughline Epilogue */}
        <section className="mb-16 border-3 border-ink bg-white p-7 shadow-print sm:p-10">
          <div className="mb-4 flex items-center justify-between border-b-2 border-ink pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-oxide">
              THE THROUGHLINE // EPILOGUE
            </span>
            <span className="font-mono text-[0.65rem] font-bold uppercase text-ink-soft">
              ARCHIVE IMPRIMATUR
            </span>
          </div>

          <h2 className="font-display mb-6 text-3xl sm:text-4xl uppercase tracking-tight text-ink">
            {biography.closingHeading}
          </h2>

          <div className="max-w-[65ch] space-y-4">
            {biography.closingBody.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-soft">
                <InlineMarkdown text={p} />
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-ink pt-6">
            <Link href="/eras" className="ov-btn ov-btn-danfo px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Browse all eras →
            </Link>
            <Link href="/songs" className="ov-btn ov-btn-ghost px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Song catalogue →
            </Link>
            <Link href="/about" className="ov-btn ov-btn-ghost px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              About this archive →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
