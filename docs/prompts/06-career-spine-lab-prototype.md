# 06 — Career Spine & Editorial Materiality Lab Prototype

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Build an isolated, interactive presentation prototype in `/lab/spine` that brings
together the merged visual concepts:
1. **The Six-Era Career Spine**: A signature wayfinding element that ties Olamide's
   six eras, albums, places, and influences into a single, cohesive timeline rail
   (desktop persistent rail + touch-friendly mobile bottom rail).
2. **Editorial Document Curation & Pacing**: Authentic zine/archive curation with
   documentary folio headers (`ARCHIVE FILE: 06 // BARIGA-TO-THE-WORLD`), rubber-style
   accession stamps, and high-contrast magazine density (bold poster scale
   alternating with calm two-column newsprint reading measures).
3. **Afro-Street Materiality & Tactile Music Artifacts**:
   - Screen-print plate misregistration (subtle offset ink/accent hover cues).
   - Restrained SVG halftone/stipple matrix treatment for archival photography.
   - Physical music tangibility: a cassette J-card sleeve accordion for album tracklists.

This prototype lives strictly in the presentational experiment space (`/lab/spine`
and a `/lab` index) with zero backend, database, or CMS mutations. Production
archive pages (`/eras`, `/albums`, `/songs`) remain completely untouched.

## Skills and documentation read

- Repository `AGENTS.md`: sections 3 (UI reproduction), 4 (skills to lean on),
  5 (boundaries), 7 (Afro-street editorial, five named motions, static-first,
  mandatory disclaimer, `/lab` isolation), and 10 (checks to run).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: core tokens, paper/ink base,
  Danfo yellow signature, two-voice typography, paste-up textures, and era definitions.
- `src/app/globals.css`: Tailwind v4 tokens (`--color-danfo`, `--color-adire`,
  `--color-paper`, `--shadow-paste`, `--shadow-print`, `--font-display`, `--font-text`).
- `src/lib/motion.ts`: GSAP + ScrollTrigger five named behaviors.
- Installed Next.js guide `node_modules/next/dist/docs/01-app/02-guides/mdx.md`.
- `wcag-audit-patterns` and `docs/ACCESSIBILITY.md`: keyboard navigation,
  `prefers-reduced-motion` static state, and contrast requirements.

## Code and content inspected

- `src/lib/content.ts` and `src/lib/content-schema.ts`: `getEras()` (ordered 1–6)
  and `getAlbums()`, with slugs, years, accents, and moment beats.
- `src/lib/accents.ts`: `accentChrome`, `accentText`, and era-specific color mappings.
- `src/components/ui/TornEdge.tsx` and `src/components/ui/DuotoneScrubber.tsx`:
  existing vector torn edge and duotone treatments.
- `src/components/chrome/DisclaimerStrip.tsx`: legal disclaimer pattern.
- `src/app/layout.tsx`: root layout providing metadata, `globals.css`, and fonts.
- `src/app/(site)/layout.tsx`: site chrome containing disclaimer and player dock.

## Decisions and assumptions

1. **Isolation in `/lab`**: Keep the entire prototype inside `/lab/` and `src/components/lab/`.
   No existing routes or shared components are modified.
2. **Mandatory Disclaimer**: Include the non-affiliation disclaimer strip on every lab page
   as required by `AGENTS.md` §7.
3. **Real Content Grounding**: Wire the prototype to the real archive content via `getEras()`
   and `getAlbums()` rather than dummy text, demonstrating the actual 16-year narrative arc
   from Bariga (2010 Upstart) to the modern era (2026+ Legacy).
4. **Accessibility & Reduced Motion**:
   - The Career Spine rail must be fully keyboard accessible (Tab + Enter/Space jump to era).
   - Provide clear ARIA landmarks and active states (`aria-current="step"`).
   - Under `prefers-reduced-motion: reduce`, disable all smooth scrolling offsets and
     misregistration animations; present a clean, static, instantaneous jump.
5. **Zero External Dependencies**: Build the SVG halftone matrix filter with native SVG
   primitives (`<feTurbulence>`, `<feColorMatrix>`); no third-party libraries.
6. **No SaaS or Cyberpunk Elements**: No glassmorphism, no neon glows, no generic 3D blobs.
   Everything uses paper grounds, warm ink, Danfo accents, and sharp corners (`--radius: 0`).

## Files expected to touch or create

