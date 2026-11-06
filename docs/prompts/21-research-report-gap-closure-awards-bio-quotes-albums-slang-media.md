# 21 — Research-report gap closure: awards, bio detail, quotes, album stories, slang, media credits

**Date:** 6 Nov 2026
**Requested by:** the user, after asking "is everything in `docs/research/2026-11-06-content-research-report.md` implemented?" and selecting the gap batches in the question panel (all four content batches + "director credits in note only").
**Follows:** `20-research-driven-content-population-and-corrections.md` (executed) and its CMS follow-up.

## Goal

Close the report lines that prompt 20 left out — the ones its own "optional / worth folding / out of scope" wording skipped — without adding a single new schema field or changing rendering semantics.

## Skills read / code inspected

- `src/lib/content-schema.ts` — `eraSchema` (ticker / contextHeading / contextBody / pullQuote / `moments[]{year,title,body}` / `open`), `albumSchema` (title / year / era / type / released / label / producer / tracklist`[]{num,title,note}` / keyBars`[]{title,body}` / credits / embeds / draft), `mediaItemSchema` (id / title / era / year / type∈{music-video,freestyle,interview,live} / source / youtubeId nullable / **note required**), `snippetSchema` (albumSlug AND albumTitle both required, title is display-only — not cross-checked against the album row), `songSchema` (no chart/peak field exists).
- `src/lib/content.ts` — `fileSnippets()` validates `albumSlug` against album slugs, never against `albumTitle`; `fileAlbums()` filters `draft`; era/album/media read from `cms_*` when `useCmsContent` is on.
- `src/lib/anchors.ts` — `momentAnchor()` derives the deep-link slug from the moment title or year, so adding moments cannot break existing links as long as titles I keep are not renamed.
- Live data: `cms_eras` 6 published rows, `cms_albums` 16 rows (15 published + `time-and-space` draft), `cms_media_items` 120 published.
- `scripts/seed-cms.mjs` (media = file-authoritative upsert; eras/albums = insert-if-missing) and `scripts/sync-audit-cms.mjs` (targeted force-update, `ERA_SLUGS` / `ALBUM_SLUGS` lists).

## Decisions

1. **Awards go into existing `moments`.** No `awards` field, no new section. Each beat gets ceremony + year + result in the body so the page never implies a win. Already covered by the archive, so not duplicated: the 2012 Headies Best Rap Album nomination, *YBNL* sweeping Headies + NEA, Headies 2014 Album of the Year + Best Rap Album (*BGEL*), "Durosoke"'s 2013 NMV award, the Cîroc ambassadorship, Headies 2015 AOTY ("Who You Epp?"'s 2016 win is *not* there). New beats:
   - `first-of-all` — sharpen the existing Cîroc line to its reported date (17 Jul 2013) rather than adding a beat.
   - `street-king-run` — "Bobo" Best Street-Hop Artiste (Headies 2015); "Who You Epp?" same award (Headies 2016); MOBO Awards 2016 Best African Act nomination; *The Glory* NEA Album of the Year (2017).
   - `reinvention` — BET Awards 2020 Best International Act nomination.
   - `elder-statesman` — Grammy nomination, Nov 2023 (66th ceremony, Best African Music Performance, "Amapiano" with Asake, lost to Tyla) framed as the first Nigerian rapper nominated in the category; NAACP Image Award nomination 2024 for the same record; Headies 2022 Best Rap Album for *Carpe Diem*.
   - `legacy` — AEA-USA Album of the Year for *Ikigai* (2024); Headies 2025 with no wins and "Metaverse" losing MV of the Year to "Egwu" (27 Apr 2025).
   - **Excluded:** the Spotify "most influential street-pop artiste of his generation" blurb — the report dates it 2025 but the source article is 2021; unresolved, so it stays out and the report gets a note.
