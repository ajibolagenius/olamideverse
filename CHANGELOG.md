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

- **Discography — *YBNL MaFia Family* (2018)** — added the label's only group
  album (13 tracks, 14 December 2018, credited to "YBNL MaFia Family" rather
  than Olamide) with verified Spotify track IDs, cover art, credits and key
  bars. Filed under the Reinvention era; discography counts bumped 14 → 15.
- **Reinvention era** — context copy and moments now acknowledge the December
  2018 group album instead of reading as an album-free stretch.
- **Influence graph** — Picazo Rhap, Yomi Blaze, Limerick and Temmie Ovwasa
  now deep-link to the album they actually appear on.
- **Fix: songs catalogue** — "Motigbana" and "Poverty Die" (2018) were
  attributed to the 2012 *YBNL* album; they're now album tracks on *YBNL
  MaFia Family*, retained as singles via `alsoSingles`.
- **Street Lingo (`/slang`)** — a lexicon of the Yoruba and Mainland terms
  Olamide put into national circulation, each linked to the record that
  carried it. Era filter, free-text find, section OG card; wired into the
  More menu, sitemap and site search.
- **Slang content pipeline** — `slangTermSchema` + `getSlang()` join the
  Zod-validated loader in `src/lib/content.ts`, cross-checking every entry's
  era, `albumSlug` and `songId` against the archive at build time.
- **Poster generator** — paste-up flyer composer on the Street Lingo page,
  built on the shared focus-trapped `ui/Modal` and the era accent palette.
- **Impact map & influence graph** — a guided "Bariga to the world" route on
  the map, and roster signing-wave shortcuts on the graph. Both derive from
  the content files, so new pins and signings appear without a code change.
- **Accessibility pass** — mobile nav is focus-trapped with focus restore;
  More / Fan Zone menus use disclosure semantics; search, players, impact
  detail, cinema, and polls announce via live regions; comment/poll controls
  get proper labels and group roles; heading hierarchy and external-link cues
  cleaned up; admin shell gains skip link + `<main>` landmarks.

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
