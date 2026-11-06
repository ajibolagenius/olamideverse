import { ArrowRight, Books, Disc } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import AlbumCard from "@/components/AlbumCard";
import OnThisDay from "@/components/OnThisDay";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import DoorCard from "@/components/ui/DoorCard";
import SectionLabel from "@/components/ui/SectionLabel";
import { accentChrome, type AccentName } from "@/lib/accents";
import { buildAnniversaries, getOnThisDay } from "@/lib/anniversaries";
import { getAlbums, getEra, getEras } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { getHomePhoto } from "@/lib/photos";
import { getFeatureFlags } from "@/lib/settings";

// `new Date()` alone doesn't opt this page into dynamic rendering — without
// a revalidate window it would be baked in at build time and "On this day"
// would never move between deploys. Hourly is more than enough precision
// for a day-level anniversary check.
export const revalidate = 3600;

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
    copy: "Fifteen releases, filterable by era in Cards or Vinyl Crate",
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
  const [allAlbums, homePhoto, flags] = await Promise.all([
    getAlbums(),
    getHomePhoto(),
    getFeatureFlags(),
  ]);
  const onThisDay = getOnThisDay(buildAnniversaries(allAlbums, eras), new Date());

  const erasBySlug = new Map(eras.map((e) => [e.slug, e]));

  // Curate 4 landmark pressings across eras for the essential front-page spread
  const landmarkSlugs = ["rapsodi", "baddest-guy-ever-liveth", "carpe-diem", "unruly"];
  const landmarkAlbums = landmarkSlugs
    .map((slug) => allAlbums.find((a) => a.slug === slug))
    .filter((a): a is (typeof allAlbums)[0] => a !== undefined);

  return (
    <>
      {/* Archival Masthead Folio Strip */}
      <div className="border-b-2 border-ink bg-paper px-5 py-2 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          <div className="flex items-center gap-3">
            <span className="border border-ink bg-danfo px-1.5 py-0.5 text-ink shadow-print">
              VOL. 01 · NO. 06
            </span>
            <span>LAGOS EDITORIAL ARCHIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>BARIGA → MAINLAND → WORLD</span>
            <span className="hidden sm:inline-block">EST. 2010</span>
          </div>
        </div>
      </div>

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
        intro="The cultural context, the era-defining moments, the lineage from Coded Tunes to YBNL — told era by era, album by album."
      >
        <div className="mt-9 flex flex-wrap items-end justify-between gap-4 border-t-6 border-danfo pt-5">
          <div className="flex flex-wrap gap-3">
            <Link href="/eras" className="ov-btn ov-btn-danfo ov-icon-inline px-5 py-3 text-sm">
              <Books className="ov-icon" size={18} weight={OV_ICON_WEIGHT} aria-hidden />
              Start with the eras
              <ArrowRight className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
            </Link>
            <Link
              href="/albums"
              className="ov-btn ov-icon-inline border-paper/50 bg-transparent px-5 py-3 text-sm text-paper hover:border-danfo hover:bg-danfo hover:text-ink"
            >
              <Disc className="ov-icon" size={18} weight={OV_ICON_WEIGHT} aria-hidden />
              Browse Vinyl Crate
            </Link>
          </div>
          <span className="font-display text-2xl text-paper">
            {String(eras.length).padStart(2, "0")} chapters live
          </span>
        </div>
      </PosterHero>

      {/* Front-Page Career Quick-Spine Strip */}
      <section className="border-b-3 border-ink bg-paper-dim/60 py-5">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">
              CAREER SPINE · SIX CHAPTERS AT A GLANCE
            </span>
            <Link
              href="/eras"
              className="text-xs font-bold uppercase tracking-wider text-ink hover:text-danfo"
            >
              Full Timeline →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {eras.map((era) => {
              const chrome = accentChrome(era.accent as AccentName);
              return (
                <Link
                  key={era.slug}
                  href={`/eras/${era.slug}`}
                  className="group relative border-2 border-ink bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-paste-sm"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: chrome.bg }}
                  />
                  <div className="flex items-baseline justify-between font-mono text-[0.62rem] font-bold text-ink-muted">
                    <span>CH. 0{era.order}</span>
                    <span>{era.years}</span>
                  </div>
                  <div className="mt-1 font-display text-xs uppercase tracking-wide truncate text-ink group-hover:text-danfo">
                    {era.title}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <OnThisDay result={onThisDay} />

      {/* Chapter One Lead Story */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-5 sm:px-8">
        <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
          <span>ORIGIN REPORT</span>
          <span>·</span>
          <span>BARIGA CHRONICLES</span>
        </div>
        <div
          className="ov-paste-up max-w-4xl border-3 border-ink bg-white shadow-paste"
          data-tilt="-0.5"
          style={{ rotate: "-0.5deg" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-3 border-ink bg-oxide px-5 py-2.5 text-paper">
            <span className="text-sm font-bold tracking-[0.06em] uppercase">
              Chapter One — Bariga Underground to National Waves
            </span>
            <span className="font-display text-2xl">{upstart.years}</span>
          </div>
          <div className="grid sm:grid-cols-2">
            <div className="p-6 sm:p-7">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-oxide block mb-1">
                FIRST INK SPILL
              </span>
              <h2 className="mb-3 font-display text-3xl sm:text-4xl">{upstart.title}</h2>
              <p className="mb-6 max-w-[46ch] text-sm leading-relaxed text-ink-soft">{upstart.thesis}</p>
              <Link
                href={`/eras/${upstart.slug}`}
                className="ov-btn ov-btn-danfo ov-icon-inline px-6 py-3.5 text-sm"
              >
                Read Chapter One
                <ArrowRight className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
              </Link>
            </div>
            <PhotoPlaceholder
              accent={upstart.accent}
              label="Archival photo — Bariga, early days"
              photo={homePhoto}
              className="min-h-[280px] border-t-3 border-ink sm:border-t-0 sm:border-l-3"
            />
          </div>
        </div>
      </section>

      {/* Essential Pressings Crate Preview */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
          <div>
            <SectionLabel className="mb-1">Dynasty Pressings</SectionLabel>
            <p className="text-sm text-ink-soft">
              Landmark albums across 16 years — from Bariga debut to world stages.
            </p>
          </div>
          <Link href="/albums" className="ov-btn ov-btn-ghost px-4 py-2 text-xs">
            Open Vinyl Crate ({allAlbums.length} records) →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {landmarkAlbums.map((album, idx) => {
            const era = erasBySlug.get(album.era) ?? upstart;
            return (
              <AlbumCard
                key={album.slug}
                album={album}
                era={era}
                priority={idx === 0}
                showFavorite={flags.fanzone}
                flagship={idx === 0}
              />
            );
          })}
        </div>
      </section>

      {/* Dispatch Doors */}
      <section className="mx-auto max-w-6xl px-5 pt-4 pb-20 sm:px-8">
        <div className="mb-6 border-b-2 border-ink/20 pb-3">
          <SectionLabel className="mb-1">Archive Corridors</SectionLabel>
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            DIRECT TRANSIT TO SECTIONS
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {DOORS.map((door) => (
            <DoorCard key={door.href} {...door} />
          ))}
        </div>
      </section>
    </>
  );
}
