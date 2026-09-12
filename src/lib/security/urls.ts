/**
 * Favorites / playlist links must stay on-site. Reject protocol-relative,
 * absolute, and javascript: URLs.
 */
export function safeInternalHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("://")) return null;
  if (trimmed.length < 2 || trimmed.length > 200) return null;
  if (/[\s\\]/.test(trimmed)) return null;
  // Path only — drop query/hash abuse vectors we don't need for favorites.
  const path = trimmed.split(/[?#]/)[0] ?? "";
  if (!/^\/[A-Za-z0-9._~/-]+$/.test(path)) return null;
  return path;
}

export function safeFavoriteLabel(label: string): string | null {
  const trimmed = label.trim().slice(0, 120);
  if (trimmed.length < 1) return null;
  return trimmed;
}

export function safeFavoriteTargetId(id: string, kind: "era" | "album"): string | null {
  const trimmed = id.trim();
  const prefix = kind === "era" ? "era:" : "album:";
  if (!trimmed.startsWith(prefix)) return null;
  const slug = trimmed.slice(prefix.length);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  return `${prefix}${slug}`;
}

/**
 * Embed IDs reach an iframe `src` by string interpolation, so they are a
 * trust boundary even though they come from `content/`. A malformed value —
 * a hand-edited catalogue row, a bad CMS override — must not be able to
 * steer the player frame somewhere else. Shape-check before interpolating.
 */
export function safeSpotifyId(id: string | null | undefined): string | undefined {
    return id && /^[A-Za-z0-9]{22}$/.test(id) ? id : undefined;
}

export function safeYoutubeId(id: string | null | undefined): string | undefined {
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
}

export function safeAppleMusicId(id: string | null | undefined): string | undefined {
    return id && /^\d{4,15}$/.test(id) ? id : undefined;
}

/**
 * Audiomack has no stable numeric ID — the canonical page URL is the handle,
 * which is why `albumSchema.embeds.audiomackUrl` stores a URL. Accepting an
 * arbitrary URL here would turn the player into an open redirect, so pin the
 * origin and return the embed form rather than the value we were handed.
 *
 * Note the two path shapes are NOT the same order:
 *   page  https://audiomack.com/<artist>/song/<slug>
 *   embed https://audiomack.com/embed/song/<artist>/<slug>
 * Both are accepted; the embed form is what comes back.
 */
export function safeAudiomackEmbedSrc(
    url: string | null | undefined,
): string | undefined {
    const parts = audiomackParts(url);
    return parts ? `https://audiomack.com/embed/${parts.kind}/${parts.artist}/${parts.slug}` : undefined;
}

/** The human-facing page URL, for the "Open in Audiomack" link-out. */
export function safeAudiomackPageUrl(
    url: string | null | undefined,
): string | undefined {
    const parts = audiomackParts(url);
    return parts ? `https://audiomack.com/${parts.artist}/${parts.kind}/${parts.slug}` : undefined;
}

const AUDIOMACK_SEGMENT = /^[A-Za-z0-9._-]{1,160}$/;

function audiomackParts(
    url: string | null | undefined,
): { kind: "song" | "album"; artist: string; slug: string } | null {
    if (!url) return null;
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }
    if (parsed.protocol !== "https:") return null;
    if (parsed.hostname !== "audiomack.com" && parsed.hostname !== "www.audiomack.com") {
        return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    let kind: string;
    let artist: string;
    let slug: string;
    if (segments[0] === "embed") {
        // /embed/<kind>/<artist>/<slug>
        if (segments.length !== 4) return null;
        [, kind, artist, slug] = segments;
    } else {
        // /<artist>/<kind>/<slug>
        if (segments.length !== 3) return null;
        [artist, kind, slug] = segments;
    }

    if (kind !== "song" && kind !== "album") return null;
    if (!AUDIOMACK_SEGMENT.test(artist) || !AUDIOMACK_SEGMENT.test(slug)) return null;
    return { kind, artist, slug };
}
