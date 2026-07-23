"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function adminLogin(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        redirect("/admin/login?error=missing");
    }

    const supabase = await createClient();

    // Drop any Fan Zone session before elevating to staff.
    await supabase.auth.signOut();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        redirect("/admin/login?error=invalid");
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login?error=invalid");

    const { data: admin } = await supabase
        .from("admin_users")
        .select("disabled")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!admin || admin.disabled) {
        await supabase.auth.signOut();
        redirect("/admin/login?error=unauthorized");
    }

    redirect("/admin");
}

export async function adminLogout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
}
