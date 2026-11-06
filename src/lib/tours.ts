import { driver, type Config, type DriveStep } from "driver.js";

const TOUR_STORAGE_PREFIX = "ov-tour-progress-";

/**
 * Saves the active step of a tour so the reader can resume where they left off.
 */
export function saveTourProgress(
  tourId: string,
  stepIndex: number,
  totalSteps: number,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${TOUR_STORAGE_PREFIX}${tourId}`,
      JSON.stringify({ step: stepIndex, total: totalSteps, updatedAt: Date.now() }),
    );
  } catch {
    // Ignore storage errors in private browsing
  }
}

/**
 * Retrieves saved tour progress if available.
 */
export function getSavedTourProgress(
  tourId: string,
): { step: number; total: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${TOUR_STORAGE_PREFIX}${tourId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clears saved tour progress when a tour is finished.
 */
export function clearTourProgress(tourId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${TOUR_STORAGE_PREFIX}${tourId}`);
  } catch {
    // Ignore
  }
}

/**
 * Returns standard Driver.js configuration adhering to the
 * OlamideVerse Afro-street editorial design system.
 */
function getDriverBaseConfig(tourId: string, overrides: Partial<Config> = {}): Config {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return {
    animate: !prefersReducedMotion,
    overlayColor: "rgba(24, 20, 16, 0.78)",
    overlayOpacity: 0.78,
    popoverClass: "ov-driver-popover",
    stagePadding: 8,
    stageRadius: 0,
    showProgress: true,
    progressText: "{{current}} of {{total}}",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Complete Act",
    closeBtnLabel: "Exit Act",
    allowKeyboardControl: true,
    smoothScroll: !prefersReducedMotion,
    waitForElement: 1200,
    onHighlightStarted: (element, step, { state }) => {
      const activeIdx = state.activeIndex ?? 0;
      const total = state.activeStep ? (overrides.steps?.length ?? 1) : 1;
      saveTourProgress(tourId, activeIdx + 1, total);
    },
    onDestroyed: () => {
      // Keep or clear based on whether user finished
    },
    ...overrides,
  };
}

/**
 * Complete Archive Orientation Tour.
 */