2. **Family detail stays in prose, in the chapters that own it** (`content/biography/biography.mdx`), not in `quickFacts`:
   - Upstart chapter — second of Pa Adedeji's three children, mother Ronke Osisanya Adedeji, raised in Ladilak; siblings include DJ Enimoney (Eniola Olamilekan Adedeji), so the Wande-Coal-era "Oya Dab" feature and the YBNL-adjacent DJ are a family link, not a signing.
   - Legacy chapter — children, and that 999's "Billion Talk" credits his son as Milly, is enough for the "named for his son" UY Scuti line already there. No full names of minors beyond what Wikipedia publishes, no marriage date (proposal reported Mar 2018, wedding kept private — said exactly that way or not at all).
   - **Never added:** the Beat FM / Maria Okanrende parentage dispute and the "married 14 years" quote (report §4.2 / §10).
3. **Quotes get the fields that already exist** — era `pullQuote` is one-per-era and all six are used, so:
   - Dami Ajayi on *Olamidé* ("poster boy for the Lagos working-class kid… the most unlikely heir to Dagrin's template") → the *Olamidé* album story body, attributed to The NATIVE, 4 Jul 2025.
   - Shallipopi ("Baddo is the father and king of Nigerian street music", 14 Nov 2024) → the `baddo` slang entry's `context`, as peer usage.
   - ID Cabasa ("I cried the day Olamide left Coded Tunes") → the `id-cabasa` node `blurb` in `content/influence/graph.json`, next to the Dec 2025 "OK" reunion already recorded there.
4. **`Eyán Mayweather` diacritics**: set the album `title` and its title-track entry to "Eyán Mayweather", then update all 12 display occurrences (street-king-run ×4, the album file ×3, 2-kings, biography, catalog, snippets `albumTitle`, slang, media manifest, plus `src/lib/tours.ts` and `src/app/(site)/page.tsx`). `slug`, ids and anchors stay untouched, so no route, embed or tour step breaks.
5. **Album-story facts** go where each album already has room: `*Eyán Mayweather*` is feature-free → album body + `credits`; `Carpe Diem` "first African rap album to 200M Spotify streams" → body, worded as press-reported; `Ikigai` AEA-USA win + US vinyl 30 Jan 2025 → body/credits; `Olamidé` → the Ọlámidé spelling note from the same review, in the body.
6. **Report §2.2 A-2 caveat**: one sentence in `reinvention.mdx` `contextBody` that *Magina* (2018) and *Everyday a Sunna* (2019) are press-reported projects with unresolved dates and are deliberately **not** enrolled as albums — this is also why sources disagree about which-numbered studio album *Time & Space* is.
7. **Slang (2 additions)**: "Who You Epp?" → `songId: "single--who-you-epp-2016"`; "Shọ́rọ́ Níyẹn" → `songId: "feature--shoro-niyen-2015"` (both rows verified present in `catalog.json`). Coinage claims follow §5.3: "Who You Epp" as his own coinage, "Shọ́rọ́ Níyẹn" as amplifier, YBNL Allstars carrier. **Gbedu stays out** — the report itself says it is general Yoruba and there is no carrier record.
8. **Catalogue diacritics**: `feature--shoro-niyen-2015` title "Shoro Niyen" → "Shọ́rọ́ Níyẹn" (AGENTS.md §9). The id is unchanged, so existing deep links hold.
9. **Media (up to 4 items)**: Flytime Fest 2025 with Reminisce, the Headies 2015 Next Rated clash with Don Jazzy (1 Jan 2016, Landmark), *Afrobeats: The Backstory* (2021), The AfroBeats Interviews (`egO4I2-BB6E`). Every one is added **only** after YouTube oEmbed returns a title that matches; anything that fails verification is reported as a documented gap instead of seeded with a guessed id. `era`/`year` must cross-validate, and `interview`/`live` choose by what the footage is.
10. **Director credits into `note`** (no schema field): append `Dir. <name>` to the existing note text of the videos §6.1/6.2/6.4 name a director for — Unlimited L.A (Science Student, Logba Logba, Motigbana, Poverty Die, Woske), TG Omori (Oil & Gas, Totori, Pawon, Burukutu, Hate Me, Shoki remix, Instagram), Clarence Peters (Eru, Jailer, Fada Fada), Patrick Elis (Julie), Jyde Ajala (Trumpet, Jinja, Metaverse, Uptown Disco, Billionaires Club, Luvaluvah, Amapiano), **Adasa Cookey for Reggae Blues** (the report's correction of the common Clarence Peters miscredit), Mex (Local Rappers). Existing note text is never overwritten; items whose director the report marks UNVERIFIED get nothing.
11. **CMS sync afterwards**: add every era and album touched in this pass to `sync-audit-cms.mjs`'s `ERA_SLUGS` / `ALBUM_SLUGS`, run `npm run sync:audit-cms` then `npm run seed:cms` (still needs an ephemeral `ADMIN_PASSWORD`, per prompt 20's follow-up), and `rm -rf .next/cache/fetch-cache` before the build — without the purge, `/media` and `/albums` render the pre-sync rows again.
12. **Changelog**: extend the existing 2026-11-06 day block in `src/lib/changelog.ts` + `CHANGELOG.md` with one item ("what the audit missed the first time"), not a new day entry.

