import { OG_CONTENT_TYPE, OG_SIZE, renderDefaultOgImage } from "@/lib/og-default";

export const alt = "Eras — OlamideVerse";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage({
    eyebrow: "Timeline",
    title: "Eras",
    tagline: "Six eras, one career — from The Upstart to Legacy.",
  });
}
