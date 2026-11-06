import type { Metadata } from "next";
import PosterHero from "@/components/PosterHero";
import SongCatalog from "@/components/SongCatalog";
import Ticker from "@/components/chrome/Ticker";
import { dedupeSongs, getEras, getSongs } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Songs",
    description:
      "A living catalogue of Olamide songs — album tracks, singles, features, freestyles, lives and snippets from 2010 to today. Titles and credits, embeds only, no lyrics dump.",
    path: "/songs",
  });
}

const TICKER = [
  "2010 — today",
  "Album tracks · singles · features · freestyles · lives · snippets",
  "Verified · Documented · Lore",
  "Titles & credits — no full lyrics",
  "Embeds only — nothing hosted",
];

export default async function SongsPage() {
  const [allSongs, eras] = await Promise.all([
    getSongs(),
    getEras(),
  ]);
  // One row per record — an album cut absorbs its single/feature/snippet twins.
  const songs = dedupeSongs(allSongs);
  const catalogCount = songs.filter((s) => s.type !== "album-track").length;
  const albumTrackCount = songs.length - catalogCount;

  return (
    <>
      {/* Archival Folio Strip */}
      <div className="border-b-2 border-ink bg-paper px-5 py-2 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          <div className="flex items-center gap-3">
            <span className="border border-ink bg-danfo px-1.5 py-0.5 text-ink shadow-print">
              CATALOGUE DOSSIER
            </span>
            <span>BARIGA → YBNL NATION RESEARCHED DATABASE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>2010 — PRESENT</span>
            <span className="hidden sm:inline-block">EMBEDS ONLY · NO HOSTED AUDIO</span>
          </div>
        </div>
      </div>

      <PosterHero
        eyebrow="Living catalogue"
        title={
          <>
            The <span className="text-danfo">Songs</span>
          </>
        }
        intro="Every documented cut we can stand behind — album tracks flattened from the discography, plus singles, features, freestyles, lives and snippets researched from 2010 to today. Titles, years and credits. No lyrics dump. Not a claim of absolute completeness."
      />
      <Ticker items={TICKER} />
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8 border-3 border-ink bg-white p-5 shadow-paste-sm">
          <div className="mb-2 flex items-center justify-between border-b border-ink/20 pb-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink-muted">
            <span>RESEARCH SPECIFICATION & CONFIDENCE TIERS</span>
            <span>{songs.length} TOTAL ENTRIES ({albumTrackCount} ALBUM · {catalogCount} RESEARCHED)</span>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
            Each record appears once — where a cut reached us as both an album track and a single or snippet, the album row carries it. Status badges mark archival confidence:
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="border border-ink bg-danfo px-1.5 py-0.2 font-bold text-ink shadow-print">
                VERIFIED
              </span>
              <span className="text-ink-soft">Working third-party embed available</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border border-ink bg-white px-1.5 py-0.2 font-bold text-ink shadow-print">
                DOCUMENTED
              </span>
              <span className="text-ink-soft">Cited release with verified publication source</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border border-ink/30 bg-paper-dim px-1.5 py-0.2 font-bold text-ink-soft">
                LORE
              </span>
              <span className="text-ink-soft">Fan-memory / soft cultural evidence</span>
            </span>
          </div>
        </div>
        <SongCatalog songs={songs} eras={eras} />
      </section>
    </>
  );
}
