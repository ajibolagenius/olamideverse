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
  "Mentors · peers · mentees",
  "Curated, not algorithmic",
  "Every node links back to the archive",
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
        intro="Who shaped him, who he raised, who he traded bars with — a curated map of the people and currents around the career. Select a node to read the note and jump into the related era or album."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <InfluenceGraph graph={graph} />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This is editorial curation, not an AI similarity model. For the places
          the music moved through, see the{" "}
          <Link href="/impact" className="font-semibold text-ink underline hover:text-oxide">
            Impact map
          </Link>
          .
        </p>
      </section>
    </>
  );
}
