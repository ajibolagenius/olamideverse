import Link from "next/link";
import { buildFooterColumns } from "@/lib/nav";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-ink-muted">
        {title}
      </p>
      <ul className="grid gap-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="font-semibold tracking-[0.05em] uppercase text-paper transition-colors hover:text-danfo"
            >
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
    <footer className="bg-ink px-5 pt-12 pb-8 text-[0.8rem] text-ink-muted sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 border-b border-[#3A332B] pb-10 sm:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="font-display text-2xl text-paper">
            Olamide<span className="bg-danfo px-[0.12em] text-ink">Verse</span>
          </Link>
          <p className="mt-4 max-w-[28ch] text-[0.85rem] leading-relaxed tracking-normal text-ink-muted normal-case">
            A fan-made editorial archive of Olamide&apos;s career — eras, albums,
            and the culture around them.
          </p>
        </div>
        <FooterColumn title="Archive" links={columns.archive} />
        <FooterColumn title="Explore" links={columns.explore} />
        <FooterColumn title="Meta" links={columns.meta} />
      </div>
      <div className="mx-auto max-w-6xl pt-5 text-center tracking-[0.04em] uppercase">
        {blurb}
      </div>
    </footer>
  );
}
