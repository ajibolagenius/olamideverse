import { notFound } from "next/navigation";
import {
  AdminButton,
  AdminPageHeader,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { deleteEra, saveEra } from "@/lib/admin/actions/content";
import { ACCENT_NAMES } from "@/lib/accents";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEraEditPage({
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
  const { data: row } = isNew
    ? { data: null }
    : await supabase.from("cms_eras").select("*").eq("slug", slug).maybeSingle();

  if (!isNew && !row) notFound();

  const d = (row?.data ?? {}) as Record<string, unknown>;

  return (
    <>
      <AdminPageHeader
        title={isNew ? "New era" : String(d.title ?? slug)}
        description="Frontmatter fields map 1:1 to the public era schema."
        actions={
          !isNew ? (
            <>
              <AdminButton href={`/eras/${slug}`} variant="secondary">
                View live
              </AdminButton>
              <AdminButton href={`/admin/preview/era/${slug}`} variant="secondary">
                Preview token
              </AdminButton>
            </>
          ) : undefined
        }
      />
      <Flash saved={flash.saved} error={flash.error} />

      <form action={saveEra} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        {!isNew ? <input type="hidden" name="existingSlug" value={slug} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" name="title" defaultValue={String(d.title ?? "")} required />
          <Field label="Slug" name="slug" defaultValue={isNew ? "" : slug} hint="URL key, e.g. the-upstart" />
          <Field label="Years" name="years" defaultValue={String(d.years ?? "")} required />
          <Field label="Order" name="order" type="number" defaultValue={Number(d.order ?? 1)} />
          <SelectField
            label="Accent"
            name="accent"
            defaultValue={String(d.accent ?? "oxide")}
            options={ACCENT_NAMES.map((a) => ({ value: a, label: a }))}
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

        <Field label="Thesis" name="thesis" defaultValue={String(d.thesis ?? "")} rows={3} required />
        <Field label="Hero badge" name="heroBadge" defaultValue={String(d.heroBadge ?? "")} />
        <Field label="Hero intro" name="heroIntro" defaultValue={String(d.heroIntro ?? "")} rows={3} />
        <Field
          label="Context heading"
          name="contextHeading"
          defaultValue={String(d.contextHeading ?? "")}
        />
        <Field
          label="Context body (JSON array of paragraphs)"
          name="contextBody"
          defaultValue={JSON.stringify(d.contextBody ?? [], null, 2)}
          rows={6}
        />
        <Field
          label="Ticker items (JSON string array)"
          name="ticker"
          defaultValue={JSON.stringify(d.ticker ?? [], null, 2)}
          rows={4}
        />
        <Field label="Pull quote" name="pullQuote" defaultValue={String(d.pullQuote ?? "")} rows={2} />
        <Field
          label="Pull quote highlight"
          name="pullQuoteHighlight"
          defaultValue={String(d.pullQuoteHighlight ?? "")}
        />
        <Field
          label="Moments span"
          name="momentsSpan"
          defaultValue={String(d.momentsSpan ?? "")}
          hint='e.g. "two years"'
        />
        <Field
          label="Moments (JSON array)"
          name="moments"
          defaultValue={JSON.stringify(d.moments ?? [], null, 2)}
          rows={10}
        />
        <Field
          label="Context photo path"
          name="context_photo_path"
          defaultValue={row?.context_photo_path ?? ""}
          hint="e.g. /media/eras/the-upstart-bariga.jpg"
        />
        <Field label="Body (MDX)" name="body" defaultValue={row?.body ?? ""} rows={8} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="open" defaultChecked={Boolean(d.open)} />
          Open-ended era (no pin-scroll / next-chapter CTA)
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
          >
            Save era
          </button>
        </div>
      </form>

      {!isNew ? (
        <form action={deleteEra} className="mt-6">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="border-2 border-ink bg-oxide px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper"
          >
            Delete era
          </button>
        </form>
      ) : null}
    </>
  );
}
