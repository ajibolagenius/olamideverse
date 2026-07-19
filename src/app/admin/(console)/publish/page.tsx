import {
  AdminPageHeader,
  Flash,
} from "@/components/admin/ui";
import { bulkPublish } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPublishPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const [eras, albums, media] = await Promise.all([
    supabase.from("cms_eras").select("slug, data").eq("status", "draft"),
    supabase.from("cms_albums").select("slug, data").eq("status", "draft"),
    supabase.from("cms_media_items").select("id, data").eq("status", "draft"),
  ]);

  const items = [
    ...(eras.data ?? []).map((r) => ({
      type: "era",
      id: r.slug,
      title: String((r.data as { title?: string }).title ?? r.slug),
    })),
    ...(albums.data ?? []).map((r) => ({
      type: "album",
      id: r.slug,
      title: String((r.data as { title?: string }).title ?? r.slug),
    })),
    ...(media.data ?? []).map((r) => ({
      type: "media",
      id: r.id,
      title: String((r.data as { title?: string }).title ?? r.id),
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Bulk publish"
        description="Publish all selected drafts at once and revalidate the public site."
      />
      <Flash saved={flash.saved} />

      {!items.length ? (
        <p className="border-2 border-dashed border-ink/30 bg-white px-4 py-8 text-center text-sm text-ink-soft">
          Nothing in draft — you&apos;re clear to launch.
        </p>
      ) : (
        <form action={bulkPublish} className="border-2 border-ink bg-white p-4">
          <ul className="mb-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex gap-2">
                <span className="uppercase text-ink-soft">{item.type}</span>
                <span className="font-semibold">{item.title}</span>
              </li>
            ))}
          </ul>
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <button
            type="submit"
            className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
          >
            Publish all {items.length} drafts
          </button>
        </form>
      )}
    </>
  );
}
