import { NextResponse } from "next/server";
import { getAdminSession, canManageTeam } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const session = await getAdminSession();
    if (!session || !canManageTeam(session.admin.role)) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const supabase = await createClient();
    const tables = [
        "cms_eras",
        "cms_albums",
        "cms_media_items",
        "cms_pages",
        "site_settings",
        "cms_seo",
        "cms_redirects",
        "cms_polls",
        "media_assets",
        "media_slots",
        "embed_blocks",
        "legal_takedowns",
    ] as const;

    const payload: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        exportedBy: session.admin.email,
    };

    for (const table of tables) {
        const { data } = await supabase.from(table).select("*");
        payload[table] = data ?? [];
    }

    const body = JSON.stringify(payload, null, 2);
    return new NextResponse(body, {
        headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="olamideverse-cms-${Date.now()}.json"`,
        },
    });
}
