import type { Metadata } from "next";
import AlbumGrid from "@/components/AlbumGrid";
import PosterHero from "@/components/PosterHero";
import { getAlbums, getEras } from "@/lib/content";

export const metadata: Metadata = {
  title: "Discography",
  description:
    "Every Olamide album and mixtape, cover-forward — filterable by era, sortable by release date.",
};

export default function AlbumsPage() {
  return (
    <>
      <PosterHero
        eyebrow="The discography"
        title="Every release, one wall"
        intro="Albums, mixtapes and EPs — filter by era, sort by year. Every cover links to the tracklist, the embeds, and the story."
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <AlbumGrid albums={getAlbums()} eras={getEras()} />
      </section>
    </>
  );
}
