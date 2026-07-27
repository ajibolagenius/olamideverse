"use client";

import {
  CaretDown,
  CaretUp,
  List,
  MagnifyingGlass,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { OV_ICON_WEIGHT, renderNavIcon } from "@/lib/icons";
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
        className={`ov-btn ov-btn-danfo ov-icon-inline px-3 py-1.5 text-[0.8rem] ${
          active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
        }`}
      >
        <UsersThree className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`ov-icon-inline border-b-3 pb-0.5 text-[0.9rem] font-semibold tracking-[0.07em] uppercase transition-colors ${
        active ? "border-ink" : "border-transparent hover:border-danfo"
      }`}
    >
      {renderNavIcon(href, { className: "ov-icon", size: 16 })}
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
      className="absolute top-full right-0 z-30 mt-2 min-w-[16rem] border-3 border-ink bg-paper p-4 shadow-paste"
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
                      className={`ov-icon-inline border-l-3 py-1 pl-2.5 text-sm font-semibold tracking-[0.05em] uppercase transition-colors ${
                        active
                          ? "border-oxide text-oxide"
                          : "border-transparent hover:border-danfo hover:text-ink"
                      }`}
                    >
                      {renderNavIcon(link.href, { className: "ov-icon", size: 15 })}
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
          <ul className="grid gap-0 border-t-3 border-ink">
            {group.links.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <li key={link.href} className="border-b-3 border-ink">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={`ov-icon-inline block bg-paper px-1 py-3.5 font-display text-2xl uppercase tracking-wide ${
                      active ? "text-oxide" : "hover:bg-danfo-tint"
                    }`}
                  >
                    {renderNavIcon(link.href, { className: "ov-icon", size: 22 })}
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
  const [dragging, setDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef(0);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const moreMenuId = useId();
  const drawerTitleId = useId();

  const DRAG_DISMISS_THRESHOLD = 80;

  function onDragStart(e: PointerEvent<HTMLDivElement>) {
    dragStartY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onDragMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragY(Math.max(0, e.clientY - dragStartY.current));
  }

  function onDragEnd() {
    if (!dragging) return;
    setDragging(false);
    setDragY(0);
    if (dragY > DRAG_DISMISS_THRESHOLD) {
      setMenuOpen(false);
    }
  }

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
      className={`sticky top-0 z-40 border-b-6 border-ink transition-[padding,box-shadow,background-color] duration-200 ${
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
              className={`ov-icon-inline border-b-3 pb-0.5 text-[0.9rem] font-semibold tracking-[0.07em] uppercase transition-colors ${
                moreOpen || moreActive
                  ? "border-ink"
                  : "border-transparent hover:border-danfo"
              }`}
            >
              More
              {moreOpen ? (
                <CaretUp className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              ) : (
                <CaretDown className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              )}
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

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="grid size-10 flex-shrink-0 place-items-center border-3 border-ink bg-paper hover:bg-danfo-tint"
          >
            <MagnifyingGlass size={20} weight={OV_ICON_WEIGHT} aria-hidden />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 flex-shrink-0 place-items-center border-3 border-ink bg-paper lg:hidden"
          >
            {menuOpen ? (
              <X size={22} weight={OV_ICON_WEIGHT} aria-hidden />
            ) : (
              <List size={22} weight={OV_ICON_WEIGHT} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className={`fixed inset-0 z-50 bg-ink/50 lg:hidden ${
              dragging ? "" : "transition-opacity duration-300 motion-reduce:transition-none"
            } ${sheetVisible ? "opacity-100" : "opacity-0"}`}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
            className="ov-sheet-in fixed inset-x-0 bottom-0 z-[51] flex max-h-[85vh] flex-col border-t-4 border-ink bg-paper shadow-[0_-8px_0_0_rgba(24,20,16,0.15)] lg:hidden"
            style={dragging ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
          >
            <div
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              className="shrink-0 touch-none"
            >
              <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink/25" aria-hidden />
              <div className="flex items-center justify-between border-b-6 border-ink px-5 py-3.5">
                <p id={drawerTitleId} className="font-display text-2xl uppercase">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="ov-btn ov-btn-ghost ov-icon-inline px-3 py-2 text-xs"
                  aria-label="Close menu"
                >
                  <X className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-ink-soft">
              Primary
            </p>
            <ul className="mb-8 grid gap-0 border-t-3 border-ink">
              {PRIMARY_NAV.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b-3 border-ink">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`ov-icon-inline block px-1 py-3.5 font-display text-3xl uppercase tracking-wide ${
                        active ? "bg-danfo text-ink" : "hover:bg-danfo-tint"
                      }`}
                    >
                      {renderNavIcon(link.href, { className: "ov-icon", size: 26 })}
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
                className="ov-btn ov-btn-danfo ov-icon-inline mt-8 w-full justify-center py-4 text-sm"
              >
                <UsersThree className="ov-icon" size={18} weight={OV_ICON_WEIGHT} aria-hidden />
                {FANZONE_LINK.label}
              </Link>
            ) : null}
          </div>
          <p className="border-t-3 border-ink px-5 py-3 text-[0.7rem] tracking-[0.08em] uppercase text-ink-soft">
            Fan archive · Not affiliated
          </p>
          </div>
        </>
      ) : null}
    </header>
  );
}
