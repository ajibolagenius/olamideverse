import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { blockEmbed, unblockEmbed } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEmbedRemovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("embed_blocks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Embed kill-switch"
        description="Block Spotify/YouTube/Audiomack IDs instantly across the public site."
      />
      <Flash saved={flash.saved} />

      {!data?.length ? (
        <EmptyState>No blocked embeds.</EmptyState>
      ) : (
        <AdminTable headers={["Provider", "ID", "Reason", ""]}>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 text-xs uppercase">{row.provider}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.embed_id}</td>
              <td className="px-3 py-2 text-sm">{row.reason || "—"}</td>
              <td className="px-3 py-2 text-right">
                <form action={unblockEmbed}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase text-oxide underline"
                  >
                    Unblock
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">Block embed</h2>
      <form action={blockEmbed} className="space-y-3 border-2 border-ink bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Provider"
            name="provider"
            defaultValue="youtube"
            options={[
              { value: "youtube", label: "YouTube" },
              { value: "spotify", label: "Spotify" },
              { value: "audiomack", label: "Audiomack" },
              { value: "any", label: "Any" },
            ]}
          />
          <Field label="Embed ID" name="embed_id" required />
        </div>
        <Field label="Reason" name="reason" rows={2} />
        <button
          type="submit"
          className="border-2 border-ink bg-oxide px-4 py-2 text-xs font-bold uppercase text-paper"
        >
          Block now
        </button>
      </form>
    </>
  );
}
