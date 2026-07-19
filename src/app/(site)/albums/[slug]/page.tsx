import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CommentBox from "@/components/fanzone/CommentBox";
import CoverArt from "@/components/CoverArt";
import EmptyState from "@/components/EmptyState";
import Prose from "@/components/Prose";
import Tracklist from "@/components/Tracklist";
import { ACCENTS } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, getAlbum, getAlbums, getEra } from "@/lib/content";
import { getComments } from "@/lib/fanzone/queries";
import { getBlockedEmbeds } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateStaticParams() {
  return (await getAlbums()).map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return {};
  return resolvePageMetadata({
    title: `${album.title} (${album.year})`,
    description: `${album.title} — ${album.year} ${ALBUM_TYPE_LABEL[album.type]}. Tracklist, embeds and the story of where it landed.`,
    path: `/albums/${slug}`,
  });
}

export default async function AlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const album = await getAlbum(slug, { previewToken: preview });
  if (!album) notFound();

  const era = (await getEra(album.era))!;
  const accent = ACCENTS[era.accent];
  const heroAccent = accent.solid === ACCENTS.ink.solid ? ACCENTS.danfo.solid : accent.solid;
  const [comments, blocks, albums] = await Promise.all([
    getComments(`album-${album.slug}`),
    getBlockedEmbeds(),
    getAlbums(),
  ]);
  const blockedYoutube = blocks
    .filter((b) => b.provider === "youtube" || b.provider === "any")
    .map((b) => b.embed_id);
  const blockedSpotify = blocks
    .filter((b) => b.provider === "spotify" || b.provider === "any")
    .map((b) => b.embed_id);

  const albumIndex = albums.findIndex((a) => a.slug === album.slug);
  const prevAlbum = albumIndex > 0 ? albums[albumIndex - 1] : undefined;
  const nextAlbum =
    albumIndex >= 0 && albumIndex < albums.length - 1 ? albums[albumIndex + 1] : undefined;

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
      <Breadcrumb
        items={[
          { label: "Discography", href: "/albums" },
          { label: era.title, href: `/eras/${era.slug}` },
          { label: album.title },
        ]}
        previous={
          prevAlbum
            ? { label: prevAlbum.title, href: `/albums/${prevAlbum.slug}` }
            : null
        }
        next={
          nextAlbum
            ? { label: nextAlbum.title, href: `/albums/${nextAlbum.slug}` }
            : null
        }
      />

      <section className="mx-auto grid max-w-6xl items-start gap-11 px-5 pt-9 pb-5 sm:px-8 lg:grid-cols-[min(340px,100%)_1fr]">
        <div
          className="ov-paste-up w-full border-[3px] border-ink shadow-paste"
          data-tilt="-0.7"
          style={{ rotate: "-0.7deg" }}
        >
          <CoverArt title={album.title} slug={album.slug} accent={era.accent} className="aspect-square" />
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
            <Tracklist
              tracks={album.tracklist}
              albumSlug={album.slug}
              albumTitle={album.title}
              albumYear={album.year}
              spotifyAlbumId={album.embeds.spotifyAlbumId}
              blockedYoutube={blockedYoutube}
              blockedSpotify={blockedSpotify}
            />
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

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Talk about it
        </p>
        <CommentBox
          threadId={`album-${album.slug}`}
          threadLabel={album.title}
          initialComments={comments}
        />
      </section>
    </>
  );
}
