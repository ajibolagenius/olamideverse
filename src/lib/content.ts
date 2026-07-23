import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
    albumSchema,
    eraSchema,
    impactPlaceSchema,
    influenceGraphSchema,
    mediaItemSchema,
    snippetSchema,
    songCatalogFileSchema,
    type Album,
    type Era,
    type ImpactPlace,
    type InfluenceGraph,
    type MediaItem,
    type Snippet,
    type Song,
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
        // preview_tokens is not directly selectable by anon/authenticated
        // (see supabase/migrations/20260719040000_security_hardening.sql) —
        // this RPC only returns a boolean, and only matches a token the
        // caller already supplies, so the token set can't be enumerated.
        const { data } = await supabase.rpc("is_valid_preview_token", {
            p_token: token,
            p_entity_type: entityType,
            p_entity_id: entityId,
        });
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

function fileSnippets(eraSlugs: Set<string>, albumSlugs: Set<string>): Snippet[] {
    const file = path.join(CONTENT_DIR, "snippets", "snippets.json");
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const items = z.array(snippetSchema).parse(raw);
    for (const item of items) {
        if (!eraSlugs.has(item.era)) {
            throw new Error(`snippets.json "${item.id}" references unknown era "${item.era}"`);
        }
        if (!albumSlugs.has(item.albumSlug)) {
            throw new Error(
                `snippets.json "${item.id}" references unknown album "${item.albumSlug}"`,
            );
        }
    }
    return items;
}

function fileInfluenceGraph(eraSlugs: Set<string>): InfluenceGraph {
    const file = path.join(CONTENT_DIR, "influence", "graph.json");
    if (!fs.existsSync(file)) return { nodes: [], edges: [] };
    const graph = influenceGraphSchema.parse(
        JSON.parse(fs.readFileSync(file, "utf8")),
    );
    for (const node of graph.nodes) {
        if (node.eraSlug && !eraSlugs.has(node.eraSlug)) {
            throw new Error(
                `influence graph node "${node.id}" references unknown era "${node.eraSlug}"`,
            );
        }
        if (
            node.departedYear != null &&
            (node.signedYear == null || node.departedYear < node.signedYear)
        ) {
            throw new Error(
                `influence graph node "${node.id}" has invalid YBNL roster years (signedYear/departedYear)`,
            );
        }
        if (node.role === "mentee" && node.signedYear == null) {
            throw new Error(
                `influence graph mentee "${node.id}" requires signedYear for the YBNL roster filter`,
            );
        }
    }
    const nodeIds = new Set(graph.nodes.map((n) => n.id));
    for (const edge of graph.edges) {
        if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
            throw new Error(
                `influence graph edge ${edge.from}→${edge.to} references a missing node`,
            );
        }
    }
    return graph;
}

function fileImpactPlaces(eraSlugs: Set<string>): ImpactPlace[] {
    const file = path.join(CONTENT_DIR, "impact", "places.json");
    if (!fs.existsSync(file)) return [];
    const places = z.array(impactPlaceSchema).parse(
        JSON.parse(fs.readFileSync(file, "utf8")),
    );
    for (const place of places) {
        if (place.eraSlug && !eraSlugs.has(place.eraSlug)) {
            throw new Error(
                `impact place "${place.id}" references unknown era "${place.eraSlug}"`,
            );
        }
    }
    return places;
}

export async function getSnippets(): Promise<Snippet[]> {
    const [eras, albums] = await Promise.all([getEras(), getAlbums()]);
    return fileSnippets(
        new Set(eras.map((e) => e.slug)),
        new Set(albums.map((a) => a.slug)),
    );
}

export async function getSnippet(id: string): Promise<Snippet | undefined> {
    return (await getSnippets()).find((s) => s.id === id);
}

export async function getSnippetsByAlbum(albumSlug: string): Promise<Snippet[]> {
    return (await getSnippets()).filter((s) => s.albumSlug === albumSlug);
}

export async function getSnippetsByEra(eraSlug: string): Promise<Snippet[]> {
    return (await getSnippets()).filter((s) => s.era === eraSlug);
}

export async function getInfluenceGraph(): Promise<InfluenceGraph> {
    const eras = await getEras();
    return fileInfluenceGraph(new Set(eras.map((e) => e.slug)));
}

export async function getImpactPlaces(): Promise<ImpactPlace[]> {
    const eras = await getEras();
    return fileImpactPlaces(new Set(eras.map((e) => e.slug)));
}

/** Stable slug for song catalogue IDs. */
export function slugifySongPart(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/**
 * Map a release year onto the era spine (docs/CONCEPT.md §4).
 * Used for catalog entries that aren't tied to an album row.
 */
export function eraSlugForYear(year: number): string {
    if (year <= 2011) return "the-upstart";
    if (year <= 2013) return "first-of-all";
    if (year <= 2017) return "street-king-run";
    if (year <= 2020) return "reinvention";
    if (year <= 2023) return "elder-statesman";
    return "legacy";
}

export function albumTrackSongId(albumSlug: string, title: string): string {
    return `${albumSlug}--${slugifySongPart(title)}`;
}

function deriveAlbumTracks(
    albums: Album[],
    alsoSingles: Map<string, number | undefined>,
): Song[] {
    const songs: Song[] = [];
    for (const album of albums) {
        for (const track of album.tracklist) {
            const id = albumTrackSongId(album.slug, track.title);
            const singleYear = alsoSingles.get(id);
            const alsoSingle = alsoSingles.has(id);
            songs.push({
                id,
                title: track.title,
                year: singleYear ?? album.year,
                era: album.era,
                type: "album-track",
                status: track.spotifyTrackId || track.youtubeId ? "verified" : "documented",
                note: track.note,
                albumSlug: album.slug,
                trackNum: track.num,
                alsoSingle: alsoSingle || undefined,
                singleYear,
                spotifyTrackId: track.spotifyTrackId,
                youtubeId: track.youtubeId,
                source: "OlamideVerse discography",
            });
        }
    }
    return songs;
}

function fileSongCatalog(eraSlugs: Set<string>, albumSlugs: Set<string>) {
    const file = path.join(CONTENT_DIR, "songs", "catalog.json");
    if (!fs.existsSync(file)) {
        return { alsoSingles: [], entries: [] as Song[] };
    }
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const parsed = songCatalogFileSchema.parse(raw);
    for (const entry of parsed.entries) {
        if (!eraSlugs.has(entry.era)) {
            throw new Error(
                `songs/catalog.json "${entry.id}" references unknown era "${entry.era}"`,
            );
        }
        if (entry.albumSlug && !albumSlugs.has(entry.albumSlug)) {
            throw new Error(
                `songs/catalog.json "${entry.id}" references unknown album "${entry.albumSlug}"`,
            );
        }
    }
    return parsed;
}

export async function getSongs(): Promise<Song[]> {
    const [eras, albums] = await Promise.all([getEras(), getAlbums()]);
    const eraSlugs = new Set(eras.map((e) => e.slug));
    const albumSlugs = new Set(albums.map((a) => a.slug));
    const catalog = fileSongCatalog(eraSlugs, albumSlugs);

    const alsoSingles = new Map(
        catalog.alsoSingles.map((row) => [row.id, row.singleYear] as const),
    );
    const derived = deriveAlbumTracks(albums, alsoSingles);
    const songs: Song[] = [...derived, ...catalog.entries];

    const seen = new Set<string>();
    for (const song of songs) {
        if (seen.has(song.id)) {
            throw new Error(`Duplicate song catalogue id "${song.id}"`);
        }
        seen.add(song.id);
    }

    return songs.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.title.localeCompare(b.title);
    });
}
