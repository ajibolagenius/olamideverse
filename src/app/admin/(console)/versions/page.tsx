import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Flash,
} from "@/components/admin/ui";
import { restoreVersion } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminVersionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; entity?: string; error?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_versions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <AdminPageHeader
        title="Versions"
        description="Revision history from CMS saves — restore any snapshot."
      />
      <Flash saved={flash.saved} error={flash.error} />
      {flash.entity ? (
        <p className="mb-4 text-sm text-palm">Restored {flash.entity}</p>
      ) : null}

      {!data?.length ? (
        <EmptyState>No versions yet. Edit an era/album/media item to create snapshots.</EmptyState>
      ) : (
        <AdminTable headers={["When", "Entity", "Summary", ""]}>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 font-mono text-xs">
                {row.entity_type}:{row.entity_id}
              </td>
              <td className="px-3 py-2 text-sm">{row.summary}</td>
              <td className="px-3 py-2 text-right">
                <form action={restoreVersion}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase text-adire underline"
                  >
                    Restore
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