export function startArchiveOrientationTour(startIndex = 0): void {
  if (typeof window === "undefined") return;

  const tourId = "orientation";
  const steps: DriveStep[] = [
    {
      popover: {
        title: "Welcome to OlamideVerse",
        description:
          "An editorial living archive charting Olamide Adedeji's rise from Bariga street-hop to an international empire. Let's explore the archive's collections and wayfinding tools.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="brand"]',
      popover: {
        title: "Editorial Living Archive",
        description:
          "OlamideVerse is crafted like an Afro-street music magazine, not a SaaS dashboard. Every recording and video is a verified third-party embed with zero self-hosted media.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="eras"]',
      popover: {
        title: "Six Eras · One Legacy",
        description:
          "The core career chronicle across six chapters (2010 to 2026+), from the Bariga Upstart to the International Legacy, equipped with scroll-driven Career Spine wayfinding.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="albums"]',
      popover: {
        title: "Vinyl Crate & Discography",
        description:
          "Browse 15 full-length projects and EPs. Switch to 'Vinyl Crate' view to experience physical record sleeve browsing, ring-wear patina, and gatefold studio master logs.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="media"]',
      popover: {
        title: "Bariga Outdoor Cinema",
        description:
          "Watch live performances, historic interviews, and music videos on the vintage Lagos Cinema Screening Wall with VHS lobby cards and showtime marquees.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="more"]',
      popover: {
        title: "Cultural Collections",
        description:
          "Dive into the Songs Catalogue (Manila Dossiers), Street Lingo (hand-painted Danfo route signboards), Snippets (Cassette J-cards), Impact (Danfo transit map), and Influence (lineage matrix).",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: '[data-tour="search"]',
      popover: {
        title: "Archive Search Console",
        description:
          "Instant unified search across songs, lyrics, slang definitions, eras, albums, and cultural places. Shortcut: press '/' anywhere on the site.",
        side: "bottom",
        align: "end",
      },
    },
  ];

  if (document.getElementById("ov-player-dock")) {
    steps.push({
      element: "#ov-player-dock",
      popover: {
        title: "Persistent Cassette Deck",
        description:
          "When you play a track, it mounts in this persistent player dock so audio playback survives page navigation across the entire archive.",
        side: "top",
        align: "end",
      },
    });
  }

  const driverInstance = driver(
    getDriverBaseConfig(tourId, {
      steps,
      onDoneClick: () => {
        clearTourProgress(tourId);
        driverInstance.destroy();
      },
    }),
  );

  driverInstance.drive(startIndex);
}

/**
 * Storytelling Acts: Narrative documentary-style walkthroughs.
 */
export function startStoryAct(actId: string, startIndex = 0): void {
  if (typeof window === "undefined") return;

  let steps: DriveStep[] = [];
  const tourId = `act-${actId}`;

  switch (actId) {
    case "act-1":
      steps = [
        {
          popover: {
            title: "Act I · The Bariga Gamble (2010)",
            description:
              "In 2010, mainstream Nigerian hip-hop spoke English. Olamide Gbenga Adedeji, a Tai Solarin University dropout from Bariga, bet everything on raw Yoruba street vernacular.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="eras"]',
          popover: {
            title: "Breakout Single · Eni Duro",
            description:
              "Recorded with producer ID Cabasa at Coded Tunes, 'Eni Duro' became a national wildfire, earning a performance slot at the Hip Hop World Awards.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="albums"]',
          popover: {
            title: "Debut Album · Rapsodi (2011)",
            description:
              "Featuring a young Wizkid, 9ice, and Pheelz, Rapsodi proved street-hop wasn't merely motor-park noise — it was high-art commercial dominance.",
            side: "bottom",
            align: "center",
          },
        },
      ];
      break;

    case "act-2":
      steps = [
        {
          popover: {
            title: "Act II · The Rebel Label (2012–2013)",
            description:
              "In 2012, Olamide took the ultimate career risk: leaving Coded Tunes to launch YBNL Nation without corporate backing, betting his own name on the line.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="albums"]',
          popover: {
            title: "YBNL & Baddest Guy Ever Liveth",
            description:
              "Singles 'First of All', 'Voice of the Street', and 'Durosoke' turned YBNL into a cultural powerhouse. When rival labels offered blank checks, he declared it was too late to sign him.",
            side: "bottom",
            align: "center",
          },
        },
      ];
      break;

    case "act-3":
      steps = [
        {
          popover: {
            title: "Act III · Street King Coronation (2014–2017)",
            description:
              "An album every single year: Street OT, 2 Kings, Eyán Mayweather, The Glory, Lagos Nawa. OLIC concerts sold out stadiums and proved street-hop could headline nationwide arenas.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="media"]',
          popover: {
            title: "The Shaku Shaku Dance Genesis",
            description:
              "In 2017, 'Wo!' turned a Bariga street dance challenge into a viral national phenomenon. Wizkid hailed it as the undisputed Nigerian song of the year.",
            side: "bottom",
            align: "center",
          },
        },
      ];
      break;

    case "act-4":
      steps = [
        {
          popover: {
            title: "Act IV · The Empire Joint Venture (2018–2020)",
            description:
              "After dropping surprise EP 999 with zero notice, YBNL signed an international joint-venture distribution deal with Empire, opening global gates for his roster.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="more"]',
          popover: {
            title: "Nurturing Global Superstars",
            description:
              "From Fireboy DML and Asake to Adekunle Gold and Pheelz, Olamide built a sustainable generational dynasty rather than hoarding the spotlight.",
            side: "bottom",
            align: "end",
          },
        },
      ];
      break;

    case "act-5":
      steps = [
        {
          popover: {
            title: "Act V · The Transit Corridor (2021–2023)",
            description:
              "From Bariga Origin 01 across the Third Mainland Bridge to London O2 Arena and Brooklyn Barclays Center, street-hop conquered international diaspora stages.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="more"]',
          popover: {
            title: "Danfo Route & BRT Corridor",
            description:
              "The Impact transit network maps Olamide's geographic migration across venues, cultural landmarks, and world tour stops.",
            side: "bottom",
            align: "end",
          },
        },
      ];
      break;

    case "act-6":
    default:
      steps = [
        {
          popover: {
            title: "Act VI · The Living Legacy (2024–Present)",
            description:
              "In 2025, self-titled album Olamidé opened with 19.1 million streams in its first week on Nigerian Spotify and swept the country's Top 10. Billboard named him a Global Power Player.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: '[data-tour="more"]',
          popover: {
            title: "The Archive Stays Open",
            description:
              "There is no arc to close — OlamideVerse is a living chronicle that keeps adding pages as the story continues.",
            side: "bottom",
            align: "end",
          },
        },
      ];
      break;
  }

  const driverInstance = driver(
    getDriverBaseConfig(tourId, {
      steps,
      onDoneClick: () => {
        clearTourProgress(tourId);
        driverInstance.destroy();
      },
    }),
  );

  driverInstance.drive(startIndex);
}

/**
 * Targeted Discography Crate Digging Tour.
 */
export function startCrateDiggingTour(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("crate", {
      steps: [
        {
          element: "#ov-crate-switcher",
          popover: {
            title: "Vinyl Crate Switcher",
            description:
              "Toggle between Editorial Cards and the tactile Vinyl Crate rack to flip through physical record spines with catalog numbers and era color tabs.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Targeted Songs Catalogue Manila Dossiers Tour.
 */
export function startCatalogueGuide(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("catalogue", {
      steps: [
        {
          element: "#ov-dossier-switcher",
          popover: {
            title: "Catalogue View Mode",
            description:
              "Toggle between Manila Dossier Folders with physical tape tabs and the high-density Ledger Table. Each song reflects confidence tiers: Verified, Documented, or Lore.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Targeted Danfo Transit Map Tour.
 */
export function startTransitGuide(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("transit", {
      steps: [
        {
          element: "#ov-transit-switcher",
          popover: {
            title: "Danfo Route Perspective",
            description:
              "Switch between the authentic Lagos Danfo & BRT transit corridor schematic and the Leaflet world map to trace Olamide's geographic trajectory from Bariga to international stages.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Targeted Dynasty Lineage Matrix Tour.
 */
export function startInfluenceGuide(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("influence", {
      steps: [
        {
          element: "#ov-influence-switcher",
          popover: {
            title: "Lineage Graph Perspective",
            description:
              "Toggle between the Blueprint engineering schematic and the Orbit gravitational system to explore YBNL mentorship and creative lineage across 16 years.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Targeted Street Lingo Tour.
 */
export function startSlangGuide(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("slang", {
      steps: [
        {
          element: "#ov-slang-switcher",
          popover: {
            title: "Street Lingo Signboards",
            description:
              "Switch between hand-painted Lagos Danfo bus signboards and the dictionary ledger. Notice the authentic Yoruba tonal underdots (Ọ, Ẹ, Ṣ) preserved on every street coinage.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Targeted Cassette Snippets Broadcast Tour.
 */
export function startSnippetsGuide(): void {
  if (typeof window === "undefined") return;

  const driverInstance = driver(
    getDriverBaseConfig("snippets", {
      steps: [
        {
          element: "#ov-snippets-switcher",
          popover: {
            title: "Cassette Broadcast Deck",
            description:
              "Switch between vintage 15 IPS cassette tape J-card inlays and high-contrast broadcast soundcards. Each snippet includes an audio deck and shareable audiogram card.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}

/**
 * Highlights a single element with an informative popover.
 */
export function highlightElement(
  elementSelector: string,
  title: string,
  description: string,
  side: "top" | "bottom" | "left" | "right" = "bottom",
): void {
  if (typeof window === "undefined") return;

  const el = document.querySelector(elementSelector);
  if (!el) return;

  const driverInstance = driver(
    getDriverBaseConfig("highlight", {
      steps: [
        {
          element: elementSelector,
          popover: {
            title,
            description,
            side,
            align: "center",
          },
        },
      ],
    }),
  );

  driverInstance.drive();
}
