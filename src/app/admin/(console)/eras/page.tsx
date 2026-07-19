import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusBadge,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminErasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_eras")
    .select("slug, data, status, updated_at")
    .order("updated_at", { ascending: false });

  const rows = (data ?? []).sort((a, b) => {
    const ao = Number((a.data as { order?: number }).order ?? 99);
    const bo = Number((b.data as { order?: number }).order ?? 99);
    return ao - bo;
  });

  return (
    <>
      <AdminPageHeader
        title="Eras"
        description="Career chapters — thesis, moments, accents, context photos."
        actions={<AdminButton href="/admin/eras/new">New era</AdminButton>}
      />

      {rows.length === 0 ? (
        <EmptyState>
          No eras in the CMS yet. Run <code className="text-ink">npm run seed:cms</code>{" "}
          to import from <code className="text-ink">content/eras</code>.
        </EmptyState>
      ) : (
        <AdminTable headers={["Order", "Title", "Years", "Status", "Updated", ""]}>
          {rows.map((row) => {
            const d = row.data as { title?: string; years?: string; order?: number };
            return (
              <tr key={row.slug} className="hover:bg-paper">
                <td className="px-3 py-2">{d.order ?? "—"}</td>
                <td className="px-3 py-2 font-semibold">{d.title ?? row.slug}</td>
                <td className="px-3 py-2 text-ink-soft">{d.years ?? "—"}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-xs text-ink-soft">
                  {new Date(row.updated_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/eras/${row.slug}`}
                    className="text-xs font-bold uppercase tracking-wide text-adire underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </>
  );
}
