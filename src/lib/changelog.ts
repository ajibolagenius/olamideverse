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
    date: "2026-07-28",
    label: "28 July 2026",
    items: [
      {
        title: "YBNL MaFia Family joins the discography",
        body: "The label's only group album — thirteen tracks, 14 December 2018, credited to “YBNL MaFia Family” rather than to Olamide — now has its own page. It's where Fireboy DML's “Jealous” first appeared, two months after he signed. The Reinvention chapter and the roster graph link into it.",
        href: "/albums/ybnl-mafia-family",
      },
      {
        title: "“Motigbana” and “Poverty Die” filed correctly",
        body: "Both 2018 singles were listed against the 2012 YBNL album in the songs catalogue. They now sit on YBNL MaFia Family, where they were actually released, still flagged as singles.",
        href: "/songs",
      },
      {
        title: "Accessibility pass across chrome & Fan Zone",
        body: "The mobile menu traps keyboard focus and returns it on close, desktop menus use proper disclosure semantics, and search results, now-playing players, impact pins, media cinema, and poll results announce changes to screen readers. Comment and poll controls get real labels; heading order and “opens in a new tab” cues are cleaned up site-wide.",
      },
    ],
  },
  {
    date: "2026-07-27",
    label: "27 July 2026",
    items: [
      {
        title: "Biography — the story, start to now",
        body: "A new narrative page walks Olamide’s career across six eras: quick facts, chapter pull quotes, and deep links into each era — so the throughline sits beside the discography instead of only on the timeline.",
        href: "/biography",
      },
      {
        title: "Open Graph cards, per section",
        body: "Share links for About, Discography, Songs, Impact, Fan Zone, and more now get distinct editorial OG images instead of the same homepage wordmark — public fan profiles get their own card too.",
      },
      {
        title: "Fan Zone: streaks & stamps",
        body: "Signed-in fans build a return-visit streak and collect paste-up “stamps” for favoriting, stacking a playlist, commenting, and going public — tracked automatically, styled like archive ephemera instead of a gamified checklist.",
        href: "/fanzone",
      },
      {
        title: "Public fan profiles",
        body: "Fans can opt in to a public profile so others can browse their favorited eras/albums and playlist. Off by default — one switch in the account panel, with a new directory to browse who's opted in.",
        href: "/fanzone/fans",
      },
      {
        title: "Poll results, on the page they're about",
        body: "Polls can now be scoped to a specific era or album, so the results sit permanently on that page instead of living only in the Fan Zone hub.",
        href: "/eras",
      },
      {
        title: "Threaded comment replies",
        body: "Comment threads support one level of replies, so a reaction to a specific comment reads as a reply instead of piling up at the bottom of the thread.",
        href: "/fanzone",
      },
      {
        title: "Save eras & albums for offline reading",
        body: "A save button caches the page itself for offline viewing — everything you've saved shows up on the new Saved page, connection or not.",
        href: "/saved",
      },
      {
        title: "Three mobile-first upgrades",
        body: "A bottom-sheet nav replaces the cramped mobile menu, swiping left or right moves between tracks while an embed is open, and snippets can share a downloadable vertical story image straight to Instagram/WhatsApp.",
      },
      {
        title: "Related albums, by era & collaborator",
        body: "Album pages now surface same-era albums and cross-era matches sharing a feature credit (parsed straight from tracklist notes), so digging deeper into the discography takes one click.",
        href: "/albums",
      },
      {
        title: "“On this day” on the homepage",
        body: "The homepage now surfaces albums and era moments whose date matches today — including the rare day where more than one lands at once.",
        href: "/",
      },
      {
        title: "Site-wide search",
        body: "A dependency-free search over albums, eras, songs, and snippets, wired to a header shortcut for finding anything in the archive fast.",
        href: "/search",
      },
      {
        title: "Changelog pagination & update notice",
        body: "This page now paginates by day instead of scrolling forever, and a quiet banner tells returning visitors when a fresh build has landed and it's safe to refresh.",
        href: "/changelog",
      },
      {
        title: "Album & era cards, retiled",
        body: "AlbumCard and EraCard move to a quieter flagship look — accent lives in a rule and label color instead of a solid fill, with a fix so danfo yellow stays readable as text on paper.",
        href: "/eras",
      },
      {
        title: "New chrome primitives",
        body: "Disclaimer strip, door card, filter chips, page header, and ticker join the design system, plus refined button, modal, and track-row patterns and a tidy-up of border styles to numeric scale across the site.",
      },
      {
        title: "Clearer delete actions",
        body: "A dedicated danger button variant marks destructive admin actions — deleting albums, eras, and media — apart from routine ones.",
      },
      {
        title: "Steadier Fan Zone sign-in",
        body: "Stale or revoked Supabase refresh tokens are now cleared instead of surfacing repeated auth errors, so sessions recover cleanly.",
        href: "/fanzone",
      },
    ],
  },
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
