# Prompt 20 — Research-driven content population and corrections (P0–P2)

**Date:** 6 November 2026
**Source of findings:** `docs/research/2026-11-06-content-research-report.md` (six web-research agents, claims re-verified against the files).
**Type:** content-only. No component, route, schema, or config changes. Every edit must pass the existing Zod validators in `src/lib/content-schema.ts` (a bad field fails the build).

## Goal

Populate, correct, and enhance the archive's content data from the verified research: fix factual errors in the impact map, enrol the forthcoming *Time & Space* album, backfill the stale media library, correct catalogue rows, update the biography and eras, expand the slang glossary from 7 to ~26 entries, deepen the influence graph, and add snippet audiograms — in three phases the user can cut short at P1.

## Skills and code read

- `src/lib/content-schema.ts` (full) — shapes for era/album/media/snippet/influence/impact/song/slang/biography; `albumSchema.draft` exists and is the mechanism for enrolling unreleased work; slang entries cross-check `era` slugs and either `albumSlug` or `songId` (required when the track is not an album cut); media `type` is only `music-video | freestyle | interview | live` — visualizers go in as `other`-adjacent media or are skipped (decision below).
- `content/` files: `albums/*.mdx` frontmatter verified (all 15 album years correct), `songs/catalog.json` (480 entries, already current through 2026 singles), `media/media.json` (95 items; year distribution shows the 2018–2026 gap), `slang/slang.json` (7 entries), `influence/graph.json`, `impact/places.json` (17 places), `snippets/snippets.json` (17), `eras/*.mdx`, `biography/biography.mdx`.
- `tailwindcss`/design refs not needed — no presentation work.
- YouTube ID resolution: verify each candidate ID via `https://www.youtube.com/oembed?url=…` (title + uploader must match the song + OlamideVEVO/Olafmedia) before writing it into content. Never ship a guessed ID.

## Decisions and assumptions

1. **`Time & Space` is enrolled as a `draft: true` album** (`content/albums/time-and-space.mdx`), with `released: "16 November 2026"`, era `legacy`, type `album`, story body written from the *announced* facts only (10 tracks, "Burukutu" lead single, TG Omori video, title/rollout framing). Flip `draft` to `false` and fill the tracklist in a follow-up after release — noted in `Needs your attention`. Plus one dated "announced" moment in `legacy.mdx` moments (visible now, not claiming release).
2. **Media backfill scope**: ~30 verified official videos (report §6.1–6.2) + 5 live/interview items (§6.5) added to `media/media.json` with `source: "YouTube"` and oEmbed-verified `youtubeId`. **Visualizers are excluded** (schema has no type for them; report §6.3 items Makaveli/Morowore/Indika/Gaza/Shibebe/Mukulu are skipped to avoid mislabelling). Directors go in `note` prose (house voice), since the schema has no director field.
3. **Slang additions must resolve their carrier record correctly**: album cuts use `albumSlug`; non-album singles (Durosoke single→BGEL album cut, so albumSlug; Woske/Pawon/Konkobility/Buga Small Small/Totori → `songId` pointing at existing catalogue rows). Where the only carrier is a track not in the catalogue (e.g. "Who You Epp?" is an album cut of the-glory — fine), verify per entry. Terms whose etymology is UNVERIFIED ship with `status: "documented"` (not `verified`), and genuinely lore-tier ones (Motigbana attribution) with `status: "lore"` or are omitted — implementer picks documented/lore honestly per the report's flags.
4. **REJECTED slang list is a hard constraint**: Ye, Zanku, Buga (as phenomenon), Kukere, Japa, Maga/Mugu, Shataye, Maruba must not appear as Olamide coinages anywhere we add.
5. **Corrections, not restyling**: existing fields keep their voice/format conventions; we only change facts (dates, venues, coordinates, attributions) and add entries.
6. **Biography edits are surgical**: add birthdate (15 March 1989, Bariga) to the origin chapter, add 2025–2026 milestone beats (1B Spotify streams 10 Jan 2025; Billboard Global Power Player 2025; OVO Wembley sell-out 23 Nov 2025; Bariga street rename Jul 2025; O2 headline announced for 25 Mar 2027; Asake exit 12 Feb 2025; ID Cabasa "Unfinished Business" reunion Dec 2025) into the current-era chapter, per `biographySchema`. No contested personal items (Okanrende parentage, "married 14 years") enter the archive.
7. **Coordinates**: OLIC pin moves to Teslim Balogun Stadium, Surulere (approx. 6.4960, 3.3244 — implementer verifies) and the blurb drops "National Stadium" + the 25,000 claim, naming Eko Hotel for OLIC 1–3/5 and Teslim Balogun for OLIC 4. A second pin for Eko Hotel & Suites (Lagos Island stages area) is optional; default is one corrected pin.
8. **Influence graph**: add nodes Dagrin (`influence`), Naira Marley (`mentee`, signedYear 2018, departedYear 2019), Zlatan (`influence`-out role: use `mentee`? — no: role enum has no "inspired"; use `influence` with blurb clarifying direction), CKay (`collaborator`), Rema (`collaborator`), Eskeez (`collaborator`). Edges: dagrin→olamide, olamide→naira-marley, olamide→zlatan, olamide↔ckay/rema (Unruly), eskeez→olamide production edge. Fix Temmie Ovwasa years (signedYear 2015, departedYear 2020). Remove "Kana" misattribution risk: "Kana" (Wizkid, 2018) is verified real — keep if any node blurb cites it. Node `x`/`y` positions: place sensibly in the 0–100 canvas near related nodes.
9. **Impact map additions**: Bariga blurb gains the Jul 2025 street rename ("Olamide Adedeji (Baddo) Street" + Charly Boy bus stop); new pins Ijebu-Ode/TASUED (`origin`, lat 6.8166, 3.8314 approx — verify), Surulere/Teslim handled via OLIC fix, Accra/New York/Abuja blurbs gain verified dated shows; **Paris and Johannesburg blurbs get softened to honest framing or flagged `documented`** (no verified Olamide event; JHB reframed as Asake-satellite note); Toronto marked reported-only.
10. **Snippets (§8)**: add only tracks that already have catalogue rows with Spotify IDs so the shape matches: "Durosoke" (bgel), "Bobo" (eyan-mayweather), "Wo" (lagos-nawa), "First of All" (ybnl), "Kai!" (olamide 2025), "Burukutu" (single, youtubeId path). Quote lines must be original editorial paraphrase in the existing voice — **never reproduce actual lyrics** (copyright rule; house rule: quote is archive commentary).
11. **Era micro-fixes**: `reinvention.mdx` 999 date "10 February 2020" → "9 February 2020". No other era text changes except one added moment in `legacy.mdx`.
12. **Changelog**: an entry summarising the content audit + Time & Space enrolment follows the repo's existing changelog convention (see recent commits) — added last.

