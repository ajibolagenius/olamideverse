import type { CSSProperties } from "react";
import Image from "next/image";
import { ACCENTS, type AccentName } from "@/lib/accents";
import { ALBUM_COVERS } from "@/lib/photos";

/**
 * Album cover in the vinyl-label motif — era-accent gradient + rotated tape
 * strip fallback, or a real cover (src/lib/photos.ts → ALBUM_COVERS) when
 * one's wired up. See photos.ts for that image source's licensing caveat.
 */
export default function CoverArt({
  title,
  slug,
  accent,
  className = "aspect-video",
}: {
  title: string;
  slug?: string;
  accent: AccentName;
  className?: string;
}) {
  const a = ACCENTS[accent];
  const cover = slug ? ALBUM_COVERS[slug] : undefined;

  return (
    <div
      className={`ov-duotone relative flex items-end ${className}`}
      style={
        cover
          ? undefined
          : ({
              background: `linear-gradient(160deg, ${a.gradient[0]}, ${a.gradient[1]})`,
              "--ov-duotone-color": a.solid,
            } as CSSProperties)
      }
    >
      {cover ? (
        <Image
          src={cover}
          alt={`${title} cover art`}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      ) : null}
      <span
        aria-hidden
        className="absolute -top-1 left-[34%] z-10 h-2.5 w-9 rotate-[-2deg] bg-paper/75"
      />
      {!cover ? <span className="font-display p-3 text-lg text-paper">{title}</span> : null}
      <span aria-hidden className="ov-duotone-overlay" />
    </div>
  );
}
