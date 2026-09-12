# 03 — PWA hardening

## Goal

Make the existing installable PWA actually feel like the mobile app, since a
native app is out of scope and background playback is not achievable on embeds.

## Why there is no native app and no lockscreen playback

The original ask was a mobile app with background / screenlock play. Both parts
are blocked, for reasons worth writing down so nobody re-litigates them:

- **Background audio from a cross-origin iframe does not work.** Mobile browsers
  suspend iframe media on backgrounding, and the MediaSession API cannot attach
  to a cross-origin frame — so there is no lockscreen artwork or transport to
  populate even if the audio survived. This is not a bug to route around; it is
  the sandbox working.
- **The only legal route is a native app-remote SDK.** Spotify's iOS/Android SDK
  controls the user's *installed Spotify app*, which then owns the lockscreen
  itself. It requires Spotify Premium, ships no audio to us, and needs a React
  Native / Expo shell this repo does not have. It is also outside AGENTS.md §1
  scope ("Build nothing beyond that").

If a native app is ever wanted, it is a separate spec, not an extension of this
one.

## Skills / docs read

- `node_modules/next/dist/docs/` — `MetadataRoute.Manifest` and the metadata
  file convention, since `manifest.ts` is a route file.
- `AGENTS.md` §9 (service worker is versioned by `prebuild`; PWA caching is
  production-only and needs a build plus hard reload to take effect).
- `docs/ACCESSIBILITY.md` for the install prompt's dismissal affordances.

## Code inspected

| Path | What it told me |
|---|---|
| `src/app/manifest.ts` | Complete and correct: standalone display, portrait, 192/512/maskable icons, theme colours matching the paper/ink tokens. **No `screenshots`** — Chrome needs those for the richer install dialog. No `shortcuts`. |
| `public/sw.js` | Shell cache + runtime cache, both versioned by `VERSION` (stamped from git sha by `scripts/stamp-sw-version.mjs`). `SAVED_CACHE = "ov-saved"` is deliberately unversioned so reader-saved pages survive deploys. `SHELL_URLS` caches 7 routes — **`/songs` is not among them**, which is now the most-used route. |
| `src/components/PWARegister.tsx` | Registers in production only, and actively unregisters + clears `ov-` caches in development to avoid stale Turbopack chunks. Careful, correct — do not touch this logic. |
| `src/components/SaveOfflineButton.tsx`, `src/lib/offline.ts` | Per-page explicit offline save already exists. |
| `src/components/AppUpdateNotice.tsx` | Update-available prompt already exists. |

## Decisions and assumptions

- **Do not add a PWA library.** `next-pwa` / Workbox would replace a 
  hand-written service worker that is already correct and understood, and
  AGENTS.md §6 is hostile to unnecessary dependencies. Edit `sw.js` directly.
- **Do not add push or background sync.** `sw.js`'s own header says the project
  does not need them, and they would require a new server surface.
- **No install-prompt nagging.** Capture `beforeinstallprompt`, surface a quiet
  affordance, and respect a dismissal. A modal on first visit is hostile and
  Safari ignores the event anyway.
- **iOS gets no install prompt** — Safari does not fire `beforeinstallprompt`.
  Show a short "Add to Home Screen" hint on iOS Safari only, or show nothing.
  Assumption: nothing is acceptable for v1; confirm if you disagree.
- Assumption: prompt 02's dock lands first, so the mobile layout work here
  accounts for it.

## Files expected to change

- `src/app/manifest.ts` — add `screenshots` (narrow + wide form factors) and
  `shortcuts` for `/songs`, `/eras`, `/albums`.
- `public/sw.js` — add `/songs`, `/snippets`, `/impact` to `SHELL_URLS`.
- `src/components/InstallPrompt.tsx` — new, `"use client"`, the quiet install
  affordance.
- `src/app/(site)/layout.tsx` or `SiteFooter` — mount it.
- `public/icons/` — new screenshot assets.

## Requirements

1. Installed app opens standalone with the correct theme colour and no browser
   chrome flash.
2. `/songs` works offline after one visit.
3. Install affordance appears at most once per session and never after
   dismissal or when already installed (`display-mode: standalone`).
4. Manifest shortcuts land on the right routes from a long-press on the icon.
5. Do not change the `SAVED_CACHE` name or its unversioned-ness — renaming it
   silently discards every page readers explicitly saved.
6. Do not weaken `PWARegister`'s development guard.

## Security considerations

- **No new secrets, no new network surface.** Manifest and service worker are
  static, public, unauthenticated.
- **Cache scope stays same-origin.** The service worker must never cache or
  intercept third-party embed requests (`open.spotify.com`,
  `youtube-nocookie.com`, `audiomack.com`). Caching a rights holder's media
  response would be exactly the hosting AGENTS.md §7 forbids — add an explicit
  origin guard in the `fetch` handler if one is not already implicit.
- Service worker scope stays `/`. No scope widening, no `importScripts` from a
  remote origin.

## Acceptance criteria

- [ ] Lighthouse "Installable" passes on a production build.
- [ ] Install from Chrome Android, launch from the home screen — standalone,
      correct splash, correct theme colour.
- [ ] Long-press the installed icon — shortcuts to Songs / Eras / Albums.
- [ ] Visit `/songs` online, go offline, reload — page renders from cache.
- [ ] Navigate offline to an unvisited route — `offline.html`, not a browser
      error page.
- [ ] Install affordance never reappears after dismissal in a session, and
      never shows in standalone mode.
- [ ] Embed iframes are absent-but-graceful offline; no cached third-party
      media anywhere in `caches`.
- [ ] Pages previously saved via `SaveOfflineButton` still open after a deploy.

## Checks to run

```
npx tsc --noEmit
npm run lint
npm run build          # service worker + manifest + routes changed
npm start              # SW is production-only; dev will not exercise it
```

## Manual test steps

1. `npm run build && npm start`. Open in Chrome, DevTools → Application →
   Manifest. Confirm icons, screenshots and shortcuts all resolve.
2. Application → Service Workers. Confirm one registration, and that `VERSION`
   matches the stamped git sha.
3. Application → Cache Storage. Confirm `ov-shell-<sha>` contains `/songs`, and
   that **no** cache entry has a third-party origin.
4. Save a page with `SaveOfflineButton`. Rebuild with a new sha, reload, confirm
   the saved page still opens — proves `ov-saved` survived.
5. DevTools → Network → Offline. Reload `/songs` (renders), then navigate to a
   route never visited (shows `offline.html`).
6. Install the app. Relaunch from the OS. Confirm standalone, and confirm the
   install affordance does not appear.
7. Android: long-press the home-screen icon, confirm the three shortcuts.
8. iOS Safari: confirm nothing broken and no dead install button.
