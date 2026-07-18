import type { Metadata } from "next";
import PosterHero from "@/components/PosterHero";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Disclaimer, copyright posture and takedown contact for OlamideVerse, a non-affiliated fan archive.",
};

export default function LegalPage() {
  return (
    <>
      <PosterHero
        eyebrow="The fine print"
        title="Legal"
        intro="The disclaimer, the copyright posture, and how to reach us."
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="max-w-[70ch]">
          <h2 className="font-display text-display-md mb-4">Disclaimer</h2>
          <p className="mb-5">
            OlamideVerse is an unofficial fan project created for archival and
            educational purposes. It is{" "}
            <strong>
              not affiliated with, endorsed by, or connected to Olamide, YBNL
              Nation
            </strong>
            , or any associated label, distributor or rights holder. All
            trademarks and names belong to their respective owners.
          </p>

          <h2 className="font-display text-display-md mt-12 mb-4">
            Copyright &amp; content posture
          </h2>
          <ul className="mb-5 list-disc pl-6">
            <li className="mb-2">
              No audio or video is hosted on this site. All playback happens
              through official embeds (Spotify, YouTube, Audiomack) under
              those platforms&apos; terms.
            </li>
            <li className="mb-2">
              Editorial text is original writing. Lyrics are quoted only in
              brief, for commentary and context — never reproduced in full.
            </li>
            <li className="mb-2">
              Cover art and photography appear only as placeholders or with
              credited sources; sourcing is documented as the archive grows.
            </li>
          </ul>

          <h2 id="takedown" className="font-display text-display-md mt-12 mb-4 scroll-mt-24">
            Takedown requests
          </h2>
          <p className="mb-5">
            If you are a rights holder and believe something here oversteps,
            contact the maintainer and it will be reviewed promptly — a
            contact address will be published here at launch.
          </p>
        </div>
      </section>
    </>
  );
}
