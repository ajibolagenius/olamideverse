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
