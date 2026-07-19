import type { Metadata } from "next";
import { getSeoForPath } from "@/lib/settings";

/**
 * Canonical site URL, resolved without requiring a manually-set env var in
 * every environment: explicit override first, then Vercel's own
 * project-domain env vars (prod vs. preview), then localhost for dev.
 * Used for `metadataBase` and anywhere an absolute URL is required.
 */
function resolveSiteUrl(): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    const vercelUrl =
        process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
    if (vercelUrl) return `https://${vercelUrl}`;
    return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "OlamideVerse";
export const SITE_DESCRIPTION =
    "A fan-made cultural archive telling the story of how a kid from Bariga built Nigerian street-hop into an empire — era by era, album by album. Not affiliated with Olamide or YBNL Nation.";

/**
 * Per-page metadata, incl. openGraph/twitter — `title`/`description` alone
 * don't cascade into the openGraph object (Next replaces it wholesale once
 * a segment defines its own), so every page sets these explicitly to get a
 * correct social-share title instead of falling back to the root's.
 */
function absoluteOgUrl(ogImage: string): string {
    if (/^https?:\/\//i.test(ogImage)) return ogImage;
    // Stable unhashed fallback route — see src/app/og/route.tsx
    const path = ogImage.startsWith("/") ? ogImage : `/${ogImage}`;
    return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
    title,
    description,
    path,
    noindex,
    ogImage,
}: {
    title: string;
    description: string;
    path: string;
    noindex?: boolean;
    ogImage?: string;
}): Metadata {
    const socialTitle = `${title} · ${SITE_NAME}`;
    // Prefer an explicit CMS/override image. When omitted, leave `images`
    // unset so the route's `opengraph-image.tsx` file convention can attach
    // (setting `images: []` or a default here would wipe album/era cards).
    const images = ogImage
        ? [{ url: absoluteOgUrl(ogImage), width: 1200, height: 630 }]
        : undefined;
    return {
        title,
        description,
        alternates: { canonical: path },
        robots: noindex ? { index: false, follow: false } : undefined,
        openGraph: {
            title: socialTitle,
            description,
            url: path,
            ...(images ? { images } : {}),
        },
        // `twitter` is a nested object like `openGraph` — a page-level value
        // replaces the root's wholesale, so `card` has to be repeated here or
        // every page but the root falls back to Twitter's small "summary" card.
        twitter: {
            card: "summary_large_image",
            title: socialTitle,
            description,
            ...(images ? { images: images.map((i) => i.url) } : {}),
        },
    };
}

/** Merge CMS SEO overrides (admin /seo) onto defaults for a path. */
export async function resolvePageMetadata(defaults: {
    title: string;
    description: string;
    path: string;
}): Promise<Metadata> {
    const seo = await getSeoForPath(defaults.path);
    return pageMetadata({
        title: seo?.title?.trim() || defaults.title,
        description: seo?.description?.trim() || defaults.description,
        path: defaults.path,
        noindex: seo?.noindex,
        ogImage: seo?.og_image?.trim() || undefined,
    });
}
