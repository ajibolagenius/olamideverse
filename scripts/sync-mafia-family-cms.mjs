/**
 * Targeted CMS sync for the YBNL MaFia Family addition.
 *
 * Same shape as sync-research-content-cms.mjs: force-updates only the rows
 * touched by this content patch (the new album, plus the Reinvention era copy
 * that now references it) so published CMS content matches content/* without
 * re-seeding unrelated admin-edited rows.
 *
 * Pass --dry-run to print what would change without writing.
 *
 * Usage: node --env-file=.env.local scripts/sync-mafia-family-cms.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const ERA_SLUGS = ["reinvention"];
const ALBUM_SLUGS = ["ybnl-mafia-family"];

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

        if (dryRun) {
            console.log(
                `[dry-run] ${existing ? "would update" : "would insert"} cms_eras:${slug} (status=${row.status})`,
            );
            continue;
        }

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

        if (dryRun) {
            console.log(
                `[dry-run] ${existing ? "would update" : "would insert"} cms_albums:${slug} (status=${row.status}, cover_path=${row.cover_path}, ${album.data.tracklist?.length ?? 0} tracks)`,
            );
            continue;
        }

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

async function main() {
    console.log(
        `Syncing YBNL MaFia Family CMS rows only…${dryRun ? " (dry run)" : ""}\n`,
    );
    await syncEras();
    await syncAlbums();
    console.log(
        "\nDone. Songs catalogue, influence graph and cover manifest stay file-backed (no CMS tables).",
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
