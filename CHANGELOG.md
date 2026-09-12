# Changelog

All notable changes to **OlamideVerse** are documented here.

The public “What’s new” page (`/changelog`) is driven by
[`src/lib/changelog.ts`](./src/lib/changelog.ts). When shipping something
user-visible, **update that file** and mirror the entry here so GitHub and the
site stay aligned.

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates are UTC calendar days of the ship window.

## [Unreleased]

### 2026-09-12

- **Persistent player dock** — one `EmbedFrame` mounted in `(site)/layout.tsx`
  via a new `PlayerProvider`, so the iframe is never unmounted on soft
  navigation and playback survives route changes. Fixed bottom-right on
  desktop, bottom bar on mobile, with `body.ov-dock-open` clearance so footer
  links stay reachable. Reuses the toast slap-in keyframes (not one of the five
  named GSAP behaviors) and honours `prefers-reduced-motion`. No autoplay, no
  Spotify iFrame API — deliberately deferred.
- **Apple Music + Audiomack embeds** — `appleMusicId` / `audiomackUrl` on
  `songSchema` and `trackSchema`; `EmbedFrame` precedence is now Spotify →
  Apple Music → YouTube/YTM → Audiomack, with everything else as a link-out.
  Admin kill-switch gained an Apple Music option, plus a migration widening
  `embed_blocks.provider` to include `applemusic` and `youtubemusic`.
- **`src/lib/embeds.ts`** — single, pure, client-safe resolver for the embed
  kill-switch (`resolveEmbed` / `hasAnyEmbed`). Blocks are now resolved once in
  the site layout instead of threaded per route, closing the gap where a route
  that forgot the prop would bypass a takedown. Removed the superseded
  `blockedSpotifyIds` / `blockedYoutubeIds` / `isEmbedBlocked` from
  `settings.ts`.
- **Embed ID validation** — `safeSpotifyId`, `safeYoutubeId`,
  `safeAppleMusicId`, `safeAudiomackEmbedSrc` and `safeAudiomackPageUrl` in
  `src/lib/security/urls.ts` shape-check every value before it reaches an
  iframe `src`. Audiomack pins the origin and accepts both the page shape
  (`/<artist>/song/<slug>`) and the embed shape
  (`/embed/song/<artist>/<slug>`). Covered by `npm run check:embed-ids`.
- **Catalogue** — +12 verified Spotify IDs (144 → 156); 375 of 478 entries now
  carry a playable embed. Eight rows whose notes flagged the year as estimated
  had year and era corrected against the track's parent release (never a
  compilation re-upload); `update-2018` → street-king-run, `vanity-2022` and
  `free-of-charge-2022` → legacy. Both automated fill passes are now exhausted:
  the remaining 103 blanks (38 documented, 65 lore) need per-row research.
- **`npm run report:coverage`** — cross-references the catalogue against both
  fill-progress files so "not matched" and "not yet attempted" stop looking
  alike.
- **PWA** — manifest gains `screenshots` (wide + narrow, captured from a
  production build by `npm run shots:pwa`) and `shortcuts` for Songs / Eras /
  Discography; `/songs`, `/snippets` and `/slang` added to the service-worker
  shell cache; new `InstallPrompt` shows a quiet, session-dismissible install
  strip only once the browser fires `beforeinstallprompt`.

#### Fixed

- `blockEmbed` ignored the Supabase insert error and redirected `?saved=1`
  regardless — an editor could believe a takedown had landed when the write had
  failed. Now surfaces `?error=block-failed` and validates a non-empty ID.
- The admin embed kill-switch offered a "YouTube Music" provider that the
  `embed_blocks` check constraint rejected, so selecting it always failed.

#### Removed

- Swipe-between-tracks on album tracklists. With playback moved to the dock the
  gesture animated the album player while changing a different track; skip
  controls belong in the dock if they are wanted back.

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
