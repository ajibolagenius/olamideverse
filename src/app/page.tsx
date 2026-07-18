import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import EraCard from "@/components/EraCard";
import { getAlbums, getAlbumsByEra, getEras } from "@/lib/content";

const DOORS = [
  {
    href: "/eras",
    title: "Explore the Eras",
    copy: "The whole career as six scrollytelling chapters — from Bariga to the empire.",
  },
  {
    href: "/albums",
    title: "Browse the Discography",
    copy: "Every album and mixtape, cover-forward, filterable by era.",
  },
  {
    href: "/media",
    title: "Watch",
    copy: "Curated videos, freestyles, interviews and live moments.",
  },
] as const;

export default function Home() {
  const eras = getEras();
  const albums = getAlbums();
  const featured = eras.find((era) => era.open) ?? eras[eras.length - 1];

  return (
    <>
      <PosterHero
        size="xl"
        eyebrow="The living archive of Olamide's legacy"
        title={
          <>
            From Bariga to the empire, era by era
          </>
        }
        intro="Streaming platforms have the songs. Blogs have the news. This is the story — the cultural context, the eras, the lineage from Coded Tunes to YBNL and the artists he raised."
      />
      <Ticker items={albums.map((album) => `${album.title} · ${album.year}`)} />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <p className="mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Three doors in
        </p>
        <h2 className="font-display text-display-md mb-8">Start anywhere</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {DOORS.map((door, i) => (
            <Link
              key={door.href}
              href={door.href}
              className="ov-paste-up group border-[3px] border-ink bg-white p-5 shadow-paste transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              data-tilt={(i - 1) * 0.6}
              style={{ rotate: `${(i - 1) * 0.6}deg` }}
            >
              <h3 className="font-display text-2xl">{door.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{door.copy}</p>
              <span className="mt-4 inline-block text-sm font-bold tracking-[0.08em] uppercase text-adire group-hover:text-oxide">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <p className="mb-1.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          The current chapter
        </p>
        <h2 className="font-display text-display-md mb-8">Still being written</h2>
        <div className="max-w-2xl">
          <EraCard
            era={featured}
            albums={getAlbumsByEra(featured.slug)}
            index={0}
          />
        </div>
      </section>
    </>
  );
}
