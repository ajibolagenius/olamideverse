import { notFound } from "next/navigation";
import { AdminPageHeader, Field, Flash, SelectField } from "@/components/admin/ui";
import { savePage } from "@/lib/admin/actions/content";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPageEdit({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { key } = await params;
  const flash = await searchParams;
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (!row) notFound();

  return (
    <>
      <AdminPageHeader
        title={row.title}
        description={`Page key: ${row.key}. Edit structured copy as JSON.`}
      />
      <Flash saved={flash.saved} error={flash.error} />

      <form action={savePage} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        <input type="hidden" name="key" value={row.key} />
        <Field label="Title" name="title" defaultValue={row.title} />
        <SelectField
          label="Status"
          name="status"
          defaultValue={row.status}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <Field
          label="Data (JSON)"
          name="data"
          defaultValue={JSON.stringify(row.data ?? {}, null, 2)}
          rows={22}
        />
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Save page
        </button>
      </form>
    </>
  );
}
