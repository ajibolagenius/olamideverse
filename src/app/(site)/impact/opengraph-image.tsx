import { OG_CONTENT_TYPE, OG_SIZE, renderDefaultOgImage } from "@/lib/og-default";

export const alt = "Impact map — OlamideVerse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage({
    eyebrow: "Map",
    title: "Impact map",
    tagline: "Bariga to the diaspora — where the music landed.",
  });
}
