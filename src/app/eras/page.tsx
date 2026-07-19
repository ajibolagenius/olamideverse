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
        eyebrow="The elevator pitch of the whole site"
        title={
          <>
            Six Eras. <span className="text-danfo">One Legacy.</span>
          </>
        }
        intro="From a Bariga upstart to a label boss raising the next generation — the whole career, one scrollable timeline. All six chapters are live."
      />
      <section className="mx-auto flex max-w-3xl flex-col gap-14 px-5 py-16 sm:px-8">
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
