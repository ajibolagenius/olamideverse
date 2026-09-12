/**
 * Resolving a catalogue row into player props, in one place.
 *
 * Two rules have to hold everywhere a player renders, and they used to be
 * re-implemented at each call site:
 *
 *  1. The admin kill-switch (`embed_blocks`) is how a rights holder's
 *     takedown lands without a redeploy. A route that forgets to apply it is
 *     a hole in the takedown path, not a cosmetic bug.
 *  2. "Blocked" and "never had an ID" are different states — the first says
 *     so explicitly, the second says the content pass hasn't reached it.
 *
 * Pure and dependency-free so client components can import it; `settings.ts`
 * reads the blocks from Supabase and hands them in.
 */
import type { Song, Track } from "@/lib/content-schema";

export type EmbedBlock = { provider: string; embed_id: string };

/** YouTube Music serves the same video IDs as YouTube — one kill-switch covers both. */
const YOUTUBE_FAMILY = new Set(["youtube", "youtubemusic"]);

function canonicalizeAudiomackUrl(value: string): string {
    try {
        const url = new URL(value);
        if (url.hostname.toLowerCase().replace(/^www\./, "") !== "audiomack.com") {
            return value;
        }

        const parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" && parts.length >= 4) {
            parts.splice(0, 3, parts[2], parts[1]);
        }

        return `audiomack.com/${parts.slice(0, 3).join("/")}`;
    } catch {
        return value;
    }
}

function isBlocked(
    blocks: EmbedBlock[],
    provider: string,
    id: string | null | undefined,
): boolean {
    if (!id) return false;
    const normalizedId =
        provider === "audiomack" ? canonicalizeAudiomackUrl(id) : id;
    return blocks.some(
        (b) => {
            const normalizedBlockId =
                provider === "audiomack" &&
                (b.provider === "any" || b.provider === "audiomack")
                    ? canonicalizeAudiomackUrl(b.embed_id)
                    : b.embed_id;

            return normalizedBlockId === normalizedId &&
            (b.provider === "any" ||
                b.provider === provider ||
                (YOUTUBE_FAMILY.has(b.provider) && YOUTUBE_FAMILY.has(provider)));
        },
    );
}

/** The subset of a song/track that can carry an embed. */
export type EmbedSource = Pick<
    Song & Track,
    "spotifyTrackId" | "youtubeId" | "appleMusicId" | "audiomackUrl"
>;

export type ResolvedEmbed = {
    spotifyId?: string;
    youtubeId?: string;
    appleMusicId?: string;
    audiomackUrl?: string;
    /** True only when IDs existed and the kill-switch took every one of them. */
    removed: boolean;
};

export function resolveEmbed(
    source: EmbedSource | null | undefined,
    blocks: EmbedBlock[] = [],
): ResolvedEmbed {
    if (!source) return { removed: false };

    const spotifyId = isBlocked(blocks, "spotify", source.spotifyTrackId)
        ? undefined
        : source.spotifyTrackId;
    const youtubeId = isBlocked(blocks, "youtube", source.youtubeId)
        ? undefined
        : source.youtubeId;
    const appleMusicId = isBlocked(blocks, "applemusic", source.appleMusicId)
        ? undefined
        : source.appleMusicId;
    const audiomackUrl = isBlocked(blocks, "audiomack", source.audiomackUrl)
        ? undefined
        : source.audiomackUrl;

    return {
        spotifyId,
        youtubeId,
        appleMusicId,
        audiomackUrl,
        removed: hasAnyEmbed(source) && !(spotifyId || youtubeId || appleMusicId || audiomackUrl),
    };
}

/** Whether the row claims an embed at all — before the kill-switch runs. */
export function hasAnyEmbed(source: EmbedSource | null | undefined): boolean {
    return Boolean(
        source &&
            (source.spotifyTrackId ||
                source.youtubeId ||
                source.appleMusicId ||
                source.audiomackUrl),
    );
}
