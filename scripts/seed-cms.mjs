/**
 * Seed admin CMS tables from content/*.mdx + media.json + manifest.json,
 * and bootstrap the first owner admin from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Idempotent for most tables: rows are inserted only if their primary key
 * doesn't already exist (ON CONFLICT DO NOTHING), so re-running never
 * overwrites eras/albums/pages/settings edited in the admin dashboard.
 *
 * Exception: cms_media_items is upserted from content/media/media.json so the
 * archive checklist stays in sync (status/sort_order preserved when present).
 *
 * Usage: node --env-file=.env.local scripts/seed-cms.mjs
 *    or: npm run seed:cms
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

const adminEmail = (process.env.ADMIN_EMAIL || "admin@olamideverse.local").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "olamideverse-admin";

function readMdxDir(dir) {
    const full = path.join(root, "content", dir);
    return fs
        .readdirSync(full)
        .filter((f) => f.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
            return { slug, data, body: content.trim() };
        });
}

/**
 * Insert rows that don't already exist (by `conflictKey`); existing rows
 * are left untouched. Returns how many were actually inserted.
 */
async function seedIfMissing(table, rows, conflictKey, label) {
    if (rows.length === 0) {
        console.log(`Seeded 0 ${label}`);
        return;
    }
    const { data, error } = await supabase
        .from(table)
        .upsert(rows, { onConflict: conflictKey, ignoreDuplicates: true })
        .select(conflictKey);
    if (error) throw error;
    const inserted = data?.length ?? 0;
    const skipped = rows.length - inserted;
    console.log(`Seeded ${inserted} ${label}${skipped ? ` (${skipped} already existed, skipped)` : ""}`);
}

async function ensureAdmin() {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    let user = list?.users?.find((u) => u.email?.toLowerCase() === adminEmail);

    if (!user) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
        });
        if (error) throw error;
        user = data.user;
        console.log("Created auth user", adminEmail);
    } else {
        // Never overwrite an existing password — admins change it in the dashboard.
        console.log("Admin auth user already exists; leaving password unchanged");
    }

    await seedIfMissing(
        "admin_users",
        [{ user_id: user.id, email: adminEmail, display_name: "Owner", role: "owner", disabled: false }],
        "user_id",
        "admin_users rows",
    );
}

async function seedEras() {
    const eras = readMdxDir("eras");
    const rows = eras.map((era) => ({
        slug: era.slug,
        data: era.data,
        body: era.body,
        status: "published",
        updated_at: new Date().toISOString(),
    }));
    await seedIfMissing("cms_eras", rows, "slug", "eras");
}

async function seedAlbums() {
    const albums = readMdxDir("albums");
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, "content/media/manifest.json"), "utf8"),
    );
    const coverBySlug = Object.fromEntries(
        (manifest.albums || []).map((a) => [a.slug, `/media/${a.file}`]),
    );

    const rows = albums.map((album) => ({
        slug: album.slug,
        data: { ...album.data, draft: false },
        body: album.body,
        status: "published",
        cover_path: coverBySlug[album.slug] ?? null,
        updated_at: new Date().toISOString(),
    }));
    await seedIfMissing("cms_albums", rows, "slug", "albums");
}

async function seedMedia() {
    // Media archive is file-authoritative (content/media/media.json). Unlike
    // eras/albums — where admin edits should win — we upsert so new YouTube
    // embeds and Waptrick checklist rows reach the live /media page when
    // useCmsContent is on. Existing status + sort_order are preserved.
    const items = JSON.parse(
        fs.readFileSync(path.join(root, "content/media/media.json"), "utf8"),
    );
    const ids = items.map((item) => item.id);
    const { data: existingRows, error: readErr } = await supabase
        .from("cms_media_items")
        .select("id, status, sort_order")
        .in("id", ids);
    if (readErr) throw readErr;
    const existing = Object.fromEntries(
        (existingRows ?? []).map((row) => [row.id, row]),
    );

    const rows = items.map((item, i) => ({
        id: item.id,
        data: item,
        status: existing[item.id]?.status ?? "published",
        sort_order: existing[item.id]?.sort_order ?? i,
        updated_at: new Date().toISOString(),
    }));

    // Supabase caps URL / payload size — batch upserts.
    const chunkSize = 50;
    let upserted = 0;
    for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const { error } = await supabase.from("cms_media_items").upsert(chunk, {
            onConflict: "id",
        });
        if (error) throw error;
        upserted += chunk.length;
    }
    console.log(
        `Upserted ${upserted} media items from media.json (${Object.keys(existing).length} already existed)`,
    );
}

