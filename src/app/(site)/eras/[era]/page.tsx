import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import AudiogramCard from "@/components/AudiogramCard";
import Breadcrumb from "@/components/Breadcrumb";
import CommentBox from "@/components/fanzone/CommentBox";
import EraMoments from "@/components/EraMoments";
import InlineMarkdown from "@/components/InlineMarkdown";
import NextChapterCta from "@/components/NextChapterCta";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import PosterHero from "@/components/PosterHero";
import PullQuote from "@/components/PullQuote";
import RelatedArchive from "@/components/RelatedArchive";
import Ticker from "@/components/chrome/Ticker";
import { ACCENTS, accentChrome } from "@/lib/accents";
import {
  getAlbumsByEra,
  getEra,
  getEras,
  getMediaItems,
  getSnippetsByEra,
} from "@/lib/content";
import { getComments } from "@/lib/fanzone/queries";
import { getEraPhoto } from "@/lib/photos";
import { getFeatureFlags } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateStaticParams() {
  return (await getEras()).map((era) => ({ era: era.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ era: string }>;
}): Promise<Metadata> {
  const { era: eraSlug } = await params;
  const era = await getEra(eraSlug);
  if (!era) return {};
  return resolvePageMetadata({
    title: `${era.title} (${era.years})`,
    description: era.thesis,
    path: `/eras/${eraSlug}`,
  });
}

export default async function EraPage({
  params,
  searchParams,
}: {
  params: Promise<{ era: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { era: eraSlug } = await params;
  const { preview } = await searchParams;
  const era = await getEra(eraSlug, { previewToken: preview });
  if (!era) notFound();

  const [eras, albums, allMedia, snippets, flags, eraPhoto] = await Promise.all([
    getEras(),
    getAlbumsByEra(era.slug),
    getMediaItems(),
    getSnippetsByEra(era.slug),
    getFeatureFlags(),
    getEraPhoto(era.slug),
  ]);
  const comments = flags.comments ? await getComments(`era-${era.slug}`) : [];
  const accent = ACCENTS[era.accent];
  const chrome = accentChrome(era.accent);
  const media = allMedia.filter((item) => item.era === era.slug);
  const prevEra = eras.find((e) => e.order === era.order - 1);
  const nextEra = era.open
    ? undefined
    : eras.find((e) => e.order === era.order + 1);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Eras", href: "/eras" },
          { label: era.title },
        ]}
        previous={
          prevEra
            ? { label: prevEra.title, href: `/eras/${prevEra.slug}` }
            : null
        }
        next={
          nextEra
            ? { label: nextEra.title, href: `/eras/${nextEra.slug}` }
            : null
        }
      />

      <PosterHero
        size="xl"
        kickerLeft={`OlamideVerse — Era ${String(era.order).padStart(2, "0")}`}
        kickerRight="Fan archive · Not affiliated with YBNL"
        eyebrow={era.heroBadge}
        title={era.title}
        intro={era.heroIntro}
        accent={chrome.bg}
        onAccent={chrome.fg}
      >
        <div
          className="mt-8 flex items-end justify-between gap-4 border-t-4 pt-4"
          style={{ borderColor: accent.solid }}
        >
          <span />
          <span className="font-display text-3xl tabular-nums text-paper">
            {era.years}
          </span>
        </div>
      </PosterHero>

      {era.ticker.length > 0 ? <Ticker items={era.ticker} /> : null}

      {era.contextBody.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-11 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
              The context
            </p>
            <h2 className="font-display text-display-lg mb-5 max-w-[16ch]">
              {era.contextHeading}
            </h2>
            <div className="max-w-[65ch]">
              {era.contextBody.map((p, i) => (
                <p key={i} className="mb-4 text-lg leading-relaxed">
                  <InlineMarkdown text={p} />
                </p>
              ))}
            </div>
          </div>
          <div
            className="ov-paste-up shadow-paste"
            data-tilt="0.7"
            style={{ rotate: "0.7deg" }}
          >
            <PhotoPlaceholder
              accent={era.accent}
              label={`Archival photo — ${era.title}, ${era.years}`}
              photo={eraPhoto}
            />
          </div>
        </section>
      ) : null}

      {albums.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
          <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            The {albums.length === 1 ? "album" : "albums"} of the era
          </p>
          <div className="grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
            {albums.map((album, i) => (
              <AlbumCard
                key={album.slug}
                album={album}
                era={era}
                index={i}
                showFavorite={flags.fanzone}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
        <PullQuote accent={era.accent} text={era.pullQuote} highlight={era.pullQuoteHighlight} />
      </section>

      <EraMoments era={era} />

      {snippets.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
                Share a snippet
              </p>
              <h2 className="font-display text-display-md">Bars from this era</h2>
            </div>
            <Link
              href="/snippets"
              className="text-sm font-semibold underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              All snippets →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {snippets.slice(0, 4).map((snippet) => (
              <AudiogramCard
                key={snippet.id}
                snippet={snippet}
                accent={era.accent}
              />
            ))}
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

      <RelatedArchive eraTitle={era.title} />

      {nextEra ? (
        <NextChapterCta nextEra={nextEra} />
      ) : era.open ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="border-2 border-dashed border-ink-soft p-9 text-center">
            <h3 className="font-display mb-2.5 text-2xl">This era stays open</h3>
            <p className="mx-auto mb-[18px] max-w-[52ch] text-ink-soft">
              There&apos;s no next chapter to hand off to yet — just whatever comes
              next. Check back as the archive grows, or revisit where it all
              started.
            </p>
            <Link
              href="/eras"
              className="inline-block border-[3px] border-ink bg-danfo px-5 py-3 text-sm font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm"
            >
              Back to all eras
            </Link>
          </div>
        </section>
      ) : null}

      {flags.comments ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            Talk about it
          </p>
          <CommentBox
            threadId={`era-${era.slug}`}
            threadLabel={era.title}
            initialComments={comments}
          />
        </section>
      ) : null}
    </>
  );
}
