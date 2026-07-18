"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/eras", label: "Eras" },
  { href: "/albums", label: "Discography" },
  { href: "/media", label: "Media" },
  { href: "/about", label: "About" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b-[6px] border-ink bg-paper px-5 py-3.5 sm:px-8">
      <Link href="/" className="font-display text-2xl leading-none sm:text-[1.7rem]">
        Olamide
        <span className="bg-danfo px-[0.12em]">Verse</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`border-b-[3px] pb-0.5 text-[0.78rem] font-semibold tracking-[0.07em] uppercase transition-colors sm:text-[0.9rem] ${
                active ? "border-ink" : "border-transparent hover:border-danfo"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
