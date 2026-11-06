# 17 — Advanced Storytelling Tours, Driver.js Onboarding Checklist & Contextual Beacons

Status: implemented and verified. 6 November 2026 (Africa/Lagos).

## Goal and scope

Elevate the Product Tours, Contextual Highlights, and Researcher Checklist into an **interactive Storytelling Expedition** inspired by the official Driver.js Onboarding Checklist style and advanced feature patterns (narrative story acts, tour resume states, async element waiting, exit confirmation, and contextual hint beacons).

Scope covers:
1. **The "Archive Expedition" Onboarding Checklist Widget (`src/components/tours/ArchiveExpeditionWidget.tsx`)**:
   - Replicate the authentic Driver.js floating onboarding checklist pattern (from `driverjs.com`), customized with the Afro-street Danfo yellow & paper aesthetic:
     - Header in Danfo yellow (`bg-danfo text-ink` with black borders): "Archive Expedition · Bariga to the World".
     - Subtitle: "Complete the 6 storytelling acts to unlock the Archival Stamp."
     - Live progress bar (`X of 6 Acts`) with percentage fill.
     - Minimize (`_`) and close (`×`) controls.
     - Minimized floating pill dock: `Archive Expedition · X/6` with circular completion badge.
     - 6 Narrative Act milestones:
       - Act I: *The Bariga Gamble (2010)* — Read how a Bariga upstart bet entirely on Yoruba rap.
       - Act II: *The Rebel Empire (2012–2013)* — Dig through the YBNL debut in the Vinyl Crate.
       - Act III: *The Street King Coronation (2014–2017)* — Decode the street anthems and dance challenge genesis.
       - Act IV: *The Global Pipeline (2018–2020)* — Trace the international distribution matrix to Empire and Fireboy DML.
       - Act V: *The Danfo Transit Corridor (2021–2023)* — Map the physical route from Bariga Mainland to global arenas.
       - Act VI: *The Living Legacy (2024–Present)* — Spin a master broadcast cassette in Snippets.
     - Each item features an action button launching that specific narrative storytelling tour directly or routing to the target page.
2. **Storytelling Act Actions (`src/lib/tours.ts`)**:
   - Transform standard technical tours into narrative, documentary storytelling sequences:
     - **"The Bariga Breakthrough Act"**: 4-step cinematic tour connecting the 2010 breakout single ("Eni Duro"), Coded Tunes recording lore, and the debut album *Rapsodi*.
     - **"The Dynasty Builder Act"**: Multi-step narrative covering the launch of YBNL Nation, the Influence Lineage matrix (Asake, Fireboy, Pheelz), and the Danfo transit route to world stages.
     - **"The Street Linguistics Act"**: Interactive linguistic tour on `/slang` highlighting authentic Yoruba orthography, underdots (ọ, ẹ, ṣ), and motor-park signboard aesthetics.
   - **Advanced Driver.js Feature Integrations**:
     - *Resume State ("left at X/Y")*: Automatically persists active tour step in `localStorage`, displaying a resume chip if closed mid-act.
     - *Async Element Waiting (`waitForElement: 1500`)*: Waits for view-switched elements (e.g. Vinyl Crate or Manila Folders) to render before attaching popovers.
     - *Confirm on Exit*: Gentle confirmation toast when pausing an active story tour.
     - *Overlay Color & Stage Padding*: Deep ink backdrop (`rgba(24, 20, 16, 0.8)`) with zero-radius crisp editorial stage borders.
3. **Contextual Beacons & Hint Pins (`src/components/tours/ContextualHints.tsx`)**:
   - Interactive pulsing hint beacons on `/slang`, `/snippets`, `/impact`, and `/influence` offering instant contextual "Field Notes from Bariga".
4. **Integration & Layout Wiring**:
   - Mount `ArchiveExpeditionWidget` and `ContextualHints` in `src/app/(site)/layout.tsx`.

## Skills and documentation read

