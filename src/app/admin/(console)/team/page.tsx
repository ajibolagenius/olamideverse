import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { inviteAdmin, updateAdminRole } from "@/lib/admin/actions/team";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const flash = await searchParams;
  const { admin } = await requireAdmin(["owner", "viewer"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  const canManage = admin.role === "owner";

  return (
    <>
      <AdminPageHeader
        title="Team"
        description="Staff accounts for the admin console. Owners can invite and change roles."
      />
      <Flash saved={flash.saved} error={flash.error} />

      {!data?.length ? (
        <EmptyState>No admin users. Run the seed script to create the owner.</EmptyState>
      ) : (
        <AdminTable headers={["Email", "Name", "Role", "Disabled", ""]}>
          {data.map((row) => (
            <tr key={row.user_id} className="hover:bg-paper">
              <td className="px-3 py-2 font-semibold">{row.email}</td>
              <td className="px-3 py-2">{row.display_name ?? "—"}</td>
              <td className="px-3 py-2 uppercase text-xs">{row.role}</td>
              <td className="px-3 py-2">{row.disabled ? "Yes" : "No"}</td>
              <td className="px-3 py-2">
                {canManage ? (
                  <form action={updateAdminRole} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="user_id" value={row.user_id} />
                    <select
                      name="role"
                      defaultValue={row.role}
                      className="border border-ink bg-paper px-2 py-1 text-xs"
                    >
                      <option value="owner">owner</option>
                      <option value="editor">editor</option>
                      <option value="moderator">moderator</option>
                      <option value="viewer">viewer</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        name="disabled"
                        defaultChecked={row.disabled}
                      />
                      disable
                    </label>
                    <button
                      type="submit"
                      className="border border-ink bg-danfo px-2 py-1 text-[0.65rem] font-bold uppercase"
                    >
                      Update
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

      {canManage ? (
        <>
          <h2 className="mt-10 mb-3 font-display text-xl uppercase">Invite admin</h2>
          <form
            action={inviteAdmin}
            className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" required />
              <Field
                label="Temp password"
                name="password"
                type="password"
                required
                hint="Min 8 characters — share securely, then rotate."
              />
              <Field label="Display name" name="display_name" />
              <SelectField
                label="Role"
                name="role"
                defaultValue="editor"
                options={[
                  { value: "owner", label: "Owner" },
                  { value: "editor", label: "Editor" },
                  { value: "moderator", label: "Moderator" },
                  { value: "viewer", label: "Viewer" },
                ]}
              />
            </div>
            <button
              type="submit"
              className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
            >
              Create admin
            </button>
          </form>
        </>
      ) : null}
    </>
  );
}
