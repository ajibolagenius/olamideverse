import Link from "next/link";
import ShareSnippet from "@/components/ShareSnippet";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Snippet } from "@/lib/content-schema";
import { SITE_URL } from "@/lib/site";
import { waveformBars } from "@/lib/waveform";

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

  return (
    <article
      className={`ov-paste-up flex flex-col border-[3px] border-ink bg-ink text-paper shadow-paste ${
        featured ? "sm:min-h-[420px]" : ""
      }`}
      data-tilt={featured ? "-0.8" : "0.6"}
      style={{ rotate: featured ? "-0.8deg" : "0.6deg" }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b-[3px] border-ink px-4 py-2.5"
        style={{ background: palette.solid, color: palette.onSolid }}
      >
        <span className="text-[0.72rem] font-bold tracking-[0.08em] uppercase">
          Audiogram · {snippet.year}
        </span>
        <span className="font-display text-lg leading-none">{snippet.track}</span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div
          className="flex h-16 items-end gap-[3px] sm:h-20"
          aria-hidden
          role="presentation"
        >
          {bars.map((h, i) => (
            <span
              key={i}
              className="min-w-[3px] flex-1 rounded-sm"
              style={{
                height: `${Math.round(h * 100)}%`,
                background: i % 5 === 0 ? palette.solid : "#F4EFE6",
                opacity: i % 5 === 0 ? 1 : 0.55,
              }}
            />
          ))}
        </div>

        <blockquote className="font-display text-[1.55rem] leading-[1.15] sm:text-[1.75rem]">
          “{snippet.quote}”
        </blockquote>
        <p className="text-sm leading-relaxed text-ink-muted">{snippet.note}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-[#3A332B] pt-4">
          <div className="text-[0.75rem] tracking-[0.05em] uppercase text-ink-muted">
            <Link
              href={`/albums/${snippet.albumSlug}`}
              className="font-semibold text-paper underline decoration-danfo underline-offset-2 hover:text-danfo"
            >
              {snippet.albumTitle}
            </Link>
            <span className="mx-1.5">·</span>
            <span>{snippet.track}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ShareSnippet url={absoluteUrl} title={snippet.track} compact />
            <Link
              href={href}
              className="border-2 border-paper px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.05em] uppercase text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Open
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
