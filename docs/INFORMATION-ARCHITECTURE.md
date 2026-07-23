# OlamideVerse v2 — Information Architecture

*Phase 0 deliverable. Routes marked [P3] arrive with Fan Zone; everything else is Phase 2.*

---

## Sitemap

```
/                       Home — editorial front door
/eras                   Eras index — the career timeline at a glance
/eras/[era]             Era chapter — scrollytelling deep dive
/albums                 Discography — grid of albums & mixtapes
/albums/[slug]          Album detail — tracklist, embeds, story, credits
/songs                  Song catalogue — album tracks, singles, features, freestyles, lives, snippets
/media                  Media gallery — videos, freestyles, interviews (embeds)
/snippets               Audiogram-style share cards (visual + embed links)
/snippets/[id]          Snippet detail — card, embed, share
/influence              Influence graph — mentors, peers, mentees, collabs
/impact                 Impact map — curated places (Lagos / Nigeria / world)
/about                  What OlamideVerse is, who made it, colophon
/legal                  Disclaimer, terms, copyright policy
/fanzone                [P3] Favorites, polls, comments, playlists
```

## Page briefs

### Home `/`
The cover of the magazine. One bold statement of what this is, the current/latest era featured, and three doors: **Explore the Eras**, **Browse the Discography**, **Watch**. No feed, no clutter — poster energy.

### Eras index `/eras`
The whole career on one scrollable timeline — six era cards, each with its years, defining albums, and one-line thesis. This page *is* the elevator pitch of the site.

### Era chapter `/eras/[era]`
The flagship template. A scroll-driven chapter: opening statement → the context (what Lagos/Nigeria sounded like then) → the albums of the era (inline, linking to album pages) → the moments (signature tracks, quotes, cultural beats, embedded video) → handoff to the next era. Each era carries its own accent treatment within the design system.

### Discography `/albums`
Grid of all albums and mixtapes, filterable by era and year, sortable by release date. Cover-art forward.

### Album detail `/albums/[slug]`
Cover, year, era link, credits, tracklist with per-track embeds (Spotify primary, YouTube/Audiomack fallback), and a short written story of the album — where it landed, what it changed. Lyrics *context* (commentary on key bars), not full lyric reproduction (licensing).

### Songs catalogue `/songs`
Living index of documented songs from ~2010 to today: album tracks (derived from discography MDX), plus researched singles, features, freestyles, lives, snippets and other. Titles, years, credits, optional embeds — no full lyrics. Filter by type / era, search, sort by year. Verification tiers: verified · documented · lore. Not a claim of absolute completeness.

### Media `/media`
Curated, era-tagged gallery of embedded videos: music videos, freestyles, interviews, live moments. Curation notes over completeness.

### Snippets `/snippets` · `/snippets/[id]`
Shareable audiogram-style cards — decorative waveforms, key-bar context, era accent, and a link to the Spotify/YouTube embed. No hosted audio. Surfaced on matching album pages and the home “Deeper cuts” strip.

### Influence `/influence`
Split magazine layout: compact hub (mentors/peers/collaborators/influences) beside an always-visible **YBNL roster timeline**. Selecting either side opens a shared detail blurb with era/album links. Filters dim/highlight; they never hide the roster. YBNL signees carry `signedYear` / `departedYear` (or `alumni` when the exit year is soft).

### Impact `/impact`
Real geography (Leaflet + lat/lng) — Lagos / Nigeria / world views with editorial pins (origin, venue, concert, cultural, international). Not a live tour tracker.

### About `/about` · Legal `/legal`
Fan-project statement, non-affiliation disclaimer, takedown contact, credits for sources.

## Content model (repo-resident, static)

```
content/
  eras/[era].mdx          # chapter prose + frontmatter (slug, title, years, thesis, accent, order)
  albums/[slug].mdx       # album story + frontmatter (title, year, era, type, cover, tracklist[], embeds{})
  songs/catalog.json      # non–album-track catalogue + alsoSingles overlays; album cuts derived at load
  media/media.json        # curated list: { id, title, era, year, type, youtubeId|embedUrl, note }
  snippets/snippets.json  # audiogram cards: { id, quote, note, track, albumSlug, era, embeds… }
  influence/graph.json    # { nodes[], edges[] } for the influence graph
  impact/places.json      # curated places with map plane + lat/lng (Leaflet)
```

- All content is MDX/JSON in the repo → fully static site, no CMS, no backend.
- Frontmatter validated with Zod at build time so bad content fails the build, not the page.
- Tracklists carry embed IDs (Spotify track/album IDs, YouTube IDs) — never audio files.

## Navigation

- **Header:** wordmark · Eras · Discography · Songs · Media · About — plus persistent "fan project" micro-disclaimer.
- **Footer:** songs, snippets, influence, impact, legal, source credits, takedown contact, Fan Zone when enabled.
- **Cross-linking rule:** every album links to its era; every era lists its albums; media items link both ways; snippets link to album + era; song catalogue rows link to albums when known; influence/impact nodes link back into chapters. The archive should feel like one continuous fabric, not siloed sections.

## Fan Zone [Phase 3 — sketch only]

`/fanzone` with favorites, polls ("best album of the Street King run?"), comments on albums/eras, shareable playlists. Requires auth + database (likely Supabase). Nothing in Phase 1–2 may depend on it; it mounts onto existing pages (e.g. a favorite button on album cards) rather than reshaping them.
