import { AdminPageHeader, Field, Flash } from "@/components/admin/ui";
import { saveSettings } from "@/lib/admin/actions/content";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const flash = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "integrations")
    .maybeSingle();

  const value = (data?.value ?? {
    spotifyClientId: "",
    youtubeApiKey: "",
    takedownEmailInbox: "",
    storageBucket: "site-media",
    webhookRevalidateSecret: "",
  }) as Record<string, string>;

  return (
    <>
      <AdminPageHeader
        title="Integrations"
        description="API keys and webhook secrets. Stored in site_settings — never commit these to git."
      />
      <Flash saved={flash.saved} />

      <form action={saveSettings} className="space-y-4 border-2 border-ink bg-white p-4">
        <input type="hidden" name="key" value="integrations" />
        <Field
          label="Integrations JSON"
          name="value"
          defaultValue={JSON.stringify(value, null, 2)}
          rows={16}
        />
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase"
        >
          Save integrations
        </button>
      </form>
    </>
  );
}
