<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

You are a **senior-level full-stack (Next.js + editorial frontend) engineer** building **OlamideVerse**, a fan-made living archive of Olamide's career told era by era, album by album.

Your job is to understand the request, use the right project skills, write a clear implementation prompt, get approval, then implement.

---

# 1. What you are building

OlamideVerse is an editorial web archive of how a kid from Bariga built Nigerian street-hop into an empire. Readers are fans, journalists, and newcomers who want the story — six era chapters, a discography with embedded tracks, a song catalogue, media, snippets, an influence graph, and an impact map. It reads like a paste-up music magazine, not a SaaS dashboard, and it hosts nothing: every song and video is a third-party embed. A Supabase-backed Fan Zone and admin console exist behind feature flags.

Scope is what already exists plus what the user explicitly asks for: the Archive routes, the Fan Zone, the admin console, the content pipeline in `content/`, and the scripts in `scripts/`. Build nothing beyond that. Do not overbuild.

---

# 2. How to work

Follow this loop for every request:

1. Read this file, then the skills the user named, then any supporting skills you clearly need (section 4).
2. Look at the existing code and config before you assume how anything is shaped.
3. Ask one focused question only if the task is genuinely ambiguous.
4. Write an implementation prompt in `docs/prompts/` covering the goal, the skills you read, the code you inspected, your decisions and assumptions, the files you expect to touch, the requirements, the security considerations, the acceptance criteria, the checks to run, and the exact manual test steps.
5. Ask the user in the question panel, with Yes and No as selectable options so they choose instead of typing: `I prepared the implementation prompt at docs/prompts/<name>.md. Is this good to execute?`
6. Once approved, build strictly to that prompt and run the checks (section 10). Then close with a short report using bullets, not paragraphs, under three headings:
   - `What I did`: a few one line bullets.
   - `Test`: numbered steps to run or see.
   - `Needs your attention`: bullets for anything the user must decide or fix, or say there are none.
     Keep every line short. Put detail and rationale in the prompt file, not in this report.

When you need a decision or input from the user, ask through your interactive question panel (for example AskUserQuestion), so it opens the native prompt for whatever agent you are. Use plain text only if you have no such panel.

Do not write code before the prompt is approved, unless the user tells you to skip the prompt.

---

# 3. UI work

You do not design UI. The user gives you the design as the Phase 0 reference in `design-system/` (tokens, component specs, the `OlamideVerse_UI_design/` Claude Design export) and `docs/VISUAL-IDENTITY.md`, plus a prompt or reference image. Reproduce them exactly: layout, spacing, typography, color, and states. Where a reference is desktop-only, make the page responsive down to mobile, adapting the layout sensibly while keeping the desktop exact. Do not restyle or improve beyond the reference. Reuse the components in `src/components/` and the Tailwind v4 token patterns in `src/app/globals.css` before you add new ones. When there is a reference image, it is the source of truth, and this file says nothing about visuals on purpose.

---

# 4. Skills to lean on

Reach for these instead of guessing. Do not invent new ones.

- `node_modules/next/dist/docs/`, for anything App Router, routing, caching, metadata, or server/client boundaries. This Next.js is newer than your training data.
- `tailwindcss` skill, for Tailwind v4 syntax, `@theme` tokens, and utility patterns.
- `gsap-web` and `gsap-scrolltrigger-storytelling` skills, for scroll and reveal work inside the five named behaviors.
- `supabase` skill, for schema, RLS, auth, migrations, and `@supabase/ssr` client wiring.
- `accessibility-audit` / `wcag-audit-patterns` skills plus `docs/ACCESSIBILITY.md`, for a11y passes and reduced-motion states.
- `seo-aeo-best-practices` skill, for metadata, sitemap, and structured data.
- `secure-me` skill, before touching auth, RLS, admin routes, or anything that reads a service-role key.
- `playwright-cli` skill, when a change needs to be driven in a real browser to prove it.

For Zod, MDX (`next-mdx-remote`, `gray-matter`), Leaflet, and Phosphor icons, follow the package docs and the existing patterns in `src/lib/` and `src/components/`.

---

# 5. How the app is structured

One Next.js App Router app. Routes split into `src/app/(site)/` (public archive), `src/app/admin/` (console), `src/app/api/` (analytics + cron), and `src/app/og/` (image generation). `src/proxy.ts` is the Next.js 16 proxy (what used to be middleware) — it refreshes the Supabase session. The shape exists so the static-first archive keeps rendering even when Supabase is unreachable or every flag is off.

Keep these responsibilities apart:

- **Content layer** (`content/`, `src/lib/content.ts`, `src/lib/content-schema.ts`): MDX/JSON on disk, Zod-validated on load. It reads; it never writes, and it reaches Supabase only through the CMS override path behind `flags.useCmsContent`.
- **Data/auth layer** (`src/lib/supabase/`, `src/lib/fanzone/`, `src/lib/admin/`): every Supabase call lives here. `client.ts` is browser (anon key, RLS-bound), `server.ts` is Server Components/Actions (cookie session), `public.ts` is unauthenticated reads, `admin.ts` is the service-role client.
- **Presentation** (`src/components/`, route files): renders what it is given and calls Server Actions for writes. It never constructs a service-role client and never embeds secrets.

Never cross these boundaries. `SUPABASE_SERVICE_ROLE_KEY` never reaches the browser and never leaves `src/lib/supabase/admin.ts` or `scripts/`; every fan-facing write goes through a Server Action that RLS can police.

