import { notFound } from "next/navigation";
import {
  AdminButton,
  AdminPageHeader,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { deleteAlbum, saveAlbum } from "@/lib/admin/actions/content";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAlbumEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { slug } = await params;
  const flash = await searchParams;
  const isNew = slug === "new";
  const supabase = await createClient();

  const [{ data: row }, { data: eras }] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : supabase.from("cms_albums").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("cms_eras").select("slug, data").order("slug"),
  ]);

  if (!isNew && !row) notFound();
  const d = (row?.data ?? {}) as Record<string, unknown>;
  const embeds = (d.embeds ?? {}) as Record<string, string>;

  const eraOptions =
    eras?.map((e) => ({
      value: e.slug,
      label: String((e.data as { title?: string }).title ?? e.slug),
    })) ?? [];

  return (
    <>
      <AdminPageHeader
        title={isNew ? "New album" : String(d.title ?? slug)}
        description="Tracklist and embeds as JSON — validated against albumSchema on save."
        actions={
          !isNew ? (
            <>
              <AdminButton href={`/albums/${slug}`} variant="secondary">
                View live
              </AdminButton>
              <AdminButton href={`/admin/preview/album/${slug}`} variant="secondary">
                Preview token
              </AdminButton>
            </>
          ) : undefined
        }
      />
      <Flash saved={flash.saved} error={flash.error} />

      <form action={saveAlbum} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        {!isNew ? <input type="hidden" name="existingSlug" value={slug} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" name="title" defaultValue={String(d.title ?? "")} required />
          <Field label="Slug" name="slug" defaultValue={isNew ? "" : slug} />
          <Field label="Year" name="year" type="number" defaultValue={Number(d.year ?? 2020)} />
          <SelectField
            label="Era"
            name="era"
            defaultValue={String(d.era ?? eraOptions[0]?.value ?? "")}
            options={eraOptions.length ? eraOptions : [{ value: "", label: "— seed eras first —" }]}
          />
          <SelectField
            label="Type"
            name="type"
            defaultValue={String(d.type ?? "album")}
            options={[
              { value: "album", label: "Album" },
              { value: "mixtape", label: "Mixtape" },
              { value: "ep", label: "EP" },
              { value: "joint", label: "Collab / Joint" },
            ]}
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
          <Field label="Released" name="released" defaultValue={String(d.released ?? "")} />
          <Field label="Label" name="label" defaultValue={String(d.label ?? "")} />
          <Field label="Producer" name="producer" defaultValue={String(d.producer ?? "")} />
          <Field
            label="Cover path"
            name="cover_path"
            defaultValue={row?.cover_path ?? ""}
            hint="/media/albums/rapsodi.jpg"
          />
        </div>

        <Field label="Credits" name="credits" defaultValue={String(d.credits ?? "")} rows={3} />
        <Field
          label="Tracklist (JSON)"
          name="tracklist"
          defaultValue={JSON.stringify(d.tracklist ?? [], null, 2)}
          rows={12}
        />
        <Field
          label="Key bars (JSON)"
          name="keyBars"
          defaultValue={JSON.stringify(d.keyBars ?? [], null, 2)}
          rows={6}
        />
        <Field
          label="Embeds (JSON)"
          name="embeds"
          defaultValue={JSON.stringify(embeds, null, 2)}
          rows={5}
          hint='{"spotifyAlbumId":"...","youtubePlaylistId":"...","audiomackUrl":"..."}'
        />
        <Field label="Story body (MDX)" name="body" defaultValue={row?.body ?? ""} rows={10} />

        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Save album
        </button>
      </form>

      {!isNew ? (
        <form action={deleteAlbum} className="mt-6">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="border-2 border-ink bg-oxide px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper"
          >
            Delete album
          </button>
        </form>
      ) : null}
    </>
  );
}
