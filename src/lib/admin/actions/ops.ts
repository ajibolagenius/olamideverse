"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeAudit } from "@/lib/admin/audit";
import {
    canEditContent,
    canManageTeam,
    canModerate,
    requireAdmin,
} from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { randomBytes } from "node:crypto";

async function assertEditor() {
    const session = await requireAdmin();
    if (!canEditContent(session.admin.role)) redirect("/admin?error=forbidden");
    return session;
}

async function assertModerator() {
    const session = await requireAdmin();
    if (!canModerate(session.admin.role)) redirect("/admin?error=forbidden");
    return session;
}

async function assertOwner() {
    const session = await requireAdmin();
    if (!canManageTeam(session.admin.role)) redirect("/admin?error=forbidden");
    return session;
}

export async function saveRedirect(formData: FormData) {
    const session = await assertEditor();
    const from_path = String(formData.get("from_path") ?? "").trim();
    const to_path = String(formData.get("to_path") ?? "").trim();
    const permanent = formData.get("permanent") === "on";
    const id = String(formData.get("id") ?? "").trim();
    const supabase = await createClient();

    if (id) {
        await supabase
            .from("cms_redirects")
            .update({
                from_path,
                to_path,
                permanent,
                updated_at: new Date().toISOString(),
                updated_by: session.userId,
            })
            .eq("id", id);
    } else {
        await supabase.from("cms_redirects").insert({
            from_path,
            to_path,
            permanent,
            updated_by: session.userId,
        });
    }
    await writeAudit({
        action: "update",
        entityType: "redirect",
        entityId: from_path,
        summary: `${from_path} → ${to_path}`,
    });
    revalidatePath("/admin/taxonomy");
    redirect("/admin/taxonomy?saved=1");
}

export async function deleteRedirect(formData: FormData) {
    await assertEditor();
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_redirects").delete().eq("id", id);
    redirect("/admin/taxonomy?saved=1");
}

