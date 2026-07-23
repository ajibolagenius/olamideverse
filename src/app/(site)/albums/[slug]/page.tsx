import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AudiogramCard from "@/components/AudiogramCard";
import Breadcrumb from "@/components/Breadcrumb";
import CommentBox from "@/components/fanzone/CommentBox";
import FavoriteButton from "@/components/fanzone/FavoriteButton";
import CoverArt from "@/components/CoverArt";
import EmptyState from "@/components/EmptyState";
import Prose from "@/components/Prose";
import Tracklist from "@/components/Tracklist";
import SectionLabel from "@/components/ui/SectionLabel";
import { ACCENTS, accentChrome } from "@/lib/accents";
import {
  ALBUM_TYPE_LABEL,
  getAlbum,
  getAlbums,
  getEra,
  getSnippetsByAlbum,
} from "@/lib/content";
import { getComments } from "@/lib/fanzone/queries";
import { getAlbumCover } from "@/lib/photos";
import { getBlockedEmbeds, getFeatureFlags } from "@/lib/settings";
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
  const chromeAccent =
    era.accent === "ink" ? "danfo" : era.accent;
  const { bg: badgeBg, fg: badgeFg } = accentChrome(chromeAccent);
  const [flags, blocks, albums, snippets] = await Promise.all([
    getFeatureFlags(),
    getBlockedEmbeds(),
    getAlbums(),
    getSnippetsByAlbum(album.slug),
  ]);
  const comments = flags.comments
    ? await getComments(`album-${album.slug}`)
    : [];
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
  const cover = getAlbumCover(album.slug);

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
        <div>
          <div
            className="ov-paste-up w-full border-[3px] border-ink shadow-paste"
            data-tilt="-0.7"
            style={{ rotate: "-0.7deg" }}
          >
            <CoverArt title={album.title} slug={album.slug} accent={era.accent} className="aspect-square" />
          </div>
          <p className="mt-2.5 text-[0.7rem] tracking-[0.06em] uppercase text-ink-soft">
            Cover art
            {cover?.sourceUrl ? (
              <>
                {" · "}
                <a
                  href={cover.sourceUrl}
                  className="underline hover:text-oxide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  via Deezer
                </a>
              </>
            ) : null}
            {" · "}
            <Link href="/legal" className="underline hover:text-oxide">
              Legal
            </Link>
          </p>
        </div>
        <div>
          <Link
            href={`/eras/${era.slug}`}
            className="mb-4 inline-block -rotate-1 px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase"
            style={{ background: badgeBg, color: badgeFg }}
          >
            Part of Era {String(era.order).padStart(2, "0")} — {era.title} →
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="ov-ink-wipe font-display text-display-lg">{album.title}</h1>
            {flags.fanzone ? (
              <FavoriteButton
                id={`album:${album.slug}`}
                label={album.title}
                kind="album"
                href={`/albums/${album.slug}`}
              />
            ) : null}
          </div>
          {metaFacts.length > 0 ? (
            <div className="mb-6 flex flex-wrap gap-7 border-y-[6px] border-ink bg-paper-dim/40 py-3.5 text-sm text-ink-soft">
              {metaFacts.map((fact) => (
                <span key={fact.label}>
                  <b className="block text-[0.7rem] tracking-[0.1em] uppercase text-ink">
                    {fact.label}
                  </b>
                  {fact.value}
                </span>
              ))}
            </div>
          ) : null}
          <Prose source={album.body} accent={era.accent} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-8 pb-16 sm:px-8">
        <SectionLabel>Tracklist</SectionLabel>
        {album.tracklist.length > 0 ? (
          <div className="grid gap-11 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <Tracklist
              tracks={album.tracklist}
              albumSlug={album.slug}
              albumTitle={album.title}
              albumYear={album.year}
              spotifyAlbumId={album.embeds.spotifyAlbumId}
              showPlaylist={flags.fanzone}
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
                    <h3 className="mb-1.5 text-sm font-bold tracking-[0.04em] uppercase">
                      {kb.title}
                    </h3>
                    <p className="text-[0.95rem] leading-relaxed text-ink-soft">{kb.body}</p>
                  </div>
                ))}
                {album.credits ? (
                  <div className="ov-paste-up border-[3px] border-ink bg-white p-[18px] shadow-paste-sm">
                    <h3 className="mb-2.5 text-xs font-bold tracking-[0.06em] uppercase">
                      Credits
                    </h3>
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

      {snippets.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
              Share a snippet
            </p>
            <Link href="/snippets" className="ov-btn ov-btn-ghost px-3 py-1.5 text-xs">
              All snippets →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {snippets.map((snippet) => (
              <AudiogramCard
                key={snippet.id}
                snippet={snippet}
                accent={era.accent}
              />
            ))}
          </div>
        </section>
      ) : null}

      {flags.comments ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <SectionLabel>Talk about it</SectionLabel>
          <CommentBox
            threadId={`album-${album.slug}`}
            threadLabel={album.title}
            initialComments={comments}
          />
        </section>
      ) : null}
    </>
  );
}
