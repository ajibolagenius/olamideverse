# 23 — Time and Space release day

Date: 16 November 2026

Requested work: "The new Olamide album is out now at 6:00 PM Nigerian time.
Update the project." Status: approved by the user's "Yes"; implemented and verified 16 Nov 2026.
CMS: user chose the targeted three-row publish over `sync:audit-cms`.

## Goal

Take the seeded `time-and-space` draft live: real tracklist, Spotify embeds,
release-day copy, and every "announced" reference flipped to "released".
Content-only change. No schema, component, or route code changes.

## Skills and inspected code

- Read root `AGENTS.md`, `docs/CONTENT-TRIGGERS.md` (Discography + Songs
  catalogue + "After content edits that already exist in CMS").
- Inspected `content/albums/time-and-space.mdx` (draft), `content/albums/olamide.mdx`
  (shape to copy), `content/eras/legacy.mdx`, `content/songs/catalog.json`
  (`single--burukutu-2026`, `alsoSingles`), `content/media/media.json`
  (`burukutu-video`), `content/media/manifest.json`, `src/lib/content-schema.ts`
  (`trackSchema`, `albumSchema.draft`), `src/lib/content.ts` (draft filter,
  `deriveAlbumTracks`), `src/lib/changelog.ts`, `scripts/sync-audit-cms.mjs`,
  `scripts/spotify/fill-spotify-track-ids.mjs`.
- No skill needed beyond these: no auth, RLS, UI, or motion work.

## Verified facts (and where from)

Spotify Web API, read on 16 Nov 2026 with the project's own client credentials:

- Album `0DHDiiApo6bKBpz1UfZuQH`, title **"Time and Space"**, release date
  2026-11-16, 10 tracks, (P) 2026 YBNL Nation / EMPIRE.
- Tracks and IDs:
  1. Elohim — `0jZoSmAohyh3UvX2LotOQx`
  2. Skoskola — `7wT93fcw6XSim76fnj5PBm`
  3. Say Less — `4lNf03MYaedHjati4YsRNR`
  4. Burukutu — `4KrkM2fOSqvVtUFoOcfyMX`
  5. Alujon — `2sotMZwvvJ9ZbqitFBY2fe`
  6. Mbiri — `7HuWPTmnO8hhZz03R3dXMr`
  7. Jaiye (feat. FOLA) — `44ymppaLcjHZmRDqlojZbL`
  8. Oshey — `1WeebIyjndnzdHSmB4Pn1v`
  9. Ring — `3h5UBmNTuYv173qsK01ab2`
  10. Jogor — `7cnzqXfo5kM0squUiM9dDl`

Press:

- BellaNaija, 12 Nov 2026 — same ten titles in the same order, Fola the only
  guest ("Jaiye"), YBNL Nation and EMPIRE, cover personally painted by Olamide
  (portrait in a vintage gold frame on red).
  https://www.bellanaija.com/2026/11/olamide-time-and-space-album-cover-tracklist/
- NotJustOk, 20 Oct 2026 — title and date announcement.
  https://notjustok.com/news/olamide-confirms-release-date-and-title-of-new-album/
- Already in the archive: "Burukutu" released 20 Oct 2026, produced by
  BlaiseBeatz, video by TG Omori.

Not verified, so not published:

- Producers for the other nine tracks. No source names them yet.
- "13th studio album" (eelive, Daily Economy). Press counts conflict with
  `CONTENT-TRIGGERS.md` ("12th studio album"); left out.
- Streaming or chart numbers. None exist on release day.
- The 6:00 PM WAT drop time. It is the user's statement; no page states a time,
  so copy says "16 November 2026" only.

## Decisions and assumptions

1. **Title becomes "Time and Space"** (the published DSP title), replacing
   "Time & Space" in the album file, the Legacy era ticker/moment and the
   Burukutu media note. Same rule the archive applied to *Olamidé*: keep the
   published title. Old changelog entries stay as written.
