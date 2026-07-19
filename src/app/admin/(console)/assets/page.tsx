import fs from "node:fs";
import path from "node:path";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  Field,
  Flash,
  SelectField,
} from "@/components/admin/ui";
import { saveSlot, updateAssetMeta, uploadAsset } from "@/lib/admin/actions/ops";
import { createClient } from "@/lib/supabase/server";

function walk(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else if (/\.(jpe?g|png|webp|avif|gif)$/i.test(entry.name)) out.push(rel);
  }
  return out.sort();
}

const SLOTS = [
  { id: "home-upstart-photo", label: "Home — Upstart photo" },
  { id: "era1-context-photo", label: "Era 1 — The Upstart context" },
  { id: "era2-context-photo", label: "Era 2 — First of All context" },
  { id: "era3-context-photo", label: "Era 3 — Street King context" },
  { id: "era4-context-photo", label: "Era 4 — Reinvention context" },
  { id: "era5-context-photo", label: "Era 5 — Elder Statesman context" },
  { id: "era6-context-photo", label: "Era 6 — Legacy context" },
  { id: "era1-rapsodi-cover", label: "Era 1 — Rapsodi cover slot" },
];

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; tab?: string }>;
}) {
  const flash = await searchParams;
  const tab = flash.tab === "slots" ? "slots" : "library";
  const root = path.join(process.cwd(), "public", "media");
  const files = walk(root).map((rel) => ({
    rel,
    url: `/media/${rel.replace(/\\/g, "/")}`,
    bytes: fs.statSync(path.join(root, rel)).size,
  }));

  const supabase = await createClient();
  const [{ data: assets }, { data: slots }, { data: albums }, { data: eras }] =
    await Promise.all([
      supabase.from("media_assets").select("*").order("path"),
      supabase.from("media_slots").select("*"),
      supabase.from("cms_albums").select("slug, cover_path"),
      supabase.from("cms_eras").select("slug, context_photo_path"),
    ]);

  const metaByPath = new Map((assets ?? []).map((a) => [a.path, a]));
  const usage = new Map<string, string[]>();
  for (const a of albums ?? []) {
    if (!a.cover_path) continue;
    usage.set(a.cover_path, [...(usage.get(a.cover_path) ?? []), `album:${a.slug}`]);
  }
  for (const e of eras ?? []) {
    if (!e.context_photo_path) continue;
    usage.set(e.context_photo_path, [
      ...(usage.get(e.context_photo_path) ?? []),
      `era:${e.slug}`,
    ]);
  }
  for (const s of slots ?? []) {
    usage.set(s.path, [...(usage.get(s.path) ?? []), `slot:${s.slot_id}`]);
  }

  return (
    <>
      <AdminPageHeader
        title="Assets"
        description="Upload, credit, slot-bind, and see where each file is used."
      />
      <Flash saved={flash.saved} error={flash.error} />

      <div className="mb-4 flex gap-2">
        <a
          href="/admin/assets"
          className={`border-2 border-ink px-3 py-1 text-[0.7rem] font-bold uppercase ${tab === "library" ? "bg-ink text-paper" : "bg-white"}`}
        >
          Library
        </a>
        <a
          href="/admin/assets?tab=slots"
          className={`border-2 border-ink px-3 py-1 text-[0.7rem] font-bold uppercase ${tab === "slots" ? "bg-ink text-paper" : "bg-white"}`}
        >
          Slot binder
        </a>
      </div>

      {tab === "library" ? (
        <>
          <form
            action={uploadAsset}
            className="mb-8 space-y-3 border-2 border-ink bg-white p-4"
            encType="multipart/form-data"
          >
            <h2 className="font-display text-lg uppercase">Upload</h2>
            <input type="file" name="file" accept="image/*" required className="text-sm" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Kind"
                name="kind"
                defaultValue="other"
                options={[
                  { value: "album-cover", label: "Album cover" },
                  { value: "era-photo", label: "Era photo" },
                  { value: "home", label: "Home" },
                  { value: "other", label: "Other" },
                ]}
              />
              <Field label="Alt text" name="alt" />
              <Field label="Credit" name="credit" />
              <Field label="License" name="license" />
              <Field label="License URL" name="license_url" />
            </div>
            <button
              type="submit"
              className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
            >
              Upload to storage
            </button>
          </form>

          {!files.length && !assets?.length ? (
            <EmptyState>No assets found.</EmptyState>
          ) : (
            <AdminTable headers={["Preview", "Path", "Kind", "Usage", "Meta"]}>
              {[
                ...files.map((f) => ({ path: f.url, bytes: f.bytes })),
                ...(assets ?? [])
                  .filter((a) => !files.some((f) => f.url === a.path))
                  .map((a) => ({ path: a.path, bytes: a.bytes ?? 0 })),
              ].map((f) => {
                const meta = metaByPath.get(f.path);
                return (
                  <tr key={f.path} className="align-top hover:bg-paper">
                    <td className="px-3 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.path}
                        alt=""
                        className="h-12 w-12 border border-ink object-cover"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-[0.65rem]">{f.path}</td>
                    <td className="px-3 py-2 text-xs">{meta?.kind ?? "—"}</td>
                    <td className="px-3 py-2 text-[0.65rem] text-ink-soft">
                      {(usage.get(f.path) ?? []).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <form action={updateAssetMeta} className="space-y-1">
                        <input type="hidden" name="path" value={f.path} />
                        <input
                          name="alt"
                          defaultValue={meta?.alt ?? ""}
                          placeholder="Alt"
                          className="w-full border border-ink px-1 py-0.5 text-[0.65rem]"
                        />
                        <input
                          name="credit"
                          defaultValue={meta?.credit ?? ""}
                          placeholder="Credit"
                          className="w-full border border-ink px-1 py-0.5 text-[0.65rem]"
                        />
                        <input
                          name="license"
                          defaultValue={meta?.license ?? ""}
                          placeholder="License"
                          className="w-full border border-ink px-1 py-0.5 text-[0.65rem]"
                        />
                        <input
                          name="license_url"
                          defaultValue={meta?.license_url ?? ""}
                          placeholder="License URL"
                          className="w-full border border-ink px-1 py-0.5 text-[0.65rem]"
                        />
                        <select
                          name="kind"
                          defaultValue={meta?.kind ?? "other"}
                          className="w-full border border-ink px-1 py-0.5 text-[0.65rem]"
                        >
                          <option value="album-cover">album-cover</option>
                          <option value="era-photo">era-photo</option>
                          <option value="home">home</option>
                          <option value="other">other</option>
                        </select>
                        <button
                          type="submit"
                          className="text-[0.65rem] font-bold uppercase text-adire underline"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
        </>
      ) : (
        <>
          <AdminTable headers={["Slot", "Bound path", ""]}>
            {SLOTS.map((slot) => {
              const bound = slots?.find((s) => s.slot_id === slot.id);
              return (
                <tr key={slot.id} className="align-top hover:bg-paper">
                  <td className="px-3 py-2">
                    <p className="font-semibold text-sm">{slot.label}</p>
                    <p className="font-mono text-[0.65rem] text-ink-soft">{slot.id}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {bound?.path || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <form action={saveSlot} className="flex flex-wrap gap-2">
                      <input type="hidden" name="slot_id" value={slot.id} />
                      <input type="hidden" name="label" value={slot.label} />
                      <input
                        name="path"
                        defaultValue={bound?.path ?? ""}
                        placeholder="/media/eras/..."
                        className="min-w-[220px] border-2 border-ink px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        className="border-2 border-ink bg-danfo px-2 py-1 text-[0.65rem] font-bold uppercase"
                      >
                        Bind
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        </>
      )}
    </>
  );
}
