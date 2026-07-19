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

export const ALBUM_TYPE_LABEL: Record<z.infer<typeof albumSchema>["type"], string> = {
  album: "Album",
  mixtape: "Mixtape",
  ep: "EP",
  joint: "Collab Album",
};

export type Era = z.infer<typeof eraSchema> & { slug: string; body: string };
export type Album = z.infer<typeof albumSchema> & { slug: string; body: string };
export type Track = z.infer<typeof trackSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
