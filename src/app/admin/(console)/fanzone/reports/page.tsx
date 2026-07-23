import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Flash,
} from "@/components/admin/ui";
import { resolveReport } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("fan_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <AdminPageHeader
        title="Reports"
        description="Abuse queue for comments, fans, and playlists."
      />
      <Flash saved={flash.saved} />

      {!data?.length ? (
        <EmptyState>
          No reports yet. Fans can flag comments from any Comment thread on albums,
          eras, or the Fan Zone hub.
        </EmptyState>
      ) : (
        <AdminTable headers={["When", "Type", "Target", "Reason", "Status", ""]}>
          {data.map((row) => (
            <tr key={row.id} className="align-top hover:bg-paper">
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-xs uppercase">{row.target_type}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.target_id}</td>
              <td className="max-w-xs px-3 py-2 text-sm">{row.reason}</td>
              <td className="px-3 py-2 text-xs uppercase">{row.status}</td>
              <td className="px-3 py-2">
                {row.status === "open" ? (
                  <div className="flex gap-2">
                    <form action={resolveReport}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="resolved" />
                      <button
                        type="submit"
                        className="text-[0.65rem] font-bold uppercase text-palm underline"
                      >
                        Resolve
                      </button>
                    </form>
                    <form action={resolveReport}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button
                        type="submit"
                        className="text-[0.65rem] font-bold uppercase text-ink-soft underline"
                      >
                        Dismiss
                      </button>
                    </form>
                  </div>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
