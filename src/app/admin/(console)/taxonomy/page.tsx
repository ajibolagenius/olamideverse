import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
} from "@/components/admin/ui";
import { deleteRedirect, saveRedirect } from "@/lib/admin/actions/ops";
import { getHealthReport } from "@/lib/admin/health";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTaxonomyPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const health = await getHealthReport();
  const { data: redirects } = await supabase
    .from("cms_redirects")
    .select("*")
    .order("from_path");

  const { data: eras } = await supabase
    .from("cms_eras")
    .select("slug, data, status")
    .order("slug");

  return (
    <>
      <AdminPageHeader
        title="Taxonomy"
        description="Era order integrity, album↔era checks, and slug redirects."
      />
      <Flash saved={flash.saved} />

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-ink bg-white p-4">
          <h2 className="mb-2 font-display text-lg uppercase">Integrity</h2>
          <ul className="space-y-2 text-sm">
            <li>
              Eras without published albums:{" "}
              <b>{health.erasWithoutAlbums.length}</b>
              {health.erasWithoutAlbums.length ? (
                <span className="ml-2 text-ink-soft">
                  ({health.erasWithoutAlbums.map((e) => e.slug).join(", ")})
                </span>
              ) : null}
            </li>
            <li>
              Published albums missing covers:{" "}
              <b>{health.missingCovers.length}</b>
            </li>
            <li>
              Media missing YouTube IDs: <b>{health.missingYoutube.length}</b>
            </li>
          </ul>
        </div>
        <div className="border-2 border-ink bg-white p-4">
          <h2 className="mb-2 font-display text-lg uppercase">Era order</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {(eras ?? [])
              .slice()
              .sort(
                (a, b) =>
                  Number((a.data as { order?: number }).order ?? 99) -
                  Number((b.data as { order?: number }).order ?? 99),
              )
              .map((e) => (
                <li key={e.slug}>
                  {(e.data as { title?: string }).title ?? e.slug}{" "}
                  <span className="text-ink-soft">({e.status})</span>
                </li>
              ))}
          </ol>
        </div>
      </section>

      <h2 className="mb-3 font-display text-xl uppercase">Redirects</h2>
      {!redirects?.length ? (
        <EmptyState>No redirects yet.</EmptyState>
      ) : (
        <AdminTable headers={["From", "To", "Type", ""]}>
          {redirects.map((r) => (
            <tr key={r.id} className="hover:bg-paper">
              <td className="px-3 py-2 font-mono text-xs">{r.from_path}</td>
              <td className="px-3 py-2 font-mono text-xs">{r.to_path}</td>
              <td className="px-3 py-2 text-xs">
                {r.permanent ? "308" : "307"}
              </td>
              <td className="px-3 py-2 text-right">
                <form action={deleteRedirect}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase text-oxide underline"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">Add redirect</h2>
      <form action={saveRedirect} className="space-y-4 border-2 border-ink bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From path" name="from_path" hint="/albums/old-slug" required />
          <Field label="To path" name="to_path" hint="/albums/new-slug" required />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="permanent" defaultChecked />
          Permanent (308)
        </label>
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Save redirect
        </button>
      </form>
    </>
  );
}
