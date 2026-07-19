import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole, AdminUser } from "./types";

export async function getAdminSession(): Promise<{
    userId: string;
    admin: AdminUser;
} | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("admin_users")
        .select("user_id, email, display_name, role, disabled, created_at")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!data || data.disabled) return null;
    return { userId: user.id, admin: data as AdminUser };
}

export async function requireAdmin(roles?: AdminRole[]) {
    const session = await getAdminSession();
    if (!session) redirect("/admin/login");
    if (roles && !roles.includes(session.admin.role)) {
        redirect("/admin?error=forbidden");
    }
    return session;
}

export function canEditContent(role: AdminRole) {
    return role === "owner" || role === "editor";
}

export function canModerate(role: AdminRole) {
    return role === "owner" || role === "editor" || role === "moderator";
}

export function canManageTeam(role: AdminRole) {
    return role === "owner";
}
