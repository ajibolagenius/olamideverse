import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
} from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";

export default async function AdminImageRightsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("path, kind, credit, license, license_url, alt")
    .order("kind");

  return (
    <>
      <AdminPageHeader
        title="Image rights"
        description="Per-asset license registry — covers vs CC photos. Edit credits on Assets."
      />
      {!data?.length ? (
        <EmptyState>No assets in the registry. Seed or upload first.</EmptyState>
      ) : (
        <AdminTable headers={["Kind", "Path", "Credit", "License", "Alt"]}>
          {data.map((row) => (
            <tr key={row.path} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs uppercase">{row.kind}</td>
              <td className="max-w-[220px] truncate px-3 py-2 font-mono text-[0.65rem]">
                {row.path}
              </td>
              <td className="px-3 py-2 text-xs">{row.credit || "—"}</td>
              <td className="px-3 py-2 text-xs">
                {row.license_url ? (
                  <a href={row.license_url} className="text-adire underline">
                    {row.license || "link"}
                  </a>
                ) : (
                  row.license || "—"
                )}
              </td>
              <td className="px-3 py-2 text-xs text-ink-soft">
                {row.alt || "missing"}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