async function seedPagesAndSettings() {
    const pages = [
        {
            key: "home",
            title: "Home",
            data: {
                featuredEra: "the-upstart",
                heroEyebrow: "A cultural archive",
                heroTitle: "The living archive of Olamide's legacy",
            },
        },
        {
            key: "about",
            title: "About",
            data: {
                intro:
                    "OlamideVerse is a fan-made editorial archive — not affiliated with Olamide or YBNL Nation.",
            },
        },
        {
            key: "legal",
            title: "Legal",
            data: {
                takedownEmail: (process.env.TAKEDOWN_EMAIL || "").trim(),
                note: "Embeds only. Cover art placeholders until licensed.",
            },
        },
    ];
    await seedIfMissing(
        "cms_pages",
        pages.map((page) => ({ ...page, status: "published", updated_at: new Date().toISOString() })),
        "key",
        "pages",
    );

    const settings = {
        disclaimer: {
            text: "Fan archive · Not affiliated with Olamide or YBNL Nation",
            highlight: "Not affiliated",
        },
        navigation: {
            links: [
                { href: "/eras", label: "Eras" },
                { href: "/albums", label: "Discography" },
                { href: "/media", label: "Media" },
                { href: "/about", label: "About" },
                { href: "/fanzone", label: "Fan Zone" },
            ],
        },
        footer: {
            links: [
                { href: "/snippets", label: "Snippets" },
                { href: "/influence", label: "Influence" },
                { href: "/impact", label: "Impact" },
                { href: "/legal", label: "Legal" },
                { href: "/about", label: "Source credits" },
                { href: "/legal#takedown", label: "Takedown" },
                { href: "/fanzone", label: "Fan Zone" },
            ],
            blurb:
                "Fan project · Not affiliated with Olamide or YBNL Nation · Archival & educational",
        },
        general: {
            siteName: "OlamideVerse",
            takedownEmail: (process.env.TAKEDOWN_EMAIL || "").trim(),
            analyticsId: (
                process.env.NEXT_PUBLIC_ANALYTICS_ID ||
                process.env.ANALYTICS_ID ||
                ""
            ).trim(),
        },
        brand: {
            accents: ["danfo", "adire", "oxide", "palm", "ink", "clay", "navy"],
            eraAccentMap: {
                "the-upstart": "oxide",
                "first-of-all": "adire",
                "street-king-run": "danfo",
                reinvention: "palm",
                "elder-statesman": "clay",
                legacy: "navy",
            },
            motionEnabled: true,
        },
        embeds: {
            providers: ["spotify", "youtube", "audiomack"],
            priority: ["spotify", "youtube", "audiomack"],
        },
        feature_flags: {
            // Archive soft-launch: enable Fan Zone from Admin → Settings when ready.
            fanzone: false,
            comments: false,
            polls: false,
            useCmsContent: true,
            maintenance: false,
        },
    };

    const settingsRows = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
    }));
    await seedIfMissing("site_settings", settingsRows, "key", "settings");
}

async function seedPolls() {
    const rows = [
        {
            id: "poll-elder-statesman",
            question: "Elder Statesman highlight?",
            options: [
                { id: "uy-scuti", label: "UY Scuti (2021)" },
                { id: "unruly", label: "Unruly (2023)" },
            ],
            base_votes: { "uy-scuti": 166, unruly: 195 },
            active: true,
            sort_order: 0,
            updated_at: new Date().toISOString(),
        },
    ];
    await seedIfMissing("cms_polls", rows, "id", "polls");
}

async function seedAssets() {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, "content/media/manifest.json"), "utf8"),
    );
    const rows = [
        ...(manifest.albums || []).map((a) => ({
            path: `/media/${a.file}`,
            kind: "album-cover",
            alt: `${a.title} cover`,
            credit: "Rights-holder copyright (editorial placeholder)",
            license: "Copyright",
            license_url: a.sourceUrl ?? "",
            bytes: a.bytes ?? null,
            mime: "image/jpeg",
        })),
        ...(manifest.photos || []).map((p) => ({
            path: `/media/${p.file}`,
            kind: p.id.startsWith("home") ? "home" : "era-photo",
            alt: p.description ?? p.id,
            credit: p.credit ?? "",
            license: p.license ?? "",
            license_url: p.licenseUrl ?? "",
            bytes: p.bytes ?? null,
            mime: "image/jpeg",
        })),
    ];

    await seedIfMissing("media_assets", rows, "path", "media_assets");

    const slots = Object.entries(manifest.slots || {}).map(([slot_id, file]) => ({
        slot_id,
        path: `/media/${file}`,
        label: slot_id,
        updated_at: new Date().toISOString(),
    }));
    await seedIfMissing("media_slots", slots, "slot_id", "media_slots");
}

async function main() {
    await ensureAdmin();
    await seedEras();
    await seedAlbums();
    await seedMedia();
    await seedPagesAndSettings();
    await seedPolls();
    await seedAssets();
    console.log("\nDone.");
    console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
    console.log("Open http://localhost:3000/admin/login");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
