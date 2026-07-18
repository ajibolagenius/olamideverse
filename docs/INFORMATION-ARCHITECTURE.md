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
/media                  Media gallery — videos, freestyles, interviews (embeds)
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

### Media `/media`
Curated, era-tagged gallery of embedded videos: music videos, freestyles, interviews, live moments. Curation notes over completeness.

### About `/about` · Legal `/legal`
Fan-project statement, non-affiliation disclaimer, takedown contact, credits for sources.

## Content model (repo-resident, static)

```
content/
  eras/[era].mdx          # chapter prose + frontmatter (slug, title, years, thesis, accent, order)
  albums/[slug].mdx       # album story + frontmatter (title, year, era, type, cover, tracklist[], embeds{})
  media/media.json        # curated list: { id, title, era, year, type, youtubeId|embedUrl, note }
```

- All content is MDX/JSON in the repo → fully static site, no CMS, no backend.
- Frontmatter validated with Zod at build time so bad content fails the build, not the page.
- Tracklists carry embed IDs (Spotify track/album IDs, YouTube IDs) — never audio files.

## Navigation

- **Header:** wordmark · Eras · Discography · Media · About — plus persistent "fan project" micro-disclaimer.
- **Footer:** legal, source credits, takedown contact, social links.
- **Cross-linking rule:** every album links to its era; every era lists its albums; media items link both ways. The archive should feel like one continuous fabric, not siloed sections.

## Fan Zone [Phase 3 — sketch only]

`/fanzone` with favorites, polls ("best album of the Street King run?"), comments on albums/eras, shareable playlists. Requires auth + database (likely Supabase). Nothing in Phase 1–2 may depend on it; it mounts onto existing pages (e.g. a favorite button on album cards) rather than reshaping them.
