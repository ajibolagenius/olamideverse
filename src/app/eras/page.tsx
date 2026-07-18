import type { Metadata } from "next";
import PosterHero from "@/components/PosterHero";
import EraCard from "@/components/EraCard";
import { getAlbumsByEra, getEras } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eras",
  description:
    "Olamide's whole career on one timeline — six eras, from The Upstart to Legacy.",
};

export default function ErasPage() {
  const eras = getEras();

  return (
    <>
      <PosterHero
        eyebrow="The career timeline"
        title="Six eras, one story"
        intro="The whole career at a glance — each era with its years, its defining albums, and its one-line thesis. Pick a chapter and go deep."
      />
      <section className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-14 sm:px-8">
        {eras.map((era, i) => (
          <EraCard
            key={era.slug}
            era={era}
            albums={getAlbumsByEra(era.slug)}
            index={i}
          />
        ))}
      </section>
    </>
  );
}
