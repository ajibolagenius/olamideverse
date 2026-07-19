import type { Metadata } from "next";
import AlbumGrid from "@/components/AlbumGrid";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getAlbums, getEras } from "@/lib/content";

export const metadata: Metadata = {
  title: "Discography",
  description:
    "Every Olamide album and mixtape, cover-forward — filterable by era, sortable by release date.",
};

const TICKER = [
  "14 releases · 2011 — 2025",
  "Cover art forward",
  "Filter by era",
  "Embeds only — no hosted audio",
];

export default function AlbumsPage() {
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
        <AlbumGrid albums={getAlbums()} eras={getEras()} />
      </section>
    </>
  );
}
