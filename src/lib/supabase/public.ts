import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon client for public CMS reads (build-time
 * generateStaticParams + Server Components that don't need a session).
 */
export function createPublicClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
