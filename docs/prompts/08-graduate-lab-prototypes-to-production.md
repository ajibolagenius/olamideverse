# 08 — Graduate Lab Prototypes to Production Archive Routes

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Graduate all six verified visual, cartographic, tactile, and editorial enhancements
from `/lab` into the live production archive routes (`src/app/(site)/`, core components,
and `src/app/globals.css`):

1. **Career Spine Wayfinding (`/eras`)**:
   - Promote `CareerSpine` into `src/components/CareerSpine.tsx`.
   - Mount it on `src/app/(site)/eras/page.tsx` with section anchor IDs (`#era-${slug}`)
     and scroll margins, providing persistent vertical wayfinding on desktop and the
     tactile chapter rail on mobile.
2. **Lagos Danfo Transit Map (`/impact`)**:
   - Promote `DanfoTransitMap` into `src/components/DanfoTransitMap.tsx`.
   - Integrate it into `src/app/(site)/impact/page.tsx` with an interactive view switcher
     (Danfo Transit Metro vs Geographic Map), conductor ticket punch stubs, and station board.
3. **YBNL Lineage Blueprint (`/influence`)**:
   - Promote `LineageBlueprint` into `src/components/LineageBlueprint.tsx`.
   - Mount it on `src/app/(site)/influence/page.tsx` with a view switcher between the
     canvas graph and the architectural blueprint dynasty matrix with detective dossiers.
4. **Tactile Cassette Boombox Player Dock (`PlayerDock.tsx`)**:
   - Upgrade `src/components/player/PlayerDock.tsx` with physical cassette boombox chassis
     accents: Danfo header stripe, tape counter badge (`TAPE: SIDE A`), and dual rotating
     mini-spools during active playback.
5. **Lagos Signwriting & Hand-Painted Underlines (`PullQuote.tsx` & `globals.css`)**:
   - Add authentic SVG hand-painted brush under-strokes to `src/components/PullQuote.tsx`.
   - Add `.ov-misregistration` screen-print plate offset utility to `src/app/globals.css`.
6. **Display P3 Wide Gamut (`globals.css`)**:
   - Add `@supports (color: color(display-p3 1 1 1))` wide-gamut enhancements for
     `--color-danfo`, `--color-adire`, and `--color-oxide` in `src/app/globals.css` so
     modern OLED screens render vibrant street colors while preserving full sRGB fallback
     and strict WCAG AA contrast.

All existing archive routes continue to function statically with zero breaking changes,
preserving embeds-only rules, non-affiliation disclaimers, and accessibility standards.

## Skills and documentation read

- Repository `AGENTS.md`: sections 3 (UI reproduction), 4 (skills to lean on),
  5 (boundaries), 7 (Afro-street editorial, five named motions, static-first,
  mandatory disclaimer), and 10 (checks to run).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: paper/ink base, Danfo signature,
  two-voice typography, paste-up textures, and era definitions.
- `src/app/globals.css`: Tailwind v4 tokens and component layer.
- `src/lib/content-schema.ts` and `src/lib/content.ts`: `getEras()`, `getAlbums()`,
  `getImpactPlaces()`, `getInfluenceGraph()`.
- `docs/ACCESSIBILITY.md`: keyboard navigation, `prefers-reduced-motion` static state,
  touch targets (≥44px), and contrast requirements.

## Code and content inspected

- `src/app/(site)/eras/page.tsx`: era layout and card mapping.
- `src/app/(site)/impact/page.tsx`: impact map layout and breadcrumbs.
- `src/app/(site)/influence/page.tsx`: influence layout and ticker.
- `src/components/player/PlayerDock.tsx`: site-wide player dock and embed integration.
- `src/components/PullQuote.tsx`: quote highlights and citations.
- `src/app/globals.css`: tokens and existing marker classes.

## Decisions and assumptions

1. **Zero Breaking Changes**: The core routes retain their existing metadata, breadcrumbs,
   and disclaimers. New views are integrated seamlessly.
2. **Opt-in / Accessible View Switchers**:
   - `/impact`: Readers can toggle between the "Geographic Leaflet Map" and the
     "Lagos Danfo Transit Network" view.
   - `/influence`: Readers can toggle between the "Orbit Graph" and the
     "YBNL Dynasty Blueprint".
