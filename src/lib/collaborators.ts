import type { Album } from "./content-schema";

/**
 * There's no structured collaborator field in the content model — features
 * live only as free text in `track.note` ("feat. Davido", "with Wizkid —
 * preceding single"). This extracts names from that convention; anything
 * that doesn't match ("Olamide & Phyno" bare joint-album credits, "Solo",
 * "Bonus track") is left alone rather than guessed at.
 */

function splitNames(raw: string): string[] {
  return raw
    .split(/\s*,\s*|\s*&\s*|\s+and\s+/i)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function extractCollaborators(note: string | undefined): string[] {
  if (!note) return [];
  const match = note.match(/^(?:feat\.|with)\s+(.+)$/i);
  if (!match) return [];
  const namesPart = match[1].split("—")[0].trim();
  return splitNames(namesPart);
}

export function albumCollaborators(album: Album): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const track of album.tracklist) {
    for (const name of extractCollaborators(track.note)) {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        names.push(name);
      }
    }
  }
  return names;
}

export type CollaboratorMatch = { name: string; albums: Album[] };

/** Other albums crediting each of `album`'s featured artists, grouped by name. */
export function relatedByCollaborator(
  album: Album,
  allAlbums: Album[],
  limitPerName = 3,
): CollaboratorMatch[] {
  const names = albumCollaborators(album);
  if (names.length === 0) return [];

  const collabByAlbum = new Map(
    allAlbums.map((a) => [a.slug, new Set(albumCollaborators(a).map((n) => n.toLowerCase()))]),
  );

  const matches: CollaboratorMatch[] = [];
  for (const name of names) {
    const key = name.toLowerCase();
    const others = allAlbums.filter(
      (other) => other.slug !== album.slug && collabByAlbum.get(other.slug)?.has(key),
    );
    if (others.length > 0) matches.push({ name, albums: others.slice(0, limitPerName) });
  }

  return matches.sort((a, b) => b.albums.length - a.albums.length);
}
