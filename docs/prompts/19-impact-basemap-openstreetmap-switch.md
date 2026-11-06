# 19 — Un-gate the /impact basemap (CARTO tiles now require an API key)

## Goal

The `/impact` map renders CARTO's "API KEY REQUIRED" watermark instead of a map. Replace the
basemap with the keyless OpenStreetMap tile source and keep the paper/ink editorial look.

## Diagnosis (verified, not assumed)

`src/lib/impact-map.ts:51` points at
`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`.

Probing that endpoint today returns HTTP **200** with a 2,049-byte 4-bit-colour PNG — the
watermark tile — while a real Positron tile is ~20 KB+. CARTO did not start returning an error,
so nothing in the app throws; Leaflet happily paints the stamp. Same result for all three
`{s}` subdomains.

`https://tile.openstreetmap.org/11/1078/604.png` returns a genuine 23,613-byte tile when the
request carries a browser UA + Referer, which is exactly what a real browser sends. So the OSM
foundation tiles work keyless from the client.

## Skills read

- AGENTS.md §5 (boundaries), §7 (paper/ink identity, static-first), §9 (env var rules), §10 (checks)
- `supabase` / `secure-me` — deliberately not needed: no auth, no secrets, no new env var
- Existing patterns: `src/lib/impact-map.ts` (tile config lives here, not in the component),
  `src/app/globals.css:517-525` (the `.ov-impact-leaflet .leaflet-tile-pane` paper filter)

## Code inspected

- `src/lib/impact-map.ts` — `IMPACT_MAP_VIEWS`, `IMPACT_TILE_URL`, `IMPACT_TILE_ATTRIBUTION`
- `src/components/ImpactMapCanvas.tsx:153-156` — the only consumer of both constants
- `src/app/globals.css:517-560` — impact-map skin (container background, tile filter, controls)
- `.env.example` — no map/CARTO key exists today

## Decisions and assumptions

1. **Source: user-approved OpenStreetMap standard tiles.** Not a CARTO key, not a community mirror.
2. **Drop the `{s}` and `{r}` placeholders.** OSM's tile usage policy asks for the single
   `tile.openstreetmap.org` host, and it publishes no `@2x` raster, so `{r}` would resolve to a
   literal `@2x` in the URL and 404. Retina displays get the 1x tile scaled by Leaflet's
   `zoomOffset`-free default — acceptable, and the max zooms here (15/11/7) never push detail.
3. **The style changes, so the filter must change.** OSM standard is colourful (green parks, red
   roads) where Positron was near-white. Without touching the filter the map stops reading as
   paste-up paper. Add `grayscale(1)` ahead of the existing `sepia(0.18)` so the hue is removed
   before the paper tint is applied. Filter order matters: grayscale after sepia leaves the
   colour in place and does nothing useful.
4. **Attribution must change with the provider.** The CARTO link becomes a false credit. New
   string credits OpenStreetMap contributors only, and links to the OSM copyright page. CARTO is
   no longer a data source here, so its name goes.
5. **`maxZoom` per view stays as configured** (15/11/7) — well inside what OSM serves, so no
   `noWrap`/tile-cap work is needed.
6. **No new env var**, therefore nothing to add to `.env.example`. The map stays a keyless,
   static-first surface per AGENTS.md §7.

## Files to touch

- `src/lib/impact-map.ts` — `IMPACT_TILE_URL`, `IMPACT_TILE_ATTRIBUTION`, and the stale
  "Carto Positron" comment above them
- `src/app/globals.css` — one line in `.ov-impact-leaflet .leaflet-tile-pane`

No component change: `ImpactMapCanvas.tsx` reads both constants and needs no edits.

## Security considerations

Nothing secret is involved. The tile URL is a public, hardcoded CDN path rendered client-side;
no key, no proxy, no service-role path. Attribution is a licensing obligation, so it stays
visible and un-styled-away — the existing control styling keeps it legible.

## Acceptance criteria

- [ ] `/impact` shows a real street map in all three views (lagos / nigeria / world), with no
      "API KEY REQUIRED" watermark anywhere.
- [ ] Markers, selection ring, zoom controls, and the place list still work over the new tiles.
- [ ] The map still reads paper/ink — desaturated, not the default OSM colour scheme.
- [ ] Attribution bottom-right credits OpenStreetMap contributors and links correctly.
- [ ] Zero requests to `basemaps.cartocdn.com` in the network log.
- [ ] No new env var; no change outside the two files listed.

## Checks to run

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` — skipped unless the CSS/token change upsets the build; this touches no routes,
  content, config, or server code. Report honestly which were run.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/impact`.
2. Hard-reload (the service worker can hold old tiles in production builds).
3. Look at the map body: streets and labels visible, no diagonal watermark.
4. DevTools → Network → filter `tile`: requests go to `tile.openstreetmap.org`, all 200, sizes in
   the 15–40 KB range (a 2 KB response = the old watermark).
5. Cycle the view switcher to Nigeria and World; confirm tiles load at low zoom too.
6. Click a place in the list and a pin; confirm pan + selection still work.
7. Toggle OS reduced motion and re-check that panning/zooming stays calm (unchanged behaviour).
