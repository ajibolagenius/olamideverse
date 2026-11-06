# 09 — Production Copy & Layout Cleanup (Career Spine Overlap & Polish)

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Address user feedback following the graduation of the visual enhancements to production:
1. **Fix Career Spine Siderail Overlap**:
   - The desktop Career Spine sidebar currently overlaps the `PosterHero` headline
     ("SIX ERAS. ONE LEGACY.") at the top of `/eras`.
   - Implement dynamic scroll visibility: the spine remains hidden while the hero
     is in view (`opacity-0 pointer-events-none -translate-x-4`), smoothly transitioning in
     (`opacity-100 pointer-events-auto translate-x-0`) only once the user scrolls past the
     hero into the era timeline content.
   - On mobile, ensure the bottom chapter rail does not obstruct content or footer links.
2. **Production-Grade Editorial Copywriting (No Prototype Artifacts)**:
   - Audit and replace all temporary prototype placeholder copy (`BRT-EXP-01`,
     `SPEC: BLUEPRINT-2026`, `SCALE: DYNASTIC 1:1`, `Conductor Log`, `FARE: VALIDATED PASS`,
     `CLEARANCE: PUBLIC ARCHIVE`) with authentic, production-grade music journalism and
     curatorial archive language.
   - Refine labels in `DanfoTransitMap.tsx`, `LineageBlueprint.tsx`, `CareerSpine.tsx`,
     and `PlayerDock.tsx`.
3. **Tidy Up Layout & Spacing**:
   - Ensure clean vertical rhythm, smooth scroll triggers, and proper padding on `/eras`,
     `/impact`, and `/influence`.

## Skills and documentation read

- Repository `AGENTS.md`: sections 2 (work loop), 3 (UI reproduction), 7 (Afro-street editorial,
  static-first, mandatory disclaimer), 9 (tripwires), and 10 (checks to run).
- `docs/VISUAL-IDENTITY.md` & `docs/CONCEPT.md`: Afro-street editorial voice,
  serious curatorial tone ("would this look at home on a wall in Bariga and in a design annual?").
- `docs/ACCESSIBILITY.md`: keyboard accessibility, ARIA landmarks, `prefers-reduced-motion`.

## Code and content inspected

- Screenshot `uploaded_media_1793957428852.png`: shows the desktop Career Spine fixed sidebar
  colliding directly with the `PosterHero` H1 on `/eras`.
- `src/components/CareerSpine.tsx`: fixed positioning (`fixed left-4 top-36 z-20`) with no
  scroll-based visibility threshold.
- `src/components/DanfoTransitMap.tsx`: prototype copy strings (`BRT-EXP-01`, `Conductor Log`,
  `FARE: VALIDATED PASS`, `PUNCH: CONFIRMED`).
- `src/components/LineageBlueprint.tsx`: prototype copy strings (`SPEC: BLUEPRINT-2026`,
  `SCALE: DYNASTIC 1:1`, `CLEARANCE: PUBLIC ARCHIVE`).
- `src/components/player/PlayerDock.tsx`: player dock styling and top bar.

## Decisions and assumptions

1. **Scroll-Driven Spine Visibility**:
   - Track hero visibility via an `IntersectionObserver` on the page hero or `window.scrollY`.
   - When the user is at the top of the page reading the hero, the spine is completely
     hidden, giving full breathing room to the poster headline.
   - When the user scrolls into the timeline, the spine slides in smoothly from the left.
   - In `prefers-reduced-motion: reduce`, transition opacity instantaneously without transform drift.
2. **Editorial Voice Realignment**:
   - The site is an editorial archive, not a fantasy simulation.
   - Replace whimsical prototype tokens (`Conductor Log`, `BRT-EXP-01`, `PUNCH: CONFIRMED`,
     `CLEARANCE: PUBLIC ARCHIVE`) with authentic music history terminology:
     - `Station Kind` → `Landmark Type`
     - `Conductor Log` → `Curatorial Notes`
     - `FARE: VALIDATED PASS` → `YBNL CULTURAL ARCHIVE`
     - `PUNCH: CONFIRMED` → `VERIFIED LANDMARK`
     - `BRT-EXP-01` → `ROUTE MAP`
     - `SPEC: BLUEPRINT-2026` → `DYNASTIC LINEAGE`
     - `CLEARANCE: PUBLIC ARCHIVE` → `ARCHIVE VERIFIED`