- Repository `AGENTS.md`: sections 1 (editorial posture, embeds only), 2 (loop), 5 (boundaries), 7 (Afro-street paper/ink aesthetic, 5 GSAP behaviors), 9 (Yoruba diacritics), and 10 (checks).
- `docs/VISUAL-IDENTITY.md` and `docs/CONCEPT.md`: documentary tone, Lagos street-hop heritage, Danfo transit culture.
- Driver.js documentation and examples: Onboarding Checklist, Compact Checklist, Resume Tour ("left at 2/3"), Async Tours, Hints, and Popover Customization.
- `src/lib/tours.ts` and `src/app/globals.css`.

## Code and content inspected

- `src/components/tours/FieldGuideLauncher.tsx`: current launcher implementation to be superseded by `ArchiveExpeditionWidget.tsx`.
- `src/app/globals.css`: existing `.ov-driver-popover` styles and tokens.
- `src/app/(site)/layout.tsx`: site layout shell and providers.

## Decisions and assumptions

1. **Afro-Street Editorial Materiality**: The Onboarding Checklist matches the driverjs.com layout structure shown in the user's reference screenshot, but with authentic paper/ink colors, Danfo yellow headers, typewriter accents, and crisp black borders.
2. **Non-Intrusive by Default**: The checklist widget sits neatly minimized or docked in the bottom corner; readers can expand, minimize, or dismiss it at will.
3. **Progress Persistence**: Checklist completion and tour resume points are safely stored in `localStorage` under `ov-archive-expedition`.
4. **Full Reduced Motion & A11y**: Keyboard accessible (`Tab`, `Space`, `Escape`), high contrast, and animated features disable smoothly under `prefers-reduced-motion: reduce`.

## Files to touch

- `docs/prompts/17-advanced-storytelling-tours-and-onboarding-expedition.md`: this prompt.
- `src/lib/tours.ts`: add storytelling acts, resume state manager, async element waits, and hint definitions.
- `src/components/tours/ArchiveExpeditionWidget.tsx`: new Driver.js-style floating onboarding checklist widget with progress bar, minimize dock, and story act triggers.
- `src/components/tours/ContextualHints.tsx`: contextual help beacon manager for `/slang`, `/snippets`, `/impact`, and `/influence`.
- `src/app/globals.css`: custom styles for the checklist widget, beacon pulses, and popover animations.
- `src/app/(site)/layout.tsx`: replace `FieldGuideLauncher` with `ArchiveExpeditionWidget` and `ContextualHints`.

## Requirements and security considerations

1. Zero external network requests; runs 100% client-side with bundled `driver.js`.
2. Safe `localStorage` access resilient to SSR and private browsing.
3. Complete TypeScript type-safety with typed interfaces for all steps, acts, and hooks.
4. Clean DOM teardown without memory leaks or scroll locks.

## Acceptance criteria and checks

- The floating "Archive Expedition" widget displays in the bottom corner with Danfo yellow header, progress bar (`X of 6 Acts`), and interactive checklist items matching the reference design.
- Clicking any Storytelling Act launches the narrative multi-step guided tour with progress counter, custom popovers, and element highlighting.
- Exiting mid-tour preserves progress and exposes a "Resume Act (left at X/Y)" badge.
- Contextual hint beacons display on relevant cultural pages with informative field notes.
- Mandatory checks pass:
  - `npx tsc --noEmit` (exit 0)
  - `npm run lint` (exit 0)
  - `npx next build --webpack` (exit 0, all 176 routes generated)

## Exact manual test steps

1. Visit `http://localhost:3000/`:
   - Verify the "Archive Expedition" widget displays in the bottom-left corner with Danfo yellow header and progress bar (`0 of 6 Acts`).
   - Click the minimize button (`_`): verify it shrinks into a compact floating pill (`Archive Expedition · 0/6`). Click again to expand.
   - Click "Act I: The Bariga Gamble": verify the storytelling tour launches with narrative dispatches and highlighted elements.
   - Click "Next →" through 2 steps and dismiss: verify the widget now shows a "Resume Act (left at Step 2/4)" indicator.
2. Check off an act or complete a tour: verify the progress bar updates and completion persists on page reload.
3. Visit `http://localhost:3000/slang` or `/snippets`:
   - Click the contextual hint beacon to view the "Field Notes from Bariga" popover.
