/**
 * Public “What’s new” feed — curated from git history for readers,
 * not a raw commit log. Newest day first.
 */

export type ChangelogItem = {
  title: string;
  body: string;
  /** Optional deep link into the archive. */
  href?: string;
};

export type ChangelogDay = {
  date: string; // YYYY-MM-DD
  label: string;
  items: ChangelogItem[];
};

export const CHANGELOG: ChangelogDay[] = [
  {
    date: "2026-07-26",
    label: "26 July 2026",
    items: [
      {
        title: "Next.js 16.2.12 & image tooling",
        body: "Framework bump to Next 16.2.12 (with matching eslint-config-next), plus an explicit sharp dependency for admin asset uploads and image optimization.",
      },
      {
        title: "Security hardening pass",
        body: "Rate limits on analytics collect and Fan Zone sign-up/sign-in, safer favorite links, stronger fan passwords, scrubbed public settings (takedown email no longer anon-readable), validated GA/GTM IDs, HSTS in production, and a hard split so Fan Zone accounts can’t reach the admin console.",
        href: "/legal",
      },
      {
        title: "First-party analytics & visitor badge",
        body: "Anonymous pageview tracking (no IP, no personal profiles), an admin Analytics console with 30-day charts and top pages, and a danfo visitor counter in the footer. Privacy notes live on Legal.",
        href: "/legal",
      },
      {
        title: "What’s new page",
        body: "This changelog — a public record of what shipped recently, linked from the footer Meta column and the More menu.",
        href: "/changelog",
      },
      {
        title: "Cover art LCP polish",
        body: "Above-the-fold album covers now eager-load with high fetch priority so the first paint stays sharp on home, discography, era, and album pages.",
        href: "/albums",
      },
    ],
  },
  {
    date: "2026-07-24",
    label: "24 July 2026",
    items: [
      {
        title: "Songs catalogue: Spotify & YouTube IDs",
        body: "Matching scripts and catalog updates wire more tracks to verified Spotify and YouTube embeds, with rate-limit handling so fills can resume cleanly.",
        href: "/songs",
      },
      {
        title: "Fan Zone: handle + password auth",
        body: "Fans sign in with a handle and password instead of anonymous sessions — same favorites, polls, comments, and playlists, with a clearer identity model.",
        href: "/fanzone",
      },
      {
        title: "Key bars formatting fix",
        body: "Small readability pass on snippet key-bar markup.",
        href: "/snippets",
      },
    ],
  },
  {
    date: "2026-07-23",
    label: "23 July 2026",
    items: [
      {
        title: "Fan Zone reliability & UI",
        body: "Stronger error handling on favorites and playlists, sign-out in the handle picker, clearer mutation feedback, and tighter Supabase policies for fan writes.",
        href: "/fanzone",
      },
      {
        title: "Navigation & chrome refresh",
        body: "Leaner header/footer grouping (Archive / Explore / Meta), DoorCard and PageHeader primitives, modal patterns for Fan Zone actions, and admin UI border/shadow consistency.",
      },
      {
        title: "Media gallery & CinemaPlayer",
        body: "CMS seed upserts for media items, search and sort on the Watch page, and a CinemaPlayer for a cleaner embed viewing experience.",
        href: "/media",
      },
    ],
  },
];
