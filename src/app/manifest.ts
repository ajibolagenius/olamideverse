import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — the living archive of Olamide's legacy`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F4EFE6",
    theme_color: "#181410",
    categories: ["music", "entertainment", "reference"],
    // Chrome shows the richer install dialog only when both form factors are
    // present; these are captured from a production build by
    // scripts/capture-pwa-screenshots.mjs, not hand-made mockups.
    screenshots: [
      {
        src: "/screenshots/home-wide.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "The archive home — six eras, one legacy",
      },
      {
        src: "/screenshots/songs-wide.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "The song catalogue, filterable by era and type",
      },
      {
        src: "/screenshots/home-narrow.png",
        sizes: "540x960",
        type: "image/png",
        form_factor: "narrow",
        label: "The archive home — six eras, one legacy",
      },
      {
        src: "/screenshots/songs-narrow.png",
        sizes: "540x960",
        type: "image/png",
        form_factor: "narrow",
        label: "The song catalogue, filterable by era and type",
      },
    ],
    shortcuts: [
      { name: "Songs", url: "/songs", description: "The full song catalogue" },
      { name: "Eras", url: "/eras", description: "Six career chapters" },
      { name: "Discography", url: "/albums", description: "Albums and mixtapes" },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
