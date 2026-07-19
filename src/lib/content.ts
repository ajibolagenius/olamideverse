import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
    albumSchema,
    eraSchema,
    mediaItemSchema,
    type Album,
    type Era,
    type MediaItem,
} from "./content-schema";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Content loader — prefers published CMS rows (editable in /admin), falls
 * back to repo-resident MDX/JSON when the CMS is empty or unreachable.
 */

export * from "./content-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMdxCollection<T extends object>(
    dir: string,
    schema: z.ZodType<T>,
): Array<T & { slug: string; body: string }> {
    const full = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(full)) return [];
    return fs
        .readdirSync(full)
        .filter((f) => f.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const { data, content } = matter(
                fs.readFileSync(path.join(full, file), "utf8"),
            );
            const parsed = schema.safeParse(data);
            if (!parsed.success) {
                throw new Error(
                    `Invalid frontmatter in content/${dir}/${file}: ${parsed.error.message}`,
                );
            }
            return { ...parsed.data, slug, body: content };
        });
}

function fileEras(): Era[] {
    return readMdxCollection("eras", eraSchema).sort((a, b) => a.order - b.order);
}

function fileAlbums(eraSlugs: Set<string>): Album[] {
    const albums = readMdxCollection("albums", albumSchema);
    for (const album of albums) {
        if (!eraSlugs.has(album.era)) {
            throw new Error(
                `content/albums/${album.slug}.mdx references unknown era "${album.era}"`,
            );
        }
    }
    return albums.sort((a, b) => a.year - b.year);
}

function fileMedia(eraSlugs: Set<string>): MediaItem[] {
    const file = path.join(CONTENT_DIR, "media", "media.json");
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const items = z.array(mediaItemSchema).parse(raw);
    for (const item of items) {
        if (!eraSlugs.has(item.era)) {
            throw new Error(`media.json item "${item.id}" references unknown era "${item.era}"`);
        }
    }
    return items.sort((a, b) => b.year - a.year);
}

async function cmsEnabled(): Promise<boolean> {
    try {
        const supabase = createPublicClient();
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "feature_flags")
            .maybeSingle();
        const flags = (data?.value ?? {}) as { useCmsContent?: boolean };
        // Default ON when the settings row is missing but CMS tables have data.
        if (typeof flags.useCmsContent === "boolean") return flags.useCmsContent;
        return true;
    } catch {
        return false;
    }
}

export async function getEras(): Promise<Era[]> {
    if (await cmsEnabled()) {
        try {
            const supabase = createPublicClient();
            const { data, error } = await supabase
                .from("cms_eras")
                .select("slug, data, body, status")
                .eq("status", "published");
            if (!error && data && data.length > 0) {
                return data
                    .map((row) => {
                        const parsed = eraSchema.parse(row.data);
                        return { ...parsed, slug: row.slug, body: row.body ?? "" };
                    })
                    .sort((a, b) => a.order - b.order);
            }
        } catch {
            // fall through to files
        }
    }
    return fileEras();
}

async function validPreview(
    token: string | undefined,
    entityType: string,
    entityId: string,
): Promise<boolean> {
    if (!token) return false;
    try {
        const supabase = createPublicClient();
        const { data } = await supabase
            .from("preview_tokens")
            .select("token")
            .eq("token", token)
            .eq("entity_type", entityType)
            .eq("entity_id", entityId)
            .gt("expires_at", new Date().toISOString())
            .maybeSingle();
        return Boolean(data);
    } catch {
        return false;
    }
}

export async function getEra(
    slug: string,
    opts?: { previewToken?: string },
): Promise<Era | undefined> {
    if (opts?.previewToken && (await validPreview(opts.previewToken, "era", slug))) {
        try {
            const supabase = createPublicClient();
            const { data } = await supabase
                .from("cms_eras")
                .select("slug, data, body")
                .eq("slug", slug)
                .maybeSingle();
            if (data) {
                const parsed = eraSchema.parse(data.data);
                return { ...parsed, slug: data.slug, body: data.body ?? "" };
            }
        } catch {
            // fall through
        }
    }
    return (await getEras()).find((e) => e.slug === slug);
}

export async function getAlbums(): Promise<Album[]> {
    const eras = await getEras();
    const eraSlugs = new Set(eras.map((e) => e.slug));

    if (await cmsEnabled()) {
        try {
            const supabase = createPublicClient();
            const { data, error } = await supabase
                .from("cms_albums")
                .select("slug, data, body, status")
                .eq("status", "published");
            if (!error && data && data.length > 0) {
                return data
                    .map((row) => {
                        const parsed = albumSchema.parse(row.data);
                        if (!eraSlugs.has(parsed.era)) {
                            throw new Error(
                                `cms album ${row.slug} references unknown era "${parsed.era}"`,
                            );
                        }
                        return { ...parsed, slug: row.slug, body: row.body ?? "" };
                    })
                    .sort((a, b) => a.year - b.year);
            }
        } catch {
            // fall through
        }
    }

    return fileAlbums(eraSlugs);
}

export async function getAlbum(
    slug: string,
    opts?: { previewToken?: string },
): Promise<Album | undefined> {
    if (opts?.previewToken && (await validPreview(opts.previewToken, "album", slug))) {
        try {
            const supabase = createPublicClient();
            const { data } = await supabase
                .from("cms_albums")
                .select("slug, data, body")
                .eq("slug", slug)
                .maybeSingle();
            if (data) {
                const parsed = albumSchema.parse(data.data);
                return { ...parsed, slug: data.slug, body: data.body ?? "" };
            }
        } catch {
            // fall through
        }
    }
    return (await getAlbums()).find((a) => a.slug === slug);
}

export async function getAlbumsByEra(eraSlug: string): Promise<Album[]> {
    return (await getAlbums()).filter((a) => a.era === eraSlug);
}

export async function getMediaItems(): Promise<MediaItem[]> {
    const eras = await getEras();
    const eraSlugs = new Set(eras.map((e) => e.slug));

    if (await cmsEnabled()) {
        try {
            const supabase = createPublicClient();
            const { data, error } = await supabase
                .from("cms_media_items")
                .select("id, data, status, sort_order")
                .eq("status", "published")
                .order("sort_order", { ascending: true });
            if (!error && data && data.length > 0) {
                return data
                    .map((row) => {
                        const parsed = mediaItemSchema.parse({
                            ...(row.data as object),
                            id: row.id,
                        });
                        if (!eraSlugs.has(parsed.era)) {
                            throw new Error(
                                `cms media ${row.id} references unknown era "${parsed.era}"`,
                            );
                        }
                        return parsed;
                    })
                    .sort((a, b) => b.year - a.year);
            }
        } catch {
            // fall through
        }
    }

    return fileMedia(eraSlugs);
}
