import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { saveTakedown } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTakedownsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_takedowns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Takedowns"
        description="Incoming rights requests — track status and actioned targets."
      />
      <Flash saved={flash.saved} />

      {!data?.length ? (
        <EmptyState>No takedown requests logged.</EmptyState>
      ) : (
        <AdminTable headers={["When", "Requester", "Target", "Status", "Update"]}>
          {data.map((row) => (
            <tr key={row.id} className="align-top hover:bg-paper">
              <td className="px-3 py-2 text-xs text-ink-soft">
                {new Date(row.created_at).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-sm">
                <div className="font-semibold">{row.requester || "—"}</div>
                <div className="text-xs text-ink-soft">{row.contact}</div>
              </td>
              <td className="px-3 py-2 text-xs">
                {row.target_type}: {row.target_ref}
              </td>
              <td className="px-3 py-2 text-xs uppercase">{row.status}</td>
              <td className="px-3 py-2">
                <form action={saveTakedown} className="space-y-1">
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="requester" value={row.requester} />
                  <input type="hidden" name="contact" value={row.contact} />
                  <input type="hidden" name="target_type" value={row.target_type} />
                  <input type="hidden" name="target_ref" value={row.target_ref} />
                  <input type="hidden" name="notes" value={row.notes} />
                  <select
                    name="status"
                    defaultValue={row.status}
                    className="border border-ink px-1 py-0.5 text-xs"
                  >
                    <option value="open">open</option>
                    <option value="actioned">actioned</option>
                    <option value="rejected">rejected</option>
                    <option value="closed">closed</option>
                  </select>
                  <button
                    type="submit"
                    className="ml-2 text-[0.65rem] font-bold uppercase text-adire underline"
                  >
                    Save
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">Log request</h2>
      <form action={saveTakedown} className="space-y-3 border-2 border-ink bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Requester" name="requester" />
          <Field label="Contact" name="contact" />
          <SelectField
            label="Target type"
            name="target_type"
            defaultValue="embed"
            options={[
              { value: "embed", label: "Embed" },
              { value: "image", label: "Image" },
              { value: "page", label: "Page" },
              { value: "comment", label: "Comment" },
              { value: "other", label: "Other" },
            ]}
          />
          <Field label="Target ref" name="target_ref" hint="YouTube ID, path, comment id…" />
        </div>
        <Field label="Notes" name="notes" rows={3} />
        <input type="hidden" name="status" value="open" />
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Create
        </button>
      </form>
    </>
  );
}
