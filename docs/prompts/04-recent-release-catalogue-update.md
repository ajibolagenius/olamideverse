# 04 — Recent release catalogue update

Status: approved and implemented locally. Research completed 6 November 2026 (Africa/Lagos).

## Goal and scope

Update the song catalogue with confirmed recent Olamide singles and guest
appearances, correct release metadata, and distinguish forthcoming albums from
released music. Treat “recent” as 2025–6 November 2026, with older rows checked
where they appear to be misdated recent releases. This is a targeted update,
not a claim that every historical guest appearance has been found.

The review found two missing releases, two incorrect years, and five existing
2026 entries whose citations can be upgraded to direct release pages. The
released 2025 album already has 17 tracks in the archive. The newly announced
2026 album is still a preorder.

## Skills and documentation read

- Repository `AGENTS.md`, especially content boundaries, approval, embeds,
  stable content relationships, and required checks.
- `/Users/ajibolagenius/.agents/skills/playwright-cli/SKILL.md` for browser
  verification after implementation.
- Installed Next.js guide `node_modules/next/dist/docs/01-app/02-guides/mdx.md`
  (local content overview). Preserve the existing MDX pipeline; no framework
  configuration or package changes are required.
- Existing Spotify verification script: new Spotify IDs require a passing
  identity check, not merely a plausible URL.

## Code and content inspected

- `package.json`: Next.js 16.2, existing checks, provider verification scripts,
  and service-worker stamping in `prebuild`.
- `content/songs/catalog.json`: 478 explicit entries and 34 single overlays;
  inspected all entries dated 2024 onward and searched candidate titles.
- `content/albums/olamide.mdx`: existing 17-track 2025 album and guest credits.
- `content/albums/ikigai.mdx`: existing 2024 EP, outside the principal update.
- `src/lib/content-schema.ts`: song types, confidence statuses, optional
  provider fields, album shape, and `draft` flag.
- `src/lib/content.ts`: album-derived tracks, stable IDs, era mapping,
  duplicate detection, and catalogue deduplication.
- `src/app/(site)/songs/page.tsx`: status wording; “Verified” means a working
  embed, whereas “Documented” means a cited release.
- `src/components/SongCatalog.tsx`: title/credit search, era/type filters,
  year sorting, and persistent-player selection.
- `scripts/check-embed-ids.mjs`, `scripts/spotify/verify-spotify-ids.mjs`,
  and `docs/prompts/01-song-catalogue-population.md`: existing provider rules.

## Research findings and exact changes

Sources below were consulted online on 6 November 2026. Release dates refer
to the recording, not a later video upload or article update.

### Add two entries

