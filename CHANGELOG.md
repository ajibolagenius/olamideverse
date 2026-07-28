# Changelog

All notable changes to **OlamideVerse** are documented here.

The public “What’s new” page (`/changelog`) is driven by
[`src/lib/changelog.ts`](./src/lib/changelog.ts). When shipping something
user-visible, **update that file** and mirror the entry here so GitHub and the
site stay aligned.

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates are UTC calendar days of the ship window.

## [Unreleased]

### 2026-07-28

- **Discography — *YBNL MaFia Family* (2018)** — label group album (13 tracks,
  14 December 2018) with Spotify IDs, cover, credits and key bars; Reinvention
  era copy and moments updated; roster graph deep-links Picazo Rhap, Yomi Blaze,
  Limerick and Temmie Ovwasa to the album; “Motigbana” / “Poverty Die” moved
  from the 2012 *YBNL* listing onto this release (still flagged as singles).
- **Street Lingo (`/slang`)** — Yoruba / Mainland lexicon with era filter,
  search, OG card, nav/sitemap wiring, Zod-validated content loader, and a
  paste-up poster composer on the page.
- **Impact map & influence graph** — guided “Bariga to the world” route on the
  map; roster signing-wave shortcuts on the graph (both driven from content).
- **Album tracklists** — sticky side rail for key bars + credits beside the
  player; the bar naming the playing track lights up as you skip.
- **Editorial chrome** — adire motif on heroes and footer; drop-cap prose and
  Yoruba proverb callouts in MDX; steadier GSAP lifecycle around reduced-motion.
- **Accessibility pass** — focus-trapped mobile nav with restore; disclosure
  menus; live regions for search, players, impact, cinema and polls; labeled
  comment/poll controls; heading and external-link cues; admin skip link +
  `<main>`.

## [0.1.0] — 2026-07-27

Current development line (package version `0.1.0`).

### 2026-07-27

- **Biography** — new `/biography` narrative across six eras (quick facts,
  chapter pull quotes, era deep-links); wired into nav, footer, and sitemap.
- **Open Graph cards** — distinct editorial OG images per section (About,
  Discography, Songs, Impact, Fan Zone, etc.) plus per-handle fan profile cards.
- **Fan Zone: streaks & stamps** — return-visit streaks and paste-up stamps for
  favoriting, playlists, comments, and going public.
- **Public fan profiles** — opt-in profiles and `/fanzone/fans` directory.
- **Scoped polls** — polls can attach to a specific era or album page.
- **Threaded comments** — one-level replies on Fan Zone threads.
- **Offline reading list** — save eras/albums for offline; `/saved` index.
- **Mobile** — bottom-sheet nav, swipe-between-tracks, share-to-story for snippets.
- **Related albums** — same-era and shared-collaborator suggestions on album pages.
- **“On this day”** — homepage anniversary surface for albums and era moments.
- **Site-wide search** — albums, eras, songs, snippets + header shortcut.
- **Changelog pagination & update notice** — day pages + PWA refresh banner.
- **Card / chrome polish** — flagship AlbumCard/EraCard, disclaimer strip, door
  card, filter chips, danger button, steadier Fan Zone sessions.

### 2026-07-26

- Next.js **16.2.12** and explicit `sharp` for image processing.
- Security hardening: rate limits, safer favorites, stronger fan passwords,
  scrubbed public settings, HSTS in production, Fan Zone ≠ admin accounts.
- First-party anonymous analytics, admin Analytics console, footer visitor badge.
- Public `/changelog` page.
- Cover-art LCP polish (eager / high priority above the fold).

### 2026-07-24

- Songs catalogue Spotify & YouTube ID fill scripts and catalog updates.
- Fan Zone **handle + password** auth (replaces anonymous sessions).
- Key-bars formatting fix on snippets.

### 2026-07-23

- Fan Zone reliability (favorites/playlists, policies, sign-out).
- Navigation & chrome refresh (Archive / Explore / Meta grouping).
- Media gallery CMS seed upserts, search/sort, CinemaPlayer.

### Earlier (Phase 0–3 foundation)

- Concept, visual identity, and information architecture (`docs/`).
- Static archive: eras, albums, songs, media, snippets, influence, impact.
- Design system tokens → `src/app/globals.css`; GSAP motion vocabulary.
- Supabase Fan Zone schema, admin CMS, PWA offline shell.
- Embeds-only posture and site-wide non-affiliation disclaimer.

## Notes

- Cover art may still be editorial placeholders pending licensing — disclosed
  on `/legal` and flagged in `content/media/manifest.json`.
- Fan Zone features remain behind CMS flags (`fanzone`, `comments`, `polls`).
