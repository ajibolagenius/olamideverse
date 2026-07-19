import { AdminPageHeader, AdminTable, EmptyState, StatusBadge } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminActivityPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <AdminPageHeader
        title="Activity"
        description="Audit trail of staff actions in the admin console."
      />
      {!data?.length ? (
        <EmptyState>No activity logged yet.</EmptyState>
      ) : (
        <AdminTable headers={["When", "Action", "Entity", "Summary"]}>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={row.action} />
              </td>
              <td className="px-3 py-2 font-mono text-xs">
                {row.entity_type}:{row.entity_id}
              </td>
              <td className="px-3 py-2 text-sm">{row.summary}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
