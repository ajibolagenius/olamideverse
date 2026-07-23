import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import FavoriteButton from "@/components/fanzone/FavoriteButton";
import { accentChrome } from "@/lib/accents";
import type { Album, Era } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function EraCard({
  era,
  albums,
  index,
  showFavorite = false,
}: {
  era: Era;
  albums: Album[];
  index: number;
  showFavorite?: boolean;
}) {
  const chrome = accentChrome(era.accent);
  const tilt = index % 2 === 0 ? -0.6 : 0.5;

  return (
    <div
      className="ov-paste-up group border-[3px] border-ink bg-white shadow-[7px_7px_0_var(--color-ink)]"
      data-tilt={tilt}
      style={{ rotate: `${tilt}deg` }}
    >
      <div
        className="flex items-center justify-between border-b-[3px] border-ink px-4 py-2.5"
        style={{ background: chrome.bg, color: chrome.fg }}
      >
        <span className="font-display text-2xl">
          {String(era.order).padStart(2, "0")}
        </span>
        <span className="font-bold tracking-[0.05em] tabular-nums">{era.years}</span>
      </div>
      <div className="px-4 py-5 sm:px-5">
        <h2 className="font-display text-display-md">{era.title}</h2>
        <p className="mt-2.5 mb-4 max-w-[52ch] text-base text-ink-soft">{era.thesis}</p>
        <div className={`flex flex-wrap gap-2 ${showFavorite ? "mb-4" : ""}`}>
          {albums.map((album) => (
            <span
              key={album.slug}
              className="border-2 border-ink bg-paper px-2.5 py-1 text-xs font-semibold tracking-[0.06em] uppercase"
            >
              {album.title} · {album.year}
            </span>
          ))}
        </div>
        {showFavorite ? (
          <FavoriteButton
            id={`era:${era.slug}`}
            label={era.title}
            kind="era"
            href={`/eras/${era.slug}`}
          />
        ) : null}
      </div>
      <Link
        href={`/eras/${era.slug}`}
        className="ov-icon-inline block border-t-[3px] border-ink px-4 py-3 text-sm font-bold tracking-[0.08em] uppercase text-adire transition-colors hover:bg-ink hover:text-paper"
      >
        Enter the era
        <ArrowRight className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
      </Link>
    </div>
  );
}
