import Link from "next/link";
import {
  AdminPageHeader,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { createPreviewToken } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ token?: string; created?: string }>;
}) {
  const { type, id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  let publicPath = "/";
  if (type === "era") publicPath = `/eras/${id}`;
  else if (type === "album") publicPath = `/albums/${id}`;
  else if (type === "media") publicPath = "/media";
  else if (type === "page") publicPath = id === "home" ? "/" : `/${id}`;

  const previewUrl = flash.token
    ? `${publicPath}?preview=${flash.token}`
    : null;

  const { data: tokens } = await supabase
    .from("preview_tokens")
    .select("*")
    .eq("entity_type", type)
    .eq("entity_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <AdminPageHeader
        title="Draft preview"
        description={`Tokenized preview for ${type}:${id}. Share the link — expires in 24h.`}
      />
      <Flash saved={flash.created} />

      {previewUrl ? (
        <p className="mb-4 border-2 border-ink bg-white px-3 py-2 text-sm">
          Preview link:{" "}
          <Link href={previewUrl} className="font-mono text-adire underline">
            {previewUrl}
          </Link>
        </p>
      ) : null}

      <form action={createPreviewToken} className="mb-8 space-y-3 border-2 border-ink bg-white p-4">
        <input type="hidden" name="entity_type" value={type} />
        <input type="hidden" name="entity_id" value={id} />
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Generate 24h preview token
        </button>
      </form>

      <h2 className="mb-3 font-display text-lg uppercase">Mint for another entity</h2>
      <form action={createPreviewToken} className="space-y-3 border-2 border-ink bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Type"
            name="entity_type"
            defaultValue="album"
            options={[
              { value: "era", label: "Era" },
              { value: "album", label: "Album" },
              { value: "media", label: "Media" },
              { value: "page", label: "Page" },
            ]}
          />
          <Field label="ID / slug" name="entity_id" defaultValue={id} required />
        </div>
        <button
          type="submit"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase"
        >
          Generate
        </button>
      </form>

      {tokens?.length ? (
        <ul className="mt-8 space-y-2 text-xs text-ink-soft">
          {tokens.map((t) => (
            <li key={t.token} className="font-mono">
              {t.token.slice(0, 12)}… expires {new Date(t.expires_at).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
