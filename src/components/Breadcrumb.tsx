import Link from "next/link";

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
    <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className="text-sm uppercase tracking-[0.06em] text-ink-soft"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-ink-soft/70">
                    /
                  </span>
                ) : null}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-oxide">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "text-ink" : undefined}
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
          className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-ink/15 pt-2.5 text-xs uppercase tracking-[0.06em]"
        >
          {previous ? (
            <Link href={previous.href} className="text-ink-soft hover:text-oxide">
              ← {previous.label}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.href} className="ml-auto text-ink-soft hover:text-oxide">
              {next.label} →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
