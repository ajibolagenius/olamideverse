import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import SnippetGrid from "@/components/SnippetGrid";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getSnippets } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { resolvePageMetadata } from "@/lib/site";
import { CassetteTape, SealCheck } from "@phosphor-icons/react/ssr";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Snippets",
    description:
      "Shareable audiogram-style cards and cassette J-cards from the archive — key bars and era notes, with embeds for listening. No audio is hosted here.",
    path: "/snippets",
  });
}

const TICKER = [
  "17 master broadcast drops",
  "Physical J-card cassette tape inlays",
  "Shareable story soundcards with live equalizers",
  "Zero hosted audio — streaming embeds only",
  "Lagos street vernacular and seminal lyric quotes",
];

export default async function SnippetsPage() {
  const [snippets, eras] = await Promise.all([getSnippets(), getEras()]);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Snippets" }]}
        next={{ label: "Influence", href: "/influence" }}
      />
      <PosterHero
        kickerLeft="OlamideVerse — Broadcast Studio"
        kickerRight={`${snippets.length} tape drops · ${snippets[0]?.year ?? 2010} — ${
          snippets[snippets.length - 1]?.year ?? 2025
        }`}
        eyebrow="Voice-Notes & Soundcards"
        title={
          <>
            The bars that <span className="text-danfo">stuck</span>
          </>
        }
        intro="Seminal bars, acoustic cuts, and defining lyrical dispatches from Bariga to global arenas. Formatted as physical J-card cassette tape sleeves and shareable broadcast soundcards — with third-party streaming embeds for listening."
      />

      {/* Broadcast Vault Folio Bar */}
      <section className="border-y-2 border-ink bg-white py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-[0.72rem] font-mono sm:px-8">
          <div className="flex items-center gap-2">
            <CassetteTape weight={OV_ICON_WEIGHT} className="h-4 w-4 text-danfo" />
            <span className="bg-ink px-1.5 py-0.5 font-bold uppercase text-paper">
              VAULT REF: SNP-YBNL-01
            </span>
            <span className="font-semibold text-ink-soft hidden md:inline">
              FORMAT: PHYSICAL CASSETTE J-CARDS & BROADCAST AUDIOGRAMS
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <SealCheck weight={OV_ICON_WEIGHT} className="h-4 w-4 text-oxide" />
            <span className="font-bold uppercase tracking-wider">
              {snippets.length} VERIFIED VOICE-NOTES · ZERO HOSTED AUDIO
            </span>
          </div>
        </div>
      </section>

      <Ticker items={TICKER} />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <SnippetGrid snippets={snippets} eras={eras} />
      </section>
    </>
  );
}
