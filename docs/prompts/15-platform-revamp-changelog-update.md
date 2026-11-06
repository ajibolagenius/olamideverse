# 15 — Platform Revamp Changelog Update

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Document the platform-wide design system revamp across Phases 1 through 4 in the public reader-facing changelog ([`src/lib/changelog.ts`](src/lib/changelog.ts)) and mirror the entries in the root [`CHANGELOG.md`](CHANGELOG.md).

Features to document under the 6 November 2026 update:
1. **Afro-Street Magazine Front Cover & Discography Vinyl Crate (Phase 1)**:
   - Homepage (`/`) restructured into a full-scale Afro-street music magazine front cover with masthead volume folio, lead story callouts, tactile 6-chapter Quick-Spine dock, and "Essential Pressings" crate.
   - Discography (`/albums`) upgraded with an archival View Switcher: "Editorial Cards" vs. "Vinyl Crate", simulating physical record spines with catalog numbers, ring-wear patina, vinyl disc hover peek, and gatefold studio master logs.
2. **Catalogue Archival Dossiers & Media Screening Wall (Phase 2)**:
   - Songs Catalogue (`/songs`) Manila Dossier Cards view with tab folders, era tape badges, and status confidence stamps (`Verified`, `Documented`, `Lore`).
   - Media Archive (`/media`) transformed into a Lagos Outdoor Cinema & VHS screening wall, featuring lobby cards, projection booth player, and broadcast ledger table.
3. **Biography Longform Marginalia & Hand-Painted Street Lingo Signboards (Phase 3)**:
   - Biography (`/biography`) archival magazine spread with manuscript folio, typed identity dossier, two-column layout with dedicated timeline marginalia notes on desktop, era ribbons, and imprimatur closing.
   - Street Lingo (`/slang`) upgraded with an accessible View Switcher: "Danfo Signboards" (hand-painted Lagos street route signs with heavy stencil borders, era colorways, and roadside usage tape callouts) vs. "Lexicon Ledger", strictly preserving authentic Yoruba orthography and tonal underdots.
4. **Snippets Broadcast Studio & Cassette Voice-Notes (Phase 4)**:
   - Snippets Studio (`/snippets`) Broadcast Vault Folio bar, instant text query, and accessible View Switcher: physical Cassette J-Cards (with tape spool windows and liner notes) vs. Broadcast Soundcards (typographic audiogram cards with live dynamic waveform equalizers).
   - Snippet Detail (`/snippets/[id]`) analog studio broadcast deck featuring a tape monitor frame around streaming embeds, session dispatch notes, and previous/next deck controls.

## Skills and documentation read

- Repository `AGENTS.md`: sections 2 (work loop), 5 (boundaries), 7 (editorial voice, mandatory disclaimer), 9 (Yoruba diacritics), and 10 (checks to run).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: reader-facing editorial tone and material design principles.
- `src/lib/changelog.ts` and `src/app/(site)/changelog/page.tsx`: changelog schema and public feed.
- `CHANGELOG.md`: keep-a-changelog format and alignment rules.

## Code and content inspected

- `src/lib/changelog.ts`: current entries under `date: "2026-11-06"`.
- `CHANGELOG.md`: current entries under `### 2026-11-06`.
- Completed revamp routes: `/`, `/albums`, `/songs`, `/media`, `/biography`, `/slang`, `/snippets`.

## Decisions and assumptions

1. **Strict Mirroring**: Both `src/lib/changelog.ts` and `CHANGELOG.md` will stay strictly synchronized.
2. **Reader-First Editorial Voice**: Entries are curated for readers, journalists, and fans, explaining how these visual and tactile modifications enhance navigation and historical preservation.
3. **Deep Linking**:
   - Magazine Cover & Discography Crate link to `/albums`.
   - Manila Dossiers link to `/songs`.
   - Outdoor Cinema Screening Wall links to `/media`.
   - Biography Marginalia links to `/biography`.
   - Danfo Signboards link to `/slang`.
   - Snippets Broadcast Studio links to `/snippets`.
4. **Preserve Prior 2026-11-06 Items**: Maintain all previously logged 2026-11-06 items (Burukutu, Goosebumps, Career Spine, Danfo Route Map, Dynasty Lineage, Cassette Dock, Design Lab) so history is complete.

## Files to touch

- `docs/prompts/15-platform-revamp-changelog-update.md`: this prompt.
- `src/lib/changelog.ts`: add platform revamp feature items under `2026-11-06`.
- `CHANGELOG.md`: add platform revamp feature items under `### 2026-11-06`.

## Requirements and security considerations

1. Zero backend changes, database writes, or environment secret alterations.
2. Valid TypeScript types for `ChangelogItem` (`title`, `body`, optional `href`).
3. Keep line breaks, bullet formatting, and markdown links consistent with existing entries.

## Acceptance criteria and checks

- `/changelog` renders all new platform revamp entries under the 6 November 2026 date with functioning deep links.
- `CHANGELOG.md` mirrors the exact items under `### 2026-11-06`.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Visit `http://localhost:3000/changelog`:
   - Verify the 6 November 2026 entry contains the new platform revamp dispatches (Magazine Cover & Vinyl Crate, Archival Catalogue Dossiers, Media Screening Wall, Biography Marginalia & Danfo Signboards, Snippets Broadcast Studio).
   - Test each new deep link (`/albums`, `/songs`, `/media`, `/biography`, `/slang`, `/snippets`) and confirm navigation functions as expected.
2. Inspect `CHANGELOG.md`:
   - Verify all entries match `src/lib/changelog.ts` verbatim in fact, tone, and date.
