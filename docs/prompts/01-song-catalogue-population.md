# 01 — Song catalogue population

## Goal

Raise embed coverage in `content/songs/catalog.json` from 373/478 playable to as
close to complete as the sources allow, and add the two providers AGENTS.md §7
already names but the code never implemented.

Three parts:

1. Fill the **105 entries with no playable ID at all**.
2. **Cross-fill** the 229 YouTube-only and 49 Spotify-only entries so most rows
   offer a provider choice.
3. Add **Audiomack** and **Apple Music** embed support end to end (schema →
   catalogue → `EmbedFrame`).

## Skills / docs read

- `AGENTS.md` §5 (content layer boundary), §7 (embeds only), §8 (song fields),
  §9 (Zod validates at build time), §10 (checks).
- `node_modules/next/dist/docs/` — not needed for this task; no routing or
  caching change. Flagged here so the next task knows it was considered.
- Existing script headers are the real spec: `scripts/spotify/verify-spotify-ids.mjs`
  (the trust boundary), `scripts/fill-youtube-catalog-ids.mjs`,
  `scripts/apply-ytm-catalog-ids.mjs`.

## Code inspected

| Path | What it told me |
|---|---|
| `content/songs/catalog.json` | 478 `entries` + 34 `alsoSingles`. 144 `spotifyTrackId`, 324 `youtubeId`, **105 with neither**. Status split: 349 verified / 64 documented / 65 lore. |
| `src/lib/content-schema.ts:194` | `songSchema` — only `spotifyTrackId` and `youtubeId` exist. `trackSchema:36` same. `albumSchema.embeds:70` already has `audiomackUrl` but no song-level equivalent. |
| `src/components/EmbedFrame.tsx` | Handles `spotify` / `youtube` / `youtubemusic` only. YTM reuses the YouTube video ID and adds a link-out. No Audiomack, no Apple Music. |
| `src/components/SongCatalog.tsx:29` | `songHasEmbed()` gates on `spotifyTrackId \|\| youtubeId` — must widen with the new fields. |
| `scripts/spotify/out/spotify-agent-verified.json` | 102 rows, all `pass`. **2 have never been applied to the catalogue.** |
| `scripts/spotify/out/spotify-catalog-progress.json` | `{accepted, rejected, skipped, doneIds}` — resumable; do not reset. |

## Decisions and assumptions

- **The verify script stays the trust boundary.** Agent-researched IDs are
  proposals, never direct catalogue writes. Every new Spotify ID goes through
  `npm run verify:spotify-ids` and only `pass` rows get applied. This is the
  existing design and the reason a hallucinated base62 ID has never shipped.
- **YouTube has no equivalent verifier.** `fill-youtube-catalog-ids.mjs`
  scrapes search HTML and self-reports confidence. Keep its existing status
  promotion rule (`documented → verified`, `lore → documented`) and keep the
  default dry-run. Do not promote on low-confidence matches.
- **Audiomack stores a URL, not an ID.** Audiomack's embed is
  `https://audiomack.com/embed/song/<artist>/<slug>`; the canonical page URL is
  the stable handle. Follow `albumSchema.embeds.audiomackUrl`, which already
  made this call — add `audiomackUrl?: string` to `songSchema`, not an ID.
- **Apple Music stores a numeric track ID plus storefront.** Embed is
  `https://embed.music.apple.com/<storefront>/song/<id>`. Store
  `appleMusicId?: string` and assume storefront `ng` (Nigeria) as the default
  rather than adding a second field for a value that never varies here.
- **Provider precedence in `EmbedFrame` becomes**: Spotify → Apple Music →
  YouTube/YTM → Audiomack. Spotify keeps winning because it is the only one
  with a compact 152px track player and the only one the mini-player (prompt
  02) can dock.
- **`lore` rows may legitimately stay empty.** 65 rows are lore — undocumented
  or unreleased. Not finding an embed is a correct outcome, not a failure. Do
  not invent an ID to close the gap.
- Assumption: no Apple Music or Audiomack API credentials are available, so
  those two are filled by researched-then-manually-reviewed proposals, same
  shape as the Spotify agent proposals file.

## Files expected to change

- `src/lib/content-schema.ts` — `songSchema`, `trackSchema`: add
  `audiomackUrl`, `appleMusicId`.
