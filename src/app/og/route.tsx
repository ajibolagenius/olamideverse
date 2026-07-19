import { renderDefaultOgImage } from "@/lib/og-default";

export const runtime = "nodejs";

/** Stable, unhashed OG image URL for metadata fallbacks and CMS overrides. */
export async function GET() {
  return renderDefaultOgImage();
}
