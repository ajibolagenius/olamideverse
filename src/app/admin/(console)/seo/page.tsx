import {
  AdminPageHeader,
  AdminTable,
  Field,
  Flash,
} from "@/components/admin/ui";
import { saveSeo } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PATHS = ["/", "/eras", "/albums", "/media", "/about", "/legal", "/fanzone"];

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; path?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("cms_seo").select("*").order("path");
  const selected =
    flash.path || data?.[0]?.path || DEFAULT_PATHS[0];
  const current = data?.find((r) => r.path === selected);

  return (
    <>
      <AdminPageHeader
        title="SEO"
        description="Per-route title, description, OG image, and noindex flags."
      />
      <Flash saved={flash.saved} />

      <div className="mb-4 flex flex-wrap gap-2">
        {[...new Set([...(data ?? []).map((d) => d.path), ...DEFAULT_PATHS])].map(
          (p) => (
            <a
              key={p}
              href={`/admin/seo?path=${encodeURIComponent(p)}`}
              className={`border-2 border-ink px-3 py-1 text-[0.7rem] font-bold uppercase ${
                selected === p ? "bg-ink text-paper" : "bg-white"
              }`}
            >
              {p}
            </a>
          ),
        )}
      </div>

      <form action={saveSeo} className="mb-10 space-y-4 border-2 border-ink bg-white p-4">
        <Field label="Path" name="path" defaultValue={selected} required />
        <Field label="Title" name="title" defaultValue={current?.title ?? ""} />
        <Field
          label="Description"
          name="description"
          defaultValue={current?.description ?? ""}
          rows={3}
        />
        <Field
          label="OG image URL"
          name="og_image"
          defaultValue={current?.og_image ?? ""}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="noindex" defaultChecked={current?.noindex ?? false} />
          noindex
        </label>
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Save SEO
        </button>
      </form>

      {data?.length ? (
        <AdminTable headers={["Path", "Title", "noindex"]}>
          {data.map((row) => (
            <tr key={row.path} className="hover:bg-paper">
              <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
              <td className="px-3 py-2 text-sm">{row.title || "—"}</td>
              <td className="px-3 py-2 text-xs">{row.noindex ? "yes" : "no"}</td>
            </tr>
          ))}
        </AdminTable>
      ) : null}
    </>
  );
}
