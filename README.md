# OlamideVerse

**The living archive of Olamide's legacy** — a fan-made, editorial web
experience that tells how a kid from Bariga built Nigerian street-hop into an
empire, era by era, album by album.

> Fan project · **Not affiliated** with Olamide or YBNL Nation · Archival &
> educational · Embeds only — no hosted audio or video.

Live product docs (concept, IA, visual identity) live in [`docs/`](./docs/).
Agent/contributor ground rules: [`AGENTS.md`](./AGENTS.md).

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 · tokens in `src/app/globals.css` |
| Motion | GSAP + ScrollTrigger — five named behaviors in `src/lib/motion.ts` |
| Content | MDX/JSON under `content/`, Zod-validated by `src/lib/content.ts` |
| Backend | Supabase (Fan Zone, CMS, admin, analytics) — feature-flagged |
| Maps | Leaflet + react-leaflet (`/impact`) |
| PWA | `public/sw.js` + offline page (production only; not registered in dev) |

## Features (today)

**Archive**

- Six era chapters + discography with track embeds
- Songs catalogue, media gallery, audiogram snippets
- Influence graph, impact map, site-wide search
- “On this day”, related albums, offline reading list (`/saved`)
- Public changelog (`/changelog`) and update notice for returning visitors

**Fan Zone** (behind CMS flags in `src/lib/settings.ts` — off by default)

- Handle + password accounts (no email)
- Favorites, playlists, polls (optional page scope), threaded comments
- Public opt-in profiles (`/fanzone/fans`), streaks & stamps

**Ops**

- Admin console (`/admin`) — CMS, Fan Zone moderation, analytics, legal ops
- First-party anonymous analytics + optional GA/GTM
- PWA shell caching for offline revisits

## Quick start

```bash
npm install
cp .env.example .env.local   # Supabase keys for Fan Zone / admin / CMS
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run build` / `start` | Production build & serve |
| `npm run lint` | ESLint (includes jsx-a11y) |
| `npm run seed:cms` | Seed Supabase CMS from repo content |
| `npm run sync:research-cms` | Targeted research → CMS sync |
| `npm run fill:spotify-tracks` | Backfill Spotify IDs on album tracks |
| `npm run fill:spotify-catalog` | Match songs catalogue → Spotify (needs API keys) |
| `npm run fill:youtube-catalog` | Match songs catalogue → YouTube |

See [`.env.example`](./.env.example) for all variables. Local Supabase defaults
point at `http://127.0.0.1:54331`; apply migrations under `supabase/migrations/`.

## Routes

| Path | What |
| --- | --- |
| `/` | Editorial home — doors into eras, discography, watch |
| `/eras`, `/eras/[era]` | Timeline + era chapters |
| `/albums`, `/albums/[slug]` | Discography + album stories / embeds |
| `/songs` | Living song catalogue |
| `/media` | Curated video embeds |
| `/snippets`, `/snippets/[id]` | Shareable audiogram cards |
| `/influence` | Mentors, peers, YBNL roster |
| `/impact` | Editorial map (Lagos / Nigeria / world) |
| `/search` | Site-wide search |
| `/saved` | Offline reading list |
| `/changelog` | What’s new (reader-facing) |
| `/about`, `/legal` | Colophon, disclaimer, takedown |
| `/fanzone`, `/fanzone/fans` | Fan Zone hub + public profiles |
| `/admin` | CMS & moderation console |

## Layout

| Path | What |
| --- | --- |
| `docs/` | Concept, IA, visual identity, a11y, content triggers |
| `design-system/` | Phase 0 design reference (not app code) |
| `content/` | Eras, albums, songs, media, snippets, influence, impact |
| `src/app/(site)/` | Public routes |
| `src/app/admin/` | Admin dashboard |
| `src/lib/content.ts` | Zod loaders / schemas |
| `src/lib/motion.ts` | Named GSAP vocabulary + reduced-motion |
| `src/lib/fanzone/`, `src/lib/admin/`, `src/lib/supabase/` | Data & auth layers |
| `src/lib/changelog.ts` | Source for `/changelog` |
| `src/components/` | UI, chrome, Fan Zone, embeds |
| `public/sw.js`, `public/offline.html` | PWA |
| `supabase/migrations/` | Schema & RLS |

## Principles

1. **Afro-street editorial** — paper/ink, danfo yellow, paste-up. Not SaaS-generic.
2. **Embeds only** — Spotify / YouTube / Audiomack. Never host audio or video.
3. **One motion system** — only the five behaviors in `src/lib/motion.ts`.
4. **Disclaimer on every page** — not affiliated with Olamide or YBNL Nation.
5. **Correct Yoruba diacritics** — including underdots (font subsetting caveat in `AGENTS.md`).
6. **Fan Zone behind flags** — `fanzone` / `comments` / `polls` in settings; don’t assume modules are optional to import.

## Roadmap status

| Phase | Status |
| --- | --- |
| 0 — Concept & design | Done — `docs/` |
| 1 — Foundation | Done — scaffold, tokens, motion |
| 2 — The Archive | Done — eras, discography, media, extras; cover art still placeholder (Legal) |
| 3 — Fan Zone | Done — built + flagged; admin console included |

Remaining launch checks: production URL confirm, VoiceOver spot-pass
(`docs/ACCESSIBILITY.md`), cover-art licensing before any rights-holder pitch.
Editorial watch list: `docs/CONTENT-TRIGGERS.md`.

## Contributing & community

- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to work on code and content
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — community standards
- [SECURITY.md](./SECURITY.md) — vulnerability & takedown reporting
- [CHANGELOG.md](./CHANGELOG.md) — repo release notes (mirrors `/changelog`)
- [LICENSE](./LICENSE) — code license; third-party rights stay with their owners

## Disclaimer

OlamideVerse is an independent fan archive for educational and cultural
purposes. It is **not affiliated with, endorsed by, or sponsored by** Olamide,
YBNL Nation, or related rights holders. Streaming embeds are provided by third
parties under their terms. See `/legal` for copyright posture and takedown.
