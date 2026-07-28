import Link from "next/link";
import VisitorBadge from "@/components/analytics/VisitorBadge";
import Ticker from "@/components/chrome/Ticker";
import AdirePattern from "@/components/ui/AdirePattern";
import { renderNavIcon } from "@/lib/icons";
import { buildFooterColumns } from "@/lib/nav";

const FOOTER_TICKER = [
  "Bariga to the world",
  "Six eras · one legacy",
  "Embeds only — no hosted audio",
  "Fan archive · not affiliated",
  "Street-hop · editorial · Lagos",
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-display mb-4 text-sm tracking-[0.08em] uppercase text-ink-muted">
        {title}
      </p>
      <ul className="grid gap-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="ov-icon-inline text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-paper transition-colors hover:text-danfo"
            >
              {renderNavIcon(link.href, { className: "ov-icon", size: 14 })}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter({
  blurb,
  showFanZone = false,
}: {
  blurb: string;
  showFanZone?: boolean;
}) {
  const columns = buildFooterColumns({ showFanZone });

  return (
    <footer className="grain relative border-t-6 border-danfo bg-ink text-ink-muted">
      <AdirePattern opacity={0.05} />
      <Ticker
        items={FOOTER_TICKER}
        className="border-b-3 border-ink bg-danfo text-ink"
      />

      <div className="mx-auto max-w-6xl px-5 pt-12 pb-10 sm:px-8">
        <div className="grid gap-12 border-b-3 border-[#3A332B] pb-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-display block text-[clamp(2.5rem,6vw,4rem)] leading-[0.9] text-paper"
            >
              Olamide
              <span className="bg-danfo px-[0.12em] text-ink">Verse</span>
            </Link>
            <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed tracking-normal text-ink-muted normal-case">
              A fan-made editorial archive of Olamide&apos;s career — eras, albums,
              and the culture around them.
            </p>
            <p className="ov-stamp mt-6 text-danfo">Fan archive · Not affiliated</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            <FooterColumn title="Archive" links={columns.archive} />
            <FooterColumn title="Explore" links={columns.explore} />
            <FooterColumn title="Meta" links={columns.meta} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 pt-6 sm:flex-row sm:justify-between sm:gap-8">
          <p className="max-w-xl text-center text-[0.72rem] tracking-[0.06em] uppercase sm:text-left">
            {blurb}
          </p>
          <VisitorBadge />
        </div>
      </div>
    </footer>
  );
}
