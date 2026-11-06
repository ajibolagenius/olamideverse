import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import SlangGrid from "@/components/SlangGrid";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getSlang } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { resolvePageMetadata } from "@/lib/site";
import { BookOpen, SealCheck } from "@phosphor-icons/react/ssr";

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
  "Authentic Yoruba orthography with underdots",
  "Every coinage linked to its carrier record",
  "Hand-painted Danfo bus route signboards",
  "Meanings and cultural context, not mere lyrics",
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
        kickerRight={`${terms.length} verified terms · ${terms[0]?.year ?? 2010} — ${
          terms[terms.length - 1]?.year ?? 2026
        }`}
        eyebrow="Street Lingo"
        title={
          <>
            The words that <span className="text-danfo">travelled</span>
          </>
        }
        intro="Yoruba phrases and Mainland coinages that left Bariga as street slang and returned as everyday Nigerian speech. Each entry documents its literal translation, street meaning, and the seminal record that carried it."
      />

      {/* Cultural Lexicon Folio Bar */}
      <section className="border-y-2 border-ink bg-white py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-[0.72rem] font-mono sm:px-8">
          <div className="flex items-center gap-2">
            <BookOpen weight={OV_ICON_WEIGHT} className="h-4 w-4 text-danfo" />
            <span className="bg-ink px-1.5 py-0.5 font-bold uppercase text-paper">
              LEXICON REGISTER
            </span>
            <span className="font-semibold text-ink-soft hidden md:inline">
              ORTHOGRAPHY: TONAL TONES & UNDERDOTS (Ọ, Ẹ, Ṣ) PRESERVED
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <SealCheck weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
            <span className="font-bold uppercase tracking-wider">
              {terms.length} VERIFIED STREET HOP TERMS
            </span>
          </div>
        </div>
      </section>

      <Ticker items={TICKER} />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <SlangGrid terms={terms} eras={eras} />
      </section>
    </>
  );
}
