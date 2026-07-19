import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AudiogramCard from "@/components/AudiogramCard";
import Breadcrumb from "@/components/Breadcrumb";
import EmbedFrame from "@/components/EmbedFrame";
import ShareSnippet from "@/components/ShareSnippet";
import { getEra, getSnippet, getSnippets } from "@/lib/content";
import { SITE_URL, resolvePageMetadata } from "@/lib/site";

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

  const era = (await getEra(snippet.era))!;
  const absoluteUrl = `${SITE_URL}/snippets/${snippet.id}`;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Snippets", href: "/snippets" },
          { label: snippet.track },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <AudiogramCard snippet={snippet} accent={era.accent} featured />

        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-2 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
              Listen via embed
            </p>
            {snippet.spotifyTrackId || snippet.youtubeId ? (
              <EmbedFrame
                title={snippet.track}
                spotifyId={snippet.spotifyTrackId}
                youtubeId={snippet.youtubeId}
              />
            ) : (
              <div className="border-2 border-dashed border-ink-soft p-6 text-sm text-ink-soft">
                Embed coming with the content pass — no audio is hosted here.
              </div>
            )}
          </div>

          <div className="border-[3px] border-ink bg-white p-5 shadow-paste-sm">
            <p className="mb-3 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
              In the archive
            </p>
            <ul className="flex flex-col gap-2 text-sm font-semibold">
              <li>
                <Link
                  href={`/albums/${snippet.albumSlug}`}
                  className="underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  {snippet.albumTitle} ({snippet.year}) →
                </Link>
              </li>
              <li>
                <Link
                  href={`/eras/${era.slug}`}
                  className="underline decoration-2 underline-offset-2 hover:text-oxide"
                >
                  Era: {era.title} →
                </Link>
              </li>
            </ul>
            <div className="mt-5">
              <ShareSnippet url={absoluteUrl} title={snippet.track} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
