import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import NextChapterCta from "@/components/NextChapterCta";
import PosterHero from "@/components/PosterHero";
import Prose from "@/components/Prose";
import PullQuote from "@/components/PullQuote";
import { ACCENTS } from "@/lib/accents";
import { getAlbumsByEra, getEra, getEras, getMediaItems } from "@/lib/content";

export function generateStaticParams() {
  return getEras().map((era) => ({ era: era.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ era: string }>;
}): Promise<Metadata> {
  const era = getEra((await params).era);
  if (!era) return {};
  return { title: `${era.title} (${era.years})`, description: era.thesis };
}

export default async function EraPage({
  params,
}: {
  params: Promise<{ era: string }>;
}) {
  const era = getEra((await params).era);
  if (!era) notFound();

  const eras = getEras();
  const accent = ACCENTS[era.accent];
  const albums = getAlbumsByEra(era.slug);
  const media = getMediaItems().filter((item) => item.era === era.slug);
  const nextEra = era.open
    ? undefined
    : eras.find((e) => e.order === era.order + 1);

  return (
    <>
      <PosterHero
        size="xl"
        eyebrow={`Era ${String(era.order).padStart(2, "0")} · ${era.years}`}
        title={era.title}
        intro={era.thesis}
        accent={accent.solid === ACCENTS.ink.solid ? ACCENTS.danfo.solid : accent.solid}
      />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Prose source={era.body} accent={era.accent} />
        {era.motto ? (
          <PullQuote accent={era.accent} cite="Editorial voice">
            {era.motto}
          </PullQuote>
        ) : null}
      </section>

      {albums.length > 0 ? (
        <section className="ov-pin-section border-t-[6px] border-ink bg-paper-dim">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="ov-pin-panel lg:pt-2">
                <p className="mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
                  {albums.length === 1 ? "The album" : "The albums"} of the era
                </p>
                <h2 className="font-display text-display-lg max-w-[10ch]">
                  {albums.length} {albums.length === 1 ? "release" : "releases"},{" "}
                  {era.years.trim().replace(/\s*—\s*/, "–")}
                </h2>
                <p className="mt-4 max-w-[44ch] text-ink-soft">
                  Every release links to its own page — tracklist, embeds, and
                  the story of where it landed.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              {albums.map((album, i) => (
                <AlbumCard key={album.slug} album={album} era={era} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {media.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            From the media archive
          </p>
          <h2 className="font-display text-display-md mb-6">Watch this era</h2>
          <ul className="max-w-2xl border-t-2 border-ink">
            {media.map((item) => (
              <li key={item.id}>
                <Link
                  href="/media"
                  className="flex items-baseline justify-between gap-4 border-b-2 border-ink px-2 py-3 hover:bg-paper-dim"
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs tracking-[0.05em] uppercase text-ink-soft">
                    {item.type.replace("-", " ")} · {item.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {nextEra ? <NextChapterCta nextEra={nextEra} /> : null}
    </>
  );
}
