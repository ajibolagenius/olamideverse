import type { CSSProperties, ReactNode } from "react";

/**
 * The full-bleed poster hero used at the top of every page: ink ground,
 * grain texture, rotated eyebrow badge, ink-reveal headline.
 */
export default function PosterHero({
  eyebrow,
  title,
  intro,
  accent = "#F5B301",
  children,
  size = "lg",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  accent?: string;
  children?: ReactNode;
  size?: "xl" | "lg";
}) {
  return (
    <section className="grain bg-ink px-5 py-14 text-paper sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        <span
          className="mb-5 inline-block -rotate-1 px-3 py-1.5 text-[0.8rem] font-bold tracking-[0.1em] uppercase text-ink"
          style={{ background: accent }}
        >
          {eyebrow}
        </span>
        <h1
          className={`ov-ink-wipe font-display ${
            size === "xl" ? "text-display-xl" : "text-display-lg"
          } max-w-[16ch]`}
          style={{ "--ov-wipe-color": accent } as CSSProperties}
        >
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-[#CFC7BB] sm:text-lg">
            {intro}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
