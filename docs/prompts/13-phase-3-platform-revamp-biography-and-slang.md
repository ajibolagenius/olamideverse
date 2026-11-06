# 13 — Phase 3 Platform Revamp: Biography Longform Marginalia & Street Lingo Signboards

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Restructure and elevate Phase 3 of the platform — specifically the **Biography (`/biography`)** and **Street Lingo (`/slang`)** pages — with the authentic Afro-street editorial identity, tactile materiality, and Danfo bus typography established across the archive.

Scope covers:
1. **Biography Page (`src/app/(site)/biography/page.tsx`)**:
   - Transform the longform narrative into a two-column editorial magazine spread on desktop (`xl`) with dedicated **Marginalia annotations** and responsive stacking on mobile.
   - Introduce an **Archival Manuscript Folio Bar** with document classification (`DOC REF: BIO-BARIGA-01`), timeline scope (`2010 — PRESENT`), and verified status.
   - Restyle the **Quick Facts** block into an authentic typed artist identity dossier / manuscript passport with wax seal stamp styling.
   - For each chapter:
     - Prominent chapter ribbons with Era badges, accent blocks, and direct links to `/eras/[eraSlug]`.
     - Editorial Marginalia callouts featuring historical context and scribe notes.
     - Drop-cap or styled initial markers and enhanced brush pull-quotes.
   - Elevate the **Throughline Epilogue** into an archival imprimatur with closing credentials and direct era navigation.
2. **Street Lingo Page (`src/app/(site)/slang/page.tsx` & `src/components/SlangGrid.tsx`)**:
   - Introduce an archival **View Switcher**: "Danfo Signboards" vs. "Lexicon Ledger" (with `aria-pressed` for accessibility).
   - **Danfo Signboards View**: Hand-painted Lagos street signboards modeled directly on `src/components/lab/SignwritingProof.tsx`, with heavy stencil borders, weathered paint backgrounds (`danfo`, `oxide`, `adire`, `palm`, `clay`), slight rotation offsets, dashed inner borders, phonetic pronunciation tags, and roadside context tape callouts.
   - **Lexicon Ledger View**: Clean, high-density typographical dictionary table with horizontal scroll protection (`min-w-[640px]`), structured columns (Term, Pronunciation, Translation, Meaning, Carrier Song), and era color chips.
   - Elevate `src/app/(site)/slang/page.tsx` with an official cultural vocabulary register masthead and Yoruba diacritic preservation notice.

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (editorial posture, embeds only), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic, 5 GSAP behaviors), 9 (Yoruba diacritics with underdots), and 10 (checks).
- `docs/VISUAL-IDENTITY.md`: Afro-street editorial identity, paper/ink base, danfo yellow accent, typography guidelines.
- `src/components/lab/SignwritingProof.tsx`: Hand-painted Lagos Danfo bus signboards and editorial manuscript proof sheet patterns.
- `src/lib/content-schema.ts`: `Biography`, `BiographyChapter`, `SlangTerm`, `Era`.
- `src/lib/accents.ts`: `ACCENTS`, `accentChrome`, `accentText`.

## Code and content inspected

- `src/app/(site)/biography/page.tsx`: Existing biography layout, `PosterHero`, quick facts grid, and chapter loop.
- `content/biography/biography.mdx`: Biography frontmatter containing 6 chapters matching the 6 eras, quick facts, pull quotes, and closing text.
- `src/app/(site)/slang/page.tsx`: Existing slang page wrapper, hero, and ticker.
- `src/components/SlangGrid.tsx`: Existing client-side filtering, poster generator modal, and basic card grid.
- `content/slang/slang.json`: 7 verified slang terms featuring full Yoruba diacritics (`Ẹni Dúró`, `Baddo Sneh`, `Shoki`, `Shakitibobo`, `Ọmọ Wóbè`, `Wó!`, `Science Student`).

## Decisions and assumptions

1. **Yoruba Diacritics Integrity**: Preserve all Yoruba underdots (ẹ, ọ, ṣ) and tone accents exactly as authored; never strip diacritics.
2. **Accessible View Switching**: The View Switcher in `SlangGrid.tsx` exposes `aria-pressed` states on both buttons and ensures all interactive controls maintain compliant contrast and tap targets.
3. **Responsive Marginalia**: On large viewports (`xl`), marginalia notes sit in a dedicated left/margin column aligned with their chapters; on smaller screens (`< xl`), marginalia collapses gracefully into a compact chapter header card so no editorial notes are hidden or squished.
4. **Motion System Compliance**: All hover tilts and subtle rotations use Tailwind `transform transition-transform` and respect `prefers-reduced-motion` where animations exist.
5. **No Data Schema Alterations**: Pure frontend presentation and design system revamp; zero modifications to content schemas, Supabase, or build configurations.

## Files to touch

- `docs/prompts/13-phase-3-platform-revamp-biography-and-slang.md`: This implementation prompt.
- `src/app/(site)/biography/page.tsx`: Restructure with archival folio masthead, identity dossier, two-column magazine spread with marginalia, chapter ribbons, and imprimatur closing.
- `src/components/SlangGrid.tsx`: Implement View Switcher (Danfo Signboards vs. Lexicon Ledger), hand-painted Danfo signboards component from `SignwritingProof.tsx`, and responsive lexicon ledger.
- `src/app/(site)/slang/page.tsx`: Upgrade with cultural vocabulary register masthead, diacritics note, and stats ticker.

## Requirements and security considerations

1. Strictly read-only content pipeline: zero writes or schema mutations.
2. No external client dependencies or third-party fonts introduced.
3. Complete TypeScript type safety without `any`.
4. Full accessibility conformance: semantic markup, high contrast, `aria-pressed` on toggles, and screen-reader accessible names.

## Acceptance criteria and checks

- `/biography` renders an Afro-street editorial magazine layout with archival folio, typed identity dossier, two-column spread with marginalia notes on desktop, and graceful responsive stacking on mobile.
- `/slang` allows toggling between "Danfo Signboards" (hand-painted bus route placards with era colorways) and "Lexicon Ledger" (structured dictionary table) with instant search and era filter.
- Yoruba diacritics and underdots render perfectly in both views.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Navigate to `/biography` in browser:
   - Verify the top archival folio bar renders with document reference and status stamp.
   - Verify the Quick Facts block displays as a typed identity dossier with clear borders and badges.
   - Verify the chapters render with era ribbons, chapter numbers (`CHAPTER 01`, etc.), marginalia notes, and brush pull quotes.
   - On desktop, verify marginalia notes sit in the margin alongside each chapter; on mobile, verify they stack neatly above the narrative.
2. Navigate to `/slang` in browser:
   - Verify the Danfo Signboards view renders with hand-painted Lagos street aesthetic, dashed stencil borders, and era colorways.
   - Click the "Lexicon Ledger" view toggle: verify it switches smoothly to the structured dictionary table with `aria-pressed` active.
   - Test the search filter (e.g., type "Bariga", "Wó", "Shoki") and era chips: verify both views filter instantaneously.
   - Click "Poster generator": verify modal continues to open and function correctly.