## Files expected to change

`content/eras/{first-of-all,street-king-run,reinvention,elder-statesman,legacy}.mdx`, `content/biography/biography.mdx`, `content/albums/{eyan-mayweather,carpe-diem,ikigai,olamide,2-kings}.mdx`, `content/slang/slang.json`, `content/songs/catalog.json`, `content/snippets/snippets.json`, `content/media/media.json`, `content/media/manifest.json`, `content/influence/graph.json`, `src/lib/tours.ts`, `src/app/(site)/page.tsx`, `scripts/sync-audit-cms.mjs`, `src/lib/changelog.ts`, `CHANGELOG.md`, and a verification note appended to `docs/research/2026-11-06-content-research-report.md`.

## Requirements & security

- No new schema fields, no new deps, no rendering-semantics change (static-first stands; the fetch-cache trap is documented, not fixed).
- Embeds only; no hosted or proxied media, no director names invented, no unverified milestone language.
- Yoruba diacritics including underdots everywhere (§9) — and the subset fonts already cover them.
- Private personal facts limited to what Wikipedia and Nigerian press already publish, minus the two contested items named in decision 2.
- Service-role key stays inside `scripts/`; nothing new in `.env.example`, no `NEXT_PUBLIC_*` secrets.

## Acceptance criteria

- [ ] Each award in decision 1 renders as a moment on its era page with an explicit won/nominated/lost result; no era page implies a win it cannot source.
- [ ] `grep -rn "Eyan Mayweather" content/ src/` returns zero hits; `/albums/eyan-mayweather` and `/eras/street-king-run` render "Eyán Mayweather"; the `/albums` grid, tour step and homepage copy still work.
- [ ] Biography names the family facts of decision 2 and contains neither of the two excluded items.
- [ ] `slang.json` = 23 terms with both new entries carrying a resolvable `songId`; catalogue shows "Shọ́rọ́ Níyẹn".
- [ ] `media.json` every added item plays its own embed and the count only grows by items that passed oEmbed; ≥15 items carry a `Dir.` credit that leaves the prior note text intact; Reggae Blues credits Adasa Cookey.
- [ ] `time-and-space` stays `draft: true` and `/albums/time-and-space` still 404s.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.

## Checks to run

`npx tsc --noEmit` → `npm run lint` → `npm run build` (content + `src/` change) → after `sync:audit-cms` + `seed:cms`: `rm -rf .next/cache/fetch-cache && npm run build && npx next start -p 3111`.

## Manual test steps

1. `/eras/street-king-run` — "Bobo" and "Who You Epp?" Headies wins, MOBO nomination and NEA win appear in the moments list.
2. `/eras/elder-statesman` — Grammy nomination wording says nominated and lost to Tyla; NAACP nomination present.
3. `/albums/eyan-mayweather` — accented title, feature-free line in the story; `/albums` grid and `/` homepage show the same spelling; the onboarding tour step that names the album still highlights.
4. `/biography` — family paragraph reads correctly and no parentage dispute appears.
5. `/slang` — "Who You Epp?" and "Shọ́rọ́ Níyẹn" render with diacritics and link to their carrier records.
6. `/media` — open a newly added live/interview item and a `Dir.`-credited video (Reggae Blues) and confirm the embed plays and the note shows the credit.
7. `/albums/time-and-space` → 404.

