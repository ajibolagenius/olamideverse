import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import SlangGrid from "@/components/SlangGrid";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getSlang } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Street Lingo",
    description:
      "The Yoruba and Lagos street terms Olamide put into national circulation — what each one means, and the record that carried it.",
    path: "/slang",
  });
}

const TICKER = [
  "Bariga vocabulary, national reach",
  "Every term linked to its record",
  "Meanings, not lyrics",
];

export default async function SlangPage() {
  const [terms, eras] = await Promise.all([getSlang(), getEras()]);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Street Lingo" }]}
        next={{ label: "Snippets", href: "/snippets" }}
      />
      <PosterHero
        kickerLeft="OlamideVerse — Cultural Lexicon"
        kickerRight={`${terms.length} terms · ${terms[0]?.year ?? ""} — ${
          terms[terms.length - 1]?.year ?? ""
        }`}
        eyebrow="Street Lingo"
        title={
          <>
            The words that <span className="text-danfo">travelled</span>
          </>
        }
        intro="Yoruba phrases and Mainland coinages that left Bariga as slang and came back as everyday Nigerian speech. Each entry says what it means and points at the record that carried it."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <SlangGrid terms={terms} eras={eras} />
      </section>
    </>
  );
}
