import type { ReactNode } from "react";
import { ACCENTS, type AccentName } from "@/lib/accents";

export default function PullQuote({
  children,
  cite,
  accent = "oxide",
}: {
  children: ReactNode;
  cite?: string;
  accent?: AccentName;
}) {
  return (
    <figure
      className="my-10 border-l-[5px] pl-5"
      style={{ borderColor: ACCENTS[accent].solid }}
    >
      <blockquote className="font-display text-display-md max-w-[24ch]">
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="mt-2 text-xs tracking-[0.05em] uppercase text-ink-soft">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
