import type { Metadata } from "next";
import Link from "next/link";
import AlbumGrid from "@/components/AlbumGrid";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getAlbums, getEras } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Discography",
    description:
      "Every Olamide album and mixtape, cover-forward — filterable by era, sortable by release date.",
    path: "/albums",
  });
}

const TICKER = [
  "14 releases · 2011 — 2025",
  "Cover art forward",
  "Filter by era",
  "Embeds only — no hosted audio",
];

export default async function AlbumsPage() {
  const [albums, eras, flags] = await Promise.all([
    getAlbums(),
    getEras(),
    getFeatureFlags(),
  ]);
  return (
    <>
      <PosterHero
        eyebrow="Every record, one shelf"
        title={
          <>
            The <span className="text-danfo">Discography</span>
          </>
        }
        intro="Fourteen studio albums, mixtapes and EPs from 2011 to 2025. Filter by era, sort by release — every cover links back to its chapter of the archive."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-ink pb-5">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
            Looking for a single cut, feature or freestyle across the whole run?
          </p>
          <Link href="/songs" className="ov-btn ov-btn-ghost shrink-0 px-4 py-2 text-xs">
            Songs catalogue →
          </Link>
        </div>
        <AlbumGrid albums={albums} eras={eras} showFavorites={flags.fanzone} />
      </section>
    </>
  );
}
