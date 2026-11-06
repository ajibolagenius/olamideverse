# Changelog

All notable changes to **OlamideVerse** are documented here.

The public “What’s new” page (`/changelog`) is driven by
[`src/lib/changelog.ts`](./src/lib/changelog.ts). When shipping something
user-visible, **update that file** and mirror the entry here so GitHub and the
site stay aligned.

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates are UTC calendar days of the ship window.

## [Unreleased]

### 2026-11-06

- **Research audit — slang, media, influence, impact** — A six-agent
  content audit corrected the OLIC venue record, the Port Harcourt/Enugu
  attribution and the 999 release date; expanded Street Lingo from 7 to 21
  entries with coined-vs-amplified sourcing; backfilled ~25 verified videos
  and live clips (2018–2026) into Media; and added Dagrin, Naira Marley,
  Zlatan, CKay, Rema and Eskeez to the influence graph.
- **Time & Space seeded as draft** — the announced 16 November 2026 album
  now has a draft record and a Legacy-era moment, held in draft until
  release.

- **Archive Expedition & Driver.js Storytelling Tours** — Introduced an
  interactive Driver.js-powered storytelling onboarding expedition docked in the
  corner. Readers can embark on 6 documentary narrative acts detailing Olamide's
  16-year journey, complete with live progress bars, pause/resume state
  (“Paused at Step X of Y”), compact and full checklist modes, and pulsing
  contextual field note beacons across Discography, Songs Catalogue, Danfo
  Transit, Street Lingo, and Snippets.
- **Author & Curator Attribution** — Formally attributed project curation,
  editorial design, and full-stack software architecture to Ajibola Akelebe
  across the site colophon, footer, and repository documentation.
- **Burukutu and Goosebumps join the catalogue** — “Burukutu” and DaniLeigh’s
  collaboration with Olamide, “Goosebumps,” now have catalogue entries with
  release dates, artist credits and verified Audiomack embeds. Find both
  under the Legacy era on Songs.
- **Clearer dates and sources for recent releases** — “Come On” moves to 2026,
  and ID Cabasa’s “Ok” with Olamide and Ayanfe moves to 2025. Formation,
  Idi Bad, Zion, Come Kulosa and Rock Me Gentle also gain direct release
  citations, making the recent catalogue easier to trace.
- **Afro-street magazine cover & discography vinyl crate** — The Homepage
  transforms into a full-scale Afro-street music magazine front cover with
  masthead volume folios, Bariga datelines, and an interactive 6-chapter
  Quick-Spine dock. In addition, Discography (`/albums`) introduces a tactile
  Vinyl Crate view simulating physical record spine browsing with ring-wear
  patina, catalog stickers, and gatefold studio master logs.
- **Catalogue archival dossiers & media screening wall** — Songs Catalogue
  (`/songs`) now features Manila Dossier Cards with tab folders, status
  confidence stamps (Verified, Documented, Lore), and direct player dock
  integration. Meanwhile, Media (`/media`) transforms into a vintage Lagos
  Outdoor Cinema screening wall with lobby cards, marquee showtimes, and an
  analog projection booth player.
- **Biography marginalia & hand-painted street lingo signboards** — The
  Biography (`/biography`) adopts a two-column editorial magazine spread
  featuring timeline marginalia notes, an archival identity dossier, and
  chapter ribbons. Street Lingo (`/slang`) introduces hand-painted Lagos Danfo
  bus signboards with authentic Yoruba diacritics (underdots and tonal
  markings) alongside a structured lexicographical ledger.
- **Snippets broadcast studio & cassette voice-notes** — Snippets (`/snippets`)
  elevates into an archival broadcast studio with session folio tags and an
  accessible View Switcher: physical Cassette J-Cards with tape spool windows
  and liner notes versus typographic Broadcast Soundcards with live waveform
  equalizers. Individual snippet decks (`/snippets/[id]`) now feature analog
  tape monitor frames and session dispatch notes.
- **Career Spine wayfinding across Eras** — A persistent, scroll-aware timeline
  rail on desktop and a tactile chapter dock on mobile now anchor the Eras section
  (`/eras`). As you explore Olamide’s 16-year journey, the spine highlights your
  active chapter and lets you jump seamlessly between all six eras.
- **Danfo Route Map on Impact** — A new cartographic view (`/impact`) reimagines
  the impact archive as an authentic Lagos Danfo transit network. Explore the
  corridor from Bariga (Origin 01) to Surulere, London, and US tour stages with
  landmark schedules and ticket punch cards.
- **YBNL Dynasty Lineage on Influence** — An architectural lineage matrix now
  accompanies the influence graph (`/influence`), mapping mentors from Coded
  Tunes, foundational YBNL signees, and second-generation stars with interactive
  archival dossiers.
- **Tactile cassette boombox dock & Display P3 color** — The persistent audio
  player dock adopts authentic cassette boombox styling with animated
  dual-rotating tape spools during playback. In addition, the site palette now
  leverages Display P3 wide-gamut enhancements for richer Danfo Yellow radiance
  on modern OLED screens.
- **Archive Design Lab** — A dedicated presentational prototyping space opens at
  `/lab`, housing active explorations testing cartographic schematics, physical
  music packaging, and Afro-street editorial materiality.

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
