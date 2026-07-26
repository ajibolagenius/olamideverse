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
