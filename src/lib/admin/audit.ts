import { createClient } from "@/lib/supabase/server";

export async function writeAudit(input: {
    action: string;
    entityType: string;
    entityId: string;
    summary?: string;
    meta?: Record<string, unknown>;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("admin_audit_log").insert({
        actor_id: user?.id ?? null,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        summary: input.summary ?? "",
        meta: input.meta ?? {},
    });
}
