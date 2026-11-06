# 22 — Remaining research: song links, charts, biography and media

Date: 6 November 2026

Requested work: implement the outstanding research items, update both changelogs,
and ensure the CMS matches. This extends prompt 21 into its explicitly deferred
schema/rendering work. Status: approved by the user's “Yes”; verification in progress.

## Goal

Fix the failed glossary-to-song navigation, expose sourced chart positions in the
existing song catalogue, add the two verified biography beats, and resolve the
remaining media candidates as far as working, accurately identified embeds allow.
Keep an explicit disposition for every remaining report item.

## Skills and inspected code

- Read/reused: `supabase`, `secure-me`, `playwright-cli`; read `tailwindcss`.
- Read root `AGENTS.md`, `docs/VISUAL-IDENTITY.md`, `docs/ACCESSIBILITY.md`,
  prompt 21 and research report sections 3, 4, 6 and 11.
- Read installed Next.js Link and `use-search-params` documentation. A static
  production route requires a Suspense boundary around the search-param reader.
- Inspected `src/lib/content-schema.ts`, song derivation and `absorbSong` in
  `src/lib/content.ts`, `SongCatalog.tsx`, `SlangGrid.tsx`, the `/songs` route,
  album tracklists, biography, media JSON, both changelogs, CMS sync/seed scripts,
  and the previous CMS readback wrapper.

## Decisions and requirements

### 1. Glossary song links

`SlangGrid` already emits `/songs?q=<encoded title>`; `SongCatalog` ignores it.
Add an isolated search-parameter reader inside a small Suspense boundary, feeding
the existing query state. Preserve the server-rendered catalogue shell and the
current input/filter/sort/player behavior. Support direct visits, client-side
navigation and browser back/forward. Missing or empty `q` restores an empty query.
Normal typing must not be repeatedly overwritten by the URL's unchanged value.
No new routing scheme, dependency or server request is required.

### 2. Chart metadata

Add an optional `chartPositions` array to both track and song schemas. Each entry
contains `chart`, `territory`, positive integer `position`, `kind` (`peak`,
`debut`, or `weekly`), an ISO `asOf` date, and an HTTP(S) `sourceUrl`. The date is
the chart/source observation date, not an invented release date. Validate these
fields with the installed Zod version and existing schema conventions.

Research the report's four records: New Religion, Jinja, Gaza and Kai!.
Prefer the chart publishers, and retain only positions supported by readable
evidence. A debut or one weekly chart cannot prove a lifetime peak. Labels must
say which kind of position is supported and give its observation date.

