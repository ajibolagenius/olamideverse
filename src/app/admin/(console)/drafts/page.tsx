import Link from "next/link";
import { AdminPageHeader, AdminTable, EmptyState, StatusBadge } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDraftsPage() {
  const supabase = await createClient();
  const [eras, albums, media] = await Promise.all([
    supabase.from("cms_eras").select("slug, data, status, updated_at").eq("status", "draft"),
    supabase.from("cms_albums").select("slug, data, status, updated_at").eq("status", "draft"),
    supabase.from("cms_media_items").select("id, data, status, updated_at").eq("status", "draft"),
  ]);

  const rows = [
    ...(eras.data ?? []).map((r) => ({
      kind: "era",
      id: r.slug,
      title: String((r.data as { title?: string }).title ?? r.slug),
      href: `/admin/eras/${r.slug}`,
      updated_at: r.updated_at,
    })),
    ...(albums.data ?? []).map((r) => ({
      kind: "album",
      id: r.slug,
      title: String((r.data as { title?: string }).title ?? r.slug),
      href: `/admin/albums/${r.slug}`,
      updated_at: r.updated_at,
    })),
    ...(media.data ?? []).map((r) => ({
      kind: "media",
      id: r.id,
      title: String((r.data as { title?: string }).title ?? r.id),
      href: `/admin/media/${r.id}`,
      updated_at: r.updated_at,
    })),
  ].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));

  return (
    <>
      <AdminPageHeader
        title="Drafts"
        description="Everything unpublished across eras, albums, and media."
      />
      {!rows.length ? (
        <EmptyState>No drafts — all CMS content is published or archived.</EmptyState>
      ) : (
        <AdminTable headers={["Kind", "Title", "Status", "Updated", ""]}>
          {rows.map((row) => (
            <tr key={`${row.kind}-${row.id}`} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs uppercase">{row.kind}</td>
              <td className="px-3 py-2 font-semibold">{row.title}</td>
              <td className="px-3 py-2">
                <StatusBadge status="draft" />
              </td>
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.updated_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={row.href} className="text-xs font-bold uppercase text-adire underline">
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