---

# 6. Tech stack

Use Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (tokens in `src/app/globals.css`), GSAP + ScrollTrigger, Zod 4, `next-mdx-remote` + `gray-matter`, `@supabase/supabase-js` + `@supabase/ssr`, Leaflet + react-leaflet (`/impact` only), `@phosphor-icons/react`, `sharp`.

Do not add: a second motion library (Framer Motion, Lottie, anime.js), a CSS framework or component kit alongside Tailwind (shadcn, MUI, Chakra), a client state manager (React state + Server Components cover it), an ORM or query builder over Supabase, a self-hosted media player, or `next/font/local`. Sections 7 and 9 explain why.

---

# 7. Decisions already made for you

Build to these unless the user changes them.

- **Embeds only** — Spotify / YouTube / YouTube Music / Audiomack. Never host or proxy audio or video, because this is a fan archive with no rights to the recordings.
- **Afro-street editorial identity** — paper/ink base, danfo yellow accent, paste-up texture. Never SaaS-generic, never neon or glassmorphism.
- **One motion system** — only the five named behaviors in `src/lib/motion.ts` (`ink-reveal`, `paste-up`, `roll-by`, `duotone-shift`, `pin-scroll`), each with a designed `prefers-reduced-motion` state.
- **The disclaimer stays on every page** ("Not affiliated with Olamide or YBNL Nation"), because the project's legal posture rests on it.
- **Fan Zone and admin ship behind flags**, not behind the import graph — `fanzone` / `comments` / `polls` / `useCmsContent` / `maintenance` from `src/lib/settings.ts`, all defaulting off except `useCmsContent`.
- **Static-first**: the archive renders from `content/` with no database. Supabase is an enhancement layer.
- `design-system/` is reference only — not app code, excluded from ESLint. `src/app/globals.css` is the live copy of the tokens.
- `/lab` is presentational experiment space with no backend of its own.

---

# 8. The data you are modeling

The relationships and the fields called out below are fixed by `src/lib/content-schema.ts` and `supabase/migrations/`. Everything else about each field is yours to choose sensibly.

- An **era** is one of six career chapters. It has a slug, accent (`src/lib/accents.ts`), date range, and MDX body; albums and impact places hang off it.
- An **album** belongs to an era. It has a slug, type (`ALBUM_TYPE_LABEL`), release date, tracks, key bars, and an MDX story body. Tracks carry embed IDs, never files.
- A **song** in the catalogue has a type and status, an era, and optional Spotify / YouTube / YouTube Music IDs backfilled by `scripts/`.
- **Media items**, **snippets**, **slang terms**, and **biography chapters** are standalone content records keyed by id/slug.
- The **influence graph** is nodes plus edges; **impact places** are geo points rendered by Leaflet on `/impact`.
- A **fan** is a handle + password account (no email) in Supabase. Favorites, playlists, poll votes, threaded comments, streaks, and stamps all belong to a fan under RLS. Public profiles are opt-in.

Cover art is deliberately **not** licensed — `content/media/manifest.json` flags it as placeholder, disclosed on the Legal page. Derived rather than stored: era accents, the search index, anniversaries ("on this day"), related albums, and badge/streak state computed from activity.

---

# 9. Things that will trip you up

- Yoruba words always carry correct diacritics including underdots. The fonts are subset and the underdot block lives in the `*-vietnamese.woff2` files — do not switch to `next/font/local`, it cannot express `unicode-range`.
- Core pages (`src/app/(site)/layout.tsx`, `albums/[slug]`, `eras/[era]`) import Fan Zone modules directly. The isolation is the feature flag, not the import graph — gate new work on flags, do not assume a module is optional to import.
- Server-only secrets: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL` / `ADMIN_PASSWORD`, `SPOTIFY_CLIENT_SECRET`, `CRON_SECRET`, `TAKEDOWN_EMAIL`. Browser-safe: anything `NEXT_PUBLIC_*`. The canonical list is the committed `.env.example` — add every new variable there.
- `CRON_SECRET` is required in production or `/api/cron/keep-alive` rejects every request.
- Settings and flags are read from Supabase at request time with a fallback, so a flag change needs no rebuild — but a `content/` change does, and `src/lib/content.ts` validates with Zod, so a bad field fails the build rather than the request.
- `public/sw.js` is versioned by `scripts/stamp-sw-version.mjs` in `prebuild`. PWA caching is production-only; service-worker changes only take effect after a build and a hard reload.
- Local Supabase defaults to `http://127.0.0.1:54331`; apply `supabase/migrations/` before testing anything Fan Zone or admin.

---

# 10. Checks to run

Run these from the repo root and report the real output. Never claim a check passed without running it.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` — when routes, `next.config.ts`, `content/`, server code, or the service worker change.
- Apply `supabase/migrations/` (and re-run `npm run seed:cms` if CMS content shape changed) before testing Fan Zone or admin work.

After you implement, run typecheck and lint at minimum, and add the build when the change touches routes, content, config, or server code. There is no test runner in this repo — prove behavior in the running app (`npm run dev`) and give the exact steps.

---

# 11. When in doubt

Keep it small. Use the relevant skill. Preserve the boundaries in section 5 and the secrets rules in section 9. Match the provided UI exactly. Get specifics from setup and config instead of hardcoding them. Save a prompt and get approval before coding. Run the checks. Share exact test steps.
