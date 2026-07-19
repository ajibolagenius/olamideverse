import Link from "next/link";
import AlbumCard from "@/components/AlbumCard";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getAlbumsByEra, getEra, getEras } from "@/lib/content";
import { getHomePhoto } from "@/lib/photos";
import { getFeatureFlags } from "@/lib/settings";

// The home ticker is a curated highlight reel, not the full catalog.
const HOME_TICKER = [
  "Rapsodi · 2011",
  "YBNL · 2012",
  "Baddest Guy Ever Liveth · 2013",
  "Street OT · 2014",
  "Eyan Mayweather · 2015",
  "The Glory · 2016",
  "Lagos Nawa · 2017",
  "Carpe Diem · 2020",
  "UY Scuti · 2021",
  "Unruly · 2023",
];

const DOORS = [
  {
    href: "/eras",
    title: "Explore the Eras",
    copy: "Six chapters, one career — start with The Upstart",
  },
  {
    href: "/albums",
    title: "Browse the Discography",
    copy: "Fourteen releases, filterable by era",
  },
  {
    href: "/media",
    title: "Watch",
    copy: "Music videos, interviews & live moments",
  },
] as const;

export default async function Home() {
  const eras = await getEras();
  const upstart = (await getEra("the-upstart"))!;
  const [upstartAlbums, homePhoto, flags] = await Promise.all([
    getAlbumsByEra(upstart.slug),
    getHomePhoto(),
    getFeatureFlags(),
  ]);

  return (
    <>
      <Ticker items={HOME_TICKER} />

      <PosterHero
        size="xl"
        kickerLeft="OlamideVerse — The Archive"
        kickerRight="Six Eras · One Legacy"
        eyebrow="A fan-made living archive"
        title={
          <>
            Bariga to
            <br />
            the <span className="text-danfo">Empire</span>
          </>
        }
        intro="Streaming platforms have the songs. Blogs have the news. Nobody has the story — the cultural context, the era-defining moments, the lineage from Coded Tunes to YBNL to the artists he raised. This is the archive, told era by era, album by album."
      >
        <div className="mt-9 flex flex-wrap items-end justify-between gap-4 border-t-[6px] border-danfo pt-5">
          <p className="max-w-[44ch] text-[#CFC7BB]">
            Not a streaming service. Not a fan forum. An editorial archive
            with the music running through it.
          </p>
          <span className="font-display text-2xl text-paper">
            {String(eras.length).padStart(2, "0")} / {String(eras.length).padStart(2, "0")} live
          </span>
        </div>
      </PosterHero>

      <section className="mx-auto max-w-6xl px-5 pt-20 pb-5 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Start at the beginning
        </p>
        <div
          className="ov-paste-up max-w-3xl border-[3px] border-ink bg-white shadow-paste"
          data-tilt="-0.6"
          style={{ rotate: "-0.6deg" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-[3px] border-ink bg-oxide px-5 py-2.5 text-paper">
            <span className="text-sm font-bold tracking-[0.06em] uppercase">
              Chapter One — live now
            </span>
            <span className="font-display text-2xl">{upstart.years}</span>
          </div>
          <div className="grid sm:grid-cols-2">
            <div className="p-6">
              <h2 className="font-display text-4xl mb-3">{upstart.title}</h2>
              <p className="mb-5 max-w-[46ch] text-ink-soft">{upstart.thesis}</p>
              <Link
                href={`/eras/${upstart.slug}`}
                className="inline-block border-[3px] border-ink bg-danfo px-6 py-3.5 text-sm font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Read the chapter →
              </Link>
            </div>
            <PhotoPlaceholder
              accent={upstart.accent}
              label="Archival photo — Bariga, early days"
              photo={homePhoto}
              className="min-h-[280px] border-t-[3px] border-ink sm:border-t-0 sm:border-l-[3px]"
            />
          </div>
        </div>
      </section>

      {upstartAlbums.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            The album of the era
          </p>
          <div className="max-w-xs">
            {upstartAlbums.map((album, i) => (
              <AlbumCard
                key={album.slug}
                album={album}
                era={upstart}
                index={i}
                showFavorite={flags.fanzone}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 pt-10 pb-20 sm:px-8">
        <p className="mb-[18px] text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Or go straight to
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {DOORS.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="block border-[3px] border-ink bg-white p-6 shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <span className="font-display mb-1.5 block text-2xl">{door.title}</span>
              <span className="text-sm text-ink-soft">{door.copy}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
