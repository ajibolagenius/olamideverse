import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ImpactMap from "@/components/ImpactMap";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getImpactPlaces } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Impact map",
    description:
      "Bariga to the diaspora — places where Olamide's music, concerts and cultural ripples landed.",
    path: "/impact",
  });
}

const TICKER = [
  "Bariga · Lagos · the road",
  "Origins, stages, diaspora",
  "Editorial pins, not a live tracker",
];

export default async function ImpactPage() {
  const places = await getImpactPlaces();

  return (
    <>
      <Breadcrumb
        items={[{ label: "Impact" }]}
        previous={{ label: "Influence", href: "/influence" }}
        next={{ label: "Snippets", href: "/snippets" }}
      />
      <PosterHero
        eyebrow="Where the archive touches ground"
        title={
          <>
            Impact <span className="text-danfo">map</span>
          </>
        }
        intro="From Bariga corners to OLIC stages to diaspora bills — a stylized map of places that matter to the story. Not a complete tour history; a curated geography of the career."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <ImpactMap places={places} />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-soft">
          For the people around the music, open the{" "}
          <Link
            href="/influence"
            className="font-semibold text-ink underline hover:text-oxide"
          >
            Influence graph
          </Link>
          . Facts here are working archive notes — refine them as the content pass
          verifies dates and venues.
        </p>
      </section>
    </>
  );
}
