import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverArt from "@/components/CoverArt";
import EmbedFrame from "@/components/EmbedFrame";
import EmptyState from "@/components/EmptyState";
import PosterHero from "@/components/PosterHero";
import Prose from "@/components/Prose";
import Tracklist from "@/components/Tracklist";
import { ACCENTS } from "@/lib/accents";
import { getAlbum, getAlbums, getEra } from "@/lib/content";

export function generateStaticParams() {
  return getAlbums().map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const album = getAlbum((await params).slug);
  if (!album) return {};
  return {
    title: `${album.title} (${album.year})`,
    description: `${album.title} — ${album.year} ${album.type}. Tracklist, embeds and the story of where it landed.`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const album = getAlbum((await params).slug);
  if (!album) notFound();

  const era = getEra(album.era)!;
  const accent = ACCENTS[era.accent];

  return (
    <>
      <PosterHero
        eyebrow={`${album.year} · ${album.type}`}
        title={album.title}
        accent={accent.solid === ACCENTS.ink.solid ? ACCENTS.danfo.solid : accent.solid}
      >
        <p className="mt-4 text-sm tracking-[0.05em] uppercase text-ink-muted">
          An era-{String(era.order).padStart(2, "0")} release ·{" "}
          <Link href={`/eras/${era.slug}`} className="font-bold text-danfo hover:underline">
            {era.title} ({era.years})
          </Link>
        </p>
      </PosterHero>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div
            className="ov-paste-up border-[3px] border-ink shadow-paste"
            data-tilt="-0.8"
            style={{ rotate: "-0.8deg" }}
          >
            <CoverArt title={album.title} accent={era.accent} className="aspect-square" />
          </div>
          {album.embeds.spotifyAlbumId ? (
            <div className="mt-8">
              <EmbedFrame
                title={album.title}
                spotifyId={album.embeds.spotifyAlbumId}
                spotifyType="album"
              />
            </div>
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-display-md mb-4">The story</h2>
          <Prose source={album.body} accent={era.accent} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <h2 className="font-display text-display-md mb-6">Tracklist</h2>
        {album.tracklist.length > 0 ? (
          <Tracklist tracks={album.tracklist} />
        ) : (
          <EmptyState message="Tracklist coming with the content pass — check back as the archive grows." />
        )}
      </section>
    </>
  );
}
