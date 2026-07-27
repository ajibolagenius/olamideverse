import { OG_CONTENT_TYPE, OG_SIZE, renderDefaultOgImage } from "@/lib/og-default";

export const alt = "About — OlamideVerse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage({
    eyebrow: "About",
    title: "About",
    tagline: "What this archive is, who made it, and the rules it lives by.",
  });
}
