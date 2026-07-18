<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OlamideVerse v2

A fan-made, static-first editorial archive of Olamide's career (Next.js + TS +
Tailwind v4 + MDX). Phase docs are the source of truth: `docs/CONCEPT.md`,
`docs/INFORMATION-ARCHITECTURE.md`, `docs/VISUAL-IDENTITY.md`.

## Ground rules

- **Afro-street editorial identity** — paper/ink base, danfo yellow accent,
  paste-up texture. Never SaaS-generic, never neon/glassmorphism.
- **Embeds only** (Spotify/YouTube/Audiomack) — no hosted audio or video, ever.
- **One motion library**: GSAP + ScrollTrigger, only the five named behaviors in
  `src/lib/motion.ts` (`ink-reveal`, `paste-up`, `roll-by`, `duotone-shift`,
  `pin-scroll`). Every behavior needs a designed `prefers-reduced-motion` state.
- **The disclaimer stays on every page** ("Not affiliated with Olamide or YBNL
  Nation").
- Yoruba words always carry correct diacritics (fonts are subset — the underdot
  block lives in the `*-vietnamese.woff2` files; don't switch to
  `next/font/local`, it can't express `unicode-range`).

## Layout

- `content/` — MDX/JSON content, Zod-validated at build by `src/lib/content.ts`.
  Seed content is draft (`draft: true`); the Phase 2 content pass verifies facts
  and fills tracklists/embed IDs.
- `src/lib/accents.ts` — per-era accent colors/gradients.
- `design-system/` — Phase 0 design reference (tokens, component specs,
  `OlamideVerse_UI_design/` Claude Design export). Reference only, not app code,
  excluded from ESLint. `src/app/globals.css` is the live copy of the tokens.
- Fan Zone is Phase 3: nothing may depend on it; it mounts onto existing pages.
