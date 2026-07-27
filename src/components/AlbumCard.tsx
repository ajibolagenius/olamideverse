import Link from "next/link";
import CoverArt from "./CoverArt";
import { accentText } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, type Album, type Era } from "@/lib/content-schema";
import FavoriteButton from "@/components/fanzone/FavoriteButton";

/**
 * Editorial tier by default: flat at rest, hard shadow only on hover
 * (`.ov-paste-up:hover` in globals.css). `flagship` opts a single card per
 * grid into Poster tier — tilt, tape, the heavier border — so a page of
 * cards keeps one loud moment instead of every card wearing it.
 */
export default function AlbumCard({
  album,
  era,
  showFavorite = false,
  priority = false,
  flagship = false,
}: {
  album: Album;
  era: Era;
  showFavorite?: boolean;
  /** Eager-load cover when this card is likely LCP (first above-the-fold). */
  priority?: boolean;
  /** Poster-tier treatment (tilt, tape, heavier border) for the one release that should read as the defining record in its grid. */
  flagship?: boolean;
}) {
  const labelColor = accentText(era.accent);
  const tilt = flagship ? -1.1 : 0;
  return (
    <div
      className={`ov-paste-up relative ${flagship ? "ov-tape" : ""}`}
      data-tilt={tilt}
      style={{ rotate: `${tilt}deg` }}
    >
      {showFavorite ? (
        <div className="absolute top-1.5 right-1.5 z-10">
          <FavoriteButton
            id={`album:${album.slug}`}
            label={album.title}
            kind="album"
            href={`/albums/${album.slug}`}
          />
        </div>
      ) : null}
      <Link
        href={`/albums/${album.slug}`}
        className={`block bg-white transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 ${
          flagship ? "border-3 border-ink shadow-paste-sm" : "border-2 border-ink shadow-print"
        }`}
      >
        <CoverArt
          title={album.title}
          slug={album.slug}
          accent={era.accent}
          priority={priority}
        />
        <div
          className={`flex items-center justify-between px-3 py-2 text-sm ${
            flagship ? "border-t-3" : "border-t-2"
          } border-ink`}
        >
          <span className="text-ink-soft">
            {album.year} · {ALBUM_TYPE_LABEL[album.type]}
          </span>
          <span className="font-bold" style={{ color: labelColor }}>
            {era.title}
          </span>
        </div>
      </Link>
    </div>
  );
}
