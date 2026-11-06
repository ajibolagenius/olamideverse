import type { Metadata } from "next";
import Link from "next/link";
import CareerSpine from "@/components/lab/CareerSpine";
import CassetteJCard from "@/components/lab/CassetteJCard";
import HalftoneImage from "@/components/lab/HalftoneImage";
import TornEdge from "@/components/ui/TornEdge";
import { accentChrome, accentText, type AccentName } from "@/lib/accents";
import { getAlbums, getEras } from "@/lib/content";

export const metadata: Metadata = {
  title: "Career Spine & Editorial Materiality · Lab · OlamideVerse",
  description:
    "Interactive prototype exploring the unified six-era timeline spine, documentary folios, SVG halftone photography, and cassette J-card sleeves.",
};

export default async function CareerSpineLabPage() {
  const [eras, albums] = await Promise.all([getEras(), getAlbums()]);

  return (
    <div className="relative min-h-screen bg-paper pb-28 lg:pb-20">
      {/* Interactive Career Spine (Desktop persistent rail + Mobile bottom chapter rail) */}
      <CareerSpine eras={eras} />

      {/* Main Editorial Canvas with gutter offset for desktop spine */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:pl-72 lg:pr-10">
        {/* Document Folio Header */}
        <div className="border-b-2 border-ink pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.7rem] font-mono uppercase tracking-widest text-ink-soft">
            <span className="bg-ink px-2 py-0.5 text-paper">
              ISSUE 06 · SPEC: 2026-SPINE
            </span>
            <span>ARCHIVE FILE: BARIGA TO THE WORLD (2010 — 2026+)</span>
            <span className="text-danfo font-bold">LIVE PROTOTYPE</span>
          </div>

          <h1 className="mt-4 font-display text-display-xl uppercase tracking-tight leading-none text-ink">
            The Career Spine
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-soft leading-relaxed">
            Testing a unified cross-archive timeline thread. The spine connects all six
            eras, album releases, and street moments into one continuous editorial
            narrative, enriched with documentary folio accession stamps, SVG halftone
            archival photography, screen-print misregistration, and cassette J-card sleeves.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-danfo border border-ink" />
              <span>Wayfinding Spine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-oxide border border-ink" />
              <span>SVG Halftone Matrix</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-adire border border-ink" />
              <span>Cassette J-Card Sleeve</span>
            </span>
          </div>
        </div>

        {/* Six Eras Rendered along the Spine */}
        <div className="mt-12 space-y-20 sm:space-y-28">
          {eras.map((era, index) => {
            const eraAlbums = albums.filter((a) => a.era === era.slug);
            const chrome = accentChrome(era.accent as AccentName);
            const textColor = accentText(era.accent as AccentName);

            return (
              <section
                key={era.slug}
                id={`era-${era.slug}`}
                className="scroll-mt-20 relative border-t-2 border-ink pt-8"
              >
                {/* Era Ticket & Accession Rubber Stamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="border border-ink px-2 py-0.5 font-display text-sm uppercase text-ink"
                      style={{ backgroundColor: chrome.bg, color: chrome.fg }}
                    >
                      CHAPTER {String(era.order).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
                      [{era.years}]
                    </span>
                  </div>

                  <div className="border border-ink bg-white px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-widest text-ink shadow-paste-sm">
                    STAMP: YBNL-ERA-0{era.order} · CONFIRMED
                  </div>
                </div>

                {/* Poster Headline */}
                <h2 className="font-display text-display-lg uppercase tracking-tight text-ink">
                  {era.title}
                </h2>
                <p className="mt-2 text-lg font-semibold" style={{ color: textColor }}>
                  {era.thesis}
                </p>

                {/* Magazine-Paced Editorial Body (2-Column Newsprint with Drop-Cap) */}
                <div className="mt-6 border-y border-ink/15 py-6">
                  <div className="columns-1 md:columns-2 gap-8 text-base leading-relaxed text-ink-soft">
                    {era.heroIntro && (
                      <p className="mb-4">
                        <span className="float-left mr-2.5 font-display text-5xl leading-none text-ink">
                          {era.heroIntro.charAt(0)}
                        </span>
                        {era.heroIntro.slice(1)}
                      </p>
                    )}
                    {era.contextBody.map((paragraph, pIdx) => (
                      <p key={pIdx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {era.pullQuote && (
                    <blockquote
                      className="mt-6 border-l-4 border-ink pl-4 py-2 font-display text-xl sm:text-2xl uppercase tracking-wide text-ink"
                      style={{ borderLeftColor: chrome.bg }}
                    >
                      “{era.pullQuote}”
                    </blockquote>
                  )}
                </div>

                {/* Materiality Showcase: Archival Halftone & Cassette Sleeve */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
                  {/* Left Column: SVG Halftone Archival Photo */}
                  <div className="lg:col-span-5">
                    <HalftoneImage
                      alt={`Archival depiction of ${era.title}`}
                      caption={`Archival photographic record from the ${era.title} chapter (${era.years}).`}
                      accessionRef={`ARCHIVE-${era.slug.toUpperCase()}`}
                      eraAccentHex={chrome.bg}
                    />
                  </div>

                  {/* Right Column: Physical Cassette J-Card & Moments */}
                  <div className="lg:col-span-7 space-y-6">
                    {eraAlbums.length > 0 ? (
                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center justify-between">
                          <span>Discography Artifact</span>
                          <span className="font-mono">{eraAlbums.length} Releases</span>
                        </div>
                        {eraAlbums.slice(0, 2).map((album) => (
                          <CassetteJCard
                            key={album.slug}
                            album={album}
                            eraAccentHex={chrome.bg}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-ink/20 p-6 text-center text-xs font-mono uppercase text-ink-muted">
                        No separate studio albums in this chapter.
                      </div>
                    )}

                    {/* Era Key Moments List */}
                    {era.moments.length > 0 && (
                      <div className="border border-ink/20 bg-white p-4 shadow-print">
                        <div className="border-b border-ink/15 pb-2 text-xs font-bold uppercase tracking-wider text-ink">
                          Chapter Chronology & Turning Points
                        </div>
                        <ul className="mt-3 space-y-2.5 text-xs text-ink-soft">
                          {era.moments.map((m, mIdx) => (
                            <li key={mIdx} className="flex items-baseline gap-2.5">
                              <span className="font-mono font-bold text-ink shrink-0 tabular-nums">
                                {m.year} ·
                              </span>
                              <span>
                                {m.title && (
                                  <strong className="text-ink mr-1">{m.title}:</strong>
                                )}
                                {m.body}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Torn edge separator between chapters */}
                {index < eras.length - 1 && (
                  <div className="mt-16 pt-8">
                    <TornEdge position="bottom" fill="#181410" />
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Back to Lab Index Footer */}
        <div className="mt-20 border-t-2 border-ink pt-8 flex items-center justify-between">
          <Link
            href="/lab"
            className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
          >
            ← Back to Lab Index
          </Link>
          <span className="font-mono text-xs uppercase text-ink-muted">
            Prototype 01: Career Spine
          </span>
        </div>
      </div>
    </div>
  );
}
