"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isFanAuthEmail } from "@/lib/fanzone/auth";
import {
    checkRateLimit,
    clientIpFromHeaders,
    hashClientKey,
} from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

/**
 * Gate a login attempt before it reaches Supabase Auth. This is the
 * highest-privilege credential in the app (full CMS + team management), so
 * it gets its own per-IP and per-email caps rather than relying solely on
 * whatever throttling the Supabase project has configured.
 */
async function checkAdminLoginRateLimit(
    email: string,
): Promise<{ ok: true } | { ok: false }> {
    const headerStore = await headers();
    const ipKey = hashClientKey(clientIpFromHeaders(headerStore), "admin-login-ip");
    const emailKey = hashClientKey(email, "admin-login-email");

    const allowedByIp = await checkRateLimit(`admin:login:ip:${ipKey}`, 20, 300);
    const allowedByEmail = await checkRateLimit(`admin:login:email:${emailKey}`, 8, 300);

    return allowedByIp && allowedByEmail ? { ok: true } : { ok: false };
}

export async function adminLogin(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        redirect("/admin/login?error=missing");
    }

    // Fan Zone synthetic mailboxes must never elevate to the console.
    if (isFanAuthEmail(email)) {
        redirect("/admin/login?error=unauthorized");
    }

    const rateLimit = await checkAdminLoginRateLimit(email);
    if (!rateLimit.ok) {
        redirect("/admin/login?error=ratelimited");
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
