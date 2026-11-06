import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AudiogramCard from "@/components/AudiogramCard";
import Breadcrumb from "@/components/Breadcrumb";
import EmbedFrame from "@/components/EmbedFrame";
import ShareSnippet from "@/components/ShareSnippet";
import ShareToStory from "@/components/ShareToStory";
import { ACCENTS } from "@/lib/accents";
import { getEra, getSnippet, getSnippets } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { SITE_URL, resolvePageMetadata } from "@/lib/site";
import { ArrowLeft, ArrowRight, Broadcast, Disc, Radio } from "@phosphor-icons/react/ssr";

export async function generateStaticParams() {
  return (await getSnippets()).map((snippet) => ({ id: snippet.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const snippet = await getSnippet(id);
  if (!snippet) return {};
  return resolvePageMetadata({
    title: `${snippet.track} — snippet`,
    description: snippet.quote,
    path: `/snippets/${id}`,
  });
}

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getSnippet(id);
  if (!snippet) notFound();

  const [era, snippets] = await Promise.all([
    getEra(snippet.era),
    getSnippets(),
  ]);
  if (!era) notFound();

  const palette = ACCENTS[era.accent];
  const absoluteUrl = `${SITE_URL}/snippets/${snippet.id}`;
  const catalogCode = `MC-${snippet.year}-${snippet.id.slice(0, 4).toUpperCase()}`;

  const index = snippets.findIndex((s) => s.id === snippet.id);
  const prevSnippet = index > 0 ? snippets[index - 1] : undefined;
  const nextSnippet =
    index >= 0 && index < snippets.length - 1 ? snippets[index + 1] : undefined;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Snippets", href: "/snippets" },
          { label: snippet.albumTitle, href: `/albums/${snippet.albumSlug}` },
          { label: snippet.track },
        ]}
        previous={
          prevSnippet
            ? {
                label: prevSnippet.track,
                href: `/snippets/${prevSnippet.id}`,
              }
            : null
        }
        next={
          nextSnippet
            ? {
                label: nextSnippet.track,
                href: `/snippets/${nextSnippet.id}`,
              }
            : null
        }
      />

      {/* Broadcast Deck Folio Bar */}
      <section className="border-b-2 border-ink bg-white py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-[0.72rem] font-mono sm:px-8">
          <div className="flex items-center gap-2">
            <Radio weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
            <span className="bg-ink px-1.5 py-0.5 font-bold uppercase text-paper">
              STUDIO DECK // {catalogCode}
            </span>
            <span className="font-semibold text-ink-soft hidden md:inline">
              15 IPS MASTER REEL · STEREO PLAYBACK
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <Broadcast weight={OV_ICON_WEIGHT} className="h-4 w-4 text-danfo" />
            <span className="font-bold uppercase tracking-wider">
              OFFICIAL EMBED · NOT HOSTED LOCALLY
            </span>
          </div>
        </div>
      </section>

      {/* Main Broadcast Console Spread */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        {/* Left Column: Enhanced Featured Audiogram Card */}
        <div className="space-y-6">
          <AudiogramCard snippet={snippet} accent={era.accent} featured />

          {/* Previous / Next Tape Deck Controls */}
          <div className="flex items-center justify-between border-2 border-ink bg-white p-3.5 shadow-paste-sm">
            {prevSnippet ? (
              <Link
                href={`/snippets/${prevSnippet.id}`}
                className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-oxide"
              >
                <ArrowLeft weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Prev Tape: {prevSnippet.track}</span>
              </Link>
            ) : (
              <span className="text-xs font-mono text-ink-muted uppercase">FIRST DROP</span>
            )}

            {nextSnippet ? (
              <Link
                href={`/snippets/${nextSnippet.id}`}
                className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-oxide"
              >
                <span>Next Tape: {nextSnippet.track}</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <span className="text-xs font-mono text-ink-muted uppercase">LATEST DROP</span>
            )}
          </div>
        </div>

        {/* Right Column: Studio Tape Monitor & Session Dispatch */}
        <div className="flex flex-col gap-6">
          {/* Analog Tape Monitor Frame */}
          <div className="border-3 border-ink bg-[#141210] p-4 text-paper shadow-print sm:p-5">
            <div className="mb-3 flex items-center justify-between border-b border-paper/20 pb-2 text-[0.68rem] font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                <span className="font-bold uppercase tracking-wider text-paper">
                  REC MONITOR ACTIVE
                </span>
              </div>
              <span className="font-bold tracking-widest text-danfo">
                0.0 dB PEAK · 44.1 kHz
              </span>
            </div>

            {snippet.spotifyTrackId || snippet.youtubeId ? (
              <div className="rounded-xs overflow-hidden border border-paper/20">
                <EmbedFrame
                  title={snippet.track}
                  spotifyId={snippet.spotifyTrackId}
                  youtubeId={snippet.youtubeId}
                  provider="youtubemusic"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-paper/30 p-6 text-center font-mono text-xs text-paper/70">
                Embed player coming with the next archive pass. No audio is hosted here.
              </div>
            )}

            <p className="mt-3 text-center font-mono text-[0.65rem] tracking-wider uppercase text-paper/60">
              Screened via authorized streaming provider · Zero audio hosted on OlamideVerse
            </p>
          </div>

          {/* Archival Session Dispatch Card */}
          <div className="border-3 border-ink bg-white p-6 shadow-paste-sm sm:p-7">
            <div className="mb-4 flex items-center justify-between border-b-2 border-ink pb-3">
              <div className="flex items-center gap-2">
                <Disc weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  SESSION ARCHIVE DISPATCH
                </span>
              </div>
              <span className="font-mono text-[0.65rem] font-bold uppercase text-ink-soft">
                {snippet.year}
              </span>
            </div>

            <ul className="divide-y divide-ink/15 font-mono text-xs">
              <li className="flex items-baseline justify-between py-2.5">
                <span className="text-ink-soft uppercase tracking-wider">CARRIER ALBUM</span>
                <Link
                  href={`/albums/${snippet.albumSlug}`}
                  className="font-bold text-ink underline decoration-danfo underline-offset-2 hover:text-oxide"
                >
                  {snippet.albumTitle} →
                </Link>
              </li>
              <li className="flex items-baseline justify-between py-2.5">
                <span className="text-ink-soft uppercase tracking-wider">CAREER ERA</span>
                <Link
                  href={`/eras/${era.slug}`}
                  className="inline-flex items-center gap-1.5 font-bold text-ink underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: palette.solid }}
                    aria-hidden="true"
                  />
                  <span>{era.title} →</span>
                </Link>
              </li>
            </ul>

            <div className="mt-4 border-l-2 border-ink/20 bg-paper-dim p-3 text-xs leading-relaxed text-ink-soft">
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider block text-ink mb-1">
                ARCHIVIST NOTE:
              </span>
              {snippet.note}
            </div>

            {/* Social Share Suite */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t-2 border-ink pt-5">
              <ShareSnippet url={absoluteUrl} title={snippet.track} />
              <ShareToStory
                storyUrl={`/snippets/${snippet.id}/story`}
                title={snippet.track}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
