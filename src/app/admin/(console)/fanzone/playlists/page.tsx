import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPlaylistsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("playlist_items")
    .select("fan_id, track_id, title, subtitle, fans(handle)")
    .order("created_at", { ascending: false })
    .limit(300);

  type Track = { title: string; subtitle: string | null };
  const byFan = new Map<string, { handle: string; tracks: Track[] }>();
  for (const row of data ?? []) {
    const fan = row.fans as unknown as { handle?: string } | null;
    const handle = fan?.handle ?? row.fan_id.slice(0, 8);
    const cur = byFan.get(row.fan_id) ?? { handle, tracks: [] as Track[] };
    cur.tracks.push({ title: row.title, subtitle: row.subtitle });
    byFan.set(row.fan_id, cur);
  }

  const rows = [...byFan.entries()].map(([id, v]) => ({
    id,
    handle: v.handle,
    count: v.tracks.length,
    sample: v.tracks
      .slice(0, 3)
      .map((t) => t.title)
      .join(", "),
  }));

  return (
    <>
      <AdminPageHeader
        title="Playlists"
        description="Community playlist inventory for moderation / takedown awareness."
      />
      {!rows.length ? (
        <EmptyState>No playlist items yet.</EmptyState>
      ) : (
        <AdminTable headers={["Fan", "Tracks", "Sample"]}>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 font-semibold">{row.handle}</td>
              <td className="px-3 py-2">{row.count}</td>
              <td className="px-3 py-2 text-xs text-ink-soft">{row.sample}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
