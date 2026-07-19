"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { writeAudit } from "@/lib/admin/audit";
import { canEditContent, canModerate, requireAdmin } from "@/lib/admin/auth";

export async function deleteComment(formData: FormData) {
    const session = await requireAdmin();
    if (!canModerate(session.admin.role)) redirect("/admin?error=forbidden");

    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("comments").delete().eq("id", id);
    await writeAudit({
        action: "delete",
        entityType: "comment",
        entityId: id,
        summary: "Moderated comment",
    });
    revalidatePath("/admin/fanzone/comments");
    redirect("/admin/fanzone/comments?saved=1");
}

export async function deleteFan(formData: FormData) {
    const session = await requireAdmin();
    if (session.admin.role !== "owner" && session.admin.role !== "moderator") {
        redirect("/admin?error=forbidden");
    }

    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    // Cascades favorites/comments/votes/playlist via FK
    await supabase.from("fans").delete().eq("id", id);
    await writeAudit({
        action: "delete",
        entityType: "fan",
        entityId: id,
        summary: "Removed fan account",
    });
    revalidatePath("/admin/fanzone/fans");
    redirect("/admin/fanzone/fans?saved=1");
}

export async function savePoll(formData: FormData) {
    const session = await requireAdmin();
    if (!canEditContent(session.admin.role)) redirect("/admin?error=forbidden");

    const id = String(formData.get("id") ?? "").trim();
    const question = String(formData.get("question") ?? "").trim();
    const options = JSON.parse(String(formData.get("options") ?? "[]")) as {
        id: string;
        label: string;
    }[];
    const base_votes = JSON.parse(String(formData.get("base_votes") ?? "{}")) as Record<
        string,
        number
    >;
    const active = formData.get("active") === "on";
    const sort_order = Number(formData.get("sort_order") ?? 0);

    const supabase = await createClient();
    await supabase.from("cms_polls").upsert({
        id,
        question,
        options,
        base_votes,
        active,
        sort_order,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
    });

    await writeAudit({
        action: "update",
        entityType: "poll",
        entityId: id,
        summary: `Saved poll “${question}”`,
    });

    revalidatePath("/fanzone");
    revalidatePath("/admin/fanzone/polls");
    redirect("/admin/fanzone/polls?saved=1");
}

export async function deletePoll(formData: FormData) {
    const session = await requireAdmin();
    if (!canEditContent(session.admin.role)) redirect("/admin?error=forbidden");
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    await supabase.from("cms_polls").delete().eq("id", id);
    await writeAudit({
        action: "delete",
        entityType: "poll",
        entityId: id,
        summary: `Deleted poll ${id}`,
    });
    revalidatePath("/fanzone");
    revalidatePath("/admin/fanzone/polls");
    redirect("/admin/fanzone/polls");
}
