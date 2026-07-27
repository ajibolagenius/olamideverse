# Contributing to OlamideVerse

Thanks for wanting to help. This is a **fan-made editorial archive** — not a
streaming product and not affiliated with Olamide or YBNL Nation. Contributions
should deepen the archive, keep the Afro-street identity, and respect licensing
(embeds only).

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

| Kind | Examples |
| --- | --- |
| **Content** | Era/album MDX corrections, song catalogue rows, influence/impact pins, verified embed IDs |
| **Design / UI** | Components that match `docs/VISUAL-IDENTITY.md` and live tokens in `src/app/globals.css` |
| **Engineering** | Bugs, a11y, performance, Fan Zone/admin behind feature flags |
| **Docs** | README, this guide, `docs/CONTENT-TRIGGERS.md` watch items |
| **Moderation / rights** | Flag bad embeds or report takedown needs via [SECURITY.md](./SECURITY.md) |

Before large product ideas: read `docs/CONCEPT.md`. Breadth without depth is
out of scope — ship finished chapters, not stub features.

## Prerequisites

- Node.js 20+ recommended (matches Next 16)
- `npm install`
- Copy `.env.example` → `.env.local` if you need Supabase (Fan Zone, CMS, admin)
- For local Fan Zone/admin: Supabase CLI + migrations in `supabase/migrations/`

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Ground rules (non-negotiable)

Copied from [`AGENTS.md`](./AGENTS.md) — keep them:

1. **Afro-street editorial** — paper/ink, danfo yellow, paste-up. No SaaS chrome,
   neon, or glassmorphism.
2. **Embeds only** — Spotify / YouTube / Audiomack. Never commit or host audio/video files.
3. **One motion library** — GSAP behaviors only from `src/lib/motion.ts`, each with
   a designed `prefers-reduced-motion` state.
4. **Disclaimer stays** on every page.
5. **Yoruba diacritics** must be correct (including underdots).
6. **Fan Zone / admin** work stays behind `flags.fanzone` / `comments` / `polls`
   in `src/lib/settings.ts`.

Also read `docs/ACCESSIBILITY.md` before shipping interactive UI.

## Content workflow

1. Edit files under `content/` (MDX/JSON). Schemas live in `src/lib/content-schema.ts`.
2. Invalid frontmatter/JSON **fails the build** — treat that as a feature.
3. Prefer verified facts and cite sources in era/album prose where claims are
   contested (awards, chart numbers).
4. New releases / roster changes: follow `docs/CONTENT-TRIGGERS.md`.
5. After CMS is in use, prefer `npm run sync:research-cms` for targeted updates
   over blind full re-seeds when possible.
6. Catalogue embed fills: dry-run first, then apply:

   ```bash
   npm run fill:spotify-catalog          # needs SPOTIFY_CLIENT_* in .env.local
   npm run fill:youtube-catalog
   # then re-run with -- --apply when confident
   ```

Cover art placeholders are intentional until licensing is clear — don’t replace
them with scraped assets.

## Code workflow

1. Branch from `main` (`feat/…`, `fix/…`, `content/…`).
2. Match existing patterns — App Router under `src/app/(site)/`, shared UI in
   `src/components/`, lib helpers in `src/lib/`.
3. Design reference only: `design-system/` (not imported by the app).
4. For Next.js APIs, prefer guides under `node_modules/next/dist/docs/` — this
   major has breaking changes vs older tutorials.
5. Before opening a PR:

   ```bash
   npm run lint
   npm run build
   ```

6. User-facing changes: add an entry to **`src/lib/changelog.ts`** and
   **`CHANGELOG.md`**.

### Fan Zone / Supabase

- Migrations go in `supabase/migrations/` with dated filenames.
- Never commit service-role keys or real `.env.local`.
- Admin accounts must not use `@fan.olamideverse.app` (reserved for Fan Zone).

## Pull requests

- One concern per PR when possible (content vs feature vs refactor).
- Describe **why**, link any issue, and note feature-flag impact.
- Screenshots or a short Loom help for UI/visual work.
- Call out anything that touches embeds, legal copy, or analytics/privacy.

Maintainers may ask for changes to protect the editorial tone, licensing
posture, or a11y bar.

## What we won’t merge

- Hosted audio/video or ripped lyric dumps
- Generic “AI redesign” that ignores the visual identity
- New animation libraries alongside GSAP
- Removing or weakening the non-affiliation disclaimer
- Secrets, scraped private data, or admin bypasses

## Questions

Open an issue for product/content questions. Security and takedown requests:
see [SECURITY.md](./SECURITY.md) — don’t file those as public feature issues
with sensitive detail.
