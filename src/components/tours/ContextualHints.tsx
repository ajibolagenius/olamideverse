"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hints, type Hints } from "driver.js/hints";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import {
  startCatalogueGuide,
  startCrateDiggingTour,
  startInfluenceGuide,
  startSlangGuide,
  startSnippetsGuide,
  startTransitGuide,
} from "@/lib/tours";
import { Lightbulb, Sparkle, X } from "@phosphor-icons/react";

interface PageHintConfig {
  pathPrefix: string;
  targetSelector: string;
  badgeLabel: string;
  hintTitle: string;
  hintDescription: string;
  launchGuide: () => void;
}

const PAGE_HINTS: PageHintConfig[] = [
  {
    pathPrefix: "/albums",
    targetSelector: "#ov-crate-switcher",
    badgeLabel: "Field Note · Vinyl Crate",
    hintTitle: "Vinyl Crate Digging",
    hintDescription:
      "Toggle between Editorial Cards and the tactile Vinyl Crate rack to flip through physical record spines with catalog numbers and era color tabs.",
    launchGuide: startCrateDiggingTour,
  },
  {
    pathPrefix: "/songs",
    targetSelector: "#ov-dossier-switcher",
    badgeLabel: "Field Note · Manila Dossiers",
    hintTitle: "Catalogue View Mode",
    hintDescription:
      "Toggle between Manila Dossier Folders with physical tape tabs and the high-density Ledger Table. Each song reflects confidence tiers: Verified, Documented, or Lore.",
    launchGuide: startCatalogueGuide,
  },
  {
    pathPrefix: "/impact",
    targetSelector: "#ov-transit-switcher",
    badgeLabel: "Field Note · Danfo Transit",
    hintTitle: "Danfo Route Perspective",
    hintDescription:
      "Switch between the authentic Lagos Danfo & BRT transit corridor schematic and the Leaflet world map to trace Olamide's geographic trajectory from Bariga to international stages.",
    launchGuide: startTransitGuide,
  },
  {
    pathPrefix: "/influence",
    targetSelector: "#ov-influence-switcher",
    badgeLabel: "Field Note · Lineage Matrix",
    hintTitle: "Lineage Graph Perspective",
    hintDescription:
      "Toggle between the Blueprint engineering schematic and the Orbit gravitational system to explore YBNL mentorship and creative lineage across 16 years.",
    launchGuide: startInfluenceGuide,
  },
  {
    pathPrefix: "/slang",
    targetSelector: "#ov-slang-switcher",
    badgeLabel: "Field Note · Yoruba Orthography",
    hintTitle: "Street Lingo Signboards",
    hintDescription:
      "Switch between hand-painted Lagos Danfo bus signboards and the dictionary ledger. Notice the authentic Yoruba tonal underdots (Ọ, Ẹ, Ṣ) preserved on every street coinage.",
    launchGuide: startSlangGuide,
  },
  {
    pathPrefix: "/snippets",
    targetSelector: "#ov-snippets-switcher",
    badgeLabel: "Field Note · Cassette J-Cards",
    hintTitle: "Cassette Broadcast Deck",
    hintDescription:
      "Switch between vintage 15 IPS cassette tape J-card inlays and high-contrast broadcast soundcards. Each snippet includes an audio deck and shareable audiogram card.",
    launchGuide: startSnippetsGuide,
  },
];

export default function ContextualHints() {
  const pathname = usePathname();
  const [dismissedPages, setDismissedPages] = useState<string[]>([]);

  // Derive active hint directly during render
  const activeHint = PAGE_HINTS.find((h) => pathname.startsWith(h.pathPrefix)) ?? null;

  useEffect(() => {
    if (!activeHint) return;

    let hintsInstance: Hints | null = null;
    let timerId: NodeJS.Timeout | null = null;

    // Wait briefly for client DOM to mount the switcher elements
    timerId = setTimeout(() => {
      const el = document.querySelector(activeHint.targetSelector);
      if (!el) return;

      try {
        hintsInstance = hints({
          popoverClass: "ov-driver-popover",
          hints: [
            {
              element: activeHint.targetSelector,
              id: activeHint.pathPrefix,
              popover: {
                title: activeHint.hintTitle,
                description: activeHint.hintDescription,
                side: "bottom",
                align: "center",
                showButton: true,
                buttonText: "Launch Section Guide →",
                onButtonClick: () => {
                  hintsInstance?.close();
                  activeHint.launchGuide();
                },
              },
            },
          ],
        });

        hintsInstance.show();
      } catch {
        // Fallback gracefully if DOM is transient
      }
    }, 400);

    return () => {
      if (timerId) clearTimeout(timerId);
      if (hintsInstance) {
        try {
          hintsInstance.hide();
        } catch {
          // Ignore
        }
      }
    };
  }, [activeHint]);

  if (!activeHint || dismissedPages.includes(activeHint.pathPrefix)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedPages((prev) => [...prev, activeHint.pathPrefix]);
  };

  return (
    <div className="fixed bottom-20 left-5 z-30 hidden sm:flex items-center gap-1.5 border-2 border-ink bg-white p-1 shadow-paste-sm animate-fade-in">
      <button
        type="button"
        onClick={activeHint.launchGuide}
        className="flex items-center gap-1.5 bg-danfo px-2.5 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink transition-transform hover:bg-danfo-tint active:translate-y-0"
        aria-label={`Open ${activeHint.badgeLabel}`}
      >
        <Lightbulb weight={OV_ICON_WEIGHT} className="h-3.5 w-3.5 text-oxide" />
        <span>{activeHint.badgeLabel}</span>
        <Sparkle weight="bold" className="h-3 w-3 text-ink/70" />
      </button>

      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 text-ink-soft hover:text-ink hover:bg-paper-dim"
        aria-label="Dismiss field note pill"
      >
        <X weight="bold" className="h-3 w-3" />
      </button>
    </div>
  );
}
