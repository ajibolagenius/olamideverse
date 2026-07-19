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
      <span className="bg-ink px-[0.1em] text-danfo">{highlight}</span>
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
      className="my-10 border-l-[5px] pl-5"
      style={{ borderColor: ACCENTS[accent].solid }}
    >
      <blockquote className="font-display text-display-md max-w-[26ch] leading-[1.05]">
        {text ? withHighlight(text, highlight) : children}
      </blockquote>
      {cite ? (
        <figcaption className="mt-2 text-xs tracking-[0.05em] uppercase text-ink-soft">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
