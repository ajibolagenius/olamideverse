import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS. Server-only. Used for bootstrap/seed
 * and ops that must run without an admin session.
 */
export function createServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
