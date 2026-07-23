import type { Metadata } from "next";
import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import SongCatalog from "@/components/SongCatalog";
import Ticker from "@/components/chrome/Ticker";
import { getEras, getSongs } from "@/lib/content";
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
  const [songs, eras] = await Promise.all([getSongs(), getEras()]);
  const catalogCount = songs.filter((s) => s.type !== "album-track").length;
  const albumTrackCount = songs.length - catalogCount;

  return (
    <>
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
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft">
          {songs.length} entries right now ({albumTrackCount} album tracks ·{" "}
          {catalogCount} researched). Status badges mark confidence:{" "}
          <b className="text-ink">Verified</b> has a working embed,{" "}
          <b className="text-ink">Documented</b> has a cited release,{" "}
          <b className="text-ink">Lore</b> is fan-memory / soft evidence. Album
          cuts stay linked to the{" "}
          <Link
            href="/albums"
            className="font-semibold text-ink underline decoration-2 underline-offset-2 hover:text-oxide"
          >
            Discography
          </Link>
          .
        </p>
        <SongCatalog songs={songs} eras={eras} />
      </section>
    </>
  );
}
