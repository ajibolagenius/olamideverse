import type { ReactNode } from "react";

interface YorubaProverbProps {
  proverb: string;
  translation: string;
  context?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * YorubaProverb — Editorial callout component for Yoruba proverbs and street slang idioms.
 * Ensures precise diacritic rendering (Ọ, Ẹ, Ṣ, tone marks) with Anton display typography and Danfo paste-up accents.
 */
export default function YorubaProverb({
  proverb,
  translation,
  context,
  className = "",
}: YorubaProverbProps) {
  return (
    <figure
      className={`ov-paste-up my-8 border-3 border-ink bg-paper p-5 shadow-paste sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="ov-stamp border-danfo bg-danfo text-ink text-[0.7rem] font-bold">
          Yoruba Proverb · Òwe
        </span>
      </div>

      <blockquote className="font-display text-2xl leading-tight text-ink sm:text-3xl">
        “{proverb}”
      </blockquote>

      <figcaption className="mt-3 border-t border-ink/20 pt-3">
        <p className="text-sm font-semibold italic text-ink-soft sm:text-base">
          Translation: &ldquo;{translation}&rdquo;
        </p>
        {context ? (
          <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
            {context}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
