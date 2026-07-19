import Link from "next/link";
import type { NavLink } from "@/lib/settings";

export default function SiteFooter({
  links,
  blurb,
}: {
  links: NavLink[];
  blurb: string;
}) {
  return (
    <footer className="bg-ink px-5 pt-10 pb-8 text-[0.8rem] text-ink-muted sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 pb-6">
        <span className="font-display text-xl text-paper">
          Olamide<span className="bg-danfo px-[0.12em] text-ink">Verse</span>
        </span>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 font-semibold tracking-[0.05em] uppercase"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-danfo">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl border-t border-[#3A332B] pt-4 text-center tracking-[0.04em] uppercase">
        {blurb}
      </div>
    </footer>
  );
}
