import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import Ticker from "@/components/chrome/Ticker";
import Pagination from "@/components/ui/Pagination";
import SectionLabel from "@/components/ui/SectionLabel";
import { CHANGELOG } from "@/lib/changelog";
import { resolvePageMetadata } from "@/lib/site";

const PAGE_SIZE = 3;

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "What’s new",
    description:
      "Recent updates to OlamideVerse — analytics, Fan Zone, catalogue embeds, and archive chrome.",
    path: "/changelog",
  });
}

const TICKER = [
  "Ship notes · not a commit dump",
  "Archive first · Fan Zone behind flags",
  "Curated from the last few days of work",
];

export default async function ChangelogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalPages = Math.max(1, Math.ceil(CHANGELOG.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const days = CHANGELOG.slice(start, start + PAGE_SIZE);

  return (
    <>
      <Breadcrumb
        items={[{ label: "What’s new" }]}
        previous={{ label: "About", href: "/about" }}
        next={{ label: "Legal", href: "/legal" }}
      />
      <PosterHero
        eyebrow="Ship notes"
        title={
          <>
            What&apos;s <span className="text-danfo">new</span>
          </>
        }
        intro="A short public log of what landed on the archive recently — grouped by day, written for readers, drawn from the git trail."
      />
      <Ticker items={TICKER} />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <SectionLabel>Recent days</SectionLabel>

        <ol className="mt-8 space-y-14">
          {days.map((day) => (
            <li key={day.date}>
              <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b-3 border-ink pb-3">
                <h2 className="font-display text-3xl uppercase tracking-wide">
                  {day.label}
                </h2>
                <time
                  dateTime={day.date}
                  className="font-mono text-xs tracking-[0.08em] text-ink-soft uppercase"
                >
                  {day.date}
                </time>
              </header>

              <ul className="space-y-5">
                {day.items.map((item) => (
                  <li
                    key={item.title}
                    className="ov-paste-up border-3 border-ink bg-white p-5 shadow-paste-sm"
                    data-tilt="-0.4"
                    style={{ rotate: "-0.4deg" }}
                  >
                    <h3 className="font-display text-xl leading-tight uppercase">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="ov-link-underline hover:text-oxide"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <Pagination page={page} totalPages={totalPages} basePath="/changelog" />

        <p className="mt-14 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This page is editorial, not exhaustive — internal refactors and
          tooling commits are folded into the notes that matter for visitors.
          For affiliation and takedown rules, see{" "}
          <Link
            href="/legal"
            className="ov-link-underline font-semibold text-ink hover:text-oxide"
          >
            Legal
          </Link>
          .
        </p>
      </section>
    </>
  );
}
