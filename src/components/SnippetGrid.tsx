"use client";

import { useMemo, useState } from "react";
import AudiogramCard from "@/components/AudiogramCard";
import FilterChips from "@/components/FilterChips";
import type { AccentName } from "@/lib/accents";
import type { Era, Snippet } from "@/lib/content-schema";

export default function SnippetGrid({
  snippets,
  eras,
}: {
  snippets: Snippet[];
  eras: Era[];
}) {
  const [eraFilter, setEraFilter] = useState("all");
  const accentByEra = useMemo(
    () => new Map(eras.map((e) => [e.slug, e.accent as AccentName])),
    [eras],
  );

  const eraOptions = useMemo(() => {
    const present = new Set(snippets.map((s) => s.era));
    return [
      { value: "all", label: "All eras" },
      ...eras
        .filter((e) => present.has(e.slug))
        .map((e) => ({ value: e.slug, label: e.title })),
    ];
  }, [eras, snippets]);

  const filtered =
    eraFilter === "all"
      ? snippets
      : snippets.filter((s) => s.era === eraFilter);

  return (
    <div>
      <div className="mb-6">
        <FilterChips
          label="Filter snippets by era"
          options={eraOptions}
          value={eraFilter}
          onChange={setEraFilter}
        />
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((snippet) => (
          <AudiogramCard
            key={snippet.id}
            snippet={snippet}
            accent={accentByEra.get(snippet.era) ?? "danfo"}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">No snippets in this era yet.</p>
      ) : null}
    </div>
  );
}
