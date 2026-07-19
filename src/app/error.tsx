"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-6 py-24 text-center">
      <div className="max-w-md">
        <p className="mb-3 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          Error
        </p>
        <h1 className="font-display text-display-md mb-4">Something broke</h1>
        <p className="mb-8 text-ink-soft">
          The archive hit a snag loading this page. Try again — if it keeps
          happening, check back shortly.
        </p>
        <button
          type="button"
          onClick={reset}
          className="border-[3px] border-ink bg-danfo px-5 py-3 text-sm font-bold tracking-[0.06em] uppercase text-ink shadow-paste-sm"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
