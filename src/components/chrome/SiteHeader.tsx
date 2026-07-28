"use client";

import {
  CaretDown,
  CaretUp,
  Fire,
  GlobeSimple,
  List,
  MagnifyingGlass,
  SignOut,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
import { OV_ICON_WEIGHT, renderNavIcon } from "@/lib/icons";
import { useFan } from "@/lib/fanzone/useFan";
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
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = isLinkActive(pathname, href);
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
                  <li key={link.href}>
                    <Link
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

/** Desktop Fan Zone CTA — a signed-in fan gets a streak chip + account menu instead of a bare link. */
function FanZoneMenu({ pathname }: { pathname: string }) {
  const { fan, signOut } = useFan();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const active = isLinkActive(pathname, FANZONE_LINK.href);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`ov-btn ov-btn-danfo ov-icon-inline px-3 py-1.5 text-[0.8rem] ${
          active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
        }`}
      >
        {fan ? (
          <Fire
            className="ov-icon"
            size={16}
            weight={fan.currentStreak > 0 ? "fill" : "regular"}
            aria-hidden
          />
        ) : (
          <UsersThree className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
        )}
        {fan ? `@${fan.handle}` : FANZONE_LINK.label}
        {open ? (
          <CaretUp className="ov-icon" size={12} weight={OV_ICON_WEIGHT} aria-hidden />
        ) : (
          <CaretDown className="ov-icon" size={12} weight={OV_ICON_WEIGHT} aria-hidden />
        )}
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute top-full right-0 z-30 mt-2 min-w-[14rem] border-3 border-ink bg-paper p-3 shadow-paste"
        >
          {fan ? (
            <p className="ov-icon-inline mb-2 border-b-2 border-ink pb-2 text-xs text-ink-soft">
              <Fire
                className="ov-icon text-danfo"
                size={14}
                weight={fan.currentStreak > 0 ? "fill" : "regular"}
                aria-hidden
              />
              <b className="text-ink">{fan.currentStreak}</b> day streak
            </p>
          ) : null}
          <ul className="grid gap-1">
            <li>
              <Link
                href="/fanzone"
                onClick={() => setOpen(false)}
                className="ov-icon-inline border-l-3 border-transparent py-1 pl-2.5 text-sm font-semibold tracking-[0.05em] uppercase transition-colors hover:border-danfo hover:text-ink"
              >
                <UsersThree className="ov-icon" size={15} weight={OV_ICON_WEIGHT} aria-hidden />
                Fan Zone
              </Link>
            </li>
            <li>
              <Link
                href={
                  fan?.publicProfile
                    ? `/fanzone/fans/${encodeURIComponent(fan.handle)}`
                    : "/fanzone/fans"
                }
                onClick={() => setOpen(false)}
                className="ov-icon-inline border-l-3 border-transparent py-1 pl-2.5 text-sm font-semibold tracking-[0.05em] uppercase transition-colors hover:border-danfo hover:text-ink"
              >
                <GlobeSimple className="ov-icon" size={15} weight={OV_ICON_WEIGHT} aria-hidden />
                {fan?.publicProfile ? "My public profile" : "Browse fans"}
              </Link>
            </li>
            {fan ? (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="ov-icon-inline w-full border-l-3 border-transparent py-1 pl-2.5 text-left text-sm font-semibold tracking-[0.05em] uppercase transition-colors hover:border-oxide hover:text-oxide"
                >
                  <SignOut className="ov-icon" size={15} weight={OV_ICON_WEIGHT} aria-hidden />
                  Sign out
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Mobile drawer equivalent of FanZoneMenu — a card when signed in, the plain CTA otherwise. */
function MobileFanZoneAction({ onNavigate }: { onNavigate: () => void }) {
  const { fan, signOut } = useFan();

  if (!fan) {
    return (
      <Link
        href={FANZONE_LINK.href}
        onClick={onNavigate}
        className="ov-btn ov-btn-danfo ov-icon-inline mt-8 w-full justify-center py-4 text-sm"
      >
        <UsersThree className="ov-icon" size={18} weight={OV_ICON_WEIGHT} aria-hidden />
        {FANZONE_LINK.label}
      </Link>
    );
  }

  return (
    <div className="mt-8 border-3 border-ink bg-danfo-tint p-4">
      <p className="ov-icon-inline mb-3 text-sm">
        <Fire
          className="ov-icon text-danfo"
          size={18}
          weight={fan.currentStreak > 0 ? "fill" : "regular"}
          aria-hidden
        />
        <b className="font-display text-xl tabular-nums">{fan.currentStreak}</b>
        <span className="text-ink-soft normal-case">day streak · @{fan.handle}</span>
      </p>
      <div className="grid gap-2">
        <Link
          href="/fanzone"
          onClick={onNavigate}
          className="ov-btn ov-btn-danfo ov-icon-inline justify-center py-3 text-sm"
        >
          <UsersThree className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
          Fan Zone
        </Link>
        <Link
          href={
            fan.publicProfile ? `/fanzone/fans/${encodeURIComponent(fan.handle)}` : "/fanzone/fans"
          }
          onClick={onNavigate}
          className="ov-btn ov-btn-ghost ov-icon-inline justify-center py-3 text-sm"
        >
          <GlobeSimple className="ov-icon" size={16} weight={OV_ICON_WEIGHT} aria-hidden />
          {fan.publicProfile ? "My public profile" : "Browse fans"}
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate();
            void signOut();
          }}
          className="ov-icon-inline justify-center py-2 text-xs font-bold tracking-[0.08em] uppercase text-ink-soft hover:text-oxide"
        >
          <SignOut className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          Sign out
        </button>
      </div>
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
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
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
    requestAnimationFrame(() => {
      moreRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });
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
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuToggle = menuBtnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector<HTMLElement>('button[aria-label="Close menu"]')
        ?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      (previouslyFocused ?? menuToggle)?.focus?.();
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
              aria-haspopup="true"
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

          {showFanZone ? <FanZoneMenu pathname={pathname} /> : null}
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
            ref={menuBtnRef}
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
            className="ov-backdrop-in fixed inset-0 z-50 bg-ink/50 lg:hidden"
          />
          <div
            ref={drawerRef}
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
              <MobileFanZoneAction onNavigate={() => setMenuOpen(false)} />
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
