import type { MetadataRoute } from "next";
import { getAlbums, getEras } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [eras, albums, flags] = await Promise.all([
        getEras(),
        getAlbums(),
        getFeatureFlags(),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/eras`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/albums`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/media`, changeFrequency: "monthly", priority: 0.8 },
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

    return [...staticRoutes, ...eraRoutes, ...albumRoutes];
}
