/**
 * Targeted CMS sync for the 2026-11-06 research audit.
 *
 * seed-cms.mjs inserts era/album rows only if missing, so the audit's era
 * beats and the 999 date fix never reached the live tables. This force-updates
 * exactly the rows the audit touched, keeping status / cover_path as stored.
 *
 * Media needs no entry here: seed-cms.mjs upserts cms_media_items from
 * media.json in full (npm run seed:cms).
 *
 * Usage: node --env-file=.env.local scripts/sync-audit-cms.mjs
 *    or: npm run sync:audit-cms
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

const ERA_SLUGS = ["first-of-all", "street-king-run", "reinvention", "elder-statesman", "legacy"];
const ALBUM_SLUGS = ["2-kings", "eyan-mayweather", "999", "carpe-diem", "unruly", "ikigai", "olamide", "time-and-space"];

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
            `cms_eras:${slug} — status=${row.status}, ` +
                `moments=${(era.data.moments ?? []).length}, ` +
                `ticker=${(era.data.ticker ?? []).length}`,
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

        // getAlbums() only reads status "published", so an unreleased album
        // (draft: true in content/) must not land as a published row.
        const status =
            existing?.status ?? (album.data.draft === true ? "draft" : "published");

        const row = {
            slug,
            data: album.data,
            body: album.body,
            status,
            cover_path: existing?.cover_path ?? coverBySlug[slug] ?? null,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("cms_albums").upsert(row, {
            onConflict: "slug",
        });
        if (error) throw error;
        console.log(
            `cms_albums:${slug} — status=${row.status}, draft=${album.data.draft === true}, ` +
                `released=${album.data.released ?? "n/a"}`,
        );
    }
}

async function main() {
    console.log("Syncing audit-touched CMS rows only…\n");
    await syncEras();
    await syncAlbums();
    console.log(
        "\nDone. Run `npm run seed:cms` for the media library. " +
            "Influence/impact/slang/songs stay file-backed (no CMS tables).",
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
