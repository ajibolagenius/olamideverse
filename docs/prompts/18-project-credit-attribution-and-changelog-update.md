# 18 — Project Credit Attribution & Public Changelog Update

Status: approved. Executing 6 November 2026 (Africa/Lagos).

## Goal and scope

1. **Project Creator Attribution**: Formally credit Ajibola Akelebe as the creator, curator, and engineer behind OlamideVerse across key project locations using details grounded in the `/jd` profile:
   - **About Page (`src/app/(site)/about/page.tsx`)**: In the "Who made it" section, introduce an Afro-street paste-up curator card detailing his role as Full Stack Engineer & Designer based in Lagos, Nigeria, his editorial ethos for this living archive, and canonical links to his portfolio (`https://ajibolagenius.vercel.app`), GitHub (`https://github.com/ajibolagenius`), LinkedIn (`https://linkedin.com/in/ajibolaakelebe`), and X/Twitter (`https://twitter.com/ajibolagenius`).
   - **Site Footer (`src/components/chrome/SiteFooter.tsx`)**: Add a discrete, elegant attribution line ("Curated & Engineered by Ajibola Akelebe · Lagos, Nigeria") alongside the legal disclaimer and visitor badge.
   - **Root Metadata (`src/app/layout.tsx`)**: Include `authors` (`Ajibola Akelebe`) and `creator` in Next.js metadata.
   - **Repository README (`README.md`)**: Add an "Author & Curator" section linking to his portfolio, GitHub, and professional channels.
2. **Public Changelog Update**: Update [`src/lib/changelog.ts`](file:///Users/ajibolagenius/Documents/Node/ajibolagenius/olamideverse/src/lib/changelog.ts) and [`CHANGELOG.md`](file:///Users/ajibolagenius/Documents/Node/ajibolagenius/olamideverse/CHANGELOG.md) to document the recent major platform updates:
   - Driver.js Storytelling Expeditions, Onboarding Checklist widget, 6 narrative Story Acts, and contextual field note beacons.
   - Creator attribution and editorial colophon expansion.

## Skills and documentation read

- `AGENTS.md`: sections 1 (editorial posture, embeds only), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic), and 10 (checks).
- `/Users/ajibolagenius/.gemini/skills/jd/` (`profile.md`, `SKILL.md`): Identity, canonical URLs, title, location (Lagos, Nigeria), and bio for Ajibola Akelebe.
- `src/lib/changelog.ts` and `CHANGELOG.md`.
- `src/app/(site)/about/page.tsx`, `src/components/chrome/SiteFooter.tsx`, `src/app/layout.tsx`, and `README.md`.

## Code and content inspected

- `src/app/(site)/about/page.tsx`: Existing "Who made it" section and colophon layout.
- `src/components/chrome/SiteFooter.tsx`: Existing bottom row with blurb and VisitorBadge.
- `src/app/layout.tsx`: Root metadata object.
- `README.md`: Repo documentation structure.

## Decisions and assumptions

1. **Preserve Legal Disclaimer**: OlamideVerse strictly remains an independent, fan-made educational archive with zero claim of official affiliation with Olamide or YBNL Nation. The attribution clearly highlights Ajibola Akelebe as the independent creator, researcher, and engineer.
2. **Afro-Street Editorial Materiality**: The author card on `/about` adheres to the paper, ink, Danfo yellow accent, and paste-up drop shadow design language.
3. **Canonical Links**: Grounded in `/jd/profile.md`:
   - Portfolio: `https://ajibolagenius.vercel.app`
   - GitHub: `https://github.com/ajibolagenius`
   - LinkedIn: `https://linkedin.com/in/ajibolaakelebe`
   - Twitter / X: `https://twitter.com/ajibolagenius`

## Files to touch

- `docs/prompts/18-project-credit-attribution-and-changelog-update.md`: this prompt.
- `src/app/(site)/about/page.tsx`: add creator card in "Who made it" section.
- `src/components/chrome/SiteFooter.tsx`: add creator attribution line in footer.
- `src/app/layout.tsx`: add authors and creator metadata.
- `README.md`: add Author & Curator section.
- `src/lib/changelog.ts`: add changelog entries for Storytelling Tours and Creator Attribution.
- `CHANGELOG.md`: mirror changelog entries.

## Requirements and security considerations

1. All external hyperlinks must specify `rel="noopener noreferrer"` and `target="_blank"`.
2. Clean DOM hierarchy without layout shifts or contrast regressions.
3. No secrets or private contact details exposed (email and phone remain private; only public portfolio and socials linked).

## Acceptance criteria and checks

- The `/about` page displays an Afro-street curator card for Ajibola Akelebe with working links to his portfolio, GitHub, LinkedIn, and X.
- The global site footer displays the attribution line with a link to his portfolio.
- The root layout metadata contains `authors` and `creator` properties.
- `README.md` includes the Author & Curator section.
- The `/changelog` route displays the latest updates for 6 November 2026.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Visit `http://localhost:3000/about`:
   - Scroll to the "Who made it" section.
   - Verify the curator profile card displays Ajibola Akelebe's name, title ("Full Stack Software Engineer & Designer"), Lagos location, and social links.
   - Click the portfolio link to verify it points to `https://ajibolagenius.vercel.app`.
2. Visit any page (`http://localhost:3000/` or `/albums`):
   - Scroll to the footer: verify the attribution line "Curated & Engineered by Ajibola Akelebe · Lagos, Nigeria".
3. Visit `http://localhost:3000/changelog`:
   - Verify the 6 November 2026 entry contains the Driver.js Storytelling Expeditions and Creator Attribution notes.
4. Open `README.md`:
   - Verify the Author & Curator section is rendered with correct markdown formatting.
