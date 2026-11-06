# 14 — Phase 4 Platform Revamp: Snippets Studio & Audiograms

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Restructure and elevate Phase 4 of the platform — specifically the **Snippets Broadcast Studio (`/snippets`)** and **Snippet Detail Pages (`/snippets/[id]`)** — using the authentic Afro-street editorial design system, physical cassette tape materiality, and tactile broadcast aesthetics.

Scope covers:
1. **Snippets Broadcast Studio (`src/app/(site)/snippets/page.tsx` & `src/components/SnippetGrid.tsx`)**:
   - Introduce an archival **View Switcher**: "Cassette J-Cards" (Physical cassette inlay cases with tape spools, catalog codes, and liner notes) vs. "Broadcast Soundcards" (High-contrast typographic poster cards with dynamic waveform equalizer bars).
   - Add accessible view toggle with `role="group"` and `aria-pressed` states.
   - Introduce an archival **Broadcast Vault Folio Bar** with session metadata (`VAULT REF: SNP-YBNL-01`), tape reel classification, and streaming embed notices ("Third-party embeds only · Zero audio hosted").
   - Instant search filter (by track, quote, album, or historical note) alongside existing era filter chips.
2. **Audiogram Card Component (`src/components/AudiogramCard.tsx`)**:
   - Physical cassette tape and soundcard styling with misregistration accent offsets (`isolate`), cassette spine headers (`MC-YEAR-{ID}`), and era colorway accents.
   - Dynamic waveform equalizer visualizer with accented peak bars reflecting the era palette.
   - Integrated action triggers: Copy Link (`ShareSnippet`), Social Story trigger (`ShareToStory`), and direct Archive Dossier link.
3. **Snippet Detail Broadcast Deck (`src/app/(site)/snippets/[id]/page.tsx`)**:
   - Re-architect into an analog **Studio Broadcast Deck** layout.
   - Analog tape monitor frame around the third-party streaming embed (`EmbedFrame`).
   - Archival Liner Notes dispatch: track provenance, album gatefold cross-reference, era context, and share suite.

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (editorial posture, embeds only, zero hosted audio), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic, 5 GSAP behaviors), and 10 (checks).
- `docs/VISUAL-IDENTITY.md`: Afro-street editorial identity, paper/ink base, danfo yellow accent, typography.
- `src/components/lab/CassetteJCard.tsx` and `src/components/lab/CassetteBoombox.tsx`: Physical cassette packaging, J-card inlays, magnetic tape spools, and analog meters.
- `src/lib/content-schema.ts`: `Snippet`, `Era`, `Album`.
- `src/lib/waveform.ts`: Waveform bar calculation algorithm.
- `src/lib/accents.ts`: `ACCENTS`, `accentChrome`, `accentText`.

## Code and content inspected

- `src/app/(site)/snippets/page.tsx`: Existing snippets hero, ticker, and container.
- `src/app/(site)/snippets/[id]/page.tsx`: Existing snippet detail view, embed frame, and metadata.
- `src/components/SnippetGrid.tsx`: Existing era filter and card grid.
- `src/components/AudiogramCard.tsx`: Existing audiogram card structure, waveform rendering, and share buttons.
- `content/snippets/snippets.json`: 17 verified snippets across all 6 career eras, each with Spotify track IDs and waveform seeds.

## Decisions and assumptions

1. **Embeds Only Posture Strictly Preserved**: All playback utilizes third-party embeds (Spotify, YouTube Music); zero audio or video is hosted or proxied.
2. **Accessible Interaction**: The View Switcher in `SnippetGrid.tsx` exposes `aria-pressed` states on both buttons and ensures all interactive controls maintain compliant contrast and tap targets.
3. **Responsive Materiality**: Cassette J-cards and broadcast soundcards stack cleanly across mobile and desktop viewports, with subtle rotation offsets that gracefully disable when `prefers-reduced-motion` is active.
4. **No Content Schema Alterations**: Read-only presentation upgrade; zero modifications to content schemas, Supabase, or build configurations.

## Files to touch

- `docs/prompts/14-phase-4-platform-revamp-snippets-and-audiograms.md`: This implementation prompt.
- `src/app/(site)/snippets/page.tsx`: Upgrade with broadcast vault folio bar and enhanced ticker.
- `src/components/SnippetGrid.tsx`: Implement View Switcher (Cassette J-Cards vs. Broadcast Soundcards), text search filter, and responsive grid layout.
- `src/components/AudiogramCard.tsx`: Enhance with physical tape misregistration accents, cassette spine header, and dynamic waveform colors.
- `src/app/(site)/snippets/[id]/page.tsx`: Upgrade into an analog studio broadcast deck layout with tape monitor frame and liner notes dispatch.

## Requirements and security considerations

1. Strictly read-only content pipeline: zero writes or schema mutations.
2. No external client dependencies or third-party fonts introduced.
3. Complete TypeScript type safety without `any`.
4. Full accessibility conformance: semantic markup, high contrast, `aria-pressed` on toggles, and screen-reader accessible names.

## Acceptance criteria and checks

- `/snippets` renders an archival broadcast studio with session folio, instant text search, and era filtering.
- Users can switch between "Cassette J-Cards" (physical tape inlay aesthetic) and "Broadcast Soundcards" (typographic audiogram cards) with `aria-pressed` properly exposed.
- `/snippets/[id]` renders the analog studio broadcast deck layout with tape monitor frame and liner notes dispatch.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Navigate to `/snippets` in browser:
   - Verify the top broadcast vault folio bar displays document reference and embed notice.
   - Verify the "Cassette J-Cards" view renders physical tape cases with tape spool windows and era accents.
   - Click "Broadcast Soundcards": verify view switches smoothly with `aria-pressed` active.
   - Type into the search input (e.g., "Patience", "Bobo", "Rock"): verify instant filtering across both views.
2. Navigate to `/snippets/eni-duro` in browser:
   - Verify the analog studio broadcast deck layout renders with tape monitor frame and liner notes.
   - Verify previous/next navigation buttons function smoothly.
   - Test "Copy link" button: verify toast notification appears.
