# 11 — Phase 1 Platform Revamp: Magazine Front Cover & Discography Vinyl Crate

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Restructure and elevate the visual materiality of Phase 1 of the platform — specifically the **Homepage (`/`)** and the **Discography (`/albums` & `/albums/[slug]`)** — using the upgraded Afro-street editorial design system established across `/eras`, `/impact`, `/influence`, `/lab`, and the persistent cassette player dock.

Scope covers:
1. **Homepage (`src/app/(site)/page.tsx`)**:
   - Transform into a full-scale Afro-street music magazine front cover.
   - Masthead folio details: volume numbers, edition date stamps, Bariga datelines, and newspaper lead story callouts.
   - Interactive Era Quick-Spine strip: tactile 6-chapter wayfinding dock directly below the hero.
   - Curated Archive Crate: multi-era record spread ("Essential Pressings") featuring physical sleeve styling.
   - Elevated "On This Day" anniversary dispatch: newsprint clipping border with archival verification stamp.
   - Tactile Dispatch Doors: bus conductor transit punch tickets for quick jumps into Eras, Discography, and Media.
2. **Discography (`src/app/(site)/albums/page.tsx` & `src/components/AlbumGrid.tsx`)**:
   - Introduce an archival **View Switcher**: "Editorial Cards" vs. "Vinyl Crate" view.
   - "Vinyl Crate" mode simulates browsing through physical record spines with catalog serial numbers, era color edge-tabs, and release year stamps.
   - Archival filter console styled like a catalog index drawer with tactile era divider tabs and sort tags.
3. **Album Card & Detail Polish (`src/components/AlbumCard.tsx` & `src/app/(site)/albums/[slug]/page.tsx`)**:
   - Physical vinyl sleeve accents: subtle cardboard ring wear, catalog code stickers (`YBNL-LP-01`), and vinyl groove edge peek on hover.
   - Detail page gatefold layout: authentic liner notes typography, wax stamp era seals, and producer credits box.

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (editorial archive, no audio/video hosting), 2 (work loop), 3 (visual reference reproducibility), 5 (boundaries), 7 (decisions: paper/ink, danfo yellow, 5 GSAP behaviors), and 10 (checks).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: paper/ink editorial aesthetic, Bariga roots, Danfo transit culture.
- `src/app/globals.css`: Tailwind v4 tokens (`@theme`, `shadow-paste`, `shadow-print`, `ov-tape`, `ov-stamp`, Display P3 enhancements).
- `src/lib/content-schema.ts`: `Album`, `Era`, `ALBUM_TYPE_LABEL`.

## Code and content inspected

- `src/app/(site)/page.tsx`: home hero, ticker, anniversary card, chapter one feature.
- `src/components/PosterHero.tsx`: full-bleed hero component.
- `src/components/OnThisDay.tsx`: anniversary banner.
- `src/components/AlbumCard.tsx` & `src/components/AlbumGrid.tsx`: discography grid and card structure.
- `src/app/(site)/albums/[slug]/page.tsx`: album detail layout, tracklist, and sleeve notes.
- `src/components/lab/CassetteJCard.tsx`: physical music packaging patterns.

## Decisions and assumptions

1. **Static-First & Non-Breaking**: All existing data flow (`getAlbums()`, `getEras()`, `getOnThisDay()`, metadata) remains 100% intact. Zero database or CMS schema modifications.
2. **Pure Styling & Component Composition**: New views (like the Vinyl Crate) are purely presentational client components layered over existing typed models.
3. **Responsive Consistency**: The Vinyl Crate and Magazine Cover adapt smoothly from mobile (touch-friendly horizontally scrollable spines) to desktop (interactive crate rack).
4. **Motion System Compliance**: Only the five named motion behaviors (`ink-reveal`, `paste-up`, `roll-by`, `duotone-shift`, `pin-scroll`) are used, respecting `prefers-reduced-motion`.
5. **No Third-Party Bloat**: No Framer Motion, no heavy 3D canvas libraries; everything is rendered with clean SVG, Tailwind CSS v4, and lightweight React state.

## Files to touch

- `docs/prompts/11-phase-1-platform-revamp-home-and-discography.md`: this prompt.
- `src/app/(site)/page.tsx`: magazine front cover layout, quick-spine strip, essential pressings crate.
- `src/components/AlbumCard.tsx`: cardboard sleeve patina, catalog sticker, vinyl edge peek.
- `src/components/AlbumGrid.tsx`: view switcher (Cards vs. Crate), index drawer filter console.
- `new file: src/components/VinylCrate.tsx`: interactive vinyl crate browsing component.
- `src/app/(site)/albums/[slug]/page.tsx`: gatefold sleeve notes styling and wax stamp seal.

## Requirements and security considerations

1. Zero external network requests or secrets; purely static/server-rendered content from `content/`.
2. Fully typed with TypeScript strict mode.
3. WCAG AA accessibility: all interactive crate spines and filters have keyboard focus indicators, ARIA labels, and minimum 44px tap targets.
4. Disclaimer ("Not affiliated with Olamide or YBNL Nation") and legal posture strictly preserved.

## Acceptance criteria and checks

- Homepage (`/`) displays elevated magazine front cover with Quick-Spine, Folio date stamp, Essential Pressings spread, and conductor ticket doors.
- `/albums` allows toggling between Editorial Cards and Vinyl Crate view, filtering seamlessly across all 6 eras.
- `/albums/[slug]` renders the enhanced gatefold sleeve layout with authentic liner notes aesthetic.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Run `npm run dev` and navigate to `/`:
   - Inspect the magazine front cover: check the folio header, the interactive 6-chapter quick-spine, and the "Essential Pressings" crate.
   - Click an era node on the quick-spine to verify direct jump to `/eras`.
2. Navigate to `/albums`:
   - Toggle between "Cards" and "Vinyl Crate" views using the view switcher.
   - In "Vinyl Crate" view, hover or click different record sleeves to preview album art and release metadata.
   - Filter by era (e.g. "The Street King Run") and verify both views update instantly.
3. Click an album (e.g. `/albums/baddest-guy-ever-liveth`):
   - Verify the gatefold sleeve header, wax seal era badge, and clean liner notes presentation.
4. Verify mobile responsiveness on iPhone viewport (375px) in developer tools.

## Execution record

- Prompt prepared and approved.
- Built interactive `VinylCrate.tsx` with animated disc pull-out, spine selection, and gatefold inspection pane.
- Enhanced `AlbumCard.tsx` with catalog stickers, ring-wear patina, and vinyl disc peeking out on hover.
- Enhanced `AlbumGrid.tsx` with view mode switcher ("Cards" vs. "Vinyl Crate") and index drawer toolbar.
- Revamped `src/app/(site)/page.tsx` into an Afro-street music magazine front cover with archival folio strip, 6-chapter Quick-Spine, and Essential Pressings spread.
- Upgraded `src/app/(site)/albums/[slug]/page.tsx` with gatefold sleeve styling, archive sticker, and studio session log header.
- Verified type check (`npx tsc --noEmit`), lint (`npm run lint`), and production build (`npx next build --webpack`).