- `src/components/EmbedFrame.tsx` — two new providers, new precedence, new
  link-outs.
- `src/components/SongCatalog.tsx` — widen `songHasEmbed()`.
- `src/components/Tracklist.tsx` — same widening for album tracks.
- `src/app/(site)/songs/page.tsx`, `src/app/(site)/albums/[slug]/page.tsx` —
  pass new blocklists if the admin kill-switch is extended (see Security).
- `content/songs/catalog.json` — the actual ID fills.
- `scripts/spotify/out/*.json` — new proposal + verified reports.
- Possibly one new script for Audiomack/Apple proposals, mirroring
  `verify-spotify-ids.mjs`'s report-only shape.

## Requirements

1. Apply the 2 outstanding `pass` rows from `spotify-agent-verified.json`.
2. For each of the 105 blank rows, attempt Spotify first, then YouTube, then
   Audiomack/Apple. Record an explicit `not-found` verdict for rows that stay
   blank so the next pass does not re-research them.
3. Cross-fill: for the 229 YouTube-only rows, propose Spotify IDs; for the 49
   Spotify-only rows, propose YouTube IDs. Both through the existing verify /
   dry-run gates.
4. New schema fields are `.optional()` — every existing catalogue row and album
   MDX file must still parse unchanged.
5. `EmbedFrame` renders exactly one player. New providers reuse the existing
   `ov-tape` chrome, the danfo pulse dot, and the uppercase label row. No new
   visual language (AGENTS.md §3).
6. Every new provider iframe keeps `loading="lazy"` and a `title` of the form
   `"<song> — <Provider> player"`.

## Security considerations

- **No new secrets.** Spotify creds already exist as `SPOTIFY_CLIENT_ID` /
  `SPOTIFY_CLIENT_SECRET`, server-only, read only by `scripts/`. Audiomack and
  Apple embeds are unauthenticated. Nothing to add to `.env.example`.
- **Embed IDs are untrusted input into an iframe `src`.** Validate shape before
  interpolation: Spotify `^[A-Za-z0-9]{22}$`, YouTube `^[A-Za-z0-9_-]{11}$`,
  Apple `^\d+$`. Audiomack takes a full URL — it must be validated as
  `https://audiomack.com/...` and nothing else, or it is a stored-XSS-adjacent
  open redirect into the player frame. Put these next to the existing
  validators in `src/lib/security/urls.ts`.
- **Honour the admin kill-switch.** `blockedSpotifyIds` / blocked YouTube lists
  exist so a rights holder's takedown can kill an embed without a redeploy. Any
  new provider must be blockable the same way, or the takedown path has a hole.
- Content layer stays read-only (AGENTS.md §5). Scripts write
  `content/songs/catalog.json` on disk; the app never does.

## Acceptance criteria

- [ ] Entries with no playable ID drops from 105, and every row still blank has
      a recorded `not-found` verdict with a reason.
- [ ] The 2 pending verified Spotify rows are in the catalogue.
- [ ] Zero rows carry an unverified Spotify ID — every `spotifyTrackId` in the
      catalogue traces to a `pass` row in a verified report.
- [ ] `audiomackUrl` / `appleMusicId` parse, render, and are blockable.
- [ ] A song with all four providers shows exactly one player (Spotify) plus
      link-outs for the rest.
- [ ] A `lore` song with no embed still renders its row and the
      "Embed coming in the content pass" copy, not an error.

## Checks to run

```
npx tsc --noEmit
npm run lint
npm run build          # content/ and schema changed → Zod runs at build
```

## Manual test steps

1. `npm run dev`, open `/songs`.
2. Filter to **Features** — pick a row that previously had no embed. Confirm a
   player loads and the provider label matches what the catalogue says.
3. Pick a row that now has both Spotify and YouTube. Confirm Spotify renders
   and the YouTube link-out is present, not a second iframe.
4. Open an album page with an Audiomack URL in `embeds`. Confirm the tracklist
   player still behaves and no layout shift was introduced.
5. Temporarily add a known `spotifyTrackId` to the admin block list, reload,
   confirm the embed falls back to the next provider rather than going blank.
6. Filter to **Lore**. Confirm rows without embeds render the placeholder copy.
