import { createClient } from "@/lib/supabase/server";

export type HealthReport = {
    missingCovers: Array<{ slug: string; title: string }>;
    missingYoutube: Array<{ id: string; title: string }>;
    erasWithoutAlbums: Array<{ slug: string; title: string }>;
    draftLeak: Array<{ kind: string; id: string; title: string }>;
    openReports: number;
    openTakedowns: number;
    scheduledPending: number;
    checklist: Array<{ id: string; label: string; ok: boolean; href: string }>;
};

export async function getHealthReport(): Promise<HealthReport> {
    const supabase = await createClient();

    const [
        albums,
        media,
        eras,
        albumsAll,
        settings,
        reports,
        takedowns,
        schedules,
        draftsE,
        draftsA,
        draftsM,
    ] = await Promise.all([
        supabase.from("cms_albums").select("slug, data, cover_path, status").eq("status", "published"),
        supabase.from("cms_media_items").select("id, data, status").eq("status", "published"),
        supabase.from("cms_eras").select("slug, data, status").eq("status", "published"),
        supabase.from("cms_albums").select("slug, data, status"),
        supabase.from("site_settings").select("key, value"),
        supabase
            .from("fan_reports")
            .select("id", { count: "exact", head: true })
            .eq("status", "open"),
        supabase
            .from("legal_takedowns")
            .select("id", { count: "exact", head: true })
            .eq("status", "open"),
        supabase
            .from("cms_schedules")
            .select("id", { count: "exact", head: true })
            .eq("status", "scheduled"),
        supabase.from("cms_eras").select("slug, data, status").eq("status", "draft"),
        supabase.from("cms_albums").select("slug, data, status").eq("status", "draft"),
        supabase.from("cms_media_items").select("id, data, status").eq("status", "draft"),
    ]);

    const missingCovers = (albums.data ?? [])
        .filter((a) => !a.cover_path)
        .map((a) => ({
            slug: a.slug,
            title: String((a.data as { title?: string }).title ?? a.slug),
        }));

    const missingYoutube = (media.data ?? [])
        .filter((m) => {
            const d = m.data as { youtubeId?: string | null };
            return !d.youtubeId;
        })
        .map((m) => ({
            id: m.id,
            title: String((m.data as { title?: string }).title ?? m.id),
        }));

    const albumEras = new Set(
        (albumsAll.data ?? [])
            .filter((a) => a.status === "published")
            .map((a) => String((a.data as { era?: string }).era ?? "")),
    );
    const erasWithoutAlbums = (eras.data ?? [])
        .filter((e) => !albumEras.has(e.slug))
        .map((e) => ({
            slug: e.slug,
            title: String((e.data as { title?: string }).title ?? e.slug),
        }));

    const draftLeak = [
        ...(draftsE.data ?? []).map((r) => ({
            kind: "era",
            id: r.slug,
            title: String((r.data as { title?: string }).title ?? r.slug),
        })),
        ...(draftsA.data ?? []).map((r) => ({
            kind: "album",
            id: r.slug,
            title: String((r.data as { title?: string }).title ?? r.slug),
        })),
        ...(draftsM.data ?? []).map((r) => ({
            kind: "media",
            id: r.id,
            title: String((r.data as { title?: string }).title ?? r.id),
        })),
    ];

    const settingsMap = new Map((settings.data ?? []).map((s) => [s.key, s.value]));
    const disclaimer = settingsMap.get("disclaimer") as { text?: string } | undefined;
    const general = settingsMap.get("general") as { takedownEmail?: string } | undefined;

    const checklist = [
        {
            id: "disclaimer",
            label: "Disclaimer copy set",
            ok: Boolean(disclaimer?.text),
            href: "/admin/settings?tab=disclaimer",
        },
        {
            id: "takedown-email",
            label: "Takedown contact email set",
            ok: Boolean(general?.takedownEmail),
            href: "/admin/settings?tab=general",
        },
        {
            id: "no-draft-leak",
            label: "No draft content pending",
            ok: draftLeak.length === 0,
            href: "/admin/drafts",
        },
        {
            id: "covers",
            label: "All published albums have covers",
            ok: missingCovers.length === 0,
            href: "/admin/insights",
        },
        {
            id: "embeds",
            label: "Published media have YouTube IDs",
            ok: missingYoutube.length === 0,
            href: "/admin/media",
        },
    ];

    return {
        missingCovers,
        missingYoutube,
        erasWithoutAlbums,
        draftLeak,
        openReports: reports.count ?? 0,
        openTakedowns: takedowns.count ?? 0,
        scheduledPending: schedules.count ?? 0,
        checklist,
    };
}
