/** Stable fragment id for era timeline beats (`#moment-…`). */
export function momentAnchor(year: string, title?: string): string {
    const raw = (title?.trim() || year).toLowerCase();
    const slug = raw
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
    return `moment-${slug || "beat"}`;
}

export function eraMomentHref(eraSlug: string, anchor: string): string {
    return `/eras/${eraSlug}#${anchor}`;
}
