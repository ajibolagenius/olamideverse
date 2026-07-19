import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Flash,
} from "@/components/admin/ui";
import { banFan } from "@/lib/admin/actions/ops";
import { deleteFan } from "@/lib/admin/actions/fanzone";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFansPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("fans")
    .select("id, handle, created_at, banned, ban_reason")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      <AdminPageHeader
        title="Fans"
        description="Anonymous Fan Zone identities. Ban mutes participation; delete cascades owned rows."
      />
      <Flash saved={flash.saved} />

      {!data?.length ? (
        <EmptyState>No fans signed in yet.</EmptyState>
      ) : (
        <AdminTable headers={["Handle", "Joined", "Status", "Actions"]}>
          {data.map((row) => (
            <tr key={row.id} className="align-top hover:bg-paper">
              <td className="px-3 py-2 font-semibold">
                {row.handle}
                <div className="font-mono text-[0.65rem] text-ink-soft">
                  {row.id.slice(0, 8)}…
                </div>
              </td>
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-xs">
                {row.banned ? (
                  <span className="text-oxide">
                    Banned{row.ban_reason ? ` — ${row.ban_reason}` : ""}
                  </span>
                ) : (
                  "Active"
                )}
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-3">
                  <form action={banFan} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={row.id} />
                    <input
                      type="hidden"
                      name="banned"
                      value={row.banned ? "false" : "true"}
                    />
                    <input
                      name="ban_reason"
                      placeholder="Reason"
                      defaultValue={row.ban_reason ?? ""}
                      className="border border-ink px-1 py-0.5 text-[0.65rem]"
                    />
                    <button
                      type="submit"
                      className="text-[0.65rem] font-bold uppercase text-oxide underline"
                    >
                      {row.banned ? "Unban" : "Ban"}
                    </button>
                  </form>
                  <form action={deleteFan}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      className="text-[0.65rem] font-bold uppercase text-ink-soft underline"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
