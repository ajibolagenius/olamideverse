import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import FavoriteButton from "@/components/fanzone/FavoriteButton";
import { accentChrome, accentText } from "@/lib/accents";
import type { Album, Era } from "@/lib/content";
import { OV_ICON_WEIGHT } from "@/lib/icons";

/**
 * Editorial tier: the era's own poster header (PosterHero) carries the loud,
 * Poster-tier chrome — this grid tile stays a notch quieter since several
 * sit on `/eras` at once. Accent lives in the rule + label color, not a
 * solid fill; shadow is soft at rest and only hardens on hover.
 */
export default function EraCard({
  era,
  albums,
  showFavorite = false,
}: {
  era: Era;
  albums: Album[];
  showFavorite?: boolean;
}) {
  const chrome = accentChrome(era.accent);
  const labelColor = accentText(era.accent);

  return (
    <div className="ov-paste-up group border-2 border-ink bg-white shadow-print">
      <div
        className="ov-ticket-punch flex items-center justify-between px-4 py-3 sm:px-5"
        style={{ borderLeft: `6px solid ${chrome.bg}` }}
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-ink-muted">
            {String(era.order).padStart(2, "0")}
          </span>
          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-ink-muted">
            · ERA TICKET
          </span>
        </div>
        <span
          className="font-bold tracking-[0.03em] tabular-nums"
          style={{ color: labelColor }}
        >
          {era.years}
        </span>
      </div>
      <div className="border-t border-ink/15 px-4 py-5 sm:px-5">
        <h2 className="font-display text-display-md">{era.title}</h2>
        <p className="mt-2.5 mb-4 max-w-[52ch] text-base text-ink-soft">{era.thesis}</p>
        <div className={`flex flex-wrap gap-x-4 gap-y-2 ${showFavorite ? "mb-4" : ""}`}>
          {albums.map((album) => (
            <span
              key={album.slug}
              className="border-b border-adire-tint pb-0.5 text-sm text-ink-soft"
            >
              <b className="font-semibold text-ink">{album.title}</b> · {album.year}
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
      <div className="border-t border-ink/15 px-4 py-3 sm:px-5">
        <Link
          href={`/eras/${era.slug}`}
          className="ov-icon-inline inline-flex items-center gap-1.5 border-2 border-ink px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors hover:bg-ink hover:text-paper"
        >
          Enter the era
          <ArrowRight className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
