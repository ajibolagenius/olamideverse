import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import type { Album, Era } from "@/lib/content";
import FavoriteButton from "@/components/fanzone/FavoriteButton";

export default function EraCard({
  era,
  albums,
  index,
}: {
  era: Era;
  albums: Album[];
  index: number;
}) {
  const accent = ACCENTS[era.accent];
  const tilt = index % 2 === 0 ? -0.6 : 0.5;

  return (
    <div
      className="ov-paste-up group border-[3px] border-ink bg-white shadow-[7px_7px_0_var(--color-ink)]"
      data-tilt={tilt}
      style={{ rotate: `${tilt}deg` }}
    >
      <div
        className="flex items-center justify-between border-b-[3px] border-ink px-4 py-2.5"
        style={{ background: accent.solid, color: accent.onSolid }}
      >
        <span className="font-display text-2xl">
          {String(era.order).padStart(2, "0")}
        </span>
        <span className="font-bold tracking-[0.05em] tabular-nums">{era.years}</span>
      </div>
      <div className="px-4 py-5 sm:px-5">
        <h3 className="font-display text-display-md">{era.title}</h3>
        <p className="mt-2.5 mb-4 max-w-[52ch] text-base text-ink-soft">{era.thesis}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {albums.map((album) => (
            <span
              key={album.slug}
              className="border-2 border-ink bg-paper px-2.5 py-1 text-xs font-semibold tracking-[0.06em] uppercase"
            >
              {album.title} · {album.year}
            </span>
          ))}
        </div>
        <FavoriteButton
          id={`era:${era.slug}`}
          label={era.title}
          kind="era"
          href={`/eras/${era.slug}`}
        />
      </div>
      <Link
        href={`/eras/${era.slug}`}
        className="block border-t-[3px] border-ink px-4 py-3 text-sm font-bold tracking-[0.08em] uppercase text-adire transition-colors hover:bg-ink hover:text-paper"
      >
        Enter the era →
      </Link>
    </div>
  );
}
