import { OG_CONTENT_TYPE, OG_SIZE, renderDefaultOgImage } from "@/lib/og-default";

export const alt = "Street Lingo — OlamideVerse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage({
    eyebrow: "Cultural lexicon",
    title: "Street Lingo",
    tagline: "The words that left Bariga — and the records that carried them.",
  });
}
