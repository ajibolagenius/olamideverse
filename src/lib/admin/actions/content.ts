"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { albumSchema, eraSchema, mediaItemSchema } from "@/lib/content-schema";
import { createClient } from "@/lib/supabase/server";
import { writeAudit } from "@/lib/admin/audit";
import { canEditContent, requireAdmin } from "@/lib/admin/auth";
import type { PublishStatus } from "@/lib/admin/types";

function slugify(input: string) {
    return input
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 64);
}

function parseJsonField(raw: FormDataEntryValue | null, fallback: unknown = {}) {
    if (typeof raw !== "string" || !raw.trim()) return fallback;
    return JSON.parse(raw) as unknown;
}

function asStatus(raw: FormDataEntryValue | null): PublishStatus {
    const v = String(raw ?? "draft");
    if (v === "published" || v === "archived" || v === "draft") return v;
    return "draft";
}

async function assertEditor() {
    const session = await requireAdmin();
    if (!canEditContent(session.admin.role)) {
        redirect("/admin?error=forbidden");
    }
    return session;
}

async function snapshotVersion(
    entityType: string,
    entityId: string,
    snapshot: Record<string, unknown>,
    summary: string,
    userId: string,
) {
    const supabase = await createClient();
    await supabase.from("cms_versions").insert({
        entity_type: entityType,
        entity_id: entityId,
        snapshot,
        summary,
        created_by: userId,
    });
}

export async function saveEra(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();

    const existingSlug = String(formData.get("existingSlug") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("title") ?? ""));
    const body = String(formData.get("body") ?? "");
    const status = asStatus(formData.get("status"));
    const context_photo_path = String(formData.get("context_photo_path") ?? "").trim() || null;

    const data = {
        title: String(formData.get("title") ?? ""),
        years: String(formData.get("years") ?? ""),
        order: Number(formData.get("order") ?? 1),
        thesis: String(formData.get("thesis") ?? ""),
        accent: String(formData.get("accent") ?? "oxide"),
        ticker: parseJsonField(formData.get("ticker"), []) as string[],
        heroBadge: String(formData.get("heroBadge") ?? ""),
        heroIntro: String(formData.get("heroIntro") ?? ""),
        contextHeading: String(formData.get("contextHeading") ?? ""),
        contextBody: parseJsonField(formData.get("contextBody"), []) as string[],
        pullQuote: String(formData.get("pullQuote") ?? ""),
        pullQuoteHighlight: String(formData.get("pullQuoteHighlight") ?? "") || undefined,
        momentsSpan: String(formData.get("momentsSpan") ?? "") || undefined,
        moments: parseJsonField(formData.get("moments"), []) as unknown[],
        open: formData.get("open") === "on",
    };

    const parsed = eraSchema.safeParse(data);
    if (!parsed.success) {
        redirect(`/admin/eras/${existingSlug || "new"}?error=validation`);
    }

    const row = {
        slug,
        data: parsed.data,
        body,
        status,
        context_photo_path,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    };

    if (existingSlug && existingSlug !== slug) {
        await supabase.from("cms_eras").delete().eq("slug", existingSlug);
    }

    const { error } = await supabase.from("cms_eras").upsert(row);
    if (error) redirect(`/admin/eras/${slug}?error=save`);

    await snapshotVersion(
        "era",
        slug,
        { data: parsed.data, body, status, context_photo_path },
        `${status} era “${parsed.data.title}”`,
        session.userId,
    );

    await writeAudit({
        action: existingSlug ? "update" : "create",
        entityType: "era",
        entityId: slug,
        summary: `${status} era “${parsed.data.title}”`,
    });

    revalidatePath("/");
    revalidatePath("/eras");
    revalidatePath(`/eras/${slug}`);
    revalidatePath("/admin/eras");
    redirect(`/admin/eras/${slug}?saved=1`);
}

export async function deleteEra(formData: FormData) {
    await assertEditor();
    const slug = String(formData.get("slug") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_eras").delete().eq("slug", slug);
    await writeAudit({
        action: "delete",
        entityType: "era",
        entityId: slug,
        summary: `Deleted era ${slug}`,
    });
    revalidatePath("/eras");
    revalidatePath("/admin/eras");
    redirect("/admin/eras");
}

export async function saveAlbum(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();

    const existingSlug = String(formData.get("existingSlug") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("title") ?? ""));
    const body = String(formData.get("body") ?? "");
    const status = asStatus(formData.get("status"));
    const cover_path = String(formData.get("cover_path") ?? "").trim() || null;

    const data = {
        title: String(formData.get("title") ?? ""),
        year: Number(formData.get("year") ?? new Date().getFullYear()),
        era: String(formData.get("era") ?? ""),
        type: String(formData.get("type") ?? "album"),
        released: String(formData.get("released") ?? "") || undefined,
        label: String(formData.get("label") ?? "") || undefined,
        producer: String(formData.get("producer") ?? "") || undefined,
        credits: String(formData.get("credits") ?? "") || undefined,
        tracklist: parseJsonField(formData.get("tracklist"), []) as unknown[],
        keyBars: parseJsonField(formData.get("keyBars"), []) as unknown[],
        embeds: parseJsonField(formData.get("embeds"), {}) as Record<string, string>,
        draft: status !== "published",
    };

    const parsed = albumSchema.safeParse(data);
    if (!parsed.success) {
        redirect(`/admin/albums/${existingSlug || "new"}?error=validation`);
    }

    const row = {
        slug,
        data: parsed.data,
        body,
        status,
        cover_path,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    };

    if (existingSlug && existingSlug !== slug) {
        await supabase.from("cms_albums").delete().eq("slug", existingSlug);
    }

    const { error } = await supabase.from("cms_albums").upsert(row);
    if (error) redirect(`/admin/albums/${slug}?error=save`);

    await snapshotVersion(
        "album",
        slug,
        { data: parsed.data, body, status, cover_path },
        `${status} album “${parsed.data.title}”`,
        session.userId,
    );

    await writeAudit({
        action: existingSlug ? "update" : "create",
        entityType: "album",
        entityId: slug,
        summary: `${status} album “${parsed.data.title}”`,
    });

    revalidatePath("/albums");
    revalidatePath(`/albums/${slug}`);
    revalidatePath("/admin/albums");
    redirect(`/admin/albums/${slug}?saved=1`);
}

