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
    date: "2026-11-06",
    label: "6 November 2026",
    items: [
      {
        title: "Burukutu and Goosebumps join the catalogue",
        body: "“Burukutu” and DaniLeigh’s collaboration with Olamide, “Goosebumps,” now have catalogue entries with release dates, artist credits and verified Audiomack embeds. Find both under the Legacy era on Songs.",
        href: "/songs",
      },
      {
        title: "Clearer dates and sources for recent releases",
        body: "“Come On” moves to 2026, and ID Cabasa’s “Ok” with Olamide and Ayanfe moves to 2025. Formation, Idi Bad, Zion, Come Kulosa and Rock Me Gentle also gain direct release citations, making the recent catalogue easier to trace.",
        href: "/songs",
      },
      {
        title: "Afro-street magazine cover & discography vinyl crate",
        body: "The Homepage transforms into a full-scale Afro-street music magazine front cover with masthead volume folios, Bariga datelines, and an interactive 6-chapter Quick-Spine dock. In addition, Discography introduces a tactile Vinyl Crate view simulating physical record spine browsing with ring-wear patina, catalog stickers, and gatefold studio master logs.",
        href: "/albums",
      },
      {
        title: "Catalogue archival dossiers & media screening wall",
        body: "Songs Catalogue now features Manila Dossier Cards with tab folders, status confidence stamps (Verified, Documented, Lore), and direct player dock integration. Meanwhile, Media transforms into a vintage Lagos Outdoor Cinema screening wall with lobby cards, marquee showtimes, and an analog projection booth player.",
        href: "/songs",
      },
      {
        title: "Biography marginalia & hand-painted street lingo signboards",
        body: "The Biography adopts a two-column editorial magazine spread featuring timeline marginalia notes, an archival identity dossier, and chapter ribbons. Street Lingo introduces hand-painted Lagos Danfo bus signboards with authentic Yoruba diacritics (underdots and tonal markings) alongside a structured lexicographical ledger.",
        href: "/biography",
      },
      {
        title: "Snippets broadcast studio & cassette voice-notes",
        body: "Snippets elevates into an archival broadcast studio with session folio tags and an accessible View Switcher: physical Cassette J-Cards with tape spool windows and liner notes versus typographic Broadcast Soundcards with live waveform equalizers. Individual snippet decks now feature analog tape monitor frames and session dispatch notes.",
        href: "/snippets",
      },
      {
        title: "Career Spine wayfinding across Eras",
        body: "A persistent, scroll-aware timeline rail on desktop and a tactile chapter dock on mobile now anchor the Eras section. As you explore Olamide’s 16-year journey, the spine highlights your active chapter and lets you jump seamlessly between all six eras.",
        href: "/eras",
      },
      {
        title: "Danfo Route Map on Impact",
        body: "A new cartographic view reimagines the impact archive as an authentic Lagos Danfo transit network. Explore the corridor from Bariga (Origin 01) to Surulere, London, and US tour stages with landmark schedules and ticket punch cards.",
        href: "/impact",
      },
      {
        title: "YBNL Dynasty Lineage on Influence",
        body: "An architectural lineage matrix now accompanies the influence graph, mapping mentors from Coded Tunes, foundational YBNL signees, and second-generation stars with interactive archival dossiers.",
        href: "/influence",
      },
      {
        title: "Tactile cassette boombox dock & Display P3 color",
        body: "The persistent audio player dock adopts authentic cassette boombox styling with animated dual-rotating tape spools during playback. In addition, the site palette now leverages Display P3 wide-gamut enhancements for richer Danfo Yellow radiance on modern OLED screens.",
      },
      {
        title: "Archive Design Lab",
        body: "A dedicated presentational prototyping space opens at /lab, housing active explorations testing cartographic schematics, physical music packaging, and Afro-street editorial materiality.",
        href: "/lab",
      },
    ],
  },
  {
    date: "2026-09-12",
    label: "12 September 2026",
    items: [
      {
        title: "The player follows you around the archive",
        body: "Playback used to stop the moment you opened another page. Now a single dock sits at the edge of the screen and keeps going — start a track on Songs and it plays on while you read an era, a sleeve note, the legal page. One player at a time, and it stops when you say so. Nothing is hosted here; it is still the provider’s own embed, moved somewhere it can survive a click.",
        href: "/songs",
      },
      {
        title: "Apple Music and Audiomack join the embeds",
        body: "Spotify and YouTube Music are no longer the only ways in. Where the archive holds more than one source for a record, the compact player takes the first slot and the rest become “open in” links — so you can finish the song wherever your subscription actually lives.",
        href: "/songs",
      },
      {
        title: "Twelve more records found their embed",
        body: "Another pass over the catalogue matched twelve entries to verified Spotify tracks, including “Orobo,” “Sheevita Juice,” Base One’s “Werey Re O (Remix)” and the CKay and Blaqbonez features. Every ID is checked against the real track’s title and credits before it ships — a wrong guess would quietly play you the wrong song.",
        href: "/songs",
      },
      {
        title: "Eight dates corrected, three records moved era",
        body: "Some catalogue years were estimated from an old Waptrick listing and said so. Checked against the release each track actually sits on, eight were wrong: “Update” moves back into The Street King Run, while “Vanity” and “Free of Charge” move forward into Legacy. The rest shifted by a year within their chapter.",
        href: "/songs",
      },
      {
        title: "Install it like an app",
        body: "The install prompt now shows real screenshots of the archive instead of a bare icon, long-pressing the installed icon jumps straight to Songs, Eras or Discography, and the Songs catalogue reads offline once you have opened it. A quiet strip offers the install once and never nags again.",
      },
      {
        title: "Swipe-between-tracks retired on album pages",
        body: "With the player moved to the dock, swiping the album pane would have animated one thing while changing another — so the gesture is gone rather than left lying. Tapping a track still loads it; skip controls will come back in the dock if they are missed.",
        href: "/albums",
      },
    ],
  },
  {
    date: "2026-07-28",
    label: "28 July 2026",
    items: [
      {
        title: "YBNL MaFia Family joins the discography",
        body: "The label's only group album — thirteen tracks, 14 December 2018 — now has its own page, with Reinvention-era context and roster deep-links into it. “Motigbana” and “Poverty Die” sit on this release instead of the 2012 YBNL album, still flagged as singles. It's also where Fireboy DML's “Jealous” first appeared.",
        href: "/albums/ybnl-mafia-family",
      },
      {
        title: "Street Lingo — the words that travelled",
        body: "A lexicon of the Yoruba and Mainland terms Olamide put into national circulation — Ẹni Dúró, Shoki, Ọmọ Wóbè, Wó! — with what each means, the record that carried it, era filters, search, and a paste-up poster you can compose from any entry.",
        href: "/slang",
      },
      {
        title: "Album pages: key bars ride with the player",
        body: "Tracklists now keep key bars and credits in a sticky side rail beside the embed. Skip a track and the matching bar lights up where it already sits — no jumping layout.",
        href: "/albums",
      },
      {
        title: "A guided route through the impact map",
        body: "The map offers a four-stop walk from Bariga out to the first international dates, and the influence graph lets you jump to a YBNL signing year. Both stay current as pins and signings are added.",
        href: "/impact",
      },
      {
        title: "Editorial texture across the archive",
        body: "Adire patterning on heroes and the footer, drop-cap chapter prose, and Yoruba proverb callouts in long-form pages — small Afro-street cues that keep the reading surface from going flat.",
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
