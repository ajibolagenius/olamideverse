/**
 * Targeted CMS sync for the research-content update.
 *
 * Unlike seed-cms.mjs (insert-if-missing only), this force-updates the
 * specific eras / album / media rows touched by the research patch so
 * published CMS content stays in sync with content/* without re-seeding
 * unrelated admin-edited rows.
 *
 * Usage: node --env-file=.env.local scripts/sync-research-content-cms.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const root = process.cwd();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const ERA_SLUGS = ["first-of-all", "legacy", "street-king-run"];
const ALBUM_SLUGS = ["olamide"];
const MEDIA_IDS = [
    "apple-music-uy-scuti-2021",
    "cnn-interview-2021",
    "amapiano-video",
];

function readMdx(relDir, slug) {
    const file = path.join(root, "content", relDir, `${slug}.mdx`);
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    return { slug, data, body: content.trim() };
}

async function syncEras() {
    for (const slug of ERA_SLUGS) {
        const era = readMdx("eras", slug);
        const { data: existing, error: readErr } = await supabase
            .from("cms_eras")
            .select("slug, status")
            .eq("slug", slug)
            .maybeSingle();
        if (readErr) throw readErr;

        const row = {
            slug,
            data: era.data,
            body: era.body,
            status: existing?.status ?? "published",
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("cms_eras").upsert(row, {
            onConflict: "slug",
        });
        if (error) throw error;
        console.log(
            existing
                ? `Updated cms_eras:${slug} (kept status=${row.status})`
                : `Inserted cms_eras:${slug}`,
        );
    }
}

async function syncAlbums() {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, "content/media/manifest.json"), "utf8"),
    );
    const coverBySlug = Object.fromEntries(
        (manifest.albums || []).map((a) => [a.slug, `/media/${a.file}`]),
    );

    for (const slug of ALBUM_SLUGS) {
        const album = readMdx("albums", slug);
        const { data: existing, error: readErr } = await supabase
            .from("cms_albums")
            .select("slug, status, cover_path")
            .eq("slug", slug)
            .maybeSingle();
        if (readErr) throw readErr;

        const row = {
            slug,
            data: { ...album.data, draft: false },
            body: album.body,
            status: existing?.status ?? "published",
            cover_path: existing?.cover_path ?? coverBySlug[slug] ?? null,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("cms_albums").upsert(row, {
            onConflict: "slug",
        });
        if (error) throw error;
        console.log(
            existing
                ? `Updated cms_albums:${slug} (kept status=${row.status}, cover_path)`
                : `Inserted cms_albums:${slug}`,
        );
    }
}

async function syncMedia() {
    const items = JSON.parse(
        fs.readFileSync(path.join(root, "content/media/media.json"), "utf8"),
    );
    const byId = Object.fromEntries(items.map((item, i) => [item.id, { item, i }]));

    for (const id of MEDIA_IDS) {
        const entry = byId[id];
        if (!entry) {
            console.warn(`Skipping media ${id}: not found in media.json`);
            continue;
        }

        const { data: existing, error: readErr } = await supabase
            .from("cms_media_items")
            .select("id, status, sort_order")
            .eq("id", id)
            .maybeSingle();
        if (readErr) throw readErr;

        const row = {
            id,
            data: entry.item,
            status: existing?.status ?? "published",
            sort_order: existing?.sort_order ?? entry.i,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("cms_media_items").upsert(row, {
            onConflict: "id",
        });
        if (error) throw error;
        console.log(
            existing
                ? `Updated cms_media_items:${id} (kept status=${row.status}, sort_order)`
                : `Inserted cms_media_items:${id}`,
        );
    }
}

async function main() {
    console.log("Syncing research-content CMS rows only…\n");
    await syncEras();
    await syncAlbums();
    await syncMedia();
    console.log("\nDone. Influence/impact remain file-backed (no CMS tables).");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
