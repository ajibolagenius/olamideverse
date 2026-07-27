import Link from "next/link";

/** Prev/next + numbered pagination, real `<Link>`s so it works without JS. */
export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-3 border-ink pt-6"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="ov-link-underline font-mono text-xs uppercase tracking-[0.08em] hover:text-oxide"
        >
          ← Newer
        </Link>
      ) : (
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft/40">
          ← Newer
        </span>
      )}

      <ol className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "flex h-8 w-8 items-center justify-center border-3 border-ink bg-danfo font-mono text-xs font-bold"
                  : "flex h-8 w-8 items-center justify-center border-3 border-ink bg-white font-mono text-xs hover:bg-paper-dim"
              }
            >
              {p}
            </Link>
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className="ov-link-underline font-mono text-xs uppercase tracking-[0.08em] hover:text-oxide"
        >
          Older →
        </Link>
      ) : (
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft/40">
          Older →
        </span>
      )}
    </nav>
  );
}
