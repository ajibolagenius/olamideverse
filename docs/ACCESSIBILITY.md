# Accessibility

*Adapted from the v1 planning doc (`docs/data/accessibility-guidelines.md`) for
the actual v2 codebase. Supports `CONCEPT.md` principle 4: "Accessible by
default."*

## Enforcement

`eslint-plugin-jsx-a11y`'s full `recommended` rule set runs on every lint pass
(`eslint.config.mjs`) — `eslint-config-next` alone only enables 6 of its 34
rules. Run `npx eslint .` before committing; a11y violations are errors, not
warnings.

## Motion

Every GSAP behavior in `src/lib/motion.ts` (`ink-reveal`, `paste-up`,
`roll-by`, `duotone-shift`, `pin-scroll`) must register both branches of
`matchMedia`:

- `(prefers-reduced-motion: no-preference)` — the full animation
- `(prefers-reduced-motion: reduce)` — a designed static end state, not just
  "skip the animation." See `src/app/globals.css` lines ~191 and ~228 for the
  paired media queries backing this.

A new motion behavior that only handles the no-preference branch is incomplete
— don't ship it.

## Embeds (`EmbedFrame.tsx`)

- Every `<iframe>` needs a descriptive `title` (already enforced by
  `jsx-a11y/iframe-has-title`) — pattern in use: `` `${title} — Spotify player` ``.
- Removed/pending states render as text, not an empty frame, so screen readers
  and sighted users get the same information (rights-holder takedown vs.
  "content pass not done yet").

## MDX content (`Prose.tsx`, `content/**/*.mdx`)

- Heading hierarchy: MDX source should use h2/h3 only — Prose's component map
  doesn't override h1 (the page title already is one), don't skip straight to
  h4.
- Component overrides in `Prose.tsx` must destructure `children` explicitly
  (`({ children, ...props }) => <h2 {...props}>{children}</h2>`) rather than
  blind-spreading `{...props}` — `jsx-a11y/heading-has-content` and
  `anchor-has-content` can't see through an opaque spread and will (correctly)
  flag it as a heading/link that might render empty.
- Images in MDX need real alt text — no filler ("image", "photo") — captions
  and photo credits live in `content/media/*.json`, not as decorative-only alt
  text.

## Yoruba diacritics

Underdot characters (ẹ, ọ, ṣ) must render correctly for screen readers as well
as visually — this is why the subset font swap warned about in `AGENTS.md`
(`*-vietnamese.woff2`, no `next/font/local`) matters for accessibility, not
just typography.

## Manual testing checklist

- [x] Keyboard-only pass through Eras scrollytelling, Discography grid, and
      album detail (embeds, admin console excluded from this — internal tool)
      — interactive controls are native buttons/links; FilterChips use
      `aria-pressed`; influence/impact expose listbox/option + marker labels.
      Spot-check still recommended before public pitch.
- [ ] VoiceOver (macOS) or NVDA pass on the same pages *(human pass — not
      automatable here)*
- [x] `prefers-reduced-motion: reduce` enabled — confirm each of the five
      motion behaviors shows its static end state, not a frozen mid-animation
      frame — CSS end states in `globals.css`; GSAP only mounts under
      `no-preference` in `motion.ts`.
- [x] Contrast check on paper/ink/danfo-yellow combinations actually used
      (`accentChrome()` darkens oxide bars so labels hit WCAG AA; clay/palm/
      adire/navy/danfo pairs verified).
- [x] Lighthouse accessibility score — CONCEPT.md's Phase 2 exit bar is 90+
      (production desktop, Jul 2026: home/eras/albums/media all **100** a11y;
      performance **90–97**; best-practices **96–100**; SEO **100**).
