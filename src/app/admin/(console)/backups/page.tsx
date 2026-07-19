import { AdminPageHeader, Flash } from "@/components/admin/ui";

export default async function AdminBackupsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  return (
    <>
      <AdminPageHeader
        title="Backups"
        description="Export CMS JSON for eras, albums, media, pages, settings, and SEO."
      />
      <Flash saved={flash.saved} />
      <a
        href="/admin/api/backup"
        className="inline-flex border-2 border-ink bg-danfo px-4 py-3 text-xs font-bold uppercase tracking-wide"
      >
        Download backup ZIP (JSON)
      </a>
      <p className="mt-4 max-w-xl text-sm text-ink-soft">
        Owner-only. The export is generated on demand from the live Supabase CMS
        tables — keep a copy before bulk wipes or migrations.
      </p>
    </>
  );
}
