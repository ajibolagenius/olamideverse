import type { CSSProperties, ReactNode } from "react";

/**
 * The full-bleed poster hero used at the top of every page: ink ground,
 * grain texture, rotated eyebrow badge, ink-reveal headline.
 */
export default function PosterHero({
  kickerLeft,
  kickerRight,
  eyebrow,
  title,
  intro,
  accent = "#F5B301",
  onAccent = "#181410",
  children,
  size = "lg",
}: {
  /** Small masthead row above the badge, e.g. "OlamideVerse — Era 01" / "Six Eras · One Legacy". */
  kickerLeft?: string;
  kickerRight?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  accent?: string;
  /** Badge text color — light accents (danfo) need ink text, dark accents need paper text. */
  onAccent?: string;
  children?: ReactNode;
  size?: "xl" | "lg";
}) {
  return (
    <section className="grain bg-ink px-5 py-14 text-paper sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        {kickerLeft || kickerRight ? (
          <div className="mb-9 flex flex-col gap-1 border-b border-[#3A332B] pb-4 text-[0.8rem] tracking-[0.12em] uppercase text-ink-muted sm:flex-row sm:justify-between sm:gap-4">
            <span>{kickerLeft}</span>
            <span>{kickerRight}</span>
          </div>
        ) : null}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className="inline-block -rotate-1 px-3 py-1.5 text-[0.8rem] font-bold tracking-[0.1em] uppercase"
            style={{ background: accent, color: onAccent }}
          >
            {eyebrow}
          </span>
          <span className="ov-stamp text-danfo border-danfo/60">
            Editorial Dossier
          </span>
        </div>
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
