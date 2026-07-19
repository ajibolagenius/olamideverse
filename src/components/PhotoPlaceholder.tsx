import type { CSSProperties } from "react";
import Image from "next/image";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { EraPhoto } from "@/lib/photos";

/**
 * Archival photo slot with the duotone-shift treatment. Renders a real,
 * credited photo when one is wired up (src/lib/photos.ts); otherwise a
 * gradient placeholder with a label, so ungrounded slots stay honest about
 * being placeholders rather than looking like a missing image.
 */
export default function PhotoPlaceholder({
  accent,
  label,
  photo,
  className = "min-h-[280px]",
}: {
  accent: AccentName;
  label: string;
  photo?: EraPhoto;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`ov-duotone relative border-[3px] border-ink bg-[#2A241D] ${className}`}
      style={{ "--ov-duotone-color": a.solid } as CSSProperties}
    >
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={label}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <span className="absolute right-1.5 bottom-1.5 z-10 bg-ink/80 px-1.5 py-0.5 text-[0.62rem] text-ink-muted">
            Photo: {photo.credit},{" "}
            <a href={photo.licenseUrl} className="underline hover:text-danfo">
              {photo.license}
            </a>
          </span>
        </>
      ) : (
        <div className="grid h-full place-items-center">
          <span className="max-w-[24ch] px-6 text-center text-sm text-ink-muted">{label}</span>
        </div>
      )}
      <span aria-hidden className="ov-duotone-overlay" />
    </div>
  );
}
