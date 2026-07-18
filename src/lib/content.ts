import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { ACCENT_NAMES, type AccentName } from "./accents";

/**
 * Repo-resident static content (docs/INFORMATION-ARCHITECTURE.md):
 *
 *   content/eras/[slug].mdx     chapter prose + frontmatter
 *   content/albums/[slug].mdx   album story + frontmatter
 *   content/media/media.json    curated embed list
 *
 * Frontmatter is Zod-validated so bad content fails the build, not the page.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

const accentSchema = z.enum(ACCENT_NAMES as [AccentName, ...AccentName[]]);

export const eraSchema = z.object({
  title: z.string(),
  years: z.string(), // display form, e.g. "2010 — 2011" or "2024 — "
  order: z.number().int().min(1),
  thesis: z.string(),
  accent: accentSchema,
  motto: z.string().optional(), // one line for roll-by tickers
  open: z.boolean().default(false), // Legacy stays open-ended
});

export const trackSchema = z.object({
  num: z.number().int().min(1),
  title: z.string(),
  note: z.string().optional(),
  youtubeId: z.string().optional(),
  spotifyTrackId: z.string().optional(),
});

export const albumSchema = z.object({
  title: z.string(),
  year: z.number().int(),
  era: z.string(), // era slug — cross-checked in getAlbums()
  type: z.enum(["album", "mixtape", "ep", "joint"]),
  tracklist: z.array(trackSchema).default([]),
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
  youtubeId: z.string().nullable(),
  note: z.string(),
});

export type Era = z.infer<typeof eraSchema> & { slug: string; body: string };
export type Album = z.infer<typeof albumSchema> & { slug: string; body: string };
export type Track = z.infer<typeof trackSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;

function readMdxCollection<T extends object>(
  dir: string,
  schema: z.ZodType<T>,
): Array<T & { slug: string; body: string }> {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(full, file), "utf8"),
      );
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/${dir}/${file}: ${parsed.error.message}`,
        );
      }
      return { ...parsed.data, slug, body: content };
    });
}

export function getEras(): Era[] {
  return readMdxCollection("eras", eraSchema).sort((a, b) => a.order - b.order);
}

export function getEra(slug: string): Era | undefined {
  return getEras().find((e) => e.slug === slug);
}

export function getAlbums(): Album[] {
  const eraSlugs = new Set(getEras().map((e) => e.slug));
  const albums = readMdxCollection("albums", albumSchema);
  for (const album of albums) {
    if (!eraSlugs.has(album.era)) {
      throw new Error(
        `content/albums/${album.slug}.mdx references unknown era "${album.era}"`,
      );
    }
  }
  return albums.sort((a, b) => a.year - b.year);
}

export function getAlbum(slug: string): Album | undefined {
  return getAlbums().find((a) => a.slug === slug);
}

export function getAlbumsByEra(eraSlug: string): Album[] {
  return getAlbums().filter((a) => a.era === eraSlug);
}

export function getMediaItems(): MediaItem[] {
  const raw = JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "media", "media.json"), "utf8"),
  );
  const items = z.array(mediaItemSchema).parse(raw);
  const eraSlugs = new Set(getEras().map((e) => e.slug));
  for (const item of items) {
    if (!eraSlugs.has(item.era)) {
      throw new Error(`media.json item "${item.id}" references unknown era "${item.era}"`);
    }
  }
  return items.sort((a, b) => b.year - a.year);
}
