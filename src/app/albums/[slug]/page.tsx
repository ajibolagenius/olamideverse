import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverArt from "@/components/CoverArt";
import EmptyState from "@/components/EmptyState";
import Prose from "@/components/Prose";
import Tracklist from "@/components/Tracklist";
import { ACCENTS } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, getAlbum, getAlbums, getEra } from "@/lib/content";

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
    description: `${album.title} — ${album.year} ${ALBUM_TYPE_LABEL[album.type]}. Tracklist, embeds and the story of where it landed.`,
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
  const heroAccent = accent.solid === ACCENTS.ink.solid ? ACCENTS.danfo.solid : accent.solid;

  const metaFacts = [
    album.released ? { label: "Released", value: album.released } : null,
    album.label ? { label: "Label", value: album.label } : null,
    album.producer ? { label: "Producer", value: album.producer } : null,
    {
      label: "Type",
      value:
        album.tracklist.length > 0
          ? `${ALBUM_TYPE_LABEL[album.type]} · ${album.tracklist.length} tracks`
          : ALBUM_TYPE_LABEL[album.type],
    },
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-4 text-sm uppercase tracking-[0.06em] text-ink-soft sm:px-8">
        <Link href="/albums" className="hover:text-oxide">
          Discography
        </Link>{" "}
        / {album.title}
      </div>

      <section className="mx-auto grid max-w-6xl gap-11 px-5 pt-9 pb-5 sm:px-8 lg:grid-cols-[340px_1fr]">
        <div
          className="ov-paste-up border-[3px] border-ink shadow-paste"
          data-tilt="-0.7"
          style={{ rotate: "-0.7deg" }}
        >
          <CoverArt title={album.title} accent={era.accent} className="aspect-square" />
        </div>
        <div>
          <Link
            href={`/eras/${era.slug}`}
            className="mb-4 inline-block -rotate-1 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase text-paper"
            style={{ background: heroAccent }}
          >
            Part of Era {String(era.order).padStart(2, "0")} — {era.title} →
          </Link>
          <h1 className="font-display text-display-lg mb-5">{album.title}</h1>
          {metaFacts.length > 0 ? (
            <div className="mb-6 flex flex-wrap gap-7 border-y-4 border-ink py-3.5 text-sm text-ink-soft">
              {metaFacts.map((fact) => (
                <span key={fact.label}>
                  <b className="block text-ink">{fact.label}</b>
                  {fact.value}
                </span>
              ))}
            </div>
          ) : null}
          <Prose source={album.body} accent={era.accent} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-8 pb-16 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">Tracklist</p>
        {album.tracklist.length > 0 ? (
          <div className="grid gap-11 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <Tracklist tracks={album.tracklist} />
            {(album.keyBars.length > 0 || album.credits) && (
              <div className="flex flex-col gap-5">
                {album.keyBars.length > 0 ? (
                  <p className="-mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
                    Key bars
                  </p>
                ) : null}
                {album.keyBars.map((kb) => (
                  <div key={kb.title} className="border-l-[6px] border-oxide pl-4">
                    <h4 className="mb-1.5 text-sm font-bold tracking-[0.04em] uppercase">
                      {kb.title}
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed text-ink-soft">{kb.body}</p>
                  </div>
                ))}
                {album.credits ? (
                  <div className="border-[3px] border-ink bg-white p-[18px] shadow-paste-sm">
                    <h4 className="mb-2.5 text-xs font-bold tracking-[0.06em] uppercase">
                      Credits
                    </h4>
                    <p className="text-[0.9rem] leading-relaxed text-ink-soft">{album.credits}</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <EmptyState message="Tracklist coming with the content pass — check back as the archive grows." />
        )}
      </section>
    </>
  );
}
