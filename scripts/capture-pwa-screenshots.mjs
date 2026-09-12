/**
 * Capture the PWA install-dialog screenshots referenced by src/app/manifest.ts.
 *
 * Shot against a PRODUCTION server, because `next dev` paints a dev-tools
 * badge into the corner and it ends up in the install dialog.
 *
 * Playwright is not a package dependency here — it is the project's browser
 * tool (AGENTS.md §4), so install it once with `npx playwright install
 * chromium` before running this.
 *
 * Usage:
 *   npm run build && PORT=3100 npm start   # in one shell
 *   npm run shots:pwa                      # in another
 *
 * Sizes here must stay in sync with the `sizes` fields in manifest.ts —
 * Chrome rejects a screenshot whose real dimensions disagree.
 */
import { chromium } from "playwright";

const base = process.env.SHOTS_BASE_URL ?? "http://localhost:3100";
const shots = [
  { name: "home-wide", path: "/", viewport: { width: 1280, height: 800 } },
  { name: "songs-wide", path: "/songs", viewport: { width: 1280, height: 800 } },
  { name: "home-narrow", path: "/", viewport: { width: 540, height: 960 } },
  { name: "songs-narrow", path: "/songs", viewport: { width: 540, height: 960 } },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({
    viewport: shot.viewport,
    // Freeze the scroll reveals so a shot never catches a half-faded section.
    reducedMotion: "reduce",
  });
  await page.goto(`${base}${shot.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `public/screenshots/${shot.name}.png` });
  console.log(`${shot.name}  ${shot.viewport.width}x${shot.viewport.height}`);
  await page.close();
}
await browser.close();
