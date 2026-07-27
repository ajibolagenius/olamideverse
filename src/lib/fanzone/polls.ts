/**
 * Poll definitions — prefer active rows from cms_polls (admin-editable),
 * fall back to the static seed list shipped with the app.
 */
import { createPublicClient } from "@/lib/supabase/public";

export type PollScope = { type: "era" | "album"; slug: string };

export type PollDef = {
    id: string;
    question: string;
    options: { id: string; label: string }[];
    base: Record<string, number>;
    /** When set, this poll's results are also surfaced permanently on that era/album page. */
    scope?: PollScope;
};

export const POLL_DEFS: PollDef[] = [
    {
        id: "poll-elder-statesman",
        question: "Elder Statesman highlight?",
        options: [
            { id: "uy-scuti", label: "UY Scuti (2021)" },
            { id: "unruly", label: "Unruly (2023)" },
        ],
        base: { "uy-scuti": 166, unruly: 195 },
        scope: { type: "era", slug: "elder-statesman" },
    },
];

export async function getPollDefs(): Promise<PollDef[]> {
    try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from("cms_polls")
            .select(
                "id, question, options, base_votes, active, sort_order, scope_type, scope_slug",
            )
            .eq("active", true)
            .order("sort_order", { ascending: true });
        if (error || !data?.length) return POLL_DEFS;
        return data.map((row) => ({
            id: row.id,
            question: row.question,
            options: row.options as PollDef["options"],
            base: (row.base_votes ?? {}) as Record<string, number>,
            scope:
                row.scope_type && row.scope_slug
                    ? { type: row.scope_type as PollScope["type"], slug: row.scope_slug }
                    : undefined,
        }));
    } catch {
        return POLL_DEFS;
    }
}

/** Polls tied to a specific era/album page, for permanent display there. */
export function pollsForScope(
    defs: PollDef[],
    type: PollScope["type"],
    slug: string,
): PollDef[] {
    return defs.filter((p) => p.scope?.type === type && p.scope.slug === slug);
}
