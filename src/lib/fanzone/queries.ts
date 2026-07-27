import { createClient } from "@/lib/supabase/server";

/**
 * Server-side reads for initial (SSR) render. Mutations happen from the
 * browser client inside the interactive components themselves — matching
 * the design's instant, same-page reactivity (the original fanzone-store.js
 * CustomEvent bus) more closely than a Server Action round-trip would.
 */

export async function getCurrentFan(): Promise<{ id: string; handle: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("fans")
    .select("id, handle")
    .eq("id", user.id)
    .maybeSingle();
  return data;
}

export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("favorites").select("target_id").eq("fan_id", user.id);
  return new Set((data ?? []).map((f) => f.target_id));
}

export type FavoriteRow = {
  id: string;
  target_id: string;
  label: string;
  kind: "era" | "album";
  href: string;
};

export async function getFavorites(): Promise<FavoriteRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("favorites")
    .select("id, target_id, label, kind, href")
    .eq("fan_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPollResults(
  pollId: string,
): Promise<{ counts: Record<string, number>; total: number; userVote: string | null }> {
  const supabase = await createClient();
  const [{ data: results, error: resultsError }, { data: userData }] = await Promise.all([
    // Prefer the security-definer RPC; fall back to the view for older DBs.
    supabase.rpc("get_poll_results", { p_poll_id: pollId }),
    supabase.auth.getUser(),
  ]);

  let rows = results ?? [];
  if (resultsError) {
    const { data: viewRows } = await supabase
      .from("poll_results")
      .select("option_id, votes")
      .eq("poll_id", pollId);
    rows = (viewRows ?? []).map((r) => ({
      poll_id: pollId,
      option_id: r.option_id,
      votes: r.votes,
    }));
  }

  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    counts[row.option_id] = row.votes;
    total += row.votes;
  }

  let userVote: string | null = null;
  if (userData.user) {
    const { data: vote } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("poll_id", pollId)
      .eq("fan_id", userData.user.id)
      .maybeSingle();
    userVote = vote?.option_id ?? null;
  }

  return { counts, total, userVote };
}

export type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  fan_id: string;
  parent_id: string | null;
  fan: { handle: string } | null;
  replies: CommentRow[];
};

export async function getComments(threadId: string): Promise<CommentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, body, created_at, fan_id, parent_id, fan:fans(handle)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  const rows = (data ?? []) as unknown as Omit<CommentRow, "replies">[];

  const byId = new Map<string, CommentRow>();
  for (const row of rows) byId.set(row.id, { ...row, replies: [] });

  const topLevel: CommentRow[] = [];
  for (const row of rows) {
    const comment = byId.get(row.id)!;
    const parent = row.parent_id ? byId.get(row.parent_id) : undefined;
    if (parent) parent.replies.push(comment);
    else topLevel.push(comment);
  }

  return topLevel.reverse();
}

export type PlaylistRow = {
  id: string;
  track_id: string;
  title: string;
  subtitle: string | null;
};

export async function getPlaylist(): Promise<PlaylistRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("playlist_items")
    .select("id, track_id, title, subtitle")
    .eq("fan_id", user.id)
    .order("position", { ascending: true });
  return data ?? [];
}
