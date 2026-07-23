import type { NavLink } from "@/lib/settings";

/** Grouped secondary destinations — More menu + mobile drawer + footer columns. */
export type NavGroup = {
  id: "archive" | "explore" | "meta";
  label: string;
  links: NavLink[];
};

export const PRIMARY_NAV: NavLink[] = [
  { href: "/eras", label: "Eras" },
  { href: "/albums", label: "Discography" },
  { href: "/media", label: "Media" },
];

export const MORE_GROUPS: NavGroup[] = [
  {
    id: "archive",
    label: "Archive",
    links: [
      { href: "/songs", label: "Songs" },
      { href: "/snippets", label: "Snippets" },
    ],
  },
  {
    id: "explore",
    label: "Explore",
    links: [
      { href: "/influence", label: "Influence" },
      { href: "/impact", label: "Impact" },
    ],
  },
  {
    id: "meta",
    label: "Meta",
    links: [
      { href: "/about", label: "About" },
      { href: "/legal", label: "Legal" },
    ],
  },
];

export const FANZONE_LINK: NavLink = { href: "/fanzone", label: "Fan Zone" };

/** Flat secondary links (for active-state checks against “More”). */
export function flattenMoreLinks(groups: NavGroup[] = MORE_GROUPS): NavLink[] {
  return groups.flatMap((g) => g.links);
}

export function isLinkActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0];
  if (!path || path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isMoreActive(pathname: string, groups: NavGroup[] = MORE_GROUPS): boolean {
  return flattenMoreLinks(groups).some((l) => isLinkActive(pathname, l.href));
}

/** Footer meta extras that sit under Meta (credits / takedown). */
export const FOOTER_META_EXTRAS: NavLink[] = [
  { href: "/about", label: "Source credits" },
  { href: "/legal#takedown", label: "Takedown" },
];

export type FooterColumns = {
  archive: NavLink[];
  explore: NavLink[];
  meta: NavLink[];
};

export function buildFooterColumns(options: {
  showFanZone: boolean;
}): FooterColumns {
  const archive = MORE_GROUPS.find((g) => g.id === "archive")!.links;
  const explore = [
    ...PRIMARY_NAV,
    ...MORE_GROUPS.find((g) => g.id === "explore")!.links,
  ];
  const meta = [
    ...MORE_GROUPS.find((g) => g.id === "meta")!.links,
    ...FOOTER_META_EXTRAS.filter(
      (l) => !MORE_GROUPS.find((g) => g.id === "meta")!.links.some((m) => m.href === l.href),
    ),
  ];
  if (options.showFanZone) {
    meta.push(FANZONE_LINK);
  }
  return { archive, explore, meta };
}
