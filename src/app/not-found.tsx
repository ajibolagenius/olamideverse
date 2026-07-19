import type { Metadata } from "next";
import Link from "next/link";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import DisclaimerStrip from "@/components/chrome/DisclaimerStrip";
import SiteFooter from "@/components/chrome/SiteFooter";
import SiteHeader from "@/components/chrome/SiteHeader";
import { getDisclaimer, getFooter, getNavigation } from "@/lib/settings";

// Lives at the app root (not inside the `(site)` route group) because
// that's what Next.js actually renders for a fully unmatched URL. It
// doesn't inherit `(site)/layout.tsx`, so the header/nav/disclaimer/footer
// chrome is fetched and rendered here directly instead — the disclaimer
// stays on every page, 404 included (AGENTS.md). This is also the nearest
// not-found.js boundary for notFound() calls thrown inside `(site)/**`
// pages (era/album slug lookups), since that route group has no
// not-found.tsx of its own.

// Next.js auto-injects `<meta name="robots" content="noindex">` for any
// response that resolves to a 404 status, so there's no `robots` field (and
// no real path to declare `canonical` for) here — just title/description.
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page isn't in the archive — it may have moved, or it never existed.",
};

const TICKER = [
  "404 — track not found",
  "skipped, deleted, or never pressed",
  "try the archive instead",
];

const DESTINATIONS = [
  { num: "01", href: "/", label: "Home", note: "Back to the top of the archive" },
  { num: "02", href: "/eras", label: "Eras", note: "Six chapters, one legacy" },
  { num: "03", href: "/albums", label: "Discography", note: "Every album and mixtape" },
  { num: "04", href: "/media", label: "Media", note: "Freestyles, interviews, concerts" },
];

export default async function NotFound() {
  const [disclaimer, nav, footer] = await Promise.all([
    getDisclaimer(),
    getNavigation(),
    getFooter(),
  ]);

  return (
    <>
      <DisclaimerStrip text={disclaimer.text} highlight={disclaimer.highlight} />
      <SiteHeader links={nav} />

      <main className="flex-1">
        <PosterHero
          eyebrow="404 — Off the Record"
          title={
            <>
              This page never made the <span className="text-danfo">tracklist.</span>
            </>
          }
          intro="Whatever you were looking for isn't in the archive — wrong turn, dead link, or it just never got written. Here's what actually made the cut."
        />

        <Ticker items={TICKER} />

        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
            Skip to
          </p>
          <div
            className="ov-paste-up border-[3px] border-ink bg-white shadow-paste"
            data-tilt="-0.5"
            style={{ rotate: "-0.5deg" }}
          >
            <ol>
              {DESTINATIONS.map((d, i) => (
                <li
                  key={d.href}
                  className={i > 0 ? "border-t-2 border-ink" : undefined}
                >
                  <Link
                    href={d.href}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-paper-dim"
                  >
                    <span className="font-display w-8 flex-shrink-0 text-lg text-ink-soft">
                      {d.num}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold">{d.label}</span>
                      <small className="block text-xs tracking-[0.04em] uppercase text-ink-soft">
                        {d.note}
                      </small>
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-3 flex-shrink-0 fill-ink-soft"
                    >
                      <path d="M3 1l11 7-11 7z" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 text-sm text-ink-soft">
            Think this is a broken link on our end? See{" "}
            <Link href="/legal" className="font-semibold text-adire underline hover:text-oxide">
              Legal
            </Link>{" "}
            for a contact.
          </p>
        </section>
      </main>

      <SiteFooter links={footer.links} blurb={footer.blurb} />
    </>
  );
}