export async function deleteAlbum(formData: FormData) {
    await assertEditor();
    const slug = String(formData.get("slug") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_albums").delete().eq("slug", slug);
    await writeAudit({
        action: "delete",
        entityType: "album",
        entityId: slug,
        summary: `Deleted album ${slug}`,
    });
    revalidatePath("/albums");
    revalidatePath("/admin/albums");
    redirect("/admin/albums");
}

export async function saveMediaItem(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();

    const existingId = String(formData.get("existingId") ?? "").trim();
    const id = String(formData.get("id") ?? "").trim() || slugify(String(formData.get("title") ?? ""));
    const status = asStatus(formData.get("status"));
    const sort_order = Number(formData.get("sort_order") ?? 0);

    const youtubeRaw = String(formData.get("youtubeId") ?? "").trim();
    const data = {
        id,
        title: String(formData.get("title") ?? ""),
        era: String(formData.get("era") ?? ""),
        year: Number(formData.get("year") ?? new Date().getFullYear()),
        type: String(formData.get("type") ?? "music-video"),
        source: String(formData.get("source") ?? "YouTube"),
        youtubeId: youtubeRaw.length ? youtubeRaw : null,
        note: String(formData.get("note") ?? ""),
    };

    const parsed = mediaItemSchema.safeParse(data);
    if (!parsed.success) {
        redirect(`/admin/media/${existingId || "new"}?error=validation`);
    }

    if (existingId && existingId !== id) {
        await supabase.from("cms_media_items").delete().eq("id", existingId);
    }

    const mediaRow = {
        id,
        data: parsed.data,
        status,
        sort_order,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    };
    const { error } = await supabase.from("cms_media_items").upsert(mediaRow);
    if (error) redirect(`/admin/media/${id}?error=save`);

    await snapshotVersion(
        "media",
        id,
        { data: parsed.data, status, sort_order },
        `${status} media “${parsed.data.title}”`,
        session.userId,
    );

    await writeAudit({
        action: existingId ? "update" : "create",
        entityType: "media",
        entityId: id,
        summary: `${status} media “${parsed.data.title}”`,
    });

    revalidatePath("/media");
    revalidatePath("/admin/media");
    redirect(`/admin/media/${id}?saved=1`);
}

export async function deleteMediaItem(formData: FormData) {
    await assertEditor();
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_media_items").delete().eq("id", id);
    await writeAudit({
        action: "delete",
        entityType: "media",
        entityId: id,
        summary: `Deleted media ${id}`,
    });
    revalidatePath("/media");
    revalidatePath("/admin/media");
    redirect("/admin/media");
}

export async function savePage(formData: FormData) {
    const session = await assertEditor();
    const key = String(formData.get("key") ?? "");
    const title = String(formData.get("title") ?? key);
    const status = asStatus(formData.get("status"));
    const data = parseJsonField(formData.get("data"), {}) as Record<string, unknown>;

    const supabase = await createClient();
    const { error } = await supabase.from("cms_pages").upsert({
        key,
        title,
        data,
        status,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    if (error) redirect(`/admin/pages/${key}?error=save`);

    await writeAudit({
        action: "update",
        entityType: "page",
        entityId: key,
        summary: `Updated page ${key}`,
    });

    revalidatePath("/");
    revalidatePath(`/${key === "home" ? "" : key}`);
    redirect(`/admin/pages/${key}?saved=1`);
}

export async function saveSettings(formData: FormData) {
    const session = await assertEditor();
    const key = String(formData.get("key") ?? "");
    const value = parseJsonField(formData.get("value"), {}) as Record<string, unknown>;
    const supabase = await createClient();
    await supabase.from("site_settings").upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    await writeAudit({
        action: "update",
        entityType: "settings",
        entityId: key,
        summary: `Updated settings ${key}`,
    });
    revalidatePath("/");
    redirect(`/admin/settings?tab=${key}&saved=1`);
}
