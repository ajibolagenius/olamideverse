import { notFound } from "next/navigation";
import {
  AdminPageHeader,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { deleteMediaItem, saveMediaItem } from "@/lib/admin/actions/content";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const isNew = id === "new";
  const supabase = await createClient();

  const [{ data: row }, { data: eras }] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : supabase.from("cms_media_items").select("*").eq("id", id).maybeSingle(),
    supabase.from("cms_eras").select("slug, data"),
  ]);

  if (!isNew && !row) notFound();
  const d = (row?.data ?? {}) as Record<string, unknown>;

  return (
    <>
      <AdminPageHeader
        title={isNew ? "New media item" : String(d.title ?? id)}
        description="Embeds only — paste a YouTube ID, never host video files."
      />
      <Flash saved={flash.saved} error={flash.error} />

      <form action={saveMediaItem} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        {!isNew ? <input type="hidden" name="existingId" value={id} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" name="title" defaultValue={String(d.title ?? "")} required />
          <Field label="ID" name="id" defaultValue={isNew ? "" : id} hint="Stable slug id" />
          <Field label="Year" name="year" type="number" defaultValue={Number(d.year ?? 2020)} />
          <Field label="Sort order" name="sort_order" type="number" defaultValue={row?.sort_order ?? 0} />
          <SelectField
            label="Era"
            name="era"
            defaultValue={String(d.era ?? "")}
            options={
              eras?.map((e) => ({
                value: e.slug,
                label: String((e.data as { title?: string }).title ?? e.slug),
              })) ?? []
            }
          />
          <SelectField
            label="Type"
            name="type"
            defaultValue={String(d.type ?? "music-video")}
            options={[
              { value: "music-video", label: "Music video" },
              { value: "freestyle", label: "Freestyle" },
              { value: "interview", label: "Interview" },
              { value: "live", label: "Live" },
            ]}
          />
          <Field label="Source" name="source" defaultValue={String(d.source ?? "YouTube")} />
          <Field
            label="YouTube ID"
            name="youtubeId"
            defaultValue={d.youtubeId == null ? "" : String(d.youtubeId)}
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={row?.status ?? "draft"}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>

        <Field label="Curation note" name="note" defaultValue={String(d.note ?? "")} rows={4} />

        {d.youtubeId ? (
          <div className="border-2 border-ink">
            <p className="bg-ink px-3 py-1 text-[0.65rem] uppercase tracking-wide text-danfo">
              YouTube preview
            </p>
            <iframe
              title="YouTube preview"
              src={`https://www.youtube-nocookie.com/embed/${String(d.youtubeId)}`}
              className="aspect-video w-full"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-ink-soft">
            Add a YouTube ID and save to see an embed preview here.
          </p>
        )}

        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Save media item
        </button>
      </form>

      {!isNew ? (
        <form action={deleteMediaItem} className="mt-6">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="border-2 border-ink bg-oxide px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper"
          >
            Delete item
          </button>
        </form>
      ) : null}
    </>
  );
}
