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
      "A curated, era-tagged gallery of Olamide videos, freestyles, interviews and live moments — all embedded, nothing hosted.",
    path: "/media",
  });
}

const TICKER = [
  "Curation notes over completeness",
  "Embeds only — no ripped video",
  "Every clip links to its era",
];

export default async function MediaPage() {
  const [items, eras] = await Promise.all([getMediaItems(), getEras()]);
  return (
    <>
      <PosterHero
        eyebrow="Curated, not comprehensive"
        title="Watch"
        intro="Music videos, interviews and live moments that mark the eras — every embed sits inside the identity, never hosted or ripped. Curation notes, not a complete video archive."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <MediaGrid items={items} eras={eras} />
      </section>
    </>
  );
}
