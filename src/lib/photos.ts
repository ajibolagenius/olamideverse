import manifest from "../../content/media/manifest.json";
import { getMediaSlotPath } from "@/lib/settings";

/**
 * Real imagery wired up from content/media/manifest.json (see that file's
 * `note` for provenance). Era/home context photos are Creative Commons
 * (Wikimedia) and carry required attribution here. Album cover art is
 * rights-holder copyright pulled from a public CDN for prototyping — see
 * ALBUM_COVERS' doc comment before treating it as production-ready.
 *
 * Admin can override slot paths via `media_slots` (Assets → slot binder).
 */

export type EraPhoto = {
    src: string;
    credit: string;
    license: string;
    licenseUrl: string;
};

const eraSlugBySlot: Record<string, string> = {
    "era1-context-photo": "the-upstart",
    "era2-context-photo": "first-of-all",
    "era3-context-photo": "street-king-run",
    "era4-context-photo": "reinvention",
    "era5-context-photo": "elder-statesman",
    "era6-context-photo": "legacy",
};

const slotByEraSlug: Record<string, string> = Object.fromEntries(
    Object.entries(eraSlugBySlot).map(([slot, slug]) => [slug, slot]),
);

export const ERA_PHOTOS: Record<string, EraPhoto> = Object.fromEntries(
    manifest.photos
        .filter((p) => p.id in eraSlugBySlot)
        .map((p) => [
            eraSlugBySlot[p.id],
            {
                src: `/media/${p.file}`,
                credit: p.credit,
                license: p.license,
                licenseUrl: p.licenseUrl,
            },
        ]),
);

const homePhoto = manifest.photos.find((p) => p.id === "home-upstart-photo")!;
export const HOME_PHOTO: EraPhoto = {
    src: `/media/${homePhoto.file}`,
    credit: homePhoto.credit,
    license: homePhoto.license,
    licenseUrl: homePhoto.licenseUrl,
};

/** Prefer CMS media_slots override when present. */
export async function getEraPhoto(eraSlug: string): Promise<EraPhoto | undefined> {
    const base = ERA_PHOTOS[eraSlug];
    if (!base) return undefined;
    const slotId = slotByEraSlug[eraSlug];
    if (!slotId) return base;
    const override = await getMediaSlotPath(slotId);
    return override ? { ...base, src: override } : base;
}

export async function getHomePhoto(): Promise<EraPhoto> {
    const override = await getMediaSlotPath("home-upstart-photo");
    return override ? { ...HOME_PHOTO, src: override } : HOME_PHOTO;
}

/**
 * Album cover art — files under public/media/albums/, with provenance in
 * content/media/manifest.json (`sourceUrl` → Deezer album page). Cover art
 * remains copyright of the rights holders; used only for archival
 * identification in this non-commercial fan archive.
 */
export type AlbumCover = {
    src: string;
    sourceUrl: string;
    title: string;
};

export const ALBUM_COVER_META: Record<string, AlbumCover> = Object.fromEntries(
    manifest.albums.map((a) => [
        a.slug,
        {
            src: `/media/${a.file}`,
            sourceUrl: a.sourceUrl,
            title: a.title,
        },
    ]),
);

export const ALBUM_COVERS: Record<string, string> = Object.fromEntries(
    Object.entries(ALBUM_COVER_META).map(([slug, c]) => [slug, c.src]),
);

export function getAlbumCover(slug: string): AlbumCover | undefined {
    return ALBUM_COVER_META[slug];
}
