import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import SearchView from "@/components/SearchView";
import { getAlbums, getEras, getSnippets, getSongs } from "@/lib/content";
import { buildSearchIndex, searchDocs } from "@/lib/search";
import { pageMetadata } from "@/lib/site";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Search",
    description: "Search OlamideVerse across eras, albums, songs, and snippets.",
    path: "/search",
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";

  const [albums, eras, songs, snippets] = await Promise.all([
    getAlbums(),
    getEras(),
    getSongs(),
    getSnippets(),
  ]);

  const docs = buildSearchIndex({ albums, eras, songs, snippets });
  const initialResults = query ? searchDocs(docs, query) : [];

  return (
    <>
      <Breadcrumb items={[{ label: "Search" }]} />
      <PosterHero
        eyebrow="Search"
        title={
          <>
            Find <span className="text-danfo">anything</span>
          </>
        }
        intro="Look up an era, an album, a song, or a snippet — matches search titles, credits, and features."
      />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <SearchView docs={docs} initialQuery={query} initialResults={initialResults} />
      </section>
    </>
  );
}
