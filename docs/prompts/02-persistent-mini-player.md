# 02 — Persistent mini-player

## Goal

Keep playback alive across navigation. Today every route change unmounts the
`EmbedFrame` iframe and kills the audio. Mount one player in the site layout
instead, so a track selected on `/songs` keeps playing while the reader walks
through `/eras` and `/albums`.

## What this is explicitly NOT

The original ask was an in-house player pulling direct stream links from
Spotify/YouTube plus a download button. **Not built.** It would mean extracting
and redistributing recordings the project has no licence to, and AGENTS.md §7
("Embeds only — Never host or proxy audio or video") and §6 ("Do not add… a
self-hosted media player") already rule it out. Offline listening stays where
the licence is: the "Open in Spotify / YouTube Music / Audiomack" link-outs,
where those apps handle their own downloads.

## Skills / docs read

- `node_modules/next/dist/docs/` — App Router layout persistence: a `layout.tsx`
  is not re-rendered on soft navigation between its child routes, so a client
  component mounted there survives route changes. This is the entire mechanism.
- `AGENTS.md` §3 (reproduce the reference, do not restyle), §5 (presentation
  layer), §6 (no new motion library), §7 (embeds only, five named motion
  behaviors).
- `docs/ACCESSIBILITY.md` for the dock's focus and live-region behaviour.

## Code inspected

| Path | What it told me |
|---|---|
| `src/app/(site)/layout.tsx` | Already composes `DisclaimerStrip` / `SiteHeader` / `main` / `SiteFooter`, and conditionally wraps in `FanProvider`. The dock and its context provider slot in here. Layout is `async` and reads flags — the provider must be a separate `"use client"` component. |
| `src/components/EmbedFrame.tsx` | Self-contained, prop-driven, no internal state. Reusable as the dock body verbatim. |
| `src/components/SongCatalog.tsx:37` | `PlayerBody` already implements "now playing" with `aria-live="polite"` and a `compact` variant. The dock is the same idea hoisted one level — reuse, don't rewrite. |
| `src/components/Tracklist.tsx:209` | Album pages have their own now-playing state and their own blocklist handling. Both call sites must be able to hand a track to the dock. |
| `src/app/(site)/songs/page.tsx:77`, `albums/[slug]/page.tsx:86` | Blocklists are resolved server-side per route and passed down. The dock lives above both — it needs the blocklist too. |

## Decisions and assumptions

- **Reuse `EmbedFrame`, do not build a player.** The dock is a fixed-position
  wrapper holding the existing component plus a title bar and a close button.
  The persistence comes from *where it is mounted*, not from new playback code.
  This is the smallest change that delivers the actual goal.
- **No Spotify iFrame API in v1.** Selecting a track loads it into the dock;
  the reader presses play inside Spotify's own embed. Auto-play-on-select needs
  `https://open.spotify.com/embed/iframe-api/v1` and a controller, which adds a
  third-party script, a gesture-chain problem on mobile, and a new failure mode.
  **Upgrade path, phase 2, only if the manual play tap proves annoying.**
- **One player slot, provider chosen per track**, same precedence as prompt 01.
  Two simultaneous players is a bug, not a feature.
- **Dock state is React context in the layout.** No client state manager
  (AGENTS.md §6). The context holds `{ song, setSong, clear }` and nothing else.
- **Blocklists move to the provider.** Resolve them once in the layout rather
  than threading them through every call site, so a takedown can never be
  bypassed by a route that forgot to pass the prop.
- **No new motion behavior.** The dock appears with `paste-up` from
  `src/lib/motion.ts`, which already has its designed reduced-motion state.
- Assumption: the dock is dismissible and its dismissed state is per-session
  only. No persistence, no localStorage, until someone asks.
- Assumption: no design reference exists for the dock. It is built from
  existing tokens and the `ov-tape` chrome only. **If you have a reference
  image, it overrides everything in this section** (AGENTS.md §3).

## Files expected to change

- `src/components/player/PlayerDock.tsx` — new, `"use client"`, the fixed dock.
- `src/components/player/usePlayer.tsx` — new, `"use client"`, context + hook.
- `src/app/(site)/layout.tsx` — mount the provider and the dock; resolve
  blocklists once.
- `src/components/SongCatalog.tsx` — selecting a song calls `setSong` instead of
  setting local state; the inline right-column player is removed or becomes a
  "playing in dock" affordance.
- `src/components/Tracklist.tsx` — same, for album tracks.
- `src/app/(site)/songs/page.tsx`, `src/app/(site)/albums/[slug]/page.tsx` —
  drop the now-redundant blocklist props.

## Requirements

1. Playback survives soft navigation between any two `(site)` routes.
2. Hard reload resets the dock. Do not fight the browser on this.
3. The dock never covers the disclaimer strip (AGENTS.md §7 — it stays visible
   on every page) and never traps focus.
4. Closing the dock stops playback by unmounting the iframe.
5. Respects the admin blocklist. A blocked ID falls through to the next
   provider; all-blocked shows the takedown copy, not an empty frame.
6. Mobile: the dock is a bottom bar that does not obscure `SiteFooter` links or
   the skip-link target. Desktop: bottom-right, does not overlap page content.
7. Works with every flag off and with Supabase unreachable — it is presentation
   only, no backend.

## Security considerations

- **No new network surface.** No API route, no Server Action, no Supabase call.
  This is why it is safe to put in the layout.
- **Embed IDs still validated before interpolation** — the dock widens where an
  ID can reach an iframe `src`, so the regex validators from prompt 01 must be
  in place first. Prompt 01 lands before this one.
- **The blocklist must not be client-trusted.** Resolve it server-side in the
  layout and pass it down. A client-only filter is a takedown bypass.
- `iframe` keeps a minimal `allow` list. Do **not** add `autoplay` — it is both
  a UX hostility and an invitation to background-playback workarounds that the
  embed terms forbid.

## Acceptance criteria

- [ ] Play a track on `/songs`, navigate to `/eras`, `/albums/<slug>` and
      `/about` — audio is uninterrupted at every step.
- [ ] Dock shows the correct title and provider label throughout.
- [ ] Selecting a second track replaces the first; only one iframe exists in
      the DOM at any time.
- [ ] Close button stops audio and removes the dock.
- [ ] Keyboard: dock is reachable by Tab, close button is labelled, and the
      now-playing region announces changes via `aria-live="polite"`.
- [ ] `prefers-reduced-motion: reduce` — dock appears without transform motion.
- [ ] Disclaimer strip visible on every route with the dock open.

## Checks to run

```
npx tsc --noEmit
npm run lint
npm run build          # layout.tsx and route files changed
```

## Manual test steps

1. `npm run dev`, go to `/songs`, click a track with a Spotify ID, press play.
2. Click through to `/eras`, then into an era, then to `/albums`. Audio must
   not stop or restart. Watch the Network tab — the embed iframe must not
   re-request.
3. Click a track in an album tracklist. Confirm the dock swaps and the old
   iframe is gone from the DOM (inspect, count `iframe` elements).
4. Close the dock. Confirm audio stops immediately.
5. Tab from the top of the page. Confirm focus reaches the dock controls in a
   sane order and never gets stuck.
6. DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Reload,
   open the dock, confirm no slide/scale animation.
7. Resize to 375px. Confirm the dock does not cover footer links or the
   disclaimer, and the page still scrolls to the bottom.
8. In the admin console, block the currently playing Spotify ID. Reload and
   confirm fallback to the next provider.
