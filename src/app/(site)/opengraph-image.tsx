import {
  OG_ALT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderDefaultOgImage,
} from "@/lib/og-default";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderDefaultOgImage();
}
