import {
  ALBUM_TYPE_LABEL,
  SONG_TYPE_LABEL,
  type Album,
  type Era,
  type SlangTerm,
  type Snippet,
  type Song,
} from "./content-schema";

/**
 * Dependency-free site-wide search over the ~700-doc content corpus. Small
 * enough to score fully per request (content.ts already re-reads on every
 * call — no caching layer to slot into), so no search library is needed.
 */

export type SearchDocType = "album" | "era" | "song" | "snippet" | "slang";

export type SearchDoc = {
  id: string;
  type: SearchDocType;
  title: string;
  subtitle: string;
  href: string;
  /** Lowercased blob of every matchable field — not rendered. */
  keywords: string;
};

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function buildSearchIndex(data: {
  albums: Album[];
  eras: Era[];
  songs: Song[];
  snippets: Snippet[];
  slang: SlangTerm[];
}): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const era of data.eras) {
    docs.push({
      id: era.slug,
      type: "era",
      title: era.title,
      subtitle: era.years,
      href: `/eras/${era.slug}`,
      keywords: [era.title, era.years, era.thesis, ...era.ticker]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const album of data.albums) {
    const trackKeywords = album.tracklist
      .map((track) => `${track.title} ${track.note ?? ""}`)
      .join(" ");
    docs.push({
      id: album.slug,
      type: "album",
      title: album.title,
      subtitle: `${ALBUM_TYPE_LABEL[album.type]} · ${album.year}`,
      href: `/albums/${album.slug}`,
      keywords: [
        album.title,
        String(album.year),
        album.type,
        album.label,
        album.producer,
        trackKeywords,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const song of data.songs) {
    docs.push({
      id: song.id,
      type: "song",
      title: song.title,
      subtitle: `${SONG_TYPE_LABEL[song.type]} · ${song.year}`,
      href: song.albumSlug ? `/albums/${song.albumSlug}` : "/songs",
      keywords: [song.title, song.artists, song.note, song.source, String(song.year)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const snippet of data.snippets) {
    docs.push({
      id: snippet.id,
      type: "snippet",
      title: `“${truncate(snippet.quote, 60)}”`,
      subtitle: `${snippet.albumTitle} · ${snippet.year}`,
      href: `/snippets/${snippet.id}`,
      keywords: [snippet.quote, snippet.note, snippet.track, snippet.albumTitle]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const term of data.slang) {
    docs.push({
      id: term.id,
      type: "slang",
      title: term.term,
      subtitle: `Street lingo · ${term.year}`,
      href: "/slang",
      keywords: [term.term, term.literal, term.meaning, term.context, term.songTitle]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  return docs;
}

const TYPE_PRIORITY: Record<SearchDocType, number> = {
  album: 0,
  era: 1,
  song: 2,
  snippet: 3,
  slang: 4,
};

function scoreDoc(doc: SearchDoc, tokens: string[], query: string): number | null {
  const title = doc.title.toLowerCase();
  const subtitle = doc.subtitle.toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += title.startsWith(token) ? 60 : 40;
    else if (subtitle.includes(token)) score += 20;
    else if (doc.keywords.includes(token)) score += 8;
    else return null; // every token must match somewhere — AND semantics
  }

  if (title === query) score += 100;
  else if (title.startsWith(query)) score += 30;

  return score;
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 30): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  return docs
    .map((doc) => ({ doc, score: scoreDoc(doc, tokens, q) }))
    .filter((entry): entry is { doc: SearchDoc; score: number } => entry.score !== null)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.doc.type !== b.doc.type) return TYPE_PRIORITY[a.doc.type] - TYPE_PRIORITY[b.doc.type];
      return a.doc.title.localeCompare(b.doc.title);
    })
    .slice(0, limit)
    .map((entry) => entry.doc);
}
