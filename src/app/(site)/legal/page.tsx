import type { Metadata } from "next";
import { getGeneralSettings } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Legal",
    description:
      "Disclaimer, copyright posture and takedown contact for OlamideVerse, a non-affiliated fan archive.",
    path: "/legal",
  });
}

export default async function LegalPage() {
  const { takedownEmail } = await getGeneralSettings();

  return (
    <>
      <div className="border-b-[6px] border-danfo bg-ink px-5 sm:px-8">
        <div className="mx-auto max-w-3xl py-11">
          <h1 className="font-display text-4xl text-paper sm:text-5xl">
            Legal &amp; Disclaimer
          </h1>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="ov-paste-up mb-10 border-[3px] border-ink bg-danfo-tint p-6 shadow-paste-sm">
          <h2 className="font-display mb-2.5 text-2xl">Not affiliated</h2>
          <p className="text-base leading-relaxed">
            OlamideVerse is an independent, non-commercial fan project. It is{" "}
            <b>not affiliated with, endorsed by, or sponsored by</b> Olamide
            (Olamidé Gbenga Adedeji), YBNL Nation, or any of their
            representatives, labels or distributors.
          </p>
        </div>

        <h2 className="font-display mb-3 text-2xl">Purpose</h2>
        <p className="mb-8 text-lg leading-relaxed">
          This site is built for archival and educational purposes — to
          document and provide cultural context for a musical career, in the
          spirit of a fan-made reference work. It is not operated for
          commercial gain.
        </p>

        <h2 className="font-display mb-3 text-2xl">Music &amp; video</h2>
        <p className="mb-8 text-lg leading-relaxed">
          No audio or video is hosted on this site. Every track and clip
          appears as an embed from its official third-party source (Spotify,
          YouTube, Audiomack, or similar), styled to sit inside this site&apos;s
          visual identity. Removing a rights holder&apos;s embed or link from its
          original platform will remove it here too.
        </p>

        <h2 className="font-display mb-3 text-2xl">Lyrics</h2>
        <p className="mb-8 text-lg leading-relaxed">
          This site does not reproduce full song lyrics. Where lyrics are
          referenced, it is limited to brief commentary on specific lines
          for critical or historical context.
        </p>

        <h2 className="font-display mb-3 text-2xl">Images</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Era and home photography are drawn from Wikimedia Commons under
          their stated Creative Commons licenses, with credit retained in the
          media registry.
        </p>
        <p className="mb-8 text-lg leading-relaxed">
          Album covers are sourced from Deezer album pages listed in the
          project&apos;s media registry (<code>content/media/manifest.json</code>{" "}
          <b>sourceUrl</b> fields) and stored locally for archival
          identification of each release. Cover art remains copyright of the
          respective rights holders. They are used solely to identify records in
          this non-commercial fan archive and will be replaced or removed on
          request — see Takedown below. They are not presented as owned or
          licensed merch assets.
        </p>

        <h2 className="font-display mb-3 text-2xl">Sources</h2>
        <p className="mb-8 text-lg leading-relaxed">
          Biographical and discographical facts are drawn from and
          cross-checked against public sources, including Wikipedia, music
          press coverage, and the artist&apos;s own public interviews.
          Corrections are welcome — see the contact below.
        </p>

        <h2 id="takedown" className="font-display mb-3 scroll-mt-24 text-2xl">
          Takedown requests
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          If you are Olamide, YBNL Nation, or an authorized representative
          and want content corrected, credited, or removed, this project
          will comply promptly with any reasonable request.
        </p>
        <div className="inline-block border-[3px] border-ink bg-white px-6 py-5 shadow-paste-sm">
          <span className="mb-1 block text-[0.85rem] font-bold tracking-[0.06em] uppercase">
            Contact
          </span>
          {takedownEmail ? (
            <a
              href={`mailto:${takedownEmail}`}
              className="text-adire underline hover:text-oxide"
            >
              {takedownEmail}
            </a>
          ) : (
            <span className="text-ink-soft">
              Set <code className="text-ink">TAKEDOWN_EMAIL</code> in the
              environment, or{" "}
              <code className="text-ink">general.takedownEmail</code> in Admin
              → Settings.
            </span>
          )}
        </div>
      </section>
    </>
  );
}
