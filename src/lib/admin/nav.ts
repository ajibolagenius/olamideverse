export type AdminNavItem = {
    href: string;
    label: string;
    roles?: Array<"owner" | "editor" | "moderator" | "viewer">;
};

export type AdminNavSection = {
    title: string;
    items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavSection[] = [
    {
        title: "Overview",
        items: [
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/drafts", label: "Drafts" },
            { href: "/admin/publish", label: "Publish", roles: ["owner", "editor"] },
            { href: "/admin/schedule", label: "Schedule", roles: ["owner", "editor"] },
            { href: "/admin/versions", label: "Versions", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/activity", label: "Activity" },
            { href: "/admin/insights", label: "Insights" },
        ],
    },
    {
        title: "Content",
        items: [
            { href: "/admin/eras", label: "Eras", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/albums", label: "Albums", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/media", label: "Media gallery", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/pages", label: "Pages", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/assets", label: "Assets", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/taxonomy", label: "Taxonomy", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/seo", label: "SEO", roles: ["owner", "editor", "viewer"] },
        ],
    },
    {
        title: "Fan Zone",
        items: [
            { href: "/admin/fanzone/comments", label: "Comments", roles: ["owner", "editor", "moderator", "viewer"] },
            { href: "/admin/fanzone/fans", label: "Fans", roles: ["owner", "moderator", "viewer"] },
            { href: "/admin/fanzone/polls", label: "Polls", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/fanzone/favorites", label: "Favorites", roles: ["owner", "editor", "moderator", "viewer"] },
            { href: "/admin/fanzone/playlists", label: "Playlists", roles: ["owner", "moderator", "viewer"] },
            { href: "/admin/fanzone/reports", label: "Reports", roles: ["owner", "editor", "moderator", "viewer"] },
        ],
    },
    {
        title: "Compliance",
        items: [
            { href: "/admin/legal/takedowns", label: "Takedowns", roles: ["owner", "editor", "moderator"] },
            { href: "/admin/legal/disclaimer", label: "Disclaimer", roles: ["owner", "editor"] },
            { href: "/admin/legal/image-rights", label: "Image rights", roles: ["owner", "editor", "viewer"] },
            { href: "/admin/legal/embed-removals", label: "Embed kill-switch", roles: ["owner", "editor"] },
        ],
    },
    {
        title: "Site",
        items: [
            { href: "/admin/settings", label: "Settings", roles: ["owner", "editor"] },
            { href: "/admin/team", label: "Team", roles: ["owner", "viewer"] },
            { href: "/admin/integrations", label: "Integrations", roles: ["owner"] },
            { href: "/admin/backups", label: "Backups", roles: ["owner"] },
            { href: "/admin/danger", label: "Danger zone", roles: ["owner"] },
        ],
    },
];
