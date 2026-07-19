import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Flash,
} from "@/components/admin/ui";
import { deleteComment } from "@/lib/admin/actions/fanzone";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, thread_id, body, created_at, fan_id, fans(handle)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <AdminPageHeader
        title="Comments"
        description="Moderate Fan Zone threads across eras, albums, and general."
      />
      <Flash saved={flash.saved} />

      {!data?.length ? (
        <EmptyState>No comments yet.</EmptyState>
      ) : (
        <AdminTable headers={["When", "Thread", "Fan", "Body", ""]}>
          {data.map((row) => {
            const fan = row.fans as unknown as { handle?: string } | null;
            return (
              <tr key={row.id} className="align-top hover:bg-paper">
                <td className="px-3 py-2 text-xs text-ink-soft">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2 font-mono text-xs">{row.thread_id}</td>
                <td className="px-3 py-2 text-sm">{fan?.handle ?? "—"}</td>
                <td className="max-w-md px-3 py-2 text-sm">{row.body}</td>
                <td className="px-3 py-2 text-right">
                  <form action={deleteComment}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      className="text-xs font-bold uppercase text-oxide underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </>
  );
}