3. **Display P3 Graceful Degradation**: Using standard CSS `@supports` ensures older
   devices and browsers continue to render standard sRGB with zero degradation.
4. **Reduced Motion**: All animated elements (tape spools, hover misregistrations,
   smooth scrolling) respect `prefers-reduced-motion: reduce`.
5. **No Secrets or DB Writes**: Pure client/server presentation consuming existing static MDX/JSON.

## Files expected to touch or create

- `docs/prompts/08-graduate-lab-prototypes-to-production.md`: this prompt.
- `src/app/globals.css`: Display P3 gamut block and `.ov-misregistration` class.
- `src/components/CareerSpine.tsx`: promoted core component.
- `src/app/(site)/eras/page.tsx`: integration of Career Spine.
- `src/components/DanfoTransitMap.tsx`: promoted core component.
- `src/app/(site)/impact/page.tsx`: integration of Danfo Transit Map.
- `src/components/LineageBlueprint.tsx`: promoted core component.
- `src/app/(site)/influence/page.tsx`: integration of Lineage Blueprint.
- `src/components/player/PlayerDock.tsx`: tactile cassette boombox styling.
- `src/components/PullQuote.tsx`: hand-painted SVG brush underline.

## Requirements and security considerations

1. Zero external dependencies added.
2. All third-party embeds remain through existing `EmbedFrame` wrappers; no audio files hosted.
3. Every page retains the mandatory non-affiliation disclaimer.
4. All interactive controls are keyboard navigable and pass WCAG AA contrast.

## Acceptance criteria and checks

- `/eras` renders the Career Spine (persistent left rail on desktop, bottom rail on mobile)
  and clicking era nodes jumps to the matching era card.
- `/impact` includes the Lagos Danfo Transit Network view with route schematic and ticket punch stubs.
- `/influence` includes the YBNL Dynasty Blueprint view with dossier sheets.
- The persistent player dock displays the tactile cassette boombox chassis and spinning spools.
- Pull-quotes render the hand-painted SVG brush flourish.
- `src/app/globals.css` includes Display P3 gamut enhancement without syntax errors.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - Production build succeeds (exit 0)

## Exact manual test steps

1. Open `/eras`:
   - Verify the fixed Career Spine on desktop; scroll down and observe active era update.
   - Click an era node (e.g. `03 · The Street King Run`); confirm smooth jump.
   - Test on 390px mobile viewport: verify bottom chapter rail functions cleanly.
2. Open `/impact`:
   - Switch between "Danfo Transit Schematic" and "Geographic Map" modes.
   - Select a transit stop (e.g. Bariga or Indigo at The O2) and verify ticket punch card updates.
3. Open `/influence`:
   - Switch to "YBNL Dynasty Blueprint" mode.
   - Filter by "Signed Roster" and click an artist to verify the archival dossier displays.
4. Trigger music playback from any song or snippet:
   - Verify the persistent player dock displays the cassette boombox chassis with rotating spools.
5. Inspect pull-quotes across the site for the hand-painted brush underline flourish.
6. Verify legal disclaimer remains present on all modified pages.

## Execution record

- User approved this implementation prompt on 6 November 2026.
- Graduated all six verified enhancements to production archive routes and components:
  1. `src/components/CareerSpine.tsx` mounted on `src/app/(site)/eras/page.tsx` with anchor IDs (`#era-${slug}`) and scroll offsets.
  2. `src/components/DanfoTransitMap.tsx` and `src/components/ImpactViewSwitcher.tsx` integrated into `src/app/(site)/impact/page.tsx`.
  3. `src/components/LineageBlueprint.tsx` and `src/components/InfluenceViewSwitcher.tsx` integrated into `src/app/(site)/influence/page.tsx`.
  4. Cassette boombox styling, dual animated rotating spools, and stereo tape counter badges integrated into `src/components/player/PlayerDock.tsx`.
  5. Hand-painted SVG brush underline accent integrated into `src/components/PullQuote.tsx`.
  6. Display P3 gamut `@supports (color: color(display-p3 1 1 1))` block and `.ov-misregistration` screen-print hover class added to `src/app/globals.css`.
- Verification checks:
  - `npx tsc --noEmit`: passed (exit 0).
  - `npm run lint`: passed (exit 0, single existing unused `accent` warning in `albums/[slug]/page.tsx:66`).
  - Production build: passed (exit 0, all 176 static pages compiled).
