import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import InfluenceGraph from "@/components/InfluenceGraph";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getInfluenceGraph } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Influence",
    description:
      "A curated influence graph — mentors, peers, YBNL signees and collaborators around Olamide's career.",
    path: "/influence",
  });
}

const TICKER = [
  "YBNL roster · always on",
  "Mentors & peers · the orbit",
  "Curated, not algorithmic",
  "Every name links back to the archive",
];

export default async function InfluencePage() {
  const graph = await getInfluenceGraph();

  return (
    <>
      <Breadcrumb
        items={[{ label: "Influence" }]}
        previous={{ label: "Snippets", href: "/snippets" }}
        next={{ label: "Impact", href: "/impact" }}
      />
      <PosterHero
        eyebrow="Lineage, not a feed"
        title={
          <>
            Influence <span className="text-danfo">graph</span>
          </>
        }
        intro="Two compositions, one archive: the YBNL roster timeline (who he signed) beside a compact orbit of mentors, peers, and collaborators. Select a name to read the note and jump into the related era or album."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <InfluenceGraph graph={graph} />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This is editorial curation, not an AI similarity model. The roster is
          always visible — filters only dim or highlight. High-confidence exits
          carry end years; softer alumni tenures are marked without inventing
          dates. Co-signs stay off the roster. For the places the music moved
          through, see the{" "}
          <Link href="/impact" className="ov-link-underline font-semibold text-ink hover:text-oxide">
            Impact map
          </Link>
          .
        </p>
      </section>
    </>
  );
}
