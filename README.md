# OlamideVerse

**The living archive of Olamide's legacy** — a fan-made, editorial web
experience telling the story of how a kid from Bariga built Nigerian street-hop
into an empire, era by era, album by album.

> Fan project · **Not affiliated** with Olamide or YBNL Nation · Archival &
> educational · Embeds only, no hosted audio or video.

## Stack

Next.js 16 (App Router, static-first) · TypeScript · Tailwind CSS v4 · GSAP +
ScrollTrigger · MDX/JSON content validated with Zod · Supabase (Fan Zone +
admin) · PWA (service worker + offline page).

## Develop

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys for Fan Zone / admin
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

Other scripts:

```bash
npm run seed:cms              # seed the Supabase CMS (needs .env.local)
npm run fill:spotify-tracks   # backfill Spotify track IDs in album content
```

## Where things live

| Path | What |
| --- | --- |
| `docs/` | Concept, information architecture, visual identity (source of truth) |
| `design-system/` | Design reference — tokens, component specs, Claude Design export |
| `content/` | Eras, albums, media, impact, influence, and snippets — the archive's content (MDX/JSON, Zod-validated) |
| `src/app/(site)/` | Public routes — home, eras, albums, about, media, impact, influence, snippets, fanzone, legal |
| `src/app/admin/` | Admin dashboard (content, Fan Zone moderation, ops, team) |
| `src/lib/content.ts`, `src/lib/content-schema.ts` | Zod-validated content loaders and schemas |
| `src/lib/motion.ts` | The five named GSAP behaviors (with reduced-motion fallbacks) |
| `src/lib/fanzone/`, `src/lib/admin/`, `src/lib/supabase/` | Fan Zone data layer, admin actions/auth, Supabase clients |
| `src/components/chrome/` | Site header, footer, disclaimer strip, ticker |
| `src/components/fanzone/` | Favorites, playlists, polls, comments, sign-in |
| `public/sw.js`, `public/offline.html` | PWA service worker and offline fallback |

## Roadmap

- **Phase 1 — Foundation** ✓ scaffold, design system, motion vocabulary, page skeletons
- **Phase 2 — The Archive**: real written content, verified facts, embed IDs
- **Phase 3 — Fan Zone**: favorites, polls, comments, playlists, admin dashboard (Supabase-backed, in progress)
