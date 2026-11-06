/** Stable fragment id for era timeline beats (`#moment-…`). */
export function momentAnchor(year: string, title?: string): string {
    // This display-title correction must retain the published fragment used
    // by the influence graph, impact map and readers' saved links.
    const label = (title?.trim() || year).toLowerCase();
    const raw = label === "2 kings & eyán mayweather"
        ? "2 kings & eyan mayweather"
        : label;
    const slug = raw
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
    return `moment-${slug || "beat"}`;
}

export function eraMomentHref(eraSlug: string, anchor: string): string {
    return `/eras/${eraSlug}#${anchor}`;
}
