import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * TTF builds of the brand fonts for `next/og` (satori can't parse the
 * woff2 files in public/fonts — only ttf/otf/woff). Converted once from
 * anton-latin.woff2 / archivo-latin.woff2; Latin-only is enough for OG
 * card titles context (full diacritic coverage isn't needed at this size).
 */
let cached: Promise<{ anton: Buffer; archivo: Buffer }> | undefined;

export function loadOgFonts() {
  if (!cached) {
    cached = Promise.all([
      readFile(join(process.cwd(), "assets/og-fonts/Anton.ttf")),
      readFile(join(process.cwd(), "assets/og-fonts/Archivo-Bold.ttf")),
    ]).then(([anton, archivo]) => ({ anton, archivo }));
  }
  return cached;
}
