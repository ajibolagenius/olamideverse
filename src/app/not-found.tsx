import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-6 py-24 text-center">
      <div className="max-w-md">
        <p className="mb-3 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          404
        </p>
        <h1 className="font-display text-display-md mb-4">Page not found</h1>
        <p className="mb-8 text-ink-soft">
          That chapter isn&apos;t in the archive — or it moved. Head back to the
          eras or the discography.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/eras"
            className="border-[3px] border-ink bg-danfo px-5 py-3 text-sm font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm"
          >
            Eras
          </Link>
          <Link
            href="/albums"
            className="border-[3px] border-ink bg-white px-5 py-3 text-sm font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm"
          >
            Discography
          </Link>
        </div>
      </div>
    </main>
  );
}