3. **Player Dock Refinement**:
   - Maintain the tactile analog tape feel while keeping the typography disciplined:
     `OlamideVerse Sound System` and `SIDE A · HI-FI`.

## Files expected to touch

- `docs/prompts/09-production-copy-and-layout-cleanup.md`: this prompt.
- `src/components/CareerSpine.tsx`: scroll-threshold visibility logic and copy polish.
- `src/components/DanfoTransitMap.tsx`: production editorial copy cleanup.
- `src/components/LineageBlueprint.tsx`: production editorial copy cleanup.
- `src/components/player/PlayerDock.tsx`: refined player chassis copy and layout.
- `src/app/(site)/eras/page.tsx`: hero sentinel integration for spine observer.

## Requirements and security considerations

1. Zero backend changes or database writes.
2. Maintain all accessibility contracts (keyboard tabs, ARIA labels, focus states).
3. Zero breaking changes to existing route URLs or data schemas.

## Acceptance criteria and checks

- On `/eras`, the Career Spine sidebar does NOT overlap the `PosterHero` headline on initial load.
- As the reader scrolls past the hero into the era cards, the Career Spine sidebar smoothly
  fades and translates in.
- All prototype placeholder labels (`BRT-EXP-01`, `SPEC: BLUEPRINT-2026`, `Conductor Log`,
  `PUNCH: CONFIRMED`) are replaced with serious, production-quality editorial copy.
- Player dock displays clean, refined analog typography.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - Production build succeeds (exit 0)

## Exact manual test steps

1. Navigate to `/eras` at desktop width (≥1280px / xl):
   - Confirm the Career Spine sidebar is HIDDEN at the top of the page; verify the
     `PosterHero` headline has 100% unobstructed margin.
   - Scroll down into the era cards; confirm the Career Spine smoothly fades in and tracks
     the active chapter.
   - Scroll back to the very top; confirm the spine smoothly hides before reaching the hero text.
2. Navigate to `/impact`:
   - Inspect the Danfo Transit Map; verify all copy reads like an authentic cultural
     geography archive (no prototype/fake bus tickets).
3. Navigate to `/influence`:
   - Inspect the Lineage Blueprint; verify copy reflects authentic music history and roster records.
4. Play a song from `/songs`:
   - Confirm the player dock displays the refined analog header bar without visual clutter.

## Execution record

- User approved this implementation prompt on 6 November 2026.
- Fixed the Career Spine sidebar overlap:
  - `src/components/CareerSpine.tsx` now listens to scroll position (`window.scrollY > 280`), remaining hidden while the reader is viewing the `PosterHero` headline and smoothly transitioning in (`opacity-100 translate-x-0`) once they scroll into the era cards.
  - Mobile bottom rail also hides at the top and slides up when scrolling into chapters.
  - Refined headers to "CAREER TIMELINE · 2010 — PRESENT" and "Chapter Wayfinding".
- Production-grade editorial copy cleanup across all promoted components:
  - `DanfoTransitMap.tsx`: Replaced prototype tokens (`BRT-EXP-01`, `Conductor Log`, `FARE: VALIDATED PASS`, `PUNCH: CONFIRMED`) with authentic cultural geography terms (`Danfo Route Schematic`, `Curatorial Notes`, `STATUS: VERIFIED`).
  - `LineageBlueprint.tsx`: Replaced prototype spec strings (`SPEC: BLUEPRINT-2026`, `SCALE: DYNASTIC 1:1`, `CLEARANCE: PUBLIC ARCHIVE`) with authentic dynasty lineage terms (`YBNL Dynasty Lineage`, `Complete Lineage`, `VERIFIED ARCHIVE ROSTER`).
  - `PlayerDock.tsx`: Cleaned up the cassette header bar to `OLAMIDEVERSE SOUND SYSTEM` and `STEREO DOCK`.
  - `ImpactViewSwitcher.tsx` & `InfluenceViewSwitcher.tsx`: Refined view perspective labels.
- Verification checks:
  - `npx tsc --noEmit`: passed (exit 0).
  - `npm run lint`: passed (exit 0, single existing unused `accent` warning in `albums/[slug]/page.tsx:66`).
  - Production build: passed (exit 0, all 176 static pages compiled).
