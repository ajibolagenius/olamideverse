import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-ink px-5 pt-10 pb-8 text-[0.8rem] text-ink-muted sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 pb-6">
        <span className="font-display text-xl text-paper">
          Olamide<span className="bg-danfo px-[0.12em] text-ink">Verse</span>
        </span>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 font-semibold tracking-[0.05em] uppercase"
        >
          <Link href="/legal" className="hover:text-danfo">
            Legal
          </Link>
          <Link href="/about" className="hover:text-danfo">
            Source credits
          </Link>
          <Link href="/legal#takedown" className="hover:text-danfo">
            Takedown
          </Link>
          <Link href="/fanzone" className="hover:text-danfo">
            Fan Zone
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl border-t border-[#3A332B] pt-4 text-center tracking-[0.04em] uppercase">
        Fan project · Not affiliated with Olamide or YBNL Nation · Archival
        &amp; educational
      </div>
    </footer>
  );
}
