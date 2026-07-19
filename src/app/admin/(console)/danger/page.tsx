import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { setMaintenance, wipeDrafts } from "@/lib/admin/actions/ops";
import { getFeatureFlags } from "@/lib/settings";

export default async function AdminDangerPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const flags = await getFeatureFlags();

  return (
    <>
      <AdminPageHeader
        title="Danger zone"
        description="Irreversible or site-wide ops. Owner only."
      />
      <Flash saved={flash.saved} />

      <div className="space-y-6">
        <form
          action={setMaintenance}
          className="border-2 border-ink bg-white p-4"
        >
          <h2 className="font-display text-lg uppercase">Maintenance mode</h2>
          <p className="mt-1 mb-3 text-sm text-ink-soft">
            Replaces the public site with a maintenance screen. Admin stays
            reachable.
          </p>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="maintenance"
              defaultChecked={flags.maintenance}
            />
            Enable maintenance mode
          </label>
          <button
            type="submit"
            className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
          >
            Save
          </button>
        </form>

        <form action={wipeDrafts} className="border-2 border-oxide bg-white p-4">
          <h2 className="font-display text-lg uppercase text-oxide">Wipe drafts</h2>
          <p className="mt-1 mb-3 text-sm text-ink-soft">
            Permanently deletes all draft eras, albums, and media items from the
            CMS. Published content is untouched.
          </p>
          <button
            type="submit"
            className="border-2 border-ink bg-oxide px-4 py-2 text-xs font-bold uppercase text-paper"
          >
            Wipe all drafts
          </button>
        </form>
      </div>
    </>
  );
}
