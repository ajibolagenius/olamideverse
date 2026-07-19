/**
 * Poll definitions — prefer active rows from cms_polls (admin-editable),
 * fall back to the static seed list shipped with the app.
 */
import { createPublicClient } from "@/lib/supabase/public";

export type PollDef = {
    id: string;
    question: string;
    options: { id: string; label: string }[];
    base: Record<string, number>;
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
    },
];

export async function getPollDefs(): Promise<PollDef[]> {
    try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from("cms_polls")
            .select("id, question, options, base_votes, active, sort_order")
            .eq("active", true)
            .order("sort_order", { ascending: true });
        if (error || !data?.length) return POLL_DEFS;
        return data.map((row) => ({
            id: row.id,
            question: row.question,
            options: row.options as PollDef["options"],
            base: (row.base_votes ?? {}) as Record<string, number>,
        }));
    } catch {
        return POLL_DEFS;
    }
}
