import Link from "next/link";
import { AdminPageHeader, AdminTable, EmptyState, StatusBadge } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPagesIndex() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_pages")
    .select("key, title, status, updated_at")
    .order("key");

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Home, About, Legal, and section intros editable as JSON documents."
      />
      {!data?.length ? (
        <EmptyState>
          No CMS pages yet. Seed with <code className="text-ink">npm run seed:cms</code>.
        </EmptyState>
      ) : (
        <AdminTable headers={["Key", "Title", "Status", "Updated", ""]}>
          {data.map((row) => (
            <tr key={row.key} className="hover:bg-paper">
              <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
              <td className="px-3 py-2 font-semibold">{row.title}</td>
              <td className="px-3 py-2">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.updated_at).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-right">
                <Link
                  href={`/admin/pages/${row.key}`}
                  className="text-xs font-bold uppercase tracking-wide text-adire underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
