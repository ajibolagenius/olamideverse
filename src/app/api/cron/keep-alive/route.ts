import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Vercel Cron target — pings Supabase on a schedule so the project doesn't
 * hit the free-tier 7-day inactivity pause. Vercel sends
 * `Authorization: Bearer $CRON_SECRET` automatically when the env var is set.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createPublicClient();
    const { error } = await supabase.from("site_settings").select("key").limit(1);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
}