- `docs/prompts/06-career-spine-lab-prototype.md`: this implementation prompt.
- `src/app/lab/layout.tsx`: isolated lab layout with disclaimer strip and header back to archive.
- `src/app/lab/page.tsx`: `/lab` index listing active experiment prototypes.
- `src/app/lab/spine/page.tsx`: the interactive prototype page integrating all 3 merged pillars.
- `src/components/lab/CareerSpine.tsx`: interactive desktop timeline rail + mobile touch pill rail.
- `src/components/lab/CassetteJCard.tsx`: tactile cassette inlay sleeve for album tracklists.
- `src/components/lab/HalftoneImage.tsx`: SVG halftone dot-matrix archival photo component.

## Requirements and security considerations

1. Zero database writes, CMS mutations, API routes, or admin endpoints.
2. No secrets or service-role keys used.
3. Clean separation: code in `src/app/lab/` and `src/components/lab/` must not leak into
   or alter `(site)` bundle sizes or behaviors.
4. All images use existing static archive assets or SVG vector placeholders.
5. High contrast: text on Danfo yellow must use Ink; text on Adire/Ink must use Paper.

## Acceptance criteria and checks

- `/lab` renders an index with a clear link to the Career Spine prototype.
- `/lab/spine` renders the complete six-era timeline (2010–2026+) using the Career Spine rail.
- Clicking an era on the Career Spine smoothly scrolls to that era chapter and updates the active step.
- Mobile viewport (390px): The desktop vertical rail hides cleanly and a fixed bottom chapter
  dock appears with horizontal scroll and tap-to-navigate.
- Folio marks (`ARCHIVE FILE: 06...`), accession stamps, and two-column newsprint measures render.
- The Cassette J-Card component displays tracklists with physical foldout styling.
- The HalftoneImage component renders archival photography with a high-contrast dot-matrix texture.
- The non-affiliation disclaimer is clearly visible.
- Code passes all mandatory repo checks:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`

## Exact manual test steps

1. Run `npm run dev` and open `http://localhost:3000/lab`.
2. Confirm the lab index loads with the disclaimer and a card pointing to `/lab/spine`.
3. Open `/lab/spine` at desktop width (1440px):
   - Verify the fixed Career Spine on the side showing all six eras with their dates and accent colors.
   - Click each era node; verify smooth scroll to the matching era beat and active state update.
   - Verify the folio headers, newsprint typography, drop caps, and accession stamps.
   - Interact with the Cassette J-Card component: click to expand the tracklist sleeve.
   - Hover over era cards to inspect the subtle screen-print plate misregistration.
4. Open Chrome DevTools and resize viewport to 390px width (iPhone 14/15):
   - Confirm the desktop side rail is hidden.
   - Confirm the mobile bottom tactile chapter rail is fixed, horizontally swipeable, and taps work.
   - Confirm no horizontal page overflow (`overflow-x: hidden`).
5. Toggle `prefers-reduced-motion: reduce` in DevTools rendering settings:
   - Verify animations settle instantly with no jump or disorientation.
6. Verify the non-affiliation disclaimer is visible on `/lab` and `/lab/spine`.

## Execution record

- User approved this implementation prompt on 6 November 2026.
- Built isolated presentation experiment in `/lab` and `/lab/spine`:
  - `src/components/lab/CareerSpine.tsx`: persistent vertical timeline rail (desktop) + horizontal tactile bottom chapter rail (mobile) with intersection tracking and keyboard accessibility.
  - `src/components/lab/HalftoneImage.tsx`: SVG dot-matrix print halftone filter, era duotone wash, hover plate misregistration, and accession reference badges.
  - `src/components/lab/CassetteJCard.tsx`: tactile West African cassette inlay sleeve with foldable Side A / Side B tracklists, catalog numbers, and paper crease borders.
  - `src/app/lab/layout.tsx`: dedicated lab layout with mandatory non-affiliation disclaimer and archive return navigation.
  - `src/app/lab/page.tsx`: lab experiment directory index.
  - `src/app/lab/spine/page.tsx`: interactive prototype presenting the complete six-era narrative arc, documentary folios, drop-caps, and materiality components.
- Restored `public/sw.js` build stamp to keep changes cleanly scoped.
- Verification checks:
  - `npx tsc --noEmit`: passed (exit 0).
  - `npm run lint`: passed (exit 0, single existing unused `accent` warning in `albums/[slug]/page.tsx:66`).
  - Production build: passed (exit 0, all 171 static pages compiled including `/lab` and `/lab/spine`).
