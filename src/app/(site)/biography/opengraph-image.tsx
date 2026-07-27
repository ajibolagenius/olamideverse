import { OG_CONTENT_TYPE, OG_SIZE, renderDefaultOgImage } from "@/lib/og-default";

export const alt = "Biography — OlamideVerse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage({
    eyebrow: "Biography",
    title: "The Biography",
    tagline: "The Olamide story, start to now — one narrative throughline across six eras.",
  });
}