Confirmed during preparation: [Official Charts' Kai history](https://www.officialcharts.com/songs/olamide-wizkid-kai/)
lists UK Afrobeats peak 7, first reached 17 May 2025.
[TurnTable's 13 June 2023 report](https://www.turntablecharts.com/news/911)
supports New Religion's debut at 2; verify any stronger peak claim separately.
The report's remaining Nigerian and US numbers are research targets, not accepted
facts merely because they appear in the report.

Store metadata with the canonical album track where one exists, otherwise in the
catalogue entry. Transfer it in `deriveAlbumTracks`; preserve distinct chart
evidence when deduplicating records without mutating input arrays. Do not turn
snippet cards into singles to accommodate charts.

Render concise chart details in the existing dossier and ledger layouts, using
existing text/link styles. Include publisher links and observation dates. Source
links must remain outside the ledger's song-selection button: no nested links
inside buttons. No new columns, charts, animation or visual redesign.

### 3. Biography

Add short, attributed prose to the existing legacy chapter for:

- The April 2026 Korty EO interview: Olamide's account of stage anxiety after
  fans grabbed jewellery. Frame this as his account, without medical diagnosis.
- The November 2026 Sotayo Gaga film-screening statement about Yoruba cultural
  heritage. Distinguish the event date from the article publication date.

Starting sources: [Daily Post, 27 April](https://dailypost.ng/2026/04/27/why-im-get-nervous-about-stage-performance-olamide/)
and [Guardian, 4 November](https://guardian.ng/life/nigerian-culture-should-not-be-demonised-olamide/).
Prefer the original interview/event footage where accessible. Paraphrase or use
short accurately attributed quotes. Preserve the private-family boundaries from
prompt 21. No new identifying details about children.

### 4. Remaining media

Search for working, correctly identified replacements for Flytime Fest 2025 and
The AfroBeats Interviews; also check the relevant official Korty EO interview.
The old IDs `XNknsGP1_c0` and `egO4I2-BB6E` failed verification and cannot be
seeded on the assumption that they work now. Verify event/upload date differences,
especially Flytime's 23 December 2025 show.

Retain the accurately labelled official Backstory excerpt unless a suitable
official longer embed can be verified. Do not call an excerpt the full film.
Each added item needs matching oEmbed title/channel evidence and actual browser
playback with an advancing timer. Deduplicate against the existing 122 items.
If a candidate remains unavailable, document the attempted sources and precise
reason; never manufacture an ID or substitute unrelated footage.

### 5. Changelogs, report and CMS

Extend the existing 6 November entries in `CHANGELOG.md` and
`src/lib/changelog.ts` with matching reader-facing descriptions. Update the
research report with a disposition and evidence for each remaining item, including
any unavailable media. Preserve earlier source corrections and execution history.

Add every newly touched album/era to the targeted CMS sync list (notably `unruly`
if its track metadata changes). The CMS stores album data in JSON, so optional
chart fields need no database migration. Biography and catalogue JSON remain
file-backed; do not invent CMS tables for them.

Validate files, save a restricted local before-snapshot, run the existing targeted
sync and required CMS seed, then read the rows back and compare data/body with disk.
Preserve status, cover paths, attribution and existing media sort order. Verify
Time & Space remains draft. Check the existing admin before seeding so an ephemeral
password cannot create an unintended account. Never log credentials.

Build after sync with stale CMS fetch-cache entries cleared. Verify the running
production build uses the new data. This includes the already authorized CMS
writes; a hosting deployment is not part of this prompt.

## Expected files

- `src/lib/content-schema.ts`, `src/lib/content.ts`
- `src/components/SongCatalog.tsx` (small helpers may remain local)
- `content/albums/unruly.mdx`, `content/albums/olamide.mdx`
- `content/songs/catalog.json`, `content/biography/biography.mdx`
- `content/media/media.json`
- `scripts/sync-audit-cms.mjs` and, only if needed, the existing seed script
- `CHANGELOG.md`, `src/lib/changelog.ts`
- `docs/research/2026-11-06-content-research-report.md`, this prompt
- `public/sw.js` only through the existing prebuild stamp

Temporary evidence/check scripts belong under ignored `scripts/out/prompt-22/`.
Preserve all existing staged work and the unrelated `docs/research/new_ideas.md`.

## Security and boundaries

No new dependencies, credentials, environment variables, auth/RLS changes or
hosted/proxied recordings. Chart links accept only HTTP(S), have descriptive
labels and use safe external-link behavior. Service-role access stays in scripts.
Do not expose CMS snapshots or environment contents in logs or public artifacts.
Keep static file fallback, draft gates, stable slugs/anchors, existing player
controls, Yoruba underdots and the site disclaimer intact.

Rejected or unsupported historical claims remain rejected: BET 2020 nomination,
TG Omori directing the Shoki remix, artist coinage of general Yoruba words,
speculative projects and unverified performances. No general cache redesign.

## Acceptance criteria and checks

- Both glossary song links filter correctly, including direct URLs and history.
- Chart fields survive schema parsing, album derivation and deduplication; invalid
  dates/positions/URL protocols are rejected and records without charts still load.
- Each displayed chart assertion has evidence, kind, territory and observation date.
- Both layouts render readable chart text and keyboard-accessible source links.
- Biography additions have sources and distinguish publication from event dates.
- Every new media item matches its evidence and plays; unavailable items have
  honest documented dispositions, not placeholder success claims.
- Both changelogs agree. CMS readback matches all changed CMS-backed files and
  preserves publishing metadata; Time & Space remains unpublished.
- Run `npx tsc --noEmit`, `npm run lint`, `npm run check:embed-ids`,
  `npm run build`, and `git diff --check`. Inspect staged and unstaged differences.
- Use focused temporary assertions for chart parsing/derivation/deduplication;
  do not add a test framework. Record actual outputs and any limitations.

## Exact manual tests

1. Start the built app on an available local port. Open `/slang`, follow the
   Who You Epp? and Shọ́rọ́ Níyẹn Song Dossier links, and verify the search input
   and results. Repeat as direct encoded `/songs?q=...` URLs, then back/forward.
2. Clear and type into the search input, change era/type/sort/view controls and
   play a result. Test an unmatched query and `/songs` without a query.
3. Search each of New Religion, Jinja, Gaza and Kai!. Inspect each sourced chart
   assertion in dossier and ledger views; follow its source link with keyboard.
   Check a song without chart metadata for regressions.
4. Repeat catalogue and glossary checks at 390px and 1440px widths; inspect
   diacritics, text wrapping, horizontal overflow and visible focus.
5. Open `/biography` and read both additions in context. Open every newly added
   media item, confirm artist/event/title, then observe playback time advancing.
6. Open `/changelog` and compare the November 6 entry with `CHANGELOG.md`.
7. Verify CMS rows against disk, inspect chart content through CMS-backed albums,
   and verify file fallback through the content checks without changing live flags.
8. Confirm `/albums/time-and-space` is 404 and the existing
   `/eras/street-king-run#moment-2-kings-eyan-mayweather` fragment still resolves.

## Execution record

Approved and implemented. Execution evidence and remaining provider restrictions
are recorded in research report section 12. Initial typecheck, lint, embed-ID
checks, focused content checks and production build passed. Browser acceptance
and final closeout are in progress.
