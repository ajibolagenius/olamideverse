# 05 — Catalogue update changelog

Status: approved and implemented locally. Completed 6 November 2026 (Africa/Lagos).

## Goal

Add a reader-facing entry for the completed recent-release catalogue update
to `/changelog`, and mirror it in the root `CHANGELOG.md`.

## Skills and documentation read

- Repository `AGENTS.md`: prompt approval, scope, content boundaries and checks.
- `playwright-cli` skill, already read in this session: verify the rendered
  changelog and its navigation after implementation.
- Installed Next.js guide
  `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`:
  page rendering and existing route structure.

## Code and evidence inspected

- `src/lib/changelog.ts`: typed, newest-day-first editorial entries.
- `src/app/(site)/changelog/page.tsx`: consumes those entries, three days per
  page; item titles optionally link to archive routes.
- `CHANGELOG.md`: requires mirroring the public feed; existing changes sit
  under `[Unreleased]`.
- `docs/README.md`: identifies the root file as the public changelog mirror.
- `docs/prompts/04-recent-release-catalogue-update.md`: completed work and
  local verification evidence for two additions and seven metadata updates.
- Git status: the catalogue and prompt 04 are already staged. Preserve that
  work and its staging; do not stage or unstage files as part of this task.

## Decisions and exact proposed copy

Prepend one day: `date: "2026-11-06"`, `label: "6 November 2026"`.
Add two items, both linking to `/songs`:

1. **Burukutu and Goosebumps join the catalogue**

   “Burukutu” and DaniLeigh’s collaboration with Olamide, “Goosebumps,” now
   have catalogue entries with release dates, artist credits and verified
   Audiomack embeds. Find both under the Legacy era on Songs.

2. **Clearer dates and sources for recent releases**

   “Come On” moves to 2026, and ID Cabasa’s “Ok” with Olamide and Ayanfe moves
   to 2025. Formation, Idi Bad, Zion, Come Kulosa and Rock Me Gentle also gain
   direct release citations, making the recent catalogue easier to trace.

Mirror these facts under a new `### 2026-11-06` section immediately beneath
`## [Unreleased]` in `CHANGELOG.md`. Describe the implemented changes without
claiming a Production deployment. The new date is the update date, not either
song's release date. Do not describe Time and Space as released or as a new
album page. Avoid a “480 songs” headline: 480 is the explicit JSON entry count,
not the combined, deduplicated count readers see on `/songs`.

## Files to touch

- `src/lib/changelog.ts`
- `CHANGELOG.md`
- This prompt's execution record

## Requirements and security

- Keep the existing data shape, editorial layout, pagination and older copy.
- Add no packages, schema fields, external embeds, backend calls or secrets.
- Use the existing internal `/songs` destination; no untrusted URLs.
- Preserve staged catalogue work. No commit, deployment or CMS write.
- Inspect and restore only a build-generated service-worker version change
  if `prebuild` creates one; preserve any pre-existing edits.

## Acceptance criteria and checks

- The first day on `/changelog` is 6 November 2026 with the exact two items.
- Both item links open `/songs`; older days remain available through pagination.
- Root Markdown mirrors both items under `[Unreleased]`.
- Run `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check`.
- Inspect final diff and status. Report existing warnings separately.

## Exact manual/browser steps

1. Use the running repo dev server, or start `npm run dev` if none is running.
2. Open `/changelog`; confirm the date, both headings and factual copy.
3. Open each new item link and confirm `/songs` loads.
4. Return to `/changelog`, open page 2, and confirm older entries render.
5. At 390px mobile width, confirm the new cards fit without horizontal overflow.
6. Confirm the non-affiliation disclaimer remains visible.

## Execution record

- User approved this prompt on 6 November 2026.
- Added `date: "2026-11-06"` (`label: "6 November 2026"`) entry to `src/lib/changelog.ts` with the two planned items:
  1. “Burukutu and Goosebumps join the catalogue” (deep link to `/songs`).
  2. “Clearer dates and sources for recent releases” (deep link to `/songs`).
- Mirrored both items in `CHANGELOG.md` under `### 2026-11-06` directly beneath `## [Unreleased]`.
- Committed in git commit `6b51f35` alongside the catalogue update from prompt 04.
- Verification checks:
  - `npx tsc --noEmit`: passed (exit 0).
  - `npm run lint`: passed (exit 0, single existing unused `accent` warning in `albums/[slug]/page.tsx:66`).
  - `npm run check:embed-ids`: passed (exit 0).
  - `npm run build`: passed (exit 0, all pages generated).
  - `git diff --check`: passed.
