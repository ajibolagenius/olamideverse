import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusBadge,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_media_items")
    .select("id, data, status, sort_order, updated_at")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Media gallery"
        description="Curated embeds — music videos, interviews, live, freestyles."
        actions={<AdminButton href="/admin/media/new">New item</AdminButton>}
      />

      {!data?.length ? (
        <EmptyState>
          No media items. Run <code className="text-ink">npm run seed:cms</code>.
        </EmptyState>
      ) : (
        <AdminTable headers={["Year", "Title", "Type", "Era", "YT", "Status", ""]}>
          {data.map((row) => {
            const d = row.data as {
              title?: string;
              year?: number;
              type?: string;
              era?: string;
              youtubeId?: string | null;
            };
            return (
              <tr key={row.id} className="hover:bg-paper">
                <td className="px-3 py-2">{d.year ?? "—"}</td>
                <td className="px-3 py-2 font-semibold">{d.title ?? row.id}</td>
                <td className="px-3 py-2">{d.type ?? "—"}</td>
                <td className="px-3 py-2 text-ink-soft">{d.era ?? "—"}</td>
                <td className="px-3 py-2">{d.youtubeId ? "✓" : "—"}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/media/${row.id}`}
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
