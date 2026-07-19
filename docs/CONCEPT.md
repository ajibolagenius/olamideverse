# OlamideVerse v2 — Concept Document

*Version 2.0 · July 2026 · Supersedes the v1 vision docs in `/data` (kept as historical input)*

---

## 1. One-liner

**OlamideVerse is the living archive of Olamide's legacy** — an immersive, editorial web experience that tells the story of how a kid from Bariga built Nigerian street-hop into an empire, era by era, album by album.

## 2. Positioning

Streaming platforms have the songs. Blogs have the news. Nobody has the **story** — the cultural context, the era-defining moments, the lineage from Coded Tunes to YBNL to the artists he raised. OlamideVerse v2 is not a music player with extra pages; it is a **cultural archive with music running through it**.

Three words that define v2: **Archive. Editorial. Street.**

What v2 is *not*:
- Not a streaming service (all audio via Spotify/YouTube/Audiomack embeds — the licensing-safe posture from v1 carries forward)
- Not a fan forum first (community features come only after the archive earns an audience)
- Not a tech demo (motion and interactivity serve the story, never the other way around)

## 3. What changed from v1

| v1 | v2 |
| --- | --- |
| Breadth-first: 8 feature areas, all stubs | Phased: each phase ships something public |
| 7 overlapping animation libraries | One motion system (GSAP), a named motion vocabulary |
| Story mode built as a framework, zero words written | Content is a first-class workstream with its own milestone |
| Generic neon "web3" theme | Afro-street editorial identity rooted in Lagos/Yoruba culture (see `VISUAL-IDENTITY.md`) |
| Supabase wired in from day one | Static-first; backend only when Fan Zone arrives |

## 4. The core idea: Eras

The organizing spine of the whole platform is **Olamide's career told as eras** — a scrollytelling journey where each era has its own chapter, mood, and soundtrack:

1. **The Upstart (2010–2011)** — Bariga, Coded Tunes, ID Cabasa, *Rapsodi*. Rapping in Yoruba when the industry said English.
2. **First of All (2012–2013)** — YBNL Nation founded. *YBNL*, *Baddest Guy Ever Liveth*. The takeover.
3. **The Street King run (2014–2017)** — an album every year: *Street OT*, *Eyan Mayweather*, *The Glory*, *Lagos Nawa*. OLIC concerts. Street-hop becomes the mainstream.
4. **Reinvention (2018–2020)** — the singles era, sonic experiments, *999*, *Carpe Diem*.
5. **Elder Statesman (2021–2023)** — *UY Scuti*, *Unruly*; the label boss era — Fireboy DML, Asake — the empire's second generation.
6. **Legacy (2024– )** — the self-titled chapter and whatever comes next; this era stays open and grows.

*(Era names, boundaries, and facts are working drafts — to be verified and refined during the Phase 2 content research pass.)*

Every other section hangs off this spine: albums belong to eras, media belongs to eras, stories are era chapters.

## 5. Feature roadmap (phased, each shippable)

- **Phase 0 — Concept & Design** *(now)*: this document, `INFORMATION-ARCHITECTURE.md`, `VISUAL-IDENTITY.md`. Optional Figma exploration before locking the identity.
- **Phase 1 — Foundation**: fresh Next.js codebase, design system implemented from the identity spec, deployed skeleton on Vercel.
- **Phase 2 — The Archive (first public milestone)**: Home, Eras scrollytelling, Discography (grid + album detail with embeds), Media gallery, Legal. Real written content. This is the public PoC and the artifact for any future YBNL pitch.
- **Phase 3 — Fan Zone**: favorites, polls, comments, playlists. First backend need (likely Supabase). Only after the archive is live.
- **Archive extras** (shipped as static editorial features): audiogram snippets (`/snippets`), influence graph (`/influence`), impact map (`/impact`). Visual/shareable and curated — still embeds-only, no hosted audio.

## 6. Principles

1. **Ship depth, not breadth.** A finished era chapter beats ten stubbed features.
2. **Content is the product.** Research and writing get scheduled like engineering work.
3. **Embeds only.** No hosted audio or ripped video — ever — until there is a licensing agreement.
4. **Accessible by default.** Keyboard, screen reader, reduced-motion paths for every interaction (carried from v1's a11y-first tooling).
5. **The design says Lagos.** If a component would look at home in a generic SaaS template, redesign it.
6. **Fan project, clearly labeled.** "Not affiliated with Olamide or YBNL Nation" stays visible on every page.

## 7. Success criteria for Phase 2 launch

- All six era chapters written and navigable
- Full discography browsable with working embeds
- Lighthouse: 90+ across performance/accessibility/best practices on key pages
- Deployed on Vercel, shareable URL, disclaimer in place