## Resumption notes — 6 November 2026

The user confirmed this file is the scope and asked to continue its partially
implemented work. The three existing era edits are being completed, not discarded.

Skills read in this continuation: `supabase`, `secure-me`, `playwright-cli`.
Also read the installed Next.js MDX and caching guides, the content loaders and
schemas, `anchors.ts`, era moment rendering, album rendering, both CMS scripts,
and the existing changelog/content files listed above. No new UI is proposed.

Source verification takes precedence over a claim in the initial research:

- BET's [official 2020 nominations](https://www.paramountpressexpress.com/bet/shows/the-bet-awards-2020/releases/?view=102500-bet-announces-official-nominations-for-the-bet-awards-2020)
  do not include Olamide. Do not add the proposed BET moment.
- The “Shoki” remix is credited to **Unlimited L.A**, not TG Omori, by
  [contemporary coverage](https://notjustok.com/songs/videos/video-lil-kesh-shoki-remix-ft-davido-olamide/).
- Preserve existing moment fragments when correcting the Eyán title. A narrow
  compatibility alias in `src/lib/anchors.ts` is necessary: the existing slugger
  removes accented letters and would break three graph/map links and saved URLs.
  Do not normalize every old fragment or introduce a schema field.
- A family sentence can name DJ Enimoney and TemmyGold and acknowledge marriage
  and children. Identify the credited son only as **Milly**; the report conflates
  the sons' names. No additional identifying details about minors are needed.
- Attribute the two short Dami Ajayi quotations separately, rather than splicing
  them into a single quotation. Use the working [NATIVE review URL](https://thenativemag.com/featured/review-olamides-olamide/).
- Use a month-level Cîroc date: contemporary reporting already appeared on
  12 July 2013, conflicting with the report's exact 17 July date.
- Vinyl sources disagree on the January 2025 day. State January 2025 and cite the
  release listing; do not turn a retailer date into a universal US release date.
- “Who You Epp?” popularized a variant of an existing Pidgin phrase. Do not claim
  that Olamide invented the underlying expression.
- Only verifiable media may be added. `egO4I2-BB6E` returned HTTP 401 from YouTube
  oEmbed. Record failed candidates and unresolved project claims in the report.
- `scripts/seed-cms.mjs` currently prints an admin password on completion. Remove
  that log before executing the authorized seed. Check the existing admin first;
  never create an account with an ephemeral throwaway password as a side effect.

These are accuracy, link-compatibility and credential-handling corrections within
the approved task. Chart/schema/UI additions, Korty/Sotayo narrative additions,
unverified performances and the general caching redesign remain outside prompt 21.

The era timeline heading also hardcoded “Four beats.” `EraMoments.tsx` now reads
the existing moments array length so the extra awards do not leave a false count.
The heading's layout and styles are unchanged.

## Execution closeout — 6 November 2026

Implemented the verified content batches and synced/read back 5 era rows, 7 album
rows and 122 media rows. Slang is 23 terms; 26 media items have explicit director
notes. The two new embeds passed oEmbed and actual Chromium playback. Family,
quote and album-story changes were inspected in the running app. Typecheck,
lint, content-schema/reference checks and the production build (182 pages) pass.
The existing moment URL and the Time & Space draft/404 gate remain intact.

The [research report, section 11](../research/2026-11-06-content-research-report.md#11-prompt-21-continuation--implementation-and-verification)
records source corrections, all disposition decisions, CMS evidence and manual
results. Flytime 2025 and The AfroBeats Interviews remain unseeded because their
candidate IDs failed oEmbed verification. Backstory is represented by a clearly
labelled official excerpt, not a guessed full-documentary embed.

**Acceptance limitation:** manual step 5 uncovered an existing navigation bug:
`SongCatalog.tsx` ignores `/songs?q=...`. Both records exist and are searchable,
but the new glossary links do not prefilter the catalogue. This is recorded as a
failed interaction check and left for a separately scoped rendering fix; it is
not hidden by the passing compiler/build checks. No hosting deployment was made.

The build also updated `public/sw.js`'s generated version stamp as expected.
