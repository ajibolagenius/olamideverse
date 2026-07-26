import { normalizeAnalyticsId } from "@/lib/security/analytics-id";
import { createServiceClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

export type NavLink = { href: string; label: string };
export type FeatureFlags = {
    fanzone: boolean;
    comments: boolean;
    polls: boolean;
    useCmsContent: boolean;
    maintenance: boolean;
};

const DEFAULT_DISCLAIMER = {
    text: "Fan archive · Not affiliated with Olamide or YBNL Nation",
    highlight: "Not affiliated",
};

/** Lean primary + Fan Zone CTA. Secondary destinations live in More / footer groups (see src/lib/nav.ts). */
const DEFAULT_NAV: NavLink[] = [
    { href: "/eras", label: "Eras" },
    { href: "/albums", label: "Discography" },
    { href: "/media", label: "Media" },
    { href: "/fanzone", label: "Fan Zone" },
];

const DEFAULT_FOOTER = {
    links: [
        { href: "/songs", label: "Songs" },
        { href: "/snippets", label: "Snippets" },
        { href: "/influence", label: "Influence" },
        { href: "/impact", label: "Impact" },
        { href: "/legal", label: "Legal" },
        { href: "/about", label: "Source credits" },
        { href: "/changelog", label: "What’s new" },
        { href: "/legal#takedown", label: "Takedown" },
        { href: "/fanzone", label: "Fan Zone" },
    ] as NavLink[],
    blurb:
        "Fan project · Not affiliated with Olamide or YBNL Nation · Archival & educational",
};

/** Archive-first defaults — Fan Zone stays off until explicitly enabled in CMS. */
const DEFAULT_FLAGS: FeatureFlags = {
    fanzone: false,
    comments: false,
    polls: false,
    useCmsContent: true,
    maintenance: false,
};

async function getSetting<T>(key: string, fallback: T): Promise<T> {
    try {
        const supabase = createPublicClient();
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", key)
            .maybeSingle();
        if (!data?.value || typeof data.value !== "object") return fallback;
        return { ...fallback, ...(data.value as object) } as T;
    } catch {
        return fallback;
    }
}

export async function getDisclaimer() {
    return getSetting("disclaimer", DEFAULT_DISCLAIMER);
}

export async function getNavigation() {
    const value = await getSetting("navigation", { links: DEFAULT_NAV });
    const links = Array.isArray(value.links) ? value.links : DEFAULT_NAV;
    const flags = await getFeatureFlags();
    return links.filter((l) => flags.fanzone || l.href !== "/fanzone") as NavLink[];
}

/** Archive extras that must remain even when CMS overrides footer.links. */
const ARCHIVE_FOOTER_LINKS: NavLink[] = [
    { href: "/songs", label: "Songs" },
    { href: "/snippets", label: "Snippets" },
    { href: "/influence", label: "Influence" },
    { href: "/impact", label: "Impact" },
];

function mergeFooterLinks(cmsLinks: NavLink[]): NavLink[] {
    const seen = new Set(cmsLinks.map((l) => l.href));
    const missing = ARCHIVE_FOOTER_LINKS.filter((l) => !seen.has(l.href));
    // Keep archive extras at the front (before Legal / About / …).
    return [...missing, ...cmsLinks];
}

export async function getFooter() {
    const value = await getSetting("footer", DEFAULT_FOOTER);
    const flags = await getFeatureFlags();
    const raw = Array.isArray(value.links) ? (value.links as NavLink[]) : DEFAULT_FOOTER.links;
    const links = mergeFooterLinks(raw).filter(
        (l) => flags.fanzone || l.href !== "/fanzone",
    );
    return {
        links,
        blurb: value.blurb || DEFAULT_FOOTER.blurb,
    };
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
    return getSetting("feature_flags", DEFAULT_FLAGS);
}

type PublicGeneral = {
    siteName: string;
    analyticsId: string;
};

async function getPublicGeneral(): Promise<PublicGeneral> {
    const envAnalytics = normalizeAnalyticsId(
        process.env.NEXT_PUBLIC_ANALYTICS_ID || process.env.ANALYTICS_ID || "",
    );
    let siteName = "OlamideVerse";
    let analyticsId = "";
    try {
        const supabase = createPublicClient();
        const { data } = await supabase.rpc("get_public_general");
        if (data && typeof data === "object") {
            const row = data as { siteName?: string; analyticsId?: string };
            if (typeof row.siteName === "string" && row.siteName.trim()) {
                siteName = row.siteName.trim();
            }
            analyticsId = normalizeAnalyticsId(row.analyticsId);
        }
    } catch {
        // RPC missing (pre-migration) — fall through to env defaults.
    }
    return {
        siteName,
        analyticsId: analyticsId || envAnalytics,
    };
}

/** Takedown inbox — service-role / env only (never anon-readable). */
export async function getTakedownEmail(): Promise<string> {
    const envEmail = (process.env.TAKEDOWN_EMAIL || "").trim();
    try {
        const service = createServiceClient();
        const { data } = await service
            .from("site_settings")
            .select("value")
            .eq("key", "general")
            .maybeSingle();
        const value = data?.value as { takedownEmail?: string } | null;
        const cmsEmail = (value?.takedownEmail || "").trim();
        if (cmsEmail) return cmsEmail;
    } catch {
        // Service role unavailable at build time — env email is enough.
    }
    return envEmail;
}

/**
 * Public-safe general settings plus server-only takedown email.
 * Prefer `getPublicGeneral` / `getTakedownEmail` when you only need one field.
 */
export async function getGeneralSettings() {
    const [pub, takedownEmail] = await Promise.all([
        getPublicGeneral(),
        getTakedownEmail(),
    ]);
    return { ...pub, takedownEmail };
}

export async function getAnalyticsId(): Promise<string> {
    return (await getPublicGeneral()).analyticsId;
}

export async function getEmbedsPolicy() {
    return getSetting("embeds", {
        providers: ["spotify", "youtube", "audiomack"],
        priority: ["spotify", "youtube", "audiomack"],
    });
}

export async function getBlockedEmbeds(): Promise<
    Array<{ provider: string; embed_id: string }>
> {
    try {
        const supabase = createPublicClient();
        const { data } = await supabase.from("embed_blocks").select("provider, embed_id");
        return data ?? [];
    } catch {
        return [];
    }
}

export function isEmbedBlocked(
    blocks: Array<{ provider: string; embed_id: string }>,
    provider: string,
    id: string | null | undefined,
) {
    if (!id) return false;
    return blocks.some(
        (b) =>
            (b.provider === provider || b.provider === "any") &&
            b.embed_id === id,
    );
}

export type SeoRow = {
    path: string;
    title: string;
    description: string;
    og_image: string;
    noindex: boolean;
};

export async function getSeoForPath(path: string): Promise<SeoRow | null> {
    try {
        const supabase = createPublicClient();
        const { data } = await supabase
            .from("cms_seo")
            .select("path, title, description, og_image, noindex")
            .eq("path", path)
            .maybeSingle();
        return data;
    } catch {
        return null;
    }
}

export async function getMediaSlotPath(slotId: string): Promise<string | null> {
    try {
        const supabase = createPublicClient();
        const { data } = await supabase
            .from("media_slots")
            .select("path")
            .eq("slot_id", slotId)
            .maybeSingle();
        return data?.path ?? null;
    } catch {
        return null;
    }
}
