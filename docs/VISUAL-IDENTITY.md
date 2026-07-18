# OlamideVerse v2 — Visual Identity Spec

*Afro-street editorial. Phase 0 deliverable — tokens here are the source of truth for the Phase 1 design system.*

---

## 1. The idea

The design language comes from the same streets the music does: **Lagos**. Danfo buses, hand-painted signage, paste-up concert posters, adire indigo cloth, newsprint. It should feel like a beautifully art-directed street-culture magazine about Olamide — bold, textured, warm — never like a SaaS template, and never like v1's neon cyberpunk.

Test for every component: *would this look at home on a wall in Bariga and in a design annual?* Both, or redesign.

## 2. Color

Grounded and warm, not neon-on-void. Paper and ink are the base; danfo yellow is the signature; adire indigo is the depth.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-danfo` | `#F5B301` | Signature accent — CTAs, highlights, era markers, the wordmark's energy |
| `--color-adire` | `#1F2A63` | Deep indigo (adire cloth) — secondary surfaces, dark sections, links |
| `--color-ink` | `#181410` | Near-black warm ink — primary text, dark grounds (never pure #000) |
| `--color-paper` | `#F4EFE6` | Warm off-white — the default background (never pure #FFF) |
| `--color-oxide` | `#C8451B` | Burnt orange/rust — sparing emphasis, era accents, hover states |
| `--color-palm` | `#2F5233` | Deep green — sparing use, success states, one era's accent |

Rules:
- Default page = `paper` ground + `ink` text. Dark sections = `ink` or `adire` ground + `paper` text.
- Danfo yellow is loud — one dominant yellow element per viewport.
- **Each era gets an accent assignment** from this palette (plus tints), so chapters feel distinct while staying in one family.
- All text/background pairs must pass WCAG AA (danfo yellow is a background/graphic color, not a text-on-paper color).

## 3. Typography

Two-voice system, chosen for character **and full Yoruba diacritic support** (Ọ ọ Ẹ ẹ Ṣ ṣ with underdots, plus tone marks) — the site will write *Olamidé*, *Àdìsá*, and Yoruba phrases correctly or not at all.

| Voice | Candidates (verify diacritics before locking) | Use |
| --- | --- | --- |
| **Display** — condensed, poster-loud | Anton, Archivo Black, Bricolage Grotesque (weights 800+) | Headlines, era titles, big numbers, the wordmark |
| **Text** — editorial grotesk | Instrument Sans, Archivo, General Sans | Body, captions, UI |

- Display type is used HUGE or not at all — poster scale (clamp ~3rem → 9rem), tight leading, often uppercase.
- Body text stays disciplined: ~1.125rem, 1.6 line-height, 65–75ch measure.
- Yoruba words and names always carry correct diacritics; this is a content rule as much as a type rule.
- One flavor detail, used sparingly: a hand-painted/marker accent style for annotations (implemented as an SVG/underline treatment, not a third font family).

## 4. Texture & imagery

This is what separates the identity from flat minimalism:

- **Grain**: a subtle film-grain overlay on hero/dark sections (CSS/SVG noise, ~3–5% opacity; static, not animated).
- **Paste-up**: cards and images sit slightly rotated (±0.5–1.5°) with hard offset shadows — like posters glued to a wall. Grid stays rational underneath; the tilt is the accent, not the layout.
- **Halftone/duotone**: archival photos treated in era-accent duotone or coarse halftone so mixed-quality source imagery becomes a coherent visual system.
- **Rules & tape**: thick solid rules (4–8px ink), corner "tape" details on pinned items, newsprint-style column dividers on editorial pages.
- **No**: glassmorphism, neon glows, gradients-as-decoration, glitch effects. (That was v1.)

## 5. Layout

- **Editorial grid**: 12-column, generous margins, but broken deliberately — full-bleed era headers, oversized pull-quotes, images crossing column boundaries.
- **Poster sections**: each era chapter opens with a full-viewport "poster" (era title in display type, years, accent color, one treated photo).
- **Density contrast**: loud poster moments alternate with calm reading measures — the rhythm of a good magazine.

## 6. Motion language

**One library: GSAP (+ ScrollTrigger).** Scroll-driven storytelling is the core of the Eras experience. A small named vocabulary — these are the only motions that exist:

| Name | What it is | Where |
| --- | --- | --- |
| `paste-up` | Element slaps in with a tiny settle (scale 1.02→1, slight rotation correction, ~350ms, punchy ease) | Cards, images entering viewport |
| `ink-reveal` | Text revealed by a wiping ink block in the section's accent color | Era titles, big headlines |
| `roll-by` | Horizontal marquee ticker, danfo-signwriting energy | Track names, era mottos, footer |
| `pin-scroll` | Section pins while inner content scrolls through beats | Era chapter storytelling moments |
| `duotone-shift` | Photo duotone eases toward full color as it reaches viewport center | Archival imagery |

Rules: nothing loops except `roll-by`; nothing moves without user scroll/intent; **`prefers-reduced-motion` gets a complete, designed static experience** (opacity-only fades, no pins, marquee paused).

## 7. Components (Phase 1 build list)

Wordmark/logotype · Header + disclaimer micro-bar · Era card · Album card (cover-forward, paste-up) · Poster section header · Pull-quote · Track row with embed trigger · Embed frame (styled wrapper for Spotify/YouTube so third-party players sit inside the identity) · Timeline rail · Footer · Legal banner.

## 8. Next step before locking

Optional but recommended: explore 2–3 concept boards in Figma (home hero + one era poster + album card) using these tokens, pick a winner, then implement in Phase 1. Alternatively, build a single styled prototype page in the browser and calibrate there.