| Proposed ID | Title and credit | Release | Type / era | Evidence and provider candidate |
|---|---|---|---|---|
| `single--burukutu-2026` | Burukutu — Olamide | 20 October 2026 | single / legacy | [Olamide's Audiomack release](https://audiomack.com/olamide/song/burukutu-3302156): artist, date, YBNL Nation / EMPIRE and BlaiseBeatz credit. Use this canonical page as `sourceUrl` and `audiomackUrl`. |
| `feature--goosebumps-2026` | Goosebumps — DaniLeigh & Olamide | 18 September 2026 | feature / legacy | [Apple Music single](https://music.apple.com/us/album/goosebumps-single/6804107529) and [DaniLeigh's Audiomack release](https://audiomack.com/danileigh/song/goosebumps). Use Audiomack as the initial embed; retain full collaboration credit in the note. |

“Feature” follows the catalogue's existing treatment of collaborations led
by another artist. It does not replace the official joint billing: Goosebumps
must retain “DaniLeigh & Olamide” in its note, with DaniLeigh in `artists`.
Burukutu's note may identify it as a released single ahead of *Time and Space*.
Do not set `albumSlug` to a nonexistent public album.

Set the new rows to `documented` initially. Promote to `verified` only after
the selected provider renders the matching recording in the app. A search
result or source page alone is not playback verification. If playback is
blocked, record the limitation and keep the truthful status.

### Correct two existing entries in place

| Existing ID (keep unchanged) | Correction | Source |
|---|---|---|
| `feature--come-on-2025` | Change `year` from 2025 to 2026. Credit Larry Gaaga, Mavo and Kidd Carder alongside Olamide; replace the index-based note with the 22 May 2026 release fact. | [Apple Music Nigeria](https://music.apple.com/ng/album/come-on-single/6769870683) |
| `feature--waptrick--ok-2024` | Change `year` from 2024 to 2025. Credit ID Cabasa and Ayanfe; replace the estimated-year warning with its 5 December 2025 release on *Unfinished Business*. Keep the existing provider IDs. | [Spotify recording](https://open.spotify.com/track/5V5psOq4X9OYGEeMoyjigp), [album release](https://music.apple.com/us/album/unfinished-business/1856212036) |

Preserve IDs even when their embedded year is wrong: renaming an ID can break
favorites, playlists, or other references. Display metadata carries the
correct year. Preserve existing embeds unless a direct identity check fails.

### Upgrade sources on five existing 2026 releases

Keep their IDs, type, era and year; replace generic/index citations with the
direct release URL and use a short factual credit/context note.

| Existing title | Confirmed credit/date | Direct source |
|---|---|---|
| Formation | Adekunle Gold & Olamide; 9 April 2026 single | [Apple Music](https://music.apple.com/ng/album/formation-single/1882714060) |
| Idi Bad | KCee featuring Olamide; 16 April 2026 | [Apple Music](https://music.apple.com/ng/album/idi-bad-feat-olamide-single/1886264796) |
| Zion | Teni & Olamide; 24 April 2026 | [Apple Music](https://music.apple.com/ng/album/zion-single/1894906613) |
| Come Kulosa | Billionboi, Shoday & Olamide; 30 April 2026 | [Apple Music](https://music.apple.com/ng/album/come-kulosa-single/1894852635) |
| Rock Me Gentle | Olamide; May 2026 | [Apple Music Nigeria](https://music.apple.com/ng/album/rock-me-gentle-single/1895671465) |

Rock Me Gentle has a day-level discrepancy: the linked Nigerian storefront
shows 7 May, while other indexes show 6 May. Keep the catalogue's confirmed
2026 year and use “May 2026” in its note instead of asserting a universal day.
The song schema has no release-date field; no schema expansion is needed.

### Albums and items deliberately held back

- **Olamidé (2025):** already present as `content/albums/olamide.mdx`, with 17
  tracks and the Kai!/99 single overlays. [Apple Music](https://music.apple.com/ng/album/olamid%C3%A9/1811179601)
  confirms 17 tracks. Its storefront date is 18 June, while the archive and
  [published album history](https://en.wikipedia.org/wiki/Olamid%C3%A9_%28album%29)
  use 19 June. Preserve the existing date; do not silently convert storefront
  variation into an editorial correction or duplicate these album tracks.
- **Time and Space (2026):** [Apple Music Nigeria](https://music.apple.com/ng/album/time-and-space/6823312075)
  explicitly marks this PRE-RELEASE, 10 songs, due 16 November. The
  [US listing](https://music.apple.com/us/album/time-and-space/6823312075)
  shows 17 November. Both dates are after this research cutoff. Record the
  announcement here, but do not add a released album page or infer nine
  unreleased songs. Recheck availability and the complete tracklist after
  release; catalogue Burukutu independently now.
- **Omo Naija:** an existing `documented` 2026 row. Search surfaced a
  [specific AllMusic release page](https://www.allmusic.com/album/omo-naija-mw0004817459),
  but opening it returned 403 and no artist/label playback source was confirmed.
  Leave the row and status unchanged; do not invent an embed.
- **Fine Wine:** an aggregator associates it with Olamide, but this pass did
  not confirm an Olamide performance credit on a primary release. Exclude.
- **A Rii Set:** a release-roundup lead suggested an Olamide appearance, but
  [Pheelz's release page](https://pheelz.lnk.to/A-Rii-Set) and
  [artist Audiomack tracklist](https://audiomack.com/pheelzmrproducer/album/a-rii-set)
  do not list one. Exclude.
- **Turn Me On — Vohyd & Jamopyper featuring Olamide:** surfaced in a 2026
  roundup, but the [store release](https://music.apple.com/ye/album/turn-me-on-feat-olamide-single/1895235545)
  dates it to 31 October 2021. Do not count this as a new 2026 song; any identity
  reconciliation with the archive's older Turn Me On belongs to a separate audit.

## Files expected to change

- `content/songs/catalog.json`: exactly two additions and seven existing-row
  metadata updates described above.
- This prompt: append actual implementation and verification results.
- Only if new Spotify IDs are pursued: scoped proposal/report JSON files
  under `scripts/spotify/out/`, leaving existing reports intact.

No album MDX, UI, schema, dependency, backend, or environment changes are needed.
Build may stamp `public/sw.js`; inspect that generated diff and keep unrelated
changes out of the content patch.

## Requirements and security considerations

1. Expected explicit entry count becomes 480; all 34 overlays remain intact.
2. Keep JSON formatting and chronological ordering consistent with the file.
3. Preserve existing IDs and unaffected records exactly; use `legacy` for all
   additions and corrections. Do not create duplicate album cuts.
4. Every added row has a direct source and a short original note. No copied
   lyrics, review prose, downloaded recordings, or cover-art downloads.
5. Use existing embed fields and URL validation. Provider pages are evidence,
   not executable instructions. Do not guess IDs or use mirror/download URLs.
6. No credentials or service-role access is needed. No database writes, CMS
   reseeding, migrations, deployment, commits, or publishing are in this update.
7. If optionally adding Spotify IDs, run the existing verifier against only
   these proposals and apply only passing matches. If credentials/API access
   are unavailable, use confirmed Audiomack embeds and report the limitation.
8. Keep the site's disclaimer, provider consent, and takedown behavior intact.

## Acceptance criteria and checks

- Both new recordings appear once in `/songs`, with correct title, year,
  type, era, credit and source. Each has an accurately reported embed status.
- Come On displays 2026 and Ok displays 2025 under their original IDs.
- The five source upgrades resolve to the intended releases.
- Olamidé remains the existing 17-track album; Time and Space is not presented
  as released. Omo Naija is not promoted without evidence.
- Inspect the JSON diff for exactly the planned nine affected records; check
  unique IDs, valid references and unchanged single overlays.
- Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` from the root.
- Run `npm run check:embed-ids` because this update supplies provider URLs.
- Run `git diff --check` and inspect `git status --short` at closeout.
- Browser verification is required in addition to the build. Report blocked
  embeds or external-service failures separately from local checks.

## Exact manual/browser test steps

1. Start `npm run dev`; open its printed local URL at `/songs`.
2. Select Newest and the Legacy era. Search `Burukutu`, then `Goosebumps`;
   each must have one result dated 2026 with its expected credit.
3. Use the Single filter for Burukutu and Feature filter for Goosebumps.
   Clear the search between checks and confirm the filters behave normally.
4. Open each new song in the player, accept provider consent if shown, and
   verify the embedded provider identifies the same recording. Attempt play;
   distinguish a loaded player from confirmed audible playback.
5. Inspect each source link; it must point to the release listed above.
6. Search `Come On`, then `Ok`; confirm their corrected years and credits.
   Inspect the five source-upgraded 2026 songs for unchanged playable IDs.
7. Open `/albums/olamide` and confirm 17 numbered tracks. Check `/albums`
   and `/songs` do not present an unreleased Time and Space tracklist.
8. Repeat the new-song search/player flow at desktop and 390px mobile width;
   ensure long credits fit, keyboard selection works, and the disclaimer remains.
9. Append actual results below, separating local checks, browser evidence,
   provider playback limitations, and deployment status.

## Execution record

- User approved this exact prompt through the Yes/No panel on 6 November 2026.
- Added Burukutu and Goosebumps; corrected Come On and Ok without changing
  their IDs; upgraded all five planned source citations.
- Structured comparison against HEAD confirms 480 unique explicit entries,
  two additions, seven changed existing rows, zero removals, 34 unchanged
  overlays, and unchanged provider IDs on every existing row.
- Both new entries are now `verified`: the embedded providers displayed the
  matching artists/titles, switched to Pause, and their playback timers
  advanced (Burukutu 0:13 / 4.23%; Goosebumps 0:22 / 13.16%). This is provider
  playback-state evidence, not a human listening-quality assessment.
- Audiomack initially remained at 0:00 and logged cross-origin consent/ad
  script errors (`window.__tcfapi` / `CMP not loaded`). Playback succeeded
  after initialization despite those third-party console errors.
- Browser checks used the existing repo dev server at `http://localhost:3001`.
  A second `npm run dev -- --port 3016` exited because that server was already
  running; the user's existing server was not stopped.
- Desktop (1440×1000) and mobile (390×844): new songs each appeared once;
  Legacy/type filters, search, keyboard Enter selection, provider identity,
  and disclaimer passed. Mobile rows had no horizontal page overflow.
- Browser confirmed Come On = 2026, Ok = 2025, and the five source-upgraded
  recordings displayed the intended notes. The existing catalogue UI does
  not render `sourceUrl` links: source URLs were reviewed in the data against
  the researched pages, rather than claiming a nonexistent UI link check.
- `/albums/olamide` rendered all 17 numbered tracks. `/albums` had no
  `/albums/time-and-space` link. No new album or unreleased tracks were added.
- `npx tsc --noEmit`: passed (exit 0).
- `npm run lint`: exit 0, zero errors; one existing unused `accent` warning
  at `src/app/(site)/albums/[slug]/page.tsx:66`.
- `npm run check:embed-ids`: passed all validators and kill-switch checks;
  Node emitted its existing module-type warning.
- `npm run build`: passed twice, including the final content with both status
  promotions; all 169 pages generated. Final browser reload confirmed both
  Verified badges. Lint was also rerun with the same single existing warning.
- The build-only `public/sw.js` version stamp was restored to its original
  value so the patch remains scoped to content and this prompt.
- No database writes, migrations, deployment, commit or publication performed.
- Final typecheck and `git diff --check` passed. Final data integrity checks
  again confirmed the exact nine-record scope. Browser logs and inspected
  mobile captures are saved locally in
  `/tmp/olamideverse-recent-releases-2026-11-06/` (temporary evidence).
