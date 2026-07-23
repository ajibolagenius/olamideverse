import type { Metadata } from "next";
import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import EraCard from "@/components/EraCard";
import SectionLabel from "@/components/ui/SectionLabel";
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
      <section className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute top-16 bottom-16 left-[1.35rem] w-[3px] bg-ink/15 sm:left-[2.1rem]"
        />
        <div className="flex flex-col gap-14">
          {albumsByEra.map(({ era, albums }, i) => (
            <EraCard
              key={era.slug}
              era={era}
              albums={albums}
              index={i}
              showFavorite={flags.fanzone}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <div className="ov-paste-up border-[3px] border-ink bg-white p-6 shadow-paste-sm">
          <SectionLabel className="mb-2">Also in the archive</SectionLabel>
          <p className="mb-5 text-[0.98rem] leading-relaxed text-ink-soft">
            Trace the people around these chapters, or the places they touched —
            also under More in the header.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/influence" className="ov-btn ov-btn-ghost px-4 py-2 text-xs">
              Influence graph →
            </Link>
            <Link href="/impact" className="ov-btn ov-btn-ghost px-4 py-2 text-xs">
              Impact map →
            </Link>
            <Link href="/snippets" className="ov-btn ov-btn-ghost px-4 py-2 text-xs">
              Audiogram snippets →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
