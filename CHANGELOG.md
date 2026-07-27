# Changelog

All notable changes to **OlamideVerse** are documented here.

The public “What’s new” page (`/changelog`) is driven by
[`src/lib/changelog.ts`](./src/lib/changelog.ts). When shipping something
user-visible, **update that file** and mirror the entry here so GitHub and the
site stay aligned.

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates are UTC calendar days of the ship window.

## [Unreleased]

—

## [0.1.0] — 2026-07-27

Current development line (package version `0.1.0`).

### 2026-07-27

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
