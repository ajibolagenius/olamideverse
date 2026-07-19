import { redirect } from "next/navigation";
import { AdminButton, AdminPageHeader } from "@/components/admin/ui";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin/auth";

// Sits outside the `(console)` route group, so it doesn't inherit that
// group's layout — reconstruct the same auth check + shell here instead of
// leaving unmatched /admin/* paths to render a bare, unbranded 404.
export default async function AdminNotFound() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell admin={session.admin}>
      <AdminPageHeader
        title="Not found"
        description="No admin page or content record matches that URL."
        actions={<AdminButton href="/admin">Back to dashboard</AdminButton>}
      />
      <p className="border-2 border-dashed border-ink/30 bg-white px-4 py-8 text-center text-sm text-ink-soft">
        Check the sidebar, or the item may have been deleted or renamed.
      </p>
    </AdminShell>
  );
}
