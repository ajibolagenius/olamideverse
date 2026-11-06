# 12 — Phase 2 Platform Revamp: Catalogue Archival Dossiers & Media Screening Wall

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Restructure and elevate Phase 2 of the platform — specifically the **Songs Catalogue (`/songs`)** and the **Media Archive (`/media`)** — with the Afro-street editorial and tactile materiality established across the archive.

Scope covers:
1. **Songs Catalogue (`src/app/(site)/songs/page.tsx` & `src/components/SongCatalog.tsx`)**:
   - Introduce an archival **View Switcher**: "Dossier Cards" vs. "Ledger Table".
   - **Dossier Cards View**: Manila archival folders with tape badges, folder tabs, era accents, and tactile confidence stamps (`Verified`, `Documented`, `Lore`).
   - Integrated playback triggers routing seamlessly to the persistent Cassette Player Dock without page reloads.
   - Archival library index console: ticket-style type filters (Album Tracks, Singles, Features, Freestyles, Snippets), era tabs, and instant keyword filter.
2. **Media Archive (`src/app/(site)/media/page.tsx` & `src/components/MediaGrid.tsx`)**:
   - Transform the screening experience into a **Lagos Outdoor Cinema & VHS Screening Wall**.
   - **Screening Wall View**: Posters styled like vintage Lagos cinema lobby cards and VHS cassette sleeves with corner admission stamps, halftone grain, and era edge-marks.
   - **Projection Booth Cinema Player**: Upgraded cinema marquee frame with projector reel accents, showtime metadata, and transparent embed attribution ("Screened via YouTube · Not hosted").
   - View Switcher: "Screening Wall" (Lobby cards) vs. "Broadcast Ledger" (curated chronological log).

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (embeds only, zero audio/video hosting), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic, 5 GSAP behaviors), and 10 (checks).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: documentary tone, Lagos street-hop heritage, Danfo transit materiality.
- `src/lib/content-schema.ts`: `Song`, `MediaItem`, `Era`, `SongStatus`, `SongType`.
- `src/components/player/PlayerDock.tsx`: player context integration (`usePlayer`).

## Code and content inspected

- `src/app/(site)/songs/page.tsx` & `src/components/SongCatalog.tsx`: existing catalog layout, filters, and player toggle logic.
- `src/app/(site)/media/page.tsx` & `src/components/MediaGrid.tsx`: existing media grid, YouTube thumbnail resolvers, and `CinemaPlayer`.

## Decisions and assumptions

1. **Embeds Only Posture Strictly Preserved**: All media and audio are third-party embeds (YouTube, Spotify, Audiomack); nothing is hosted or proxied.
2. **Seamless Player Integration**: Clicking play on any song dossier continues to route into `PlayerProvider` so playback persists across navigation.
3. **Responsive and Accessible**: Manila dossiers and cinema lobby cards stack cleanly on mobile viewports with high contrast, focus indicators, and keyboard navigation.
4. **Motion Integrity**: Animations respect `prefers-reduced-motion` using Tailwind `motion-safe` utilities and standard CSS transitions.

## Files to touch

- `docs/prompts/12-phase-2-platform-revamp-catalogue-and-media.md`: this prompt.
- `src/components/SongCatalog.tsx`: View switcher (Dossier Cards vs. Ledger Table), Manila dossier card component, and catalog toolbar.
- `src/app/(site)/songs/page.tsx`: Enhanced header folio and archival confidence legend.
- `src/components/MediaGrid.tsx`: Lagos cinema marquee frame, VHS lobby cards, projection booth player, and view switcher.
- `src/app/(site)/media/page.tsx`: Screening marquee header and cinema showtime ticker.

## Requirements and security considerations

1. Zero database writes, secret modifications, or external dependencies.
2. Full TypeScript type-safety with zero `any` shortcuts.
3. Preserves all existing song confidence statuses (`verified`, `documented`, `lore`) and YouTube embed parameters (`youtube-nocookie.com`).

## Acceptance criteria and checks

- `/songs` allows switching between Manila Dossier Cards and Ledger Table views, with instant search and era/type filtering.
- Clicking any playable song in `/songs` triggers the global Cassette Player Dock without page reloads.
- `/media` renders the Lagos Outdoor Cinema screening wall with VHS lobby cards, showtime marquee, and vintage projection booth player.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Run `npm run dev` and navigate to `/songs`:
   - Inspect the Manila Dossier Cards view: verify confidence stamps (`Verified`, `Documented`, `Lore`) and era color tags.
   - Toggle to "Ledger Table" view and test sorting (`Oldest first` vs `Newest first`).
   - Type in the search box (e.g. "Eni Duro") and verify immediate live filtering.
   - Click the play button on a verified track; confirm the Cassette Player Dock opens at the bottom with rotating tape spools.
2. Navigate to `/media`:
   - Inspect the Lagos Outdoor Cinema marquee and the VHS lobby card grid.
   - Click a media poster to open the Projection Booth player; confirm the YouTube embed loads cleanly with close controls.
   - Toggle between "Screening Wall" and "Broadcast Ledger" views.
3. Test responsiveness on mobile viewport (375px).

## Execution record

- Prompt prepared and approved.
- Upgraded `SongCatalog.tsx` with Manila Dossier Cards view, confidence status seals, and View Switcher (`Dossiers` vs. `Table`).
- Enhanced `src/app/(site)/songs/page.tsx` with archival folio masthead and research confidence tier specification.
- Upgraded `MediaGrid.tsx` with Lagos cinema lobby cards, marquee projection booth player, and View Switcher (`Wall` vs. `Ledger`).
- Enhanced `src/app/(site)/media/page.tsx` with Bariga Outdoor Cinema masthead strip.
- Verified type check (`npx tsc --noEmit`), lint (`npm run lint`), and production build (`npx next build --webpack`).
