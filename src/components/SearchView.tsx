"use client";

import type { Icon } from "@phosphor-icons/react";
import { Books, Disc, MusicNotes, Waveform } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "@/components/EmptyState";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { searchDocs, type SearchDoc, type SearchDocType } from "@/lib/search";

const TYPE_LABEL: Record<SearchDocType, string> = {
  album: "Albums",
  era: "Eras",
  song: "Songs",
  snippet: "Snippets",
};

const TYPE_ICON: Record<SearchDocType, Icon> = {
  album: Disc,
  era: Books,
  song: MusicNotes,
  snippet: Waveform,
};

function groupByType(docs: SearchDoc[]): Array<{ type: SearchDocType; docs: SearchDoc[] }> {
  const order: SearchDocType[] = ["album", "era", "song", "snippet"];
  return order
    .map((type) => ({ type, docs: docs.filter((d) => d.type === type) }))
    .filter((group) => group.docs.length > 0);
}

export default function SearchView({
  docs,
  initialQuery,
  initialResults,
}: {
  docs: SearchDoc[];
  initialQuery: string;
  initialResults: SearchDoc[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const debounceRef = useRef<number | undefined>(undefined);

  const results = useMemo(() => {
    if (deferredQuery.trim() === initialQuery.trim()) return initialResults;
    return searchDocs(docs, deferredQuery);
  }, [docs, deferredQuery, initialQuery, initialResults]);

  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const trimmed = query.trim();
      const href = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
      router.replace(href, { scroll: false });
    }, 300);
    return () => window.clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the query should retrigger this
  }, [query]);

  const groups = groupByType(results);
  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[0.72rem] font-bold tracking-[0.04em] uppercase text-ink-soft">
          Search the archive
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Eni Duro, YBNL, Davido, First of All…"
          className="border-3 border-ink bg-white px-4 py-3 text-base outline-none focus:bg-paper-dim"
        />
      </label>

      <div className="mt-8">
        {!hasQuery ? (
          <EmptyState message="Type an era, album, song, or a name like Davido to get started." />
        ) : groups.length === 0 ? (
          <EmptyState message="Nothing matches that search — try a shorter or different term." />
        ) : (
          <div className="space-y-10">
            {groups.map((group) => {
              const TypeIcon = TYPE_ICON[group.type];
              return (
                <div key={group.type}>
                  <p className="ov-icon-inline mb-3 text-[0.72rem] font-bold tracking-[0.1em] uppercase text-ink-soft">
                    <TypeIcon className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
                    {TYPE_LABEL[group.type]}
                  </p>
                  <ul className="grid gap-3">
                    {group.docs.map((doc) => (
                      <li key={`${doc.type}-${doc.id}`}>
                        <Link
                          href={doc.href}
                          className="ov-lift block border-3 border-ink bg-white p-4 shadow-paste-sm"
                        >
                          <span className="block font-display text-lg leading-tight">
                            {doc.title}
                          </span>
                          <span className="mt-1 block text-xs tracking-[0.04em] uppercase text-ink-soft">
                            {doc.subtitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