export async function saveSeo(formData: FormData) {
    const session = await assertEditor();
    const path = String(formData.get("path") ?? "").trim();
    const supabase = await createClient();
    await supabase.from("cms_seo").upsert({
        path,
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        og_image: String(formData.get("og_image") ?? ""),
        noindex: formData.get("noindex") === "on",
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    await writeAudit({
        action: "update",
        entityType: "seo",
        entityId: path,
        summary: `SEO for ${path}`,
    });
    revalidatePath(path || "/");
    redirect(`/admin/seo?saved=1&path=${encodeURIComponent(path)}`);
}

export async function saveTakedown(formData: FormData) {
    const session = await assertModerator();
    const id = String(formData.get("id") ?? "").trim();
    const supabase = await createClient();
    const row = {
        requester: String(formData.get("requester") ?? ""),
        contact: String(formData.get("contact") ?? ""),
        target_type: String(formData.get("target_type") ?? "other"),
        target_ref: String(formData.get("target_ref") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        status: String(formData.get("status") ?? "open"),
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    };
    if (id) await supabase.from("legal_takedowns").update(row).eq("id", id);
    else await supabase.from("legal_takedowns").insert(row);
    redirect("/admin/legal/takedowns?saved=1");
}

export async function blockEmbed(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();
    await supabase.from("embed_blocks").upsert({
        provider: String(formData.get("provider") ?? "any"),
        embed_id: String(formData.get("embed_id") ?? "").trim(),
        reason: String(formData.get("reason") ?? ""),
        created_by: session.userId,
    });
    await writeAudit({
        action: "block",
        entityType: "embed",
        entityId: String(formData.get("embed_id") ?? ""),
        summary: "Embed kill-switch added",
    });
    revalidatePath("/");
    redirect("/admin/legal/embed-removals?saved=1");
}

export async function unblockEmbed(formData: FormData) {
    await assertEditor();
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("embed_blocks").delete().eq("id", id);
    redirect("/admin/legal/embed-removals?saved=1");
}

export async function resolveReport(formData: FormData) {
    const session = await assertModerator();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "resolved");
    const supabase = await createClient();
    await supabase
        .from("fan_reports")
        .update({
            status,
            resolved_at: new Date().toISOString(),
            resolved_by: session.userId,
        })
        .eq("id", id);
    redirect("/admin/fanzone/reports?saved=1");
}

export async function banFan(formData: FormData) {
    const session = await assertModerator();
    const id = String(formData.get("id") ?? "");
    const banned = formData.get("banned") === "on" || formData.get("banned") === "true";
    const ban_reason = banned ? String(formData.get("ban_reason") ?? "") : "";
    const supabase = await createClient();
    await supabase.from("fans").update({ banned, ban_reason }).eq("id", id);
    await writeAudit({
        action: banned ? "ban" : "unban",
        entityType: "fan",
        entityId: id,
        summary: ban_reason || (banned ? "Banned" : "Unbanned"),
    });
    redirect("/admin/fanzone/fans?saved=1");
}

export async function saveSlot(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();
    await supabase.from("media_slots").upsert({
        slot_id: String(formData.get("slot_id") ?? ""),
        path: String(formData.get("path") ?? ""),
        label: String(formData.get("label") ?? ""),
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    redirect("/admin/assets?tab=slots&saved=1");
}

export async function uploadAsset(formData: FormData) {
    const session = await assertEditor();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        redirect("/admin/assets?error=nofile");
    }
    const kind = String(formData.get("kind") ?? "other");
    const folder =
        kind === "album-cover" ? "albums" : kind === "era-photo" ? "eras" : kind === "home" ? "home" : "other";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
    const storagePath = `${folder}/${Date.now()}-${safeName}`;

    const supabase = await createClient();
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
        .from("site-media")
        .upload(storagePath, bytes, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
        });
    if (upErr) redirect(`/admin/assets?error=${encodeURIComponent(upErr.message)}`);

    const {
        data: { publicUrl },
    } = supabase.storage.from("site-media").getPublicUrl(storagePath);

    await supabase.from("media_assets").upsert(
        {
            path: publicUrl,
            kind,
            alt: String(formData.get("alt") ?? ""),
            credit: String(formData.get("credit") ?? ""),
            license: String(formData.get("license") ?? ""),
            license_url: String(formData.get("license_url") ?? ""),
            bytes: file.size,
            mime: file.type,
            updated_at: new Date().toISOString(),
            updated_by: session.userId,
        },
        { onConflict: "path" },
    );

    await writeAudit({
        action: "upload",
        entityType: "asset",
        entityId: publicUrl,
        summary: `Uploaded ${safeName}`,
    });
    redirect("/admin/assets?saved=1");
}

export async function updateAssetMeta(formData: FormData) {
    const session = await assertEditor();
    const path = String(formData.get("path") ?? "");
    const supabase = await createClient();
    await supabase
        .from("media_assets")
        .update({
            alt: String(formData.get("alt") ?? ""),
            credit: String(formData.get("credit") ?? ""),
            license: String(formData.get("license") ?? ""),
            license_url: String(formData.get("license_url") ?? ""),
            kind: String(formData.get("kind") ?? "other"),
            updated_at: new Date().toISOString(),
            updated_by: session.userId,
        })
        .eq("path", path);
    redirect("/admin/assets?saved=1");
}

export async function bulkPublish(formData: FormData) {
    const session = await assertEditor();
    const raw = String(formData.get("items") ?? "[]");
    const items = JSON.parse(raw) as Array<{ type: string; id: string }>;
    const supabase = await createClient();

    for (const item of items) {
        const table =
            item.type === "era"
                ? "cms_eras"
                : item.type === "album"
                    ? "cms_albums"
                    : item.type === "media"
                        ? "cms_media_items"
                        : "cms_pages";
        const key = item.type === "media" ? "id" : item.type === "page" ? "key" : "slug";
        await supabase
            .from(table)
            .update({
                status: "published",
                updated_at: new Date().toISOString(),
                updated_by: session.userId,
            })
            .eq(key, item.id);
    }

    await writeAudit({
        action: "publish",
        entityType: "bulk",
        entityId: String(items.length),
        summary: `Bulk published ${items.length} items`,
    });
    revalidatePath("/");
    redirect("/admin/publish?saved=1");
}

export async function schedulePublish(formData: FormData) {
    const session = await assertEditor();
    const supabase = await createClient();
    const rawWhen = String(formData.get("publish_at") ?? "");
    const publish_at = rawWhen ? new Date(rawWhen).toISOString() : new Date().toISOString();
    await supabase.from("cms_schedules").upsert({
        entity_type: String(formData.get("entity_type") ?? "album"),
        entity_id: String(formData.get("entity_id") ?? ""),
        publish_at,
        status: "scheduled",
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    redirect("/admin/schedule?saved=1");
}

export async function cancelSchedule(formData: FormData) {
    await assertEditor();
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_schedules").update({ status: "cancelled" }).eq("id", id);
    redirect("/admin/schedule?saved=1");
}

export async function createPreviewToken(formData: FormData) {
    const session = await assertEditor();
    const entity_type = String(formData.get("entity_type") ?? "");
    const entity_id = String(formData.get("entity_id") ?? "");
    const token = randomBytes(16).toString("hex");
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
    const supabase = await createClient();
    await supabase.from("preview_tokens").insert({
        token,
        entity_type,
        entity_id,
        expires_at,
        created_by: session.userId,
    });
    redirect(
        `/admin/preview/${entity_type}/${entity_id}?token=${token}&created=1`,
    );
}

export async function restoreVersion(formData: FormData) {
    const session = await assertEditor();
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    const { data: version } = await supabase
        .from("cms_versions")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (!version) redirect("/admin/versions?error=missing");

    const snap = version.snapshot as {
        data?: object;
        body?: string;
        status?: string;
        cover_path?: string | null;
        context_photo_path?: string | null;
    };
    const table =
        version.entity_type === "era"
            ? "cms_eras"
            : version.entity_type === "album"
                ? "cms_albums"
                : version.entity_type === "media"
                    ? "cms_media_items"
                    : "cms_pages";
    const key =
        version.entity_type === "media"
            ? "id"
            : version.entity_type === "page"
                ? "key"
                : "slug";

    await supabase
        .from(table)
        .update({
            data: snap.data ?? {},
            body: snap.body ?? "",
            status: snap.status ?? "draft",
            ...(version.entity_type === "album" ? { cover_path: snap.cover_path ?? null } : {}),
            ...(version.entity_type === "era"
                ? { context_photo_path: snap.context_photo_path ?? null }
                : {}),
            updated_at: new Date().toISOString(),
            updated_by: session.userId,
        })
        .eq(key, version.entity_id);

    await writeAudit({
        action: "restore",
        entityType: version.entity_type,
        entityId: version.entity_id,
        summary: `Restored version ${id.slice(0, 8)}`,
    });
    redirect(`/admin/versions?saved=1&entity=${version.entity_type}:${version.entity_id}`);
}

export async function exportBackup() {
    await assertOwner();
    // Handled by a route handler — this action just gates access.
    redirect("/admin/api/backup");
}

export async function setMaintenance(formData: FormData) {
    const session = await assertOwner();
    const on = formData.get("maintenance") === "on";
    const supabase = await createClient();
    const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "feature_flags")
        .maybeSingle();
    const value = {
        ...((data?.value as object) ?? {}),
        maintenance: on,
    };
    await supabase.from("site_settings").upsert({
        key: "feature_flags",
        value,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });
    await writeAudit({
        action: "maintenance",
        entityType: "settings",
        entityId: "feature_flags",
        summary: on ? "Maintenance ON" : "Maintenance OFF",
    });
    revalidatePath("/");
    redirect("/admin/danger?saved=1");
}

export async function wipeDrafts() {
    const session = await assertOwner();
    const service = createServiceClient();
    await Promise.all([
        service.from("cms_eras").delete().eq("status", "draft"),
        service.from("cms_albums").delete().eq("status", "draft"),
        service.from("cms_media_items").delete().eq("status", "draft"),
    ]);
    await writeAudit({
        action: "wipe",
        entityType: "drafts",
        entityId: "all",
        summary: `Drafts wiped by ${session.admin.email}`,
    });
    redirect("/admin/danger?saved=1");
}

export async function runDueSchedules() {
    const session = await assertEditor();
    const supabase = await createClient();
    const { data } = await supabase
        .from("cms_schedules")
        .select("*")
        .eq("status", "scheduled")
        .lte("publish_at", new Date().toISOString());

    for (const row of data ?? []) {
        const table =
            row.entity_type === "era"
                ? "cms_eras"
                : row.entity_type === "album"
                    ? "cms_albums"
                    : row.entity_type === "media"
                        ? "cms_media_items"
                        : "cms_pages";
        const key =
            row.entity_type === "media"
                ? "id"
                : row.entity_type === "page"
                    ? "key"
                    : "slug";
        await supabase
            .from(table)
            .update({
                status: "published",
                updated_at: new Date().toISOString(),
                updated_by: session.userId,
            })
            .eq(key, row.entity_id);
        await supabase
            .from("cms_schedules")
            .update({ status: "published", updated_at: new Date().toISOString() })
            .eq("id", row.id);
    }
    revalidatePath("/");
    redirect(`/admin/schedule?saved=1&ran=${data?.length ?? 0}`);
}
