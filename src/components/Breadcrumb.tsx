import Link from "next/link";
import { ArrowLeft, ArrowRight, CaretRight } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbSibling = {
  label: string;
  href: string;
};

export default function Breadcrumb({
  items,
  previous,
  next,
}: {
  items: BreadcrumbItem[];
  previous?: BreadcrumbSibling | null;
  next?: BreadcrumbSibling | null;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className="border-b border-ink/15 pb-3 text-sm uppercase tracking-[0.06em] text-ink-soft"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
                {index > 0 ? (
                  <CaretRight
                    className="ov-icon text-ink/35"
                    size={12}
                    weight={OV_ICON_WEIGHT}
                    aria-hidden
                  />
                ) : null}
                {item.href && !isLast ? (
                  <Link href={item.href} className="ov-link-underline hover:text-oxide">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "font-semibold text-ink" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {previous || next ? (
        <nav
          aria-label="Adjacent pages"
          className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs uppercase tracking-[0.06em]"
        >
          {previous ? (
            <Link
              href={previous.href}
              className="ov-icon-inline ov-link-underline text-ink-soft hover:text-oxide"
            >
              <ArrowLeft className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              {previous.label}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.href}
              className="ov-icon-inline ov-link-underline ml-auto text-ink-soft hover:text-oxide"
            >
              {next.label}
              <ArrowRight className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
