# Content update triggers

Maintainer checklist derived from the career research dossier.
These are **editorial watch items**, not product features — no admin UI,
no public routes. When one fires, update the named content surfaces and
(if CMS already has the row) run a targeted sync rather than a blind re-seed.

## Discography

- [ ] **12th studio album** (Olamide has publicly hinted at stepping back after
      his 12th). Update `content/albums/[slug].mdx`, Legacy era moments, albums
      index copy, and any home featured-era framing.
- [ ] **Major chart / streaming records** for new releases — prefer TurnTable
      Charts and platform first-party figures; put numbers on the album page
      and the matching era moments (not a standalone charts page).

## YBNL Nation roster

- [ ] **New signing** — add an Influence node with `signedYear`, mentee role,
      blurb, era/moment links; add a `signed` edge from `olamide`.
- [ ] **Departure / imprint launch** — set `departedYear`, refresh the blurb,
      and add a Legacy (or current-era) moment if the exit is career-defining
      (pattern: Asake → Giran Republic, early 2025).
- [ ] Confirm the **YBNL roster** filter on `/influence` still lists every
      node that carries `signedYear`.

## Awards & honours

- [ ] Only publish hard totals (e.g. Headies win counts) after checking
      official or primary records — press sources conflict.
- [ ] New verifiable superlatives (Grammy, Billboard Global Power Player,
      Headies AOTY) → era ticker + moment, not an awards database.

## Business / endorsements

- [ ] **Verified** ambassadorships and OLIC editions → era moments and/or
      Impact pins (`content/impact/places.json`).
- [ ] Never publish net-worth figures, rumoured deal values, or aggregator-only
      investment claims as fact.

## Credibility reminders

- Separate verified from reported in copy.
- Embeds only — no hosted audio/video.
- Disclaimer stays on every page.
- Yoruba orthography with correct diacritics.

## After content edits that already exist in CMS

Eras, albums, and media items may be served from Supabase when
`useCmsContent` is on. Prefer a **targeted** update (see
`npm run sync:research-cms` as the pattern) over `npm run seed:cms`, which
only inserts missing rows and will not refresh edited CMS content.
