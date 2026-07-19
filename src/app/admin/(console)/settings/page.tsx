import { AdminPageHeader, Field, Flash } from "@/components/admin/ui";
import { saveSettings } from "@/lib/admin/actions/content";
import { requireAdmin, canEditContent } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const TABS = [
  { key: "disclaimer", label: "Disclaimer" },
  { key: "navigation", label: "Navigation" },
  { key: "footer", label: "Footer" },
  { key: "brand", label: "Brand" },
  { key: "embeds", label: "Embeds policy" },
  { key: "general", label: "General" },
  { key: "feature_flags", label: "Feature flags" },
] as const;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saved?: string; error?: string }>;
}) {
  const session = await requireAdmin(["owner", "editor"]);
  if (!canEditContent(session.admin.role)) redirect("/admin?error=forbidden");

  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? (sp.tab as string) : "disclaimer";
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("key", tab).maybeSingle();

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="Chrome, brand, embeds policy, and feature flags — wired into the public site."
      />
      <Flash saved={sp.saved} error={sp.error} />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={`/admin/settings?tab=${t.key}`}
            className={`border-2 border-ink px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide ${
              tab === t.key ? "bg-ink text-paper" : "bg-white"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <form action={saveSettings} className="space-y-4 border-2 border-ink bg-white p-4 sm:p-6">
        <input type="hidden" name="key" value={tab} />
        <Field
          label={`${tab} (JSON)`}
          name="value"
          defaultValue={JSON.stringify(data?.value ?? defaultFor(tab), null, 2)}
          rows={18}
        />
        <button
          type="submit"
          className="border-2 border-ink bg-danfo px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Save settings
        </button>
      </form>
    </>
  );
}

function defaultFor(key: string) {
  switch (key) {
    case "disclaimer":
      return {
        text: "Fan archive · Not affiliated with Olamide or YBNL Nation",
        highlight: "Not affiliated",
      };
    case "navigation":
      return {
        links: [
          { href: "/eras", label: "Eras" },
          { href: "/albums", label: "Discography" },
          { href: "/media", label: "Media" },
          { href: "/about", label: "About" },
          { href: "/fanzone", label: "Fan Zone" },
        ],
      };
    case "footer":
      return {
        links: [
          { href: "/legal", label: "Legal" },
          { href: "/about", label: "Source credits" },
          { href: "/legal#takedown", label: "Takedown contact" },
          { href: "/fanzone", label: "Fan Zone" },
        ],
        blurb:
          "Fan project · Not affiliated with Olamide or YBNL Nation · Built for archival & educational purposes",
      };
    case "brand":
      return {
        accents: ["danfo", "adire", "oxide", "palm", "ink", "clay", "navy"],
        eraAccentMap: {
          "the-upstart": "oxide",
          "first-of-all": "adire",
          "street-king-run": "danfo",
          reinvention: "palm",
          "elder-statesman": "clay",
          legacy: "navy",
        },
        motionEnabled: true,
        preferReducedMotionDefault: false,
      };
    case "embeds":
      return {
        providers: ["spotify", "youtube", "audiomack"],
        priority: ["spotify", "youtube", "audiomack"],
      };
    case "general":
      return {
        siteName: "OlamideVerse",
        takedownEmail: "",
        analyticsId: "",
      };
    case "feature_flags":
      return {
        fanzone: false,
        comments: false,
        polls: false,
        useCmsContent: true,
        maintenance: false,
      };
    default:
      return {};
  }
}
