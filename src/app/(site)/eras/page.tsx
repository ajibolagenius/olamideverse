import type { Metadata } from "next";
import PosterHero from "@/components/PosterHero";
import EraCard from "@/components/EraCard";
import { getAlbumsByEra, getEras } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Eras",
    description:
      "Olamide's whole career on one timeline — six eras, from The Upstart to Legacy.",
    path: "/eras",
  });
}

export default async function ErasPage() {
  const [eras, flags] = await Promise.all([getEras(), getFeatureFlags()]);
  const albumsByEra = await Promise.all(
    eras.map(async (era) => ({
      era,
      albums: await getAlbumsByEra(era.slug),
    })),
  );

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
        {albumsByEra.map(({ era, albums }, i) => (
          <EraCard
            key={era.slug}
            era={era}
            albums={albums}
            index={i}
            showFavorite={flags.fanzone}
          />
        ))}
      </section>
    </>
  );
}
