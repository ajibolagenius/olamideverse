import type { Metadata } from "next";
import AudiogramCard from "@/components/AudiogramCard";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getSnippets } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Snippets",
    description:
      "Shareable audiogram-style cards from the archive — key bars and era notes, with embeds for listening. No audio is hosted here.",
    path: "/snippets",
  });
}

const TICKER = [
  "Visual cards · embed players",
  "Share the story, not a rip",
  "No hosted audio — ever",
];

export default async function SnippetsPage() {
  const [snippets, eras] = await Promise.all([getSnippets(), getEras()]);
  const accentByEra = new Map(eras.map((e) => [e.slug, e.accent]));

  return (
    <>
      <Breadcrumb
        items={[{ label: "Snippets" }]}
        next={{ label: "Influence", href: "/influence" }}
      />
      <PosterHero
        eyebrow="Share a snippet"
        title={
          <>
            Audiogram <span className="text-danfo">cards</span>
          </>
        }
        intro="Editorial share cards for the bars and moments that define eras — decorative waveforms, real context, and a link back to the embed. Nothing is ripped or hosted."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {snippets.map((snippet) => (
            <AudiogramCard
              key={snippet.id}
              snippet={snippet}
              accent={accentByEra.get(snippet.era) ?? "danfo"}
            />
          ))}
        </div>
      </section>
    </>
  );
}