## Files expected to touch

- `content/impact/places.json` — corrections C-5/C-6/C-7/C-8 + additions (§7.2–7.3)
- `content/albums/time-and-space.mdx` — new draft album (§A-1)
- `content/media/media.json` — ~30 video + 5 live/interview backfill (§6)
- `content/songs/catalog.json` — C-2 Kai! type, C-3 Welcome id/dup, add verified records lacking rows (Wonders, Ibadi, "OK" Cabasa, "Where We Come From" feature) only where a Spotify/YouTube ID verifies them
- `content/slang/slang.json` — S-1…S-6 corrections + up to 19 additions (§5)
- `content/influence/graph.json` — new nodes/edges + Temmie fix (§7.1)
- `content/biography/biography.mdx` — §4.2 items
- `content/eras/reinvention.mdx`, `content/eras/legacy.mdx` — date fix + Time & Space moment
- `content/snippets/snippets.json` — 4–6 new cards (§8)
- changelog doc per repo convention

## Requirements

1. Every added/changed claim comes from the research report with a source URL; anything the report marks UNVERIFIED ships only as `documented`/`lore` status or is omitted.
2. All new media/impact/influence/slang/snippet rows match their Zod schemas exactly (required fields, enums, era slugs, `songId` when no `albumSlug`, url-shaped `sourceUrl`).
3. Yoruba diacritics everywhere, including underdots (Ẹ ẹ Ọ ọ Ṣ ṣ, tone marks as the report writes them).
4. YouTube IDs oEmbed-verified before writing; `youtubeId: null` beats a wrong ID (the media grid tolerates nulls — verify by reading an existing null entry's render path first).
5. No hosted media, no new env vars, no service-role usage — this is static content.
6. Keep the disclaimer/flags/feature boundaries untouched.

## Acceptance criteria

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass (build validates all content via Zod — this is the hard gate).
- [ ] `/impact` map shows corrected OLIC + Port Harcourt blurbs and new pins render with popups.
- [ ] `/media` count grows from 95 to ~130 with 2018–2026 videos present, each embedding or null-graceful.
- [ ] `/slang` shows ~26 entries; corrected Baddo/Bobo/Wó entries render; REJECTED terms appear nowhere.
- [ ] `/influence` renders new nodes (Dagrin visible) and the YBNL roster filter behaves with signed/departed years.
- [ ] `/biography` + `/eras/legacy` include the 2025–2026 beats; `999` date reads 9 February 2020.
- [ ] `content/albums/time-and-space.mdx` exists with `draft: true` and does not surface publicly until flipped.
- [ ] Report lines in the final summary use What I did / Test / Needs your attention bullets.

## Checks to run

`npx tsc --noEmit` → `npm run lint` → `npm run build` (content pipeline change) → `npm run dev` for the manual pass. No DB/Fan Zone work needed.

## Manual test steps

1. `npm run dev`; open `/impact`, click the OLIC pin — venue text and coordinate land in Surulere, not "National Stadium".
2. `/media` — filter by era `reinvention` and `legacy`; spot-check three new videos embed and play (Science Student, Burukutu, Kai!).
3. `/slang` — confirm "Dúróṣọ̀kẹ́" and "Wobey" render with diacritics; confirm "Ye"/"Zanku" absent.
4. `/influence` — Dagrin node with `mentor/influence` blurb; Temmie Ovwasa shows alumni 2015–2020.
5. `/biography` — birthdate line and 2026 beats read correctly; `/albums` list shows 15 public albums (no Time & Space until draft flip).

## Out of scope

Component changes, new schema fields, P2 niceties that need judgment calls we could not verify (Afro Nation clip, VEVO claims), Supabase/`seed:cms` re-run (content/ JSON is static; CMS overrides are a separate flag path — re-seed only if `flags.useCmsContent` duplication is later observed).

---

## Follow-up executed on request — CMS sync (2026-11-06)

The user lifted the Supabase exclusion above and asked for three things: upsert the
Legacy era rows, decide the draft gate, and `npm run seed:cms`.

1. **Era + album rows synced.** `seed-cms.mjs` uses `ON CONFLICT DO NOTHING` for
   eras/albums, so it cannot push audit fixes into rows that already exist. Followed
   the repo's existing convention (`sync-research-content-cms.mjs`) and added
   `scripts/sync-audit-cms.mjs` + `npm run sync:audit-cms`, scoped to
   `cms_eras: legacy, reinvention` and `cms_albums: 999, time-and-space`. It keeps
   `status`, `cover_path` and `updated_by` from the stored row and writes only
   `data`, `body`, `updated_at`.
2. **Draft gate kept** in `src/lib/content.ts:75`. Reverting it would *unhide* Time &
   Space: the filter is what keeps the unreleased album off `/albums`, and it still
   matters because `content/` is the no-database fallback render. Matching gate added
   on the CMS side — `seed-cms.mjs` and the sync script now derive the row's
   `status` from `draft`, instead of the previous hardcoded `draft: false` +
   `status: "published"`, which would have published the unreleased album on a fresh
   seed. `cms_albums:time-and-space` is stored as `status=draft`; `/albums/time-and-space`
   returns 404.
3. **Media seeded.** `npm run seed:cms` upserted all 120 `cms_media_items` rows
   (25 new, `status`/`sort_order` preserved for the 95 existing). It refuses to run
   while `ADMIN_PASSWORD` is the example default, so it was executed once with an
   ephemeral in-memory value — the existing admin auth user was detected and its
   password left unchanged. Rotate `ADMIN_PASSWORD` in `.env.local` so the plain
   command works.

### The stale-render trap (found here, still open)

`/media`, `/albums`, `/impact`, `/songs` are statically prerendered (`○`), and their
Supabase reads land in `.next/cache/fetch-cache`, which survives rebuilds. After the
seed, a full rebuild still served the pre-seed 95-item `/media`; the page only
corrected after `rm -rf .next/cache/fetch-cache && npm run build`. Consequences:

- Anyone deploying a CMS change (admin publish or `seed:cms`) can see a stale
  prerender on those routes even after a rebuild, depending on host cache behaviour.
- Options, not chosen unilaterally because "static-first" is an AGENTS.md §7 decision:
  `revalidatePath` in the admin publish/seed path, `{ cache: "no-store" }` on the CMS
  reads, or documenting a cache purge in the build step.

### Also corrected during the sync

`999`'s date fix had only reached one of four places (era body). Now fixed and synced:
the Reinvention moment chip (9 Feb 2020), `content/albums/999.mdx` `released:` and
credits line, and the "days later" gap to the 18 February 2020 Empire announcement —
nine days, corrected from "Eight"/"Ten". See report §2.3 C-1.
