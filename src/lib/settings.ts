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

const DEFAULT_NAV: NavLink[] = [
    { href: "/eras", label: "Eras" },
    { href: "/albums", label: "Discography" },
    { href: "/media", label: "Media" },
    { href: "/about", label: "About" },
    { href: "/fanzone", label: "Fan Zone" },
];

const DEFAULT_FOOTER = {
    links: [
        { href: "/legal", label: "Legal" },
        { href: "/about", label: "Source credits" },
        { href: "/legal#takedown", label: "Takedown" },
        { href: "/fanzone", label: "Fan Zone" },
    ] as NavLink[],
    blurb:
        "Fan project · Not affiliated with Olamide or YBNL Nation · Archival & educational",
};

const DEFAULT_FLAGS: FeatureFlags = {
    fanzone: true,
    comments: true,
    polls: true,
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

export async function getFooter() {
    const value = await getSetting("footer", DEFAULT_FOOTER);
    const flags = await getFeatureFlags();
    const links = (Array.isArray(value.links) ? value.links : DEFAULT_FOOTER.links).filter(
        (l) => flags.fanzone || l.href !== "/fanzone",
    );
    return {
        links: links as NavLink[],
        blurb: value.blurb || DEFAULT_FOOTER.blurb,
    };
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
    return getSetting("feature_flags", DEFAULT_FLAGS);
}

export async function getGeneralSettings() {
    const envEmail = (process.env.TAKEDOWN_EMAIL || "").trim();
    const settings = await getSetting("general", {
        siteName: "OlamideVerse",
        takedownEmail: "",
        analyticsId: "",
    });
    return {
        ...settings,
        // CMS wins when set; otherwise fall back to env for deploys without a seed.
        takedownEmail: (settings.takedownEmail || envEmail).trim(),
    };
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
