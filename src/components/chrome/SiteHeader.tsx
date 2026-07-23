"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  FANZONE_LINK,
  MORE_GROUPS,
  PRIMARY_NAV,
  isLinkActive,
  isMoreActive,
  type NavGroup,
} from "@/lib/nav";

function NavItem({
  href,
  label,
  pathname,
  cta = false,
}: {
  href: string;
  label: string;
  pathname: string;
  cta?: boolean;
}) {
  const active = isLinkActive(pathname, href);
  if (cta) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`ov-btn ov-btn-danfo px-3 py-1.5 text-[0.8rem] ${
          active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
        }`}
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border-b-[3px] pb-0.5 text-[0.9rem] font-semibold tracking-[0.07em] uppercase transition-colors ${
        active ? "border-ink" : "border-transparent hover:border-danfo"
      }`}
    >
      {label}
    </Link>
  );
}

function MoreMenuPanel({
  pathname,
  groups,
  id,
}: {
  pathname: string;
  groups: NavGroup[];
  id: string;
}) {
  return (
    <div
      id={id}
      role="menu"
      className="absolute top-full right-0 z-30 mt-2 min-w-[16rem] border-[3px] border-ink bg-paper p-4 shadow-paste"
    >
      <div className="grid gap-4">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-ink-soft">
              {group.label}
            </p>
            <ul className="grid gap-1">
              {group.links.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href} role="none">
                    <Link
                      role="menuitem"
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block border-l-[3px] py-1 pl-2.5 text-sm font-semibold tracking-[0.05em] uppercase transition-colors ${
                        active
                          ? "border-oxide text-oxide"
                          : "border-transparent hover:border-danfo hover:text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DrawerGroups({
  pathname,
  groups,
  onNavigate,
}: {
  pathname: string;
  groups: NavGroup[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-ink-soft">
            {group.label}
          </p>
          <ul className="grid gap-0 border-t-[3px] border-ink">
            {group.links.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <li key={link.href} className="border-b-[3px] border-ink">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={`block bg-paper px-1 py-3.5 font-display text-2xl uppercase tracking-wide ${
                      active ? "text-oxide" : "hover:bg-danfo-tint"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function SiteHeader({ showFanZone = false }: { showFanZone?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const moreMenuId = useId();
  const drawerTitleId = useId();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setMoreOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        moreBtnRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [moreOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const moreActive = isMoreActive(pathname);
  const eraMatch = pathname.match(/^\/eras\/([^/]+)/);
  const eraAccent = eraMatch
    ? "color-mix(in srgb, var(--ov-era-accent, var(--color-danfo)) 18%, var(--color-paper))"
    : undefined;

  return (
    <header
      className={`sticky top-0 z-40 border-b-[6px] border-ink transition-[padding,box-shadow,background-color] duration-200 ${
        scrolled ? "ov-header-scrolled bg-paper shadow-[0_4px_0_0_var(--color-ink)]" : "bg-paper"
      }`}
      style={eraAccent ? { backgroundColor: eraAccent } : undefined}
    >
      <div
        className={`flex items-center justify-between px-5 sm:px-8 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <Link href="/" className="font-display text-2xl leading-none sm:text-[1.7rem]">
          Olamide
          <span className="bg-danfo px-[0.12em]">Verse</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}

          <div className="relative" ref={moreRef}>
            <button
              ref={moreBtnRef}
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-controls={moreMenuId}
              onClick={() => setMoreOpen((o) => !o)}
              className={`border-b-[3px] pb-0.5 text-[0.9rem] font-semibold tracking-[0.07em] uppercase transition-colors ${
                moreOpen || moreActive
                  ? "border-ink"
                  : "border-transparent hover:border-danfo"
              }`}
            >
              More
              <span aria-hidden className="ml-1 inline-block text-[0.65em]">
                {moreOpen ? "▴" : "▾"}
              </span>
            </button>
            {moreOpen ? (
              <MoreMenuPanel pathname={pathname} groups={MORE_GROUPS} id={moreMenuId} />
            ) : null}
          </div>

          {showFanZone ? (
            <NavItem
              href={FANZONE_LINK.href}
              label={FANZONE_LINK.label}
              pathname={pathname}
              cta
            />
          ) : null}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 flex-shrink-0 place-items-center border-[3px] border-ink bg-paper lg:hidden"
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
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerTitleId}
          className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
        >
          <div className="flex items-center justify-between border-b-[6px] border-ink px-5 py-3.5">
            <p id={drawerTitleId} className="font-display text-2xl uppercase">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="ov-btn ov-btn-ghost px-3 py-2 text-xs"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-ink-soft">
              Primary
            </p>
            <ul className="mb-8 grid gap-0 border-t-[3px] border-ink">
              {PRIMARY_NAV.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b-[3px] border-ink">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-1 py-3.5 font-display text-3xl uppercase tracking-wide ${
                        active ? "bg-danfo text-ink" : "hover:bg-danfo-tint"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <DrawerGroups
              pathname={pathname}
              groups={MORE_GROUPS}
              onNavigate={() => setMenuOpen(false)}
            />
            {showFanZone ? (
              <Link
                href={FANZONE_LINK.href}
                onClick={() => setMenuOpen(false)}
                className="ov-btn ov-btn-danfo mt-8 block w-full py-4 text-center text-sm"
              >
                {FANZONE_LINK.label}
              </Link>
            ) : null}
          </div>
          <p className="border-t-[3px] border-ink px-5 py-3 text-[0.7rem] tracking-[0.08em] uppercase text-ink-soft">
            Fan archive · Not affiliated
          </p>
        </div>
      ) : null}
    </header>
  );
}
