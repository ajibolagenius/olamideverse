import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import {
  cancelSchedule,
  runDueSchedules,
  schedulePublish,
} from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; ran?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_schedules")
    .select("*")
    .order("publish_at", { ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Schedule"
        description="Queue future publishes — especially useful for the open Legacy era."
        actions={
          <form action={runDueSchedules}>
            <button
              type="submit"
              className="border-2 border-ink bg-white px-3 py-2 text-[0.75rem] font-bold uppercase"
            >
              Run due now
            </button>
          </form>
        }
      />
      <Flash saved={flash.saved} />
      {flash.ran ? (
        <p className="mb-4 text-sm text-palm">Published {flash.ran} scheduled item(s).</p>
      ) : null}

      {!data?.length ? (
        <EmptyState>No schedules.</EmptyState>
      ) : (
        <AdminTable headers={["When", "Entity", "Status", ""]}>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs">
                {new Date(row.publish_at).toLocaleString()}
              </td>
              <td className="px-3 py-2 font-mono text-xs">
                {row.entity_type}:{row.entity_id}
              </td>
              <td className="px-3 py-2 text-xs uppercase">{row.status}</td>
              <td className="px-3 py-2 text-right">
                {row.status === "scheduled" ? (
                  <form action={cancelSchedule}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      className="text-xs font-bold uppercase text-oxide underline"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">Schedule publish</h2>
      <form action={schedulePublish} className="space-y-3 border-2 border-ink bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField
            label="Type"
            name="entity_type"
            defaultValue="album"
            options={[
              { value: "era", label: "Era" },
              { value: "album", label: "Album" },
              { value: "media", label: "Media" },
              { value: "page", label: "Page" },
            ]}
          />
          <Field label="Entity ID / slug" name="entity_id" required />
          <Field
            label="Publish at"
            name="publish_at"
            type="datetime-local"
            required
          />
        </div>
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Schedule
        </button>
      </form>
    </>
  );
}
