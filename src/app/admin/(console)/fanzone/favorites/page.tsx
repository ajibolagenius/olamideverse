import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFavoritesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("target_id, kind, label");

  const counts = new Map<string, { kind: string; label: string; count: number }>();
  for (const row of data ?? []) {
    const cur = counts.get(row.target_id) ?? {
      kind: row.kind,
      label: row.label,
      count: 0,
    };
    cur.count += 1;
    counts.set(row.target_id, cur);
  }
  const rows = [...counts.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <AdminPageHeader
        title="Favorites"
        description="Privacy-safe aggregates only — no per-fan favorite lists exposed."
      />
      {!rows.length ? (
        <EmptyState>No favorites yet.</EmptyState>
      ) : (
        <AdminTable headers={["Target", "Kind", "Label", "Count"]}>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-3 py-2 text-xs uppercase">{row.kind}</td>
              <td className="px-3 py-2 text-sm">{row.label}</td>
              <td className="px-3 py-2 font-semibold">{row.count}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
