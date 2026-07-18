import type { Metadata } from "next";
import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import PullQuote from "@/components/PullQuote";

export const metadata: Metadata = {
  title: "About",
  description:
    "What OlamideVerse is, who made it, and the rules it lives by. A fan project — not affiliated with Olamide or YBNL Nation.",
};

export default function AboutPage() {
  return (
    <>
      <PosterHero
        eyebrow="Fan project · Archival & educational"
        title="What this is"
        intro="OlamideVerse is a fan-built cultural archive. Not a streaming service, not a news blog — the story, with the music running through it."
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="max-w-[70ch]">
          <p className="mb-5">
            Streaming platforms have the songs. Blogs have the news. Nobody
            has the <strong>story</strong> — the cultural context, the
            era-defining moments, the lineage from Coded Tunes to YBNL to the
            artists Olamide raised. OlamideVerse tells that story as six eras,
            album by album.
          </p>
          <p className="mb-5">
            Three words define the project: <strong>Archive. Editorial.
            Street.</strong> The design language comes from the same streets
            the music does — danfo buses, hand-painted signage, paste-up
            concert posters, adire indigo.
          </p>
        </div>

        <PullQuote accent="adire" cite="House rules">
          Embeds only. No hosted audio, ever.
        </PullQuote>

        <div className="max-w-[70ch]">
          <h2 className="font-display text-display-md mt-12 mb-4">The rules</h2>
          <ul className="mb-5 list-disc pl-6">
            <li className="mb-2">
              <strong>Fan project, clearly labeled.</strong> Not affiliated
              with Olamide or YBNL Nation — the disclaimer stays on every page.
            </li>
            <li className="mb-2">
              <strong>Embeds only.</strong> All audio and video plays via
              Spotify, YouTube or Audiomack embeds from official sources.
            </li>
            <li className="mb-2">
              <strong>Commentary, not reproduction.</strong> Lyrics get
              context and commentary — never full reproduction.
            </li>
            <li className="mb-2">
              <strong>Accessible by default.</strong> Keyboard, screen reader
              and reduced-motion paths for every interaction.
            </li>
          </ul>

          <h2 className="font-display text-display-md mt-12 mb-4">Colophon</h2>
          <p className="mb-5">
            Built with Next.js, Tailwind CSS and GSAP. Type is Anton and
            Archivo — chosen for poster energy and full Yoruba diacritic
            support (Ọ ọ Ẹ ẹ Ṣ ṣ). Content lives as MDX in the open —
            corrections welcome.
          </p>
          <p className="mb-5">
            Questions, credits or takedown requests:{" "}
            <Link href="/legal#takedown" className="font-semibold text-adire underline hover:text-oxide">
              see the legal page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
