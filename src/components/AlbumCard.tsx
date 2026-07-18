import Link from "next/link";
import CoverArt from "./CoverArt";
import { ACCENTS } from "@/lib/accents";
import type { Album, Era } from "@/lib/content";

const TYPE_LABEL: Record<Album["type"], string> = {
  album: "Album",
  mixtape: "Mixtape",
  ep: "EP",
  joint: "Joint album",
};

export default function AlbumCard({
  album,
  era,
  index = 0,
}: {
  album: Album;
  era: Era;
  index?: number;
}) {
  const tilt = ((index % 3) - 1) * 0.5;
  // danfo fails AA as text-on-white; use its darkened gradient stop instead
  const eraLabelColor =
    era.accent === "danfo" ? ACCENTS.danfo.gradient[1] : ACCENTS[era.accent].solid;
  return (
    <Link
      href={`/albums/${album.slug}`}
      className="ov-paste-up block border-[3px] border-ink bg-white shadow-paste transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      data-tilt={tilt}
      style={{ rotate: `${tilt}deg` }}
    >
      <CoverArt title={album.title} accent={era.accent} />
      <div className="flex items-center justify-between border-t-[3px] border-ink px-3 py-2 text-sm">
        <span className="text-ink-soft">
          {album.year} · {TYPE_LABEL[album.type]}
        </span>
        <span className="font-bold" style={{ color: eraLabelColor }}>
          {era.title}
        </span>
      </div>
    </Link>
  );
}
