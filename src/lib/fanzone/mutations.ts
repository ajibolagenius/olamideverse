"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Client-side mutations — one function per fanzone-store.js signature
 * (the design's own porting note: "replace each function ... with an API
 * call of the same signature"). All require a signed-in fan; callers
 * should gate on `useFan()` first and prompt for a handle if there isn't
 * one yet.
 */

async function requireFanId(): Promise<string> {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Pick a handle first.");

    const { data: fan } = await supabase
        .from("fans")
        .select("banned")
        .eq("id", user.id)
        .maybeSingle();
    if (fan?.banned) throw new Error("This handle has been suspended.");

    return user.id;
}

function mutationError(error: { message?: string; code?: string } | null, fallback: string): Error {
    if (!error) return new Error(fallback);
    if (error.code === "P0001" && error.message) return new Error(error.message);
    return new Error(error.message || fallback);
}

export async function toggleFavorite(
    id: string,
    label: string,
    kind: "era" | "album",
    href: string,
): Promise<boolean> {
    const supabase = createClient();
    const fanId = await requireFanId();

    const { data: existing, error: lookupError } = await supabase
        .from("favorites")
        .select("id")
        .eq("fan_id", fanId)
        .eq("target_id", id)
        .maybeSingle();
    if (lookupError) throw mutationError(lookupError, "Couldn't update favorite.");

    if (existing) {
        const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
        if (error) throw mutationError(error, "Couldn't remove favorite.");
        return false;
    }
    const { error } = await supabase
        .from("favorites")
        .insert({ fan_id: fanId, target_id: id, label, kind, href });
    if (error) throw mutationError(error, "Couldn't save favorite.");
    return true;
}

export async function removeFavorite(id: string): Promise<void> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("fan_id", fanId)
        .eq("target_id", id);
    if (error) throw mutationError(error, "Couldn't remove favorite.");
}

/** Cast or change a vote. Returns previous option id when changing. */
export async function votePoll(
    pollId: string,
    optionId: string,
): Promise<{ previousOptionId: string | null }> {
    const supabase = createClient();
    const fanId = await requireFanId();

    const { data: existing, error: lookupError } = await supabase
        .from("poll_votes")
        .select("id, option_id")
        .eq("fan_id", fanId)
        .eq("poll_id", pollId)
        .maybeSingle();
    if (lookupError) throw mutationError(lookupError, "Couldn't read vote.");

    if (existing) {
        if (existing.option_id === optionId) {
            return { previousOptionId: optionId };
        }
        const { error } = await supabase
            .from("poll_votes")
            .update({ option_id: optionId })
            .eq("id", existing.id);
        if (error) throw mutationError(error, "Couldn't change vote.");
        return { previousOptionId: existing.option_id };
    }

    const { error } = await supabase
        .from("poll_votes")
        .insert({ fan_id: fanId, poll_id: pollId, option_id: optionId });
    if (error) throw mutationError(error, "Couldn't cast vote.");
    return { previousOptionId: null };
}

export async function postComment(
    threadId: string,
    body: string,
): Promise<{ id: string; created_at: string }> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { data, error } = await supabase
        .from("comments")
        .insert({ thread_id: threadId, fan_id: fanId, body })
        .select("id, created_at")
        .single();
    if (error || !data) throw mutationError(error, "Couldn't post comment.");
    return data;
}

export async function deleteComment(id: string): Promise<void> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)
        .eq("fan_id", fanId);
    if (error) throw mutationError(error, "Couldn't delete comment.");
}

export async function reportComment(commentId: string, reason: string): Promise<void> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { error } = await supabase.from("fan_reports").insert({
        reporter_fan_id: fanId,
        target_type: "comment",
        target_id: commentId,
        reason: reason.trim() || "Reported from Fan Zone",
        status: "open",
    });
    if (error) throw mutationError(error, "Couldn't file report.");
}

export async function addToPlaylist(
    trackId: string,
    title: string,
    subtitle?: string,
): Promise<{ id: string }> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { count } = await supabase
        .from("playlist_items")
        .select("id", { count: "exact", head: true })
        .eq("fan_id", fanId);
    const { data, error } = await supabase
        .from("playlist_items")
        .insert({
            fan_id: fanId,
            track_id: trackId,
            title,
            subtitle,
            position: count ?? 0,
        })
        .select("id")
        .single();
    if (error || !data) throw mutationError(error, "Couldn't add to playlist.");
    return data;
}

export async function removeFromPlaylist(trackId: string): Promise<void> {
    const supabase = createClient();
    const fanId = await requireFanId();
    const { error } = await supabase
        .from("playlist_items")
        .delete()
        .eq("fan_id", fanId)
        .eq("track_id", trackId);
    if (error) throw mutationError(error, "Couldn't remove from playlist.");
}
