"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { writeAudit } from "@/lib/admin/audit";
import { canManageTeam, requireAdmin } from "@/lib/admin/auth";
import type { AdminRole } from "@/lib/admin/types";

export async function inviteAdmin(formData: FormData) {
    const session = await requireAdmin();
    if (!canManageTeam(session.admin.role)) redirect("/admin?error=forbidden");

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const role = String(formData.get("role") ?? "editor") as AdminRole;
    const display_name = String(formData.get("display_name") ?? "").trim() || null;

    if (!email || password.length < 8) {
        redirect("/admin/team?error=invalid");
    }

    const service = createServiceClient();
    const { data: created, error } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (error || !created.user) {
        redirect(`/admin/team?error=${encodeURIComponent(error?.message ?? "create")}`);
    }

    const { error: rowError } = await service.from("admin_users").insert({
        user_id: created.user.id,
        email,
        display_name,
        role,
        created_by: session.userId,
    });
    if (rowError) {
        redirect(`/admin/team?error=${encodeURIComponent(rowError.message)}`);
    }

    await writeAudit({
        action: "create",
        entityType: "admin_user",
        entityId: created.user.id,
        summary: `Invited ${email} as ${role}`,
    });

    revalidatePath("/admin/team");
    redirect("/admin/team?saved=1");
}

export async function updateAdminRole(formData: FormData) {
    const session = await requireAdmin();
    if (!canManageTeam(session.admin.role)) redirect("/admin?error=forbidden");

    const user_id = String(formData.get("user_id") ?? "");
    const role = String(formData.get("role") ?? "editor") as AdminRole;
    const disabled = formData.get("disabled") === "on";

    if (user_id === session.userId && disabled) {
        redirect("/admin/team?error=self");
    }

    const supabase = await createClient();
    await supabase
        .from("admin_users")
        .update({ role, disabled })
        .eq("user_id", user_id);

    await writeAudit({
        action: "update",
        entityType: "admin_user",
        entityId: user_id,
        summary: `Set role=${role} disabled=${disabled}`,
    });

    revalidatePath("/admin/team");
    redirect("/admin/team?saved=1");
}
