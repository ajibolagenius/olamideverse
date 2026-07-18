# OlamideVerse

**The living archive of Olamide's legacy** — a fan-made, editorial web
experience telling the story of how a kid from Bariga built Nigerian street-hop
into an empire, era by era, album by album.

> Fan project · **Not affiliated** with Olamide or YBNL Nation · Archival &
> educational · Embeds only, no hosted audio.

## Stack

Next.js (App Router, fully static) · TypeScript · Tailwind CSS v4 · GSAP +
ScrollTrigger · MDX/JSON content validated with Zod.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `docs/` | Phase 0 concept, information architecture, visual identity (source of truth) |
| `design-system/` | Phase 0 design reference — tokens, component specs, Claude Design export |
| `content/` | Eras (MDX), albums (MDX), media (JSON) — the archive's content |
| `src/lib/content.ts` | Zod-validated content loaders |
| `src/lib/motion.ts` | The five named GSAP behaviors (with reduced-motion fallbacks) |

## Roadmap

- **Phase 1 — Foundation** ✓ scaffold, design system, motion vocabulary, page skeletons
- **Phase 2 — The Archive**: real written content, verified facts, embed IDs, deploy
- **Phase 3 — Fan Zone**: favorites, polls, comments, playlists (first backend)
