import type { ReactNode } from "react";
import { ACCENTS, type AccentName } from "@/lib/accents";

/** Splits `text` on the first occurrence of `highlight`, wrapping it in the ink/danfo span. */
function withHighlight(text: string, highlight?: string): ReactNode {
  if (!highlight) return text;
  const i = text.indexOf(highlight);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="ov-marker-double px-[0.1em] text-ink">{highlight}</span>
      {text.slice(i + highlight.length)}
    </>
  );
}

export default function PullQuote({
  children,
  text,
  highlight,
  cite,
  accent = "oxide",
}: {
  children?: ReactNode;
  text?: string;
  highlight?: string;
  cite?: string;
  accent?: AccentName;
}) {
  return (
    <figure
      className="my-10 border-l-5 pl-5"
      style={{ borderColor: ACCENTS[accent].solid }}
    >
      <blockquote className="font-display text-display-md max-w-[26ch] leading-[1.05]">
        {text ? withHighlight(text, highlight) : children}
      </blockquote>
      <svg
        className="mt-2.5 h-2 w-28 max-w-full opacity-85"
        style={{ color: ACCENTS[accent].solid }}
        viewBox="0 0 200 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2 8C50 2 150 10 198 4"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {cite ? (
        <figcaption className="mt-2 text-xs tracking-[0.05em] uppercase text-ink-soft">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
