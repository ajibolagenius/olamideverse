# 16 — Driver.js Product Tours, Highlights & Contextual Help

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Introduce interactive product tours, element highlights, and contextual help across OlamideVerse using [`driver.js`](https://driverjs.com) (v1.10.2). Incorporate a variety of Driver.js patterns (multi-step animated tours, no-element intro modals, contextual popover positioning, exit confirmation hooks, targeted feature highlights, and onboarding checklists), fully customized into the Afro-street editorial and tactile Danfo design system.

Scope covers:
1. **Afro-Street Custom Driver.js Theme (`src/app/globals.css`)**:
   - Custom styling for `.driver-popover.ov-driver-popover` and `.driver-overlay` to match the archive's aesthetic: thick black borders (`3px solid var(--color-ink)`), paper background (`var(--color-paper)`), danfo yellow button accents (`var(--color-danfo)`), tactile ink box-shadows (`4px 4px 0px var(--color-ink)`), Anton display headings, and typewriter mono accents.
   - Deep ink overlay styling (`rgba(24, 20, 16, 0.78)`).
   - Full `prefers-reduced-motion` compliance.
2. **Centralized Tour & Help Controller (`src/lib/tours.ts`)**:
   - **Archive Orientation Tour** (Multi-step animated tour with progress counter, custom popovers, and exit confirmation):
     - Step 1: No-element introductory modal dispatch welcoming the reader.
     - Step 2: Era Wayfinding & Career Spine highlight (`#nav-eras` & Quick-Spine).
     - Step 3: Discography Vinyl Crate digging guide (`#nav-albums`).
     - Step 4: Songs Catalogue Manila Dossiers & verification tiers (`#nav-songs`).
     - Step 5: Persistent Cassette Player Dock (`#player-dock`).
     - Step 6: Danfo Transit Corridor & impact geography (`#nav-impact`).
     - Step 7: Cultural Vernacular & Yoruba orthography (`#nav-slang`).
     - Step 8: Exit confirmation & research pass stamp.
   - **Targeted Page Feature Guides**:
     - *Crate Digging Guide* on `/albums` (highlighting the Vinyl Crate view, cardboard ring-wear, and gatefold liner notes).
     - *Catalogue Dossiers Guide* on `/songs` (highlighting the Manila folders, verification tiers, and instant playback).
     - *Danfo Transit Guide* on `/impact` (highlighting the Lagos BRT route network and station punch cards).
   - **Contextual Help Beacons & Hints (`driver.js/hints`)**:
     - Contextual hint pins on `/slang` (explaining authentic Yoruba tonal diacritics and underdots) and `/snippets` (explaining 15 IPS master voice-notes).
3. **Interactive Field Guide Trigger (`src/components/tours/FieldGuideLauncher.tsx`)**:
   - A tactile floating/docked "Field Guide" button accessible across the site offering quick actions:
     - 🧭 Take the Archive Orientation Tour
     - 📋 Open Field Researcher Checklist (compact onboarding checklist tracking key archive discoveries)
     - 💡 Toggle Contextual Help Hints
4. **Data Tour Hooks**:
   - Add unobtrusive `data-tour` and `id` attributes to header nav items, the player dock, and key view switchers.

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (editorial posture, embeds only), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic, 5 GSAP behaviors), 9 (Yoruba diacritics), and 10 (checks).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: paper/ink base, danfo yellow accent, paste-up texture, tactile materiality.
- `driver.js` official docs and API typings (`node_modules/driver.js/dist/driver.js.d.ts` and `hints.d.ts`).
- `src/components/chrome/Header.tsx` and `src/components/player/PlayerDock.tsx`.

## Code and content inspected

- `src/app/globals.css`: existing tokens, feedback toasts, and player dock animations.
- `src/components/chrome/Header.tsx`: navigation links and search shortcuts.
- `src/components/AlbumGrid.tsx` & `src/components/VinylCrate.tsx`: crate switcher and spine components.
- `src/components/SongCatalog.tsx`: dossier cards and ledger views.
- `src/components/DanfoTransitMap.tsx`: transit map switcher and station cards.

## Decisions and assumptions

1. **Afro-Street Editorial Theme Over Default Styles**: Driver.js default popovers are completely overridden to feel like printed newsprint / Danfo bus placards rather than generic modern SaaS modals.
2. **Non-Intrusive & User-Initiated**: Tours never auto-launch aggressively on initial load; they are triggered via the tactile "Field Guide" button, contextual help badges, or explicit user clicks.
3. **PWA & Offline Resilience**: Driver.js runs entirely client-side without external network calls; works seamlessly offline.
4. **Accessible Keyboard & Reduced Motion**: Keyboard navigation (`Escape` to close, `Arrow` keys for next/prev) is enabled, and all animations respect `prefers-reduced-motion: reduce`.

## Files to touch

- `docs/prompts/16-driverjs-product-tours-and-contextual-help.md`: this prompt.
- `src/app/globals.css`: custom `.ov-driver-popover` theme and overlay styling.
- `src/lib/tours.ts`: centralized Driver.js tour configurations, steps, hooks, and helpers.
- `src/components/tours/FieldGuideLauncher.tsx`: floating/docked tour launcher menu and checklist drawer.
- `src/app/(site)/layout.tsx`: mount the `FieldGuideLauncher` component.
- `src/components/chrome/Header.tsx`: add `data-tour` hooks for targeted navigation highlighting.

## Requirements and security considerations

1. Zero external network requests during tour execution; strictly bundled client module.
2. Zero database writes or schema modifications.
3. Complete TypeScript type-safety with typed `Driver`, `Config`, and `DriveStep` interfaces.
4. Clean DOM cleanup on teardown without leaving orphaned overlays or scroll locks.

## Acceptance criteria and checks

- The "Field Guide" launcher is accessible across the archive and opens an editorial tour menu.
- Starting the "Archive Orientation Tour" triggers an animated multi-step tour with custom Afro-street popover styling, live progress counters, and deep ink backdrop.
- Targeted guides on `/albums`, `/songs`, and `/impact` highlight their respective views and switchers.
- Contextual hints on `/slang` and `/snippets` display informative popovers on demand.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Navigate to `http://localhost:3000/`:
   - Locate the "Field Guide" button at the bottom-left / floating dock.
   - Click "Take Archive Orientation Tour": verify step 1 (introductory dispatch) renders with Afro-street paper/ink styling.
   - Click "Next →": verify the highlight moves smoothly to Eras, then to the Player Dock, and through the archive stops.
   - Press `Escape` or finish: verify the tour dismisses cleanly without locking body scrolling.
2. Navigate to `http://localhost:3000/albums`:
   - Open Field Guide and click "Explore Crate Digging": verify targeted highlight on the Vinyl Crate switcher and record shelf.
3. Navigate to `http://localhost:3000/slang`:
   - Click the "Hint: Yoruba Diacritics" beacon: verify contextual popover explaining underdots and tonal markings.
