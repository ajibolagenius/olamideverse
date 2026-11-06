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
      className={`ov-paste-up group relative ${flagship ? "ov-tape" : ""}`}
      data-tilt={tilt}
      style={{ rotate: `${tilt}deg` }}
    >
      {/* Vinyl record disc peeking out behind sleeve on hover */}
      <div
        className="pointer-events-none absolute -right-2 top-4 bottom-12 w-20 rounded-full border-2 border-ink bg-[#141210] shadow-sm transition-transform duration-300 group-hover:translate-x-3 hidden sm:block"
        style={{
          background:
            "radial-gradient(circle, #24201C 30%, #141210 31%, #24201C 60%, #141210 61%)",
        }}
        aria-hidden="true"
      />

      {showFavorite ? (
        <div className="absolute top-1.5 right-1.5 z-20">
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
        className={`relative z-10 block bg-white transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${
          flagship ? "border-3 border-ink shadow-paste" : "border-2 border-ink shadow-print group-hover:shadow-paste-sm"
        }`}
      >
        {/* Archival Catalog Sticker */}
        <div className="absolute top-2 left-2 z-10 border border-ink/40 bg-paper/95 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-ink shadow-print">
          {ALBUM_TYPE_LABEL[album.type]} · {album.year}
        </div>

        <CoverArt
          title={album.title}
          slug={album.slug}
          accent={era.accent}
          priority={priority}
        />
        <div
          className={`flex items-center justify-between px-3 py-2 text-sm ${
            flagship ? "border-t-3" : "border-t-2"
          } border-ink bg-paper-dim/40`}
        >
          <span className="font-display tracking-wide uppercase truncate text-ink">
            {album.title}
          </span>
          <span className="font-bold shrink-0 ml-2 text-xs" style={{ color: labelColor }}>
            {era.title}
          </span>
        </div>
      </Link>
    </div>
  );
}
