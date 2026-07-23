import Link from "next/link";
import CoverArt from "./CoverArt";
import { ACCENTS } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, type Album, type Era } from "@/lib/content-schema";
import FavoriteButton from "@/components/fanzone/FavoriteButton";

export default function AlbumCard({
  album,
  era,
  index = 0,
  showFavorite = false,
}: {
  album: Album;
  era: Era;
  index?: number;
  showFavorite?: boolean;
}) {
  const tilt = ((index % 3) - 1) * 0.5;
  // danfo fails AA as text-on-white; use its darkened gradient stop instead
  const eraLabelColor =
    era.accent === "danfo" ? ACCENTS.danfo.gradient[1] : ACCENTS[era.accent].solid;
  return (
    <div
      className="ov-paste-up ov-tape relative"
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
        className="block border-[3px] border-ink bg-white shadow-paste transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        <CoverArt title={album.title} slug={album.slug} accent={era.accent} />
        <div className="flex items-center justify-between border-t-[3px] border-ink px-3 py-2 text-sm">
          <span className="text-ink-soft">
            {album.year} · {ALBUM_TYPE_LABEL[album.type]}
          </span>
          <span className="font-bold" style={{ color: eraLabelColor }}>
            {era.title}
          </span>
        </div>
      </Link>
    </div>
  );
}
