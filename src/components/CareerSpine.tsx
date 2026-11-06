"use client";

import { useEffect, useState } from "react";
import { accentChrome, accentText, type AccentName } from "@/lib/accents";
import type { Era } from "@/lib/content";

interface CareerSpineProps {
  eras: Era[];
}

export default function CareerSpine({ eras }: CareerSpineProps) {
  const [activeSlug, setActiveSlug] = useState<string>(eras[0]?.slug ?? "");
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal the spine only after scrolling past the hero headline
      setIsScrolledPastHero(window.scrollY > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eraSlug = entry.target.id.replace("era-", "");
            if (eraSlug) setActiveSlug(eraSlug);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    );

    eras.forEach((era) => {
      const el = document.getElementById(`era-${era.slug}`);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [eras]);

  const scrollToEra = (slug: string) => {
    setActiveSlug(slug);
    const target = document.getElementById(`era-${slug}`);
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* Desktop Persistent Vertical Spine Rail (Hidden while hero is in view to prevent overlap) */}
      <aside
        className={`hidden xl:block fixed left-4 2xl:left-8 top-36 z-20 w-52 select-none transition-all duration-300 ${
          isScrolledPastHero
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-6 pointer-events-none"
        }`}
        aria-label="Career Eras Timeline"
      >
        <div className="border-2 border-ink bg-white p-3.5 shadow-paste">
          <div className="flex items-center justify-between border-b border-ink/15 pb-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
              CAREER TIMELINE
            </span>
            <span className="font-mono text-[0.65rem] font-bold text-ink-muted">
              2010 — PRESENT
            </span>
          </div>

          <nav className="mt-3 relative pl-4">
            {/* Continuous vertical connecting ink line */}
            <div
              className="absolute left-[7px] top-2 bottom-3 w-0.5 bg-ink/20"
              aria-hidden="true"
            />

            <ol className="space-y-3.5">
              {eras.map((era) => {
                const isActive = activeSlug === era.slug;
                const chrome = accentChrome(era.accent as AccentName);
                const textColor = accentText(era.accent as AccentName);

                return (
                  <li key={era.slug} className="relative">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[13px] top-1.5 h-3 w-3 border-2 border-ink transition-all ${
                        isActive
                          ? "scale-125 shadow-paste-sm"
                          : "bg-white group-hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: isActive ? chrome.bg : "#FFFFFF",
                      }}
                      aria-hidden="true"
                    />

                    <button
                      type="button"
                      onClick={() => scrollToEra(era.slug)}
                      aria-current={isActive ? "step" : undefined}
                      className={`group w-full text-left pl-2.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ink ${
                        isActive ? "font-bold text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-display tracking-wide uppercase truncate">
                          {String(era.order).padStart(2, "0")} · {era.title}
                        </span>
                      </div>
                      <div
                        className="text-[0.68rem] tabular-nums font-semibold mt-0.5"
                        style={{ color: isActive ? textColor : undefined }}
                      >
                        {era.years}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Tactile Chapter Rail (Appears as user scrolls into chapters) */}
      <nav
        className={`block xl:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-ink bg-paper/95 px-3 py-2.5 backdrop-blur-sm shadow-paste transition-all duration-300 ${
          isScrolledPastHero
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        aria-label="Mobile Career Eras Navigation"
      >
        <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted mb-1 px-1">
          <span>Chapter Wayfinding</span>
          <span className="tabular-nums font-mono">6 Chapters</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {eras.map((era) => {
            const isActive = activeSlug === era.slug;
            const chrome = accentChrome(era.accent as AccentName);

            return (
              <button
                key={era.slug}
                type="button"
                onClick={() => scrollToEra(era.slug)}
                aria-current={isActive ? "step" : undefined}
                className={`flex min-h-[44px] shrink-0 items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 ${
                  isActive
                    ? "shadow-paste-sm"
                    : "bg-white text-ink-soft hover:text-ink"
                }`}
                style={{
                  backgroundColor: isActive ? chrome.bg : undefined,
                  color: isActive ? chrome.fg : undefined,
                }}
              >
                <span className="font-display">{String(era.order).padStart(2, "0")}</span>
                <span className="whitespace-nowrap">{era.title}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
