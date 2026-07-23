import type { CSSProperties, ReactNode } from "react";

/**
 * Consistent kicker / display title / intro for index and utility pages
 * that don't use the full ink PosterHero.
 */
export default function PageHeader({
  kicker,
  title,
  intro,
  children,
  dark = false,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header
      className={`border-b-[6px] border-ink px-5 py-12 sm:px-8 sm:py-16 ${
        dark ? "grain bg-ink text-paper" : "bg-paper"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {kicker ? (
          <p
            className={`mb-3 text-[0.8rem] tracking-[0.14em] uppercase ${
              dark ? "text-ink-muted" : "text-ink-soft"
            }`}
          >
            {kicker}
          </p>
        ) : null}
        <h1
          className={`ov-ink-wipe font-display text-display-lg max-w-[18ch] ${
            dark ? "text-paper" : "text-ink"
          }`}
          style={
            dark
              ? ({ "--ov-wipe-color": "var(--color-danfo)" } as CSSProperties)
              : undefined
          }
        >
          {title}
        </h1>
        {intro ? (
          <p
            className={`mt-5 max-w-[62ch] text-base leading-relaxed sm:text-lg ${
              dark ? "text-[#CFC7BB]" : "text-ink-soft"
            }`}
          >
            {intro}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
