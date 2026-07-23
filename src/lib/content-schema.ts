import { z } from "zod";
import { ACCENT_NAMES, type AccentName } from "./accents";

/**
 * Zod schemas, types and pure derived constants for the content model
 * (docs/INFORMATION-ARCHITECTURE.md). Kept free of `node:fs` so client
 * components can import types/labels from here without pulling the
 * server-only file-reading logic in `content.ts` into their bundle.
 */

const accentSchema = z.enum(ACCENT_NAMES as [AccentName, ...AccentName[]]);

const momentSchema = z.object({
    year: z.string(), // display form, e.g. "2010" or "21 Mar 2011"
    title: z.string().optional(), // Legacy's "moments so far" are title-less
    body: z.string(),
});

export const eraSchema = z.object({
    title: z.string(),
    years: z.string(), // display form, e.g. "2010 — 2011" or "2024 — "
    order: z.number().int().min(1),
    thesis: z.string(), // Eras-index card summary
    accent: accentSchema,
    ticker: z.array(z.string()).default([]), // era-page-specific roll-by items
    heroBadge: z.string(), // eyebrow over the era-page H1
    heroIntro: z.string(), // paragraph under the era-page H1
    contextHeading: z.string(),
    contextBody: z.array(z.string()).default([]), // "The context" paragraphs
    pullQuote: z.string(),
    pullQuoteHighlight: z.string().optional(), // substring wrapped in the ink/danfo span
    moments: z.array(momentSchema).default([]), // "The moments" timeline beats
    momentsSpan: z.string().optional(), // e.g. "two years" — feeds "Four beats, {span}"
    open: z.boolean().default(false), // Legacy stays open-ended: no pin-scroll, no next-chapter CTA
});

export const trackSchema = z.object({
    num: z.number().int().min(1),
    title: z.string(),
    note: z.string().optional(),
    youtubeId: z.string().optional(),
    spotifyTrackId: z.string().optional(),
});

const keyBarSchema = z.object({
    title: z.string(), // track name, e.g. `"Eni Duro"`
    body: z.string(),
});

export const albumSchema = z.object({
    title: z.string(),
    year: z.number().int(),
    era: z.string(), // era slug — cross-checked in getAlbums()
    type: z.enum(["album", "mixtape", "ep", "joint"]),
    released: z.string().optional(), // full display date, e.g. "21 March 2011"
    label: z.string().optional(),
    producer: z.string().optional(),
    tracklist: z.array(trackSchema).default([]),
    keyBars: z.array(keyBarSchema).default([]), // annotated-lyrics sidebar
    credits: z.string().optional(), // full credits paragraph
    embeds: z
        .object({
            spotifyAlbumId: z.string().optional(),
            youtubePlaylistId: z.string().optional(),
            audiomackUrl: z.string().optional(),
        })
        .default({}),
    draft: z.boolean().default(false),
});

export const mediaItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    era: z.string(),
    year: z.number().int(),
    type: z.enum(["music-video", "freestyle", "interview", "live"]),
    source: z.string(), // e.g. "YouTube", "NdaniTV", "The Guardian"
    youtubeId: z.string().nullable(),
    note: z.string(),
});

/** Shareable audiogram-style cards — visual + embed link, never hosted audio. */
export const snippetSchema = z.object({
    id: z.string(),
    quote: z.string(),
    note: z.string(),
    track: z.string(),
    albumSlug: z.string(),
    albumTitle: z.string(),
    year: z.number().int(),
    era: z.string(),
    spotifyTrackId: z.string().optional(),
    youtubeId: z.string().optional(),
    /** Deterministic seed for the decorative waveform bars. */
    waveformSeed: z.number().int().default(1),
});

export const INFLUENCE_ROLES = [
    "center",
    "mentor",
    "peer",
    "mentee",
    "collaborator",
    "influence",
] as const;

export const influenceNodeSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(INFLUENCE_ROLES),
    blurb: z.string(),
    eraSlug: z.string().optional(),
    albumSlug: z.string().optional(),
    /** Year signed to YBNL — presence opts the node into the YBNL roster filter. */
    signedYear: z.number().int().optional(),
    /** Year departed from YBNL (alumni); omit while still on the roster. */
    departedYear: z.number().int().optional(),
    /** Deep-link into an era moment — must match `momentAnchor(year, title)`. */
    momentAnchor: z.string().optional(),
    /** Position in the graph canvas, 0–100. */
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
});

export const influenceEdgeSchema = z.object({
    from: z.string(),
    to: z.string(),
    label: z.string().optional(),
});

export const influenceGraphSchema = z.object({
    nodes: z.array(influenceNodeSchema).min(1),
    edges: z.array(influenceEdgeSchema).default([]),
});

export const IMPACT_KINDS = [
    "origin",
    "venue",
    "concert",
    "cultural",
    "international",
] as const;

export const impactPlaceSchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    region: z.string(),
    kind: z.enum(IMPACT_KINDS),
    year: z.number().int().optional(),
    blurb: z.string(),
    eraSlug: z.string().optional(),
    albumSlug: z.string().optional(),
    /** Deep-link into an era moment — must match `momentAnchor(year, title)`. */
    momentAnchor: z.string().optional(),
    /** WGS84 coordinates for the Leaflet map. */
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    map: z.enum(["lagos", "nigeria", "world"]).default("nigeria"),
});

export const ALBUM_TYPE_LABEL: Record<z.infer<typeof albumSchema>["type"], string> = {
    album: "Album",
    mixtape: "Mixtape",
    ep: "EP",
    joint: "Collab Album",
};

export const INFLUENCE_ROLE_LABEL: Record<
    z.infer<typeof influenceNodeSchema>["role"],
    string
> = {
    center: "The archive's subject",
    mentor: "Mentor / early guide",
    peer: "Peer",
    mentee: "Signed / raised",
    collaborator: "Collaborator",
    influence: "Influence",
};

export const IMPACT_KIND_LABEL: Record<
    z.infer<typeof impactPlaceSchema>["kind"],
    string
> = {
    origin: "Origin",
    venue: "Venue",
    concert: "Concert",
    cultural: "Cultural",
    international: "International",
};

export type Era = z.infer<typeof eraSchema> & { slug: string; body: string };
export type Album = z.infer<typeof albumSchema> & { slug: string; body: string };
export type Track = z.infer<typeof trackSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
export type Snippet = z.infer<typeof snippetSchema>;
export type InfluenceNode = z.infer<typeof influenceNodeSchema>;
export type InfluenceEdge = z.infer<typeof influenceEdgeSchema>;
export type InfluenceGraph = z.infer<typeof influenceGraphSchema>;
export type ImpactPlace = z.infer<typeof impactPlaceSchema>;
