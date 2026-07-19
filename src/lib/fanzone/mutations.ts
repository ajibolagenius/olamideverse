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
  return user.id;
}

export async function toggleFavorite(
  id: string,
  label: string,
  kind: "era" | "album",
  href: string,
): Promise<boolean> {
  const supabase = createClient();
  const fanId = await requireFanId();

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("fan_id", fanId)
    .eq("target_id", id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  }
  await supabase
    .from("favorites")
    .insert({ fan_id: fanId, target_id: id, label, kind, href });
  return true;
}

export async function removeFavorite(id: string): Promise<void> {
  const supabase = createClient();
  const fanId = await requireFanId();
  await supabase.from("favorites").delete().eq("fan_id", fanId).eq("target_id", id);
}

export async function votePoll(pollId: string, optionId: string): Promise<void> {
  const supabase = createClient();
  const fanId = await requireFanId();
  const { error } = await supabase
    .from("poll_votes")
    .insert({ fan_id: fanId, poll_id: pollId, option_id: optionId });
  if (error && error.code !== "23505") throw error; // 23505 = already voted, ignore
}

export async function postComment(threadId: string, body: string): Promise<void> {
  const supabase = createClient();
  const fanId = await requireFanId();
  const { error } = await supabase
    .from("comments")
    .insert({ thread_id: threadId, fan_id: fanId, body });
  if (error) throw error;
}

export async function deleteComment(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("comments").delete().eq("id", id);
}

export async function addToPlaylist(
  trackId: string,
  title: string,
  subtitle?: string,
): Promise<void> {
  const supabase = createClient();
  const fanId = await requireFanId();
  const { count } = await supabase
    .from("playlist_items")
    .select("id", { count: "exact", head: true })
    .eq("fan_id", fanId);
  await supabase
    .from("playlist_items")
    .insert({ fan_id: fanId, track_id: trackId, title, subtitle, position: count ?? 0 });
}

export async function removeFromPlaylist(trackId: string): Promise<void> {
  const supabase = createClient();
  const fanId = await requireFanId();
  await supabase.from("playlist_items").delete().eq("fan_id", fanId).eq("track_id", trackId);
}
