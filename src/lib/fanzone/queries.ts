import { createClient } from "@/lib/supabase/server";

/**
 * Server-side reads for initial (SSR) render. Mutations happen from the
 * browser client inside the interactive components themselves — matching
 * the design's instant, same-page reactivity (the original fanzone-store.js
 * CustomEvent bus) more closely than a Server Action round-trip would.
 */

export type CurrentFan = {
  id: string;
  handle: string;
  currentStreak: number;
  longestStreak: number;
};

export async function getCurrentFan(): Promise<CurrentFan | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("fans")
    .select("id, handle, current_streak, longest_streak")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    handle: data.handle,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
  };
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
    .select("id, body, created_at, fan_id, parent_id")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  const rawRows = data ?? [];

  // Handles are public for every commenter regardless of their public_profile
  // opt-in, but `fans` itself is no longer directly readable cross-fan — go
  // through the comment_authors() security-definer function instead.
  const fanIds = Array.from(new Set(rawRows.map((r) => r.fan_id)));
  const handleById = new Map<string, string>();
  if (fanIds.length) {
    const { data: authors } = await supabase.rpc("comment_authors", { fan_ids: fanIds });
    for (const author of authors ?? []) handleById.set(author.id, author.handle);
  }

  const rows: Omit<CommentRow, "replies">[] = rawRows.map((row) => ({
    ...row,
    fan: handleById.has(row.fan_id) ? { handle: handleById.get(row.fan_id)! } : null,
  }));

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

/**
 * Public browse — every read here relies on the "public favorites/playlists
 * are visible" RLS policies (only rows for fans with public_profile = true
 * and banned = false ever come back), so no extra filtering is needed here.
 * The fan identity itself comes from public_fan_profiles(), a
 * security-definer function that applies the same public_profile/banned
 * filter internally — `fans` is no longer directly readable cross-fan.
 */

export type PublicFan = { handle: string; createdAt: string };

type PublicFanProfileRow = {
  id: string;
  handle: string;
  created_at: string;
  longest_streak: number;
};

export async function getPublicFans(): Promise<PublicFan[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .rpc("public_fan_profiles")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as PublicFanProfileRow[];
  return rows.map((f) => ({ handle: f.handle, createdAt: f.created_at }));
}

export async function getFanByHandle(
  handle: string,
): Promise<{ id: string; handle: string } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .rpc("public_fan_profiles")
    .eq("handle", handle)
    .maybeSingle();
  const row = data as PublicFanProfileRow | null;
  return row ? { id: row.id, handle: row.handle } : null;
}

export async function getPublicFavorites(fanId: string): Promise<FavoriteRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id, target_id, label, kind, href")
    .eq("fan_id", fanId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPublicPlaylist(fanId: string): Promise<PlaylistRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("playlist_items")
    .select("id, track_id, title, subtitle")
    .eq("fan_id", fanId)
    .order("position", { ascending: true });
  return data ?? [];
}

/**
 * Stats behind the "stamps" (badges) board. favorites/playlist counts rely
 * on the same RLS as getPublicFavorites/getPublicPlaylist — for a fan who
 * hasn't opted into a public profile, counting only works from that fan's
 * own signed-in session (RLS returns 0 for a private fan's rows to anyone
 * else, which is the right behavior here too).
 */
export type FanStats = {
  favoritesCount: number;
  playlistCount: number;
  commentsCount: number;
  publicProfile: boolean;
  longestStreak: number;
};

export async function getFanStats(fanId: string): Promise<FanStats> {
  const supabase = await createClient();
  const [{ count: favoritesCount }, { count: playlistCount }, { count: commentsCount }, { data: ownRow }] =
    await Promise.all([
      supabase.from("favorites").select("id", { count: "exact", head: true }).eq("fan_id", fanId),
      supabase
        .from("playlist_items")
        .select("id", { count: "exact", head: true })
        .eq("fan_id", fanId),
      supabase.from("comments").select("id", { count: "exact", head: true }).eq("fan_id", fanId),
      // Works when `fanId` is the signed-in caller (or an admin) — `fans`
      // RLS otherwise hides other fans' rows here entirely.
      supabase.from("fans").select("public_profile, longest_streak").eq("id", fanId).maybeSingle(),
    ]);

  let publicProfile = ownRow?.public_profile ?? null;
  let longestStreak = ownRow?.longest_streak ?? null;

  if (publicProfile === null) {
    // Not our own row and not an admin — fall back to the security-definer
    // function, which only ever returns opted-in, unbanned fans.
    const { data: publicRow } = await supabase
      .rpc("public_fan_profiles")
      .eq("id", fanId)
      .maybeSingle();
    const row = publicRow as PublicFanProfileRow | null;
    publicProfile = Boolean(row);
    longestStreak = row?.longest_streak ?? 0;
  }

  return {
    favoritesCount: favoritesCount ?? 0,
    playlistCount: playlistCount ?? 0,
    commentsCount: commentsCount ?? 0,
    publicProfile: publicProfile ?? false,
    longestStreak: longestStreak ?? 0,
  };
}
