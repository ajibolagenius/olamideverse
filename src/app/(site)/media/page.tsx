import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getMediaItems } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Media",
    description:
      "Music videos, freestyles, interviews and live moments — YouTube embeds only, tagged by era.",
    path: "/media",
  });
}

const TICKER = [
  "Click a poster to screen it",
  "Embeds only — no ripped video",
  "Search titles, eras & notes",
];

export default async function MediaPage() {
  const [items, eras] = await Promise.all([getMediaItems(), getEras()]);
  return (
    <>
      {/* Archival Folio Strip */}
      <div className="border-b-2 border-ink bg-paper px-5 py-2 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          <div className="flex items-center gap-3">
            <span className="border border-ink bg-danfo px-1.5 py-0.5 text-ink shadow-print">
              BARIGA OUTDOOR CINEMA
            </span>
            <span>VISUAL PRESSINGS & BROADCAST ARCHIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>2010 — PRESENT</span>
            <span className="hidden sm:inline-block">EMBEDS ONLY · NO RIPPED MEDIA</span>
          </div>
        </div>
      </div>

      <PosterHero
        eyebrow="Screening wall"
        title="Watch"
        intro="A paste-up wall of music videos, interviews and live moments — search and filter, then tap a poster to load the YouTube embed. Nothing hosted or ripped."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <MediaGrid items={items} eras={eras} />
      </section>
    </>
  );
}
