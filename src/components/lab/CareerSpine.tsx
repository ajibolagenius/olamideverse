"use client";

import { useEffect, useState } from "react";
import { accentChrome, accentText, type AccentName } from "@/lib/accents";
import type { Era } from "@/lib/content";

interface CareerSpineProps {
  eras: Era[];
}

export default function CareerSpine({ eras }: CareerSpineProps) {
  const [activeSlug, setActiveSlug] = useState<string>(eras[0]?.slug ?? "");

  useEffect(() => {
    // Track active era as user scrolls past sections
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

    return () => observer.disconnect();
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
      {/* Desktop Persistent Vertical Spine Rail */}
      <aside
        className="hidden lg:block fixed left-6 top-32 z-30 w-56 select-none"
        aria-label="Career Eras Timeline Spine"
      >
        <div className="border-2 border-ink bg-white p-3.5 shadow-paste">
          <div className="flex items-center justify-between border-b border-ink/15 pb-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
              CAREER SPINE
            </span>
            <span className="font-mono text-[0.65rem] font-bold text-ink-muted">
              2010 — 2026+
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
                        <span className="font-display tracking-wide uppercase">
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

      {/* Mobile Fixed Bottom Tactile Chapter Rail */}
      <nav
        className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-ink bg-paper/95 px-3 py-2.5 backdrop-blur-sm shadow-paste"
        aria-label="Mobile Career Eras Navigation"
      >
        <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted mb-1 px-1">
          <span>Career Chapter Rail</span>
          <span className="tabular-nums">6 Chapters</span>
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