2. **Burukutu stops being a standalone single row.** Per `CONTENT-TRIGGERS.md`,
   delete `single--burukutu-2026` from `entries` and add
   `{ "id": "time-and-space--burukutu" }` to `alsoSingles`. Its Audiomack URL
   moves to the album track's `audiomackUrl`. The exact derived ID is confirmed
   from `albumTrackSongId` before editing. Any fan favourite stored against the
   old ID is not migrated (the single has been listed for under a month).
3. **Producer field** reads "BlaiseBeatz and others" only if the schema/page
   tolerates it as the other albums do; credits paragraph states plainly that
   only Burukutu's producer is verified so far.
4. **Cover art** follows the existing disclosed-placeholder pattern: look up the
   album on Deezer's public API, save `public/media/albums/time-and-space.jpg`,
   add the manifest row with `sourceUrl`. If Deezer does not list it yet, ship
   without a cover and report it.
5. **Era copy** stays open-ended. `legacy.mdx` keeps "This chapter has no ending
   yet"; the new album gets one sentence in `heroIntro`/`contextBody` and a
   16 Nov 2026 moment. The 20 Oct announcement moment is reworded to past tense.
6. **No new npm script.** CMS sync reuses `npm run sync:audit-cms`, which
   already lists `legacy` and `time-and-space` and preserves stored `status`.
   The CMS album row is `draft`; publishing it is a separate, outward-facing
   step done only with the user's go-ahead (see "Needs approval at run time").

## Files expected to change

- `content/albums/time-and-space.mdx` — title, producer, tracklist with Spotify
  IDs, `note` per track (Solo / feat. Fola / lead single), key bars for
  "Burukutu" and "Jaiye", credits, `embeds.spotifyAlbumId`, body rewritten for
  release, `draft` removed.
- `content/eras/legacy.mdx` — ticker, hero intro, context, moments.
- `content/songs/catalog.json` — remove Burukutu single row, add `alsoSingles`.
- `content/media/media.json` — Burukutu note title spelling.
- `content/media/manifest.json` + `public/media/albums/time-and-space.jpg` — cover.
- `src/lib/changelog.ts` (and the repo's second changelog, as in prompt 22) —
  new 2026-11-16 day: "Time and Space is out".
- `docs/CONTENT-TRIGGERS.md` — tick/annotate the new-album trigger.
- Any hard-coded release count found by grep (manifest note says "15 releases").

## Requirements

- Album body: three or four short paragraphs in the house voice. Facts only from
  the list above. No review claims, no numbers, no invented lyrics.
- Key bars describe the track's place in the story, not quoted lyrics.
- Yoruba words carry full diacritics where the archive writes them itself;
  published track titles keep their published spelling.
- Embeds only. The disclaimer and layouts are untouched.

## Security considerations

- No auth, RLS, or route changes. No secrets in content or logs.
- Spotify lookup and CMS sync use `--env-file=.env.local`; the service-role key
  stays inside `scripts/`.
- Cover download is a single public CDN GET; no user data in the request.

## Acceptance criteria

- `/albums/time-and-space` returns 200 with ten tracks, each playable through
  the Spotify embed, and the album embed loads.
- Discography and the Legacy era page list the album; no page says "announced",
  "to be verified" or "draft" about it.
- `/songs?q=Burukutu` shows exactly one Burukutu row, linked to the album and
  marked also-single. `/songs` shows the other nine as album tracks.
- "What's new" shows the 16 November entry linking to the album.
- Build passes Zod validation with no duplicate song IDs.

## Checks

- `npx tsc --noEmit`
- `npm run lint`
- `npm run check:embed-ids`
- `npm run build`

## Manual test steps

1. `npm run dev`, open `/albums/time-and-space`. Play track 1 and track 7.
2. Open `/eras/legacy`. Confirm ticker and the 16 Nov 2026 moment.
3. Open `/songs?q=Burukutu`. Confirm one row.
4. Open the changelog page. Confirm the new entry and its link.

## Needs approval at run time

- Running `npm run sync:audit-cms` against the Supabase project in `.env.local`
  and flipping `cms_albums.time-and-space` from `draft` to `published`. This
  changes the live site when `useCmsContent` is on.
- Commit / push / deploy. Not done unless asked.
