import type { MetadataRoute } from "next";
import { getAlbums, getEras, getSnippets } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [eras, albums, snippets, flags] = await Promise.all([
        getEras(),
        getAlbums(),
        getSnippets(),
        getFeatureFlags(),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/eras`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/albums`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/songs`, changeFrequency: "weekly", priority: 0.85 },
        { url: `${SITE_URL}/media`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/snippets`, changeFrequency: "monthly", priority: 0.75 },
        { url: `${SITE_URL}/influence`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${SITE_URL}/impact`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
        { url: `${SITE_URL}/legal`, changeFrequency: "yearly", priority: 0.4 },
    ];

    if (flags.fanzone) {
        staticRoutes.push({
            url: `${SITE_URL}/fanzone`,
            changeFrequency: "daily",
            priority: 0.6,
        });
    }

    const eraRoutes: MetadataRoute.Sitemap = eras.map((era) => ({
        url: `${SITE_URL}/eras/${era.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const albumRoutes: MetadataRoute.Sitemap = albums.map((album) => ({
        url: `${SITE_URL}/albums/${album.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const snippetRoutes: MetadataRoute.Sitemap = snippets.map((snippet) => ({
        url: `${SITE_URL}/snippets/${snippet.id}`,
        changeFrequency: "monthly",
        priority: 0.55,
    }));

    return [...staticRoutes, ...eraRoutes, ...albumRoutes, ...snippetRoutes];
}
