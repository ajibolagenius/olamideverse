import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusBadge,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAlbumsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_albums")
    .select("slug, data, status, updated_at")
    .order("updated_at", { ascending: false });

  const rows = (data ?? []).sort((a, b) => {
    const ay = Number((a.data as { year?: number }).year ?? 0);
    const by = Number((b.data as { year?: number }).year ?? 0);
    return by - ay;
  });

  return (
    <>
      <AdminPageHeader
        title="Albums"
        description="Discography — covers, tracklists, embeds, stories."
        actions={<AdminButton href="/admin/albums/new">New album</AdminButton>}
      />

      {rows.length === 0 ? (
        <EmptyState>
          No albums in the CMS. Run <code className="text-ink">npm run seed:cms</code>.
        </EmptyState>
      ) : (
        <AdminTable headers={["Year", "Title", "Era", "Type", "Status", ""]}>
          {rows.map((row) => {
            const d = row.data as {
              title?: string;
              year?: number;
              era?: string;
              type?: string;
            };
            return (
              <tr key={row.slug} className="hover:bg-paper">
                <td className="px-3 py-2">{d.year ?? "—"}</td>
                <td className="px-3 py-2 font-semibold">{d.title ?? row.slug}</td>
                <td className="px-3 py-2 text-ink-soft">{d.era ?? "—"}</td>
                <td className="px-3 py-2">{d.type ?? "—"}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/albums/${row.slug}`}
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
