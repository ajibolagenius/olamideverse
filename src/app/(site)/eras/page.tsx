import type { Metadata } from "next";
import Link from "next/link";
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

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <div className="border-[3px] border-ink bg-white p-6 shadow-paste-sm">
          <p className="mb-2 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            Also in the archive
          </p>
          <p className="mb-4 text-[0.98rem] leading-relaxed text-ink-soft">
            Trace the people around these chapters, or the places they touched.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link
              href="/influence"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Influence graph →
            </Link>
            <Link
              href="/impact"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Impact map →
            </Link>
            <Link
              href="/snippets"
              className="underline decoration-2 underline-offset-2 hover:text-oxide"
            >
              Audiogram snippets →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
