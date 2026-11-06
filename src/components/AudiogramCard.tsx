import Link from "next/link";
import ShareSnippet from "@/components/ShareSnippet";
import ShareToStory from "@/components/ShareToStory";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Snippet } from "@/lib/content-schema";
import { SITE_URL } from "@/lib/site";
import { waveformBars } from "@/lib/waveform";
import { ArrowRight, CassetteTape } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function AudiogramCard({
  snippet,
  accent,
  featured = false,
}: {
  snippet: Snippet;
  accent: AccentName;
  featured?: boolean;
}) {
  const palette = ACCENTS[accent];
  const bars = waveformBars(snippet.waveformSeed, featured ? 56 : 40);
  const href = `/snippets/${snippet.id}`;
  const absoluteUrl = `${SITE_URL}${href}`;
  const catalogCode = `MC-${snippet.year}-${snippet.id.slice(0, 4).toUpperCase()}`;

  return (
    <article
      className={`group relative isolate flex flex-col border-3 border-ink bg-ink text-paper shadow-paste transition-all hover:shadow-print ${
        featured ? "sm:min-h-[440px]" : ""
      }`}
      data-tilt={featured ? "-0.6" : "0.5"}
      style={{ rotate: featured ? "-0.6deg" : "0.5deg" }}
    >
      {/* Misregistration colored accent edge */}
      <div
        className="pointer-events-none absolute -bottom-1.5 -right-1.5 -z-10 h-full w-full border-2 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
        style={{ borderColor: palette.solid }}
        aria-hidden="true"
      />

      {/* Cassette Spine & Broadcast Header Bar */}
      <div
        className="flex items-center justify-between gap-3 border-b-3 border-ink px-4 py-2.5"
        style={{ background: palette.solid, color: palette.onSolid }}
      >
        <div className="flex items-center gap-2">
          <CassetteTape weight={OV_ICON_WEIGHT} className="h-4 w-4 shrink-0" />
          <span className="font-mono text-[0.68rem] font-bold tracking-widest uppercase">
            {catalogCode}
          </span>
        </div>
        <span className="font-display text-lg uppercase tracking-tight leading-none truncate">
          {snippet.track}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        {/* Dynamic Waveform Visualizer */}
        <div
          className="flex h-16 items-end gap-[3px] border-b border-paper/15 pb-2 sm:h-20"
          aria-hidden
          role="presentation"
        >
          {bars.map((h, i) => {
            const isPeak = i % 4 === 0;
            return (
              <span
                key={i}
                className="min-w-[3px] flex-1 rounded-xs transition-all"
                style={{
                  height: `${Math.round(h * 100)}%`,
                  background: isPeak ? palette.solid : "#F4EFE6",
                  opacity: isPeak ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>

        {/* Lyrical Quote */}
        <blockquote className="font-display text-[1.5rem] leading-[1.15] tracking-tight sm:text-[1.75rem]">
          “{snippet.quote}”
        </blockquote>

        {/* Contextual Note */}
        <p className="text-xs font-mono leading-relaxed text-ink-muted">
          {snippet.note}
        </p>

        {/* Card Footer with Provenance & Actions */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-paper/20 pt-4">
          <div className="text-[0.72rem] font-mono tracking-wider uppercase text-ink-muted">
            <Link
              href={`/albums/${snippet.albumSlug}`}
              className="font-bold text-paper underline decoration-danfo underline-offset-2 hover:text-danfo"
            >
              {snippet.albumTitle}
            </Link>
            <span className="mx-1.5">·</span>
            <span>{snippet.year}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ShareSnippet url={absoluteUrl} title={snippet.track} compact />
            <ShareToStory
              storyUrl={`/snippets/${snippet.id}/story`}
              title={snippet.track}
              compact
            />
            <Link
              href={href}
              className="inline-flex items-center gap-1 border-2 border-paper px-2.5 py-1 text-[0.68rem] font-bold tracking-wider uppercase text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <span>Deck</span>
              <ArrowRight weight="bold" className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
