# 07 — Complete Lab Prototype Suite (Prototypes 01 to 06)

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Expand the presentational experiment space in `/lab` into a comprehensive 6-prototype
design suite, bringing all agreed visual, cartographic, tactile, and editorial concepts
together for interactive review prior to graduating them to production archive routes:

1. **Prototype 01 (`/lab/spine`)**: Career Spine & Editorial Materiality (already built,
   connecting six eras, documentary folios, SVG halftone, and cassette J-cards).
2. **Prototype 02 (`/lab/transit`)**: Lagos Danfo Transit Map & Route Schedules (reimagining
   `/impact` as a BRT/Danfo subway-style vector transit network from Bariga to world stages,
   with conductor punch stubs and route stop boards).
3. **Prototype 03 (`/lab/player`)**: Tactile Cassette Boombox & Vinyl Player Dock
   (dual rotating tape spools, analog VU meters, tactile transport buttons, and cassette
   chassis styling for player embeds).
4. **Prototype 04 (`/lab/lineage`)**: YBNL Lineage Blueprint & Archival Dossiers
   (reimagining `/influence` as an archival family tree blueprint connecting mentors,
   collaborators, and protégés across generations).
5. **Prototype 05 (`/lab/signwriting`)**: Lagos Hand-Painted Signwriting & Editorial Red-Penning
   (authentic Lagos street sign lettering, SVG hand-painted brush under-strokes, editor
   red-pen margin notes, and wax/rubber stamps).
6. **Prototype 06 (`/lab/p3-sensory`)**: Display P3 Wide Gamut & Sensory Micro-Interactions
   (side-by-side color space comparison showing Danfo Yellow in Display P3, analog tactile
   click audio feedback toggles, and native CSS scroll-driven animations).
7. **Lab Index (`/lab`)**: Updated showcase gallery featuring cards, status badges, tags,
   and launch links for all 6 active prototypes.

Scope remains strictly within `/lab` and `src/components/lab/`. No production `(site)`
pages or shared backend code are modified.

## Skills and documentation read

- Repository `AGENTS.md`: sections 3 (UI reproduction), 4 (skills to lean on),
  5 (boundaries), 7 (Afro-street editorial, five named motions, static-first,
  mandatory disclaimer, `/lab` isolation), and 10 (checks to run).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: core tokens, paper/ink base,
  Danfo yellow signature, two-voice typography, paste-up textures, and era definitions.
- `src/app/globals.css`: Tailwind v4 tokens (`--color-danfo`, `--color-adire`,
  `--color-paper`, `--shadow-paste`, `--shadow-print`, `--font-display`, `--font-text`).
- `src/lib/content-schema.ts`: `ImpactPlace`, `InfluenceGraph`, `Album`, `Era`.
- `src/lib/content.ts`: `getImpactPlaces()`, `getInfluenceGraph()`, `getEras()`, `getAlbums()`.
- `docs/ACCESSIBILITY.md`: keyboard navigation, `prefers-reduced-motion` static state,
  touch targets (≥44px), and WCAG AA contrast.

## Decisions and assumptions

1. **Isolation in `/lab`**: All new pages live in `src/app/lab/` and use components from
   `src/components/lab/`. Production routes (`/impact`, `/influence`, `/eras`, `/`) remain
   untouched until visual approval and explicit graduation instruction.
2. **Mandatory Disclaimer**: Every lab prototype page inherits `src/app/lab/layout.tsx`
   ensuring the non-affiliation disclaimer strip is displayed.
3. **Data Grounded**: Sourced from actual content records (`getImpactPlaces()`,
   `getInfluenceGraph()`, `getEras()`, `getAlbums()`).
4. **Zero Extra Dependencies**: Build all transit vectors, tape spools, blueprints,
   and brush flourishes with native SVG, React state, and Tailwind CSS v4 tokens.
5. **Reduced Motion**: Full fallback states for `prefers-reduced-motion: reduce`:
   tape spools remain static, transit transitions disable smooth pans, and hover
   misregistration disables offsets.

## Files expected to touch or create

