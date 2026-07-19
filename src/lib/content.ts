import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  albumSchema,
  eraSchema,
  mediaItemSchema,
  type Album,
  type Era,
  type MediaItem,
} from "./content-schema";

/**
 * Repo-resident static content (docs/INFORMATION-ARCHITECTURE.md):
 *
 *   content/eras/[slug].mdx     chapter prose + frontmatter
 *   content/albums/[slug].mdx   album story + frontmatter
 *   content/media/media.json    curated embed list
 *
 * Frontmatter is Zod-validated so bad content fails the build, not the page.
 * Server-only (uses node:fs) — types/schemas/labels live in content-schema.ts
 * so client components can import those without pulling this file in.
 */

export * from "./content-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

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
