import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import PosterHero from "@/components/PosterHero";
import { getEras, getMediaItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Media",
  description:
    "A curated, era-tagged gallery of Olamide videos, freestyles, interviews and live moments — all embedded, nothing hosted.",
};

export default function MediaPage() {
  return (
    <>
      <PosterHero
        eyebrow="The media archive"
        title="Watch the story"
        intro="Music videos, freestyles, interviews and live moments — curated with notes, tagged by era, and always embedded from the original source."
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <MediaGrid items={getMediaItems()} eras={getEras()} />
      </section>
    </>
  );
}