- `docs/prompts/07-complete-lab-prototype-suite.md`: this prompt.
- `src/app/lab/page.tsx`: updated index grid for all 6 prototypes.
- `src/app/lab/transit/page.tsx` & `src/components/lab/DanfoTransitMap.tsx`: Prototype 02.
- `src/app/lab/player/page.tsx` & `src/components/lab/CassetteBoombox.tsx`: Prototype 03.
- `src/app/lab/lineage/page.tsx` & `src/components/lab/LineageBlueprint.tsx`: Prototype 04.
- `src/app/lab/signwriting/page.tsx` & `src/components/lab/SignwritingProof.tsx`: Prototype 05.
- `src/app/lab/p3-sensory/page.tsx` & `src/components/lab/P3SensoryLab.tsx`: Prototype 06.

## Requirements and security considerations

1. Presentational experiment space only; zero writes to Supabase or file system content.
2. No API keys or service role secrets required.
3. High visual contrast passing WCAG AA.
4. Clean build with webpack fallback if Turbopack subprocess encounters macOS sandbox issue.

## Acceptance criteria and checks

- `/lab` renders a clean gallery showcasing all 6 prototypes with working links.
- `/lab/transit` renders the Danfo subway-style route map, stop board, and conductor stubs.
- `/lab/player` renders the cassette boombox player with rotating spools and VU meters.
- `/lab/lineage` renders the archival YBNL family tree blueprint with dossiers.
- `/lab/signwriting` renders authentic hand-painted trade signs, brush underlines, and red-penning.
- `/lab/p3-sensory` renders the Display P3 gamut comparison, analog click sound toggle, and scroll timeline.
- All 6 prototypes display the non-affiliation disclaimer.
- Mandatory checks:
  - `npx tsc --noEmit` passes with 0 errors.
  - `npm run lint` passes with 0 errors.
  - Production build succeeds.

## Exact manual test steps

1. Navigate to `/lab` and verify all 6 prototypes are listed in the gallery.
2. Open `/lab/transit`:
   - Inspect the vector Danfo transit map (Bariga Origin → Ikeja → London → US).
   - Click a transit stop to inspect its conductor punch card and departure notes.
3. Open `/lab/player`:
   - Toggle Play/Pause; observe the dual cassette spools rotating and VU meter bouncing.
   - Switch tape modes (Dolby B, Normal/CrO2) and view cassette cassette shell aesthetics.
4. Open `/lab/lineage`:
   - View the archival blueprint graph; filter by Mentors, Roster, and Alumni.
   - Click an artist node (e.g. Fireboy DML or Asake) to open their dossier sheet.
5. Open `/lab/signwriting`:
   - Inspect the hand-painted Danfo brush signs and editor red-pen annotations.
6. Open `/lab/p3-sensory`:
   - Compare sRGB vs Display P3 Danfo Yellow.
   - Test the optional analog tape-click sound toggle.
7. Verify all pages adapt cleanly to mobile viewports (390px).

## Execution record

- User approved this implementation prompt on 6 November 2026.
- Built and verified all 6 prototypes and the showcase directory:
  - `src/app/lab/page.tsx`: 6-card interactive gallery with route metadata, tags, and launcher buttons.
  - `src/app/lab/transit/page.tsx` & `src/components/lab/DanfoTransitMap.tsx`: 45° vector transit schematic, stop departure board, and conductor ticket punch stubs.
  - `src/app/lab/player/page.tsx` & `src/components/lab/CassetteBoombox.tsx`: dual rotating tape reels, analog VU meter bars, Dolby NR controls, and 7-inch vinyl turntable mode.
  - `src/app/lab/lineage/page.tsx` & `src/components/lab/LineageBlueprint.tsx`: blue-grid architectural dynasty blueprint with dossier sheets and generation filters.
  - `src/app/lab/signwriting/page.tsx` & `src/components/lab/SignwritingProof.tsx`: hand-painted Danfo route signboards, red-pen circled years, and editorial manuscript marginalia.
  - `src/app/lab/p3-sensory/page.tsx` & `src/components/lab/P3SensoryLab.tsx`: Display P3 vs sRGB color-4 calibration, hardware detection via `useSyncExternalStore`, and Web Audio analog click synthesis.
  - `src/app/lab/spine/page.tsx`: Career Spine & Editorial Materiality prototype (built in Prompt 06).
- Verification checks:
  - `npx tsc --noEmit`: passed (exit 0).
  - `npm run lint`: passed (exit 0, single existing unused `accent` warning in `albums/[slug]/page.tsx:66`).
  - Production build: passed (exit 0, all 176 static pages compiled including all 6 lab routes).
