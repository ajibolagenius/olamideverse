export type AdminRole = "owner" | "editor" | "moderator" | "viewer";

export type PublishStatus = "draft" | "published" | "archived";

export type AdminUser = {
    user_id: string;
    email: string;
    display_name: string | null;
    role: AdminRole;
    disabled: boolean;
    created_at: string;
};

export type CmsEraRow = {
    slug: string;
    data: Record<string, unknown>;
    body: string;
    status: PublishStatus;
    context_photo_path: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
};

export type CmsAlbumRow = {
    slug: string;
    data: Record<string, unknown>;
    body: string;
    status: PublishStatus;
    cover_path: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
};

export type CmsMediaRow = {
    id: string;
    data: Record<string, unknown>;
    status: PublishStatus;
    sort_order: number;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
};

export type CmsPageRow = {
    key: string;
    title: string;
    data: Record<string, unknown>;
    status: PublishStatus;
    updated_at: string;
    updated_by: string | null;
};

export type MediaAssetRow = {
    id: string;
    path: string;
    kind: "album-cover" | "era-photo" | "home" | "other";
    alt: string;
    credit: string;
    license: string;
    license_url: string;
    bytes: number | null;
    mime: string | null;
    created_at: string;
    updated_at: string;
};
