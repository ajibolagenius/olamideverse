"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavLink } from "@/lib/settings";

export default function SiteHeader({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation so a stale open panel never lingers.
  // Adjusted during render (not an effect) per React's guidance for state
  // that depends on a prop change: https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b-[6px] border-ink bg-paper">
      <div className="flex items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="font-display text-2xl leading-none sm:text-[1.7rem]">
          Olamide
          <span className="bg-danfo px-[0.12em]">Verse</span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Main">
          {links.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-[3px] pb-0.5 text-[0.9rem] font-semibold tracking-[0.07em] uppercase transition-colors ${
                  active ? "border-ink" : "border-transparent hover:border-danfo"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 flex-shrink-0 place-items-center border-[3px] border-ink bg-paper sm:hidden"
        >
          <span className="relative block h-3 w-5" aria-hidden>
            <span
              className={`absolute inset-x-0 top-0 h-[3px] bg-ink transition-transform ${
                menuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-[3px] bg-ink transition-transform ${
                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="flex flex-col border-t-[3px] border-ink bg-paper px-5 py-2 sm:hidden"
        >
          {links.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 border-paper-dim py-3 text-sm font-semibold tracking-[0.07em] uppercase last:border-b-0 ${
                  active ? "text-oxide" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
