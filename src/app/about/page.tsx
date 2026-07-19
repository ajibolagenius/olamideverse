import type { Metadata } from "next";
import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import PullQuote from "@/components/PullQuote";

export const metadata: Metadata = {
  title: "About",
  description:
    "What OlamideVerse is, who made it, and the rules it lives by. A fan project — not affiliated with Olamide or YBNL Nation.",
};

const COLOPHON = [
  {
    heading: "Typography",
    body: "Anton for display, chosen for poster scale and full Yoruba diacritic support. Archivo for text and UI.",
  },
  {
    heading: "Motion",
    body: "One library, GSAP + ScrollTrigger — five named motions: paste-up, ink-reveal, roll-by, pin-scroll, duotone-shift.",
  },
  {
    heading: "Sourcing",
    body: "Career facts and dates cross-checked against public sources — Wikipedia, AllMusic, contemporary music press and the artist's own interviews.",
  },
  {
    heading: "Visual system",
    body: "Afro-street editorial — danfo yellow, adire indigo, paper and ink. Paste-up tilt, hard shadows, thick rules. No glass, no neon, no glitch.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PosterHero
        eyebrow="The masthead"
        title={
          <>
            About the <span className="text-danfo">Archive</span>
          </>
        }
      />

      <section className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          What this is
        </p>
        <h2 className="font-display mb-5 text-4xl">Archive. Editorial. Street.</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Streaming platforms have the songs. Blogs have the news.
          OlamideVerse exists because nobody had put the <b>story</b> in one
          place — the cultural context, the era-defining moments, the lineage
          running from Coded Tunes to YBNL Nation to the artists Olamide
          raised after him.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          This is not a music player with extra pages. It&apos;s a cultural
          archive with the music running through it — every track lives here
          as an embed, never hosted, because the point is context, not
          catalog. It is not a fan forum, and it is not a tech demo: motion
          and interactivity exist to serve the story, never to show off.
        </p>
        <p className="text-lg leading-relaxed">
          The organizing idea is simple: Olamide&apos;s career told as six
          eras, each with its own chapter, mood and soundtrack. Albums belong
          to eras. Media belongs to eras. Every page is one continuous
          fabric, not a pile of siloed sections.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pt-12 sm:px-8">
        <PullQuote
          accent="danfo"
          text="Ship depth, not breadth. One finished era chapter beats ten stubbed features."
          highlight="One finished era chapter beats ten stubbed features."
          cite="The project's own first principle"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 pt-12 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Who made it
        </p>
        <h2 className="font-display mb-5 text-3xl">A fan project, built in the open</h2>
        <p className="mb-4 text-lg leading-relaxed">
          OlamideVerse is an independent, unofficial archive made by a fan of
          the music, not by Olamide or YBNL Nation. There is no affiliation,
          sponsorship or endorsement between this project and the artist, his
          label, or his estate — that stays true on every page, not just this
          one.
        </p>
        <p className="text-lg leading-relaxed text-ink-soft">
          If anything here is inaccurate, out of date, or should be removed
          at the rights holder&apos;s request, see the{" "}
          <Link href="/legal" className="font-semibold text-adire underline hover:text-oxide">
            Legal
          </Link>{" "}
          page for a takedown contact.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Colophon
        </p>
        <div
          className="ov-paste-up grid gap-6 border-[3px] border-ink bg-white p-7 shadow-paste-sm sm:grid-cols-2"
          data-tilt="-0.4"
          style={{ rotate: "-0.4deg" }}
        >
          {COLOPHON.map((c) => (
            <div key={c.heading}>
              <h4 className="mb-2 text-[0.8rem] font-bold tracking-[0.06em] uppercase">
                {c.heading}
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
