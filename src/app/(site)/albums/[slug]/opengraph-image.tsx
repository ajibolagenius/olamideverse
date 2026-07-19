import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ACCENTS } from "@/lib/accents";
import { ALBUM_TYPE_LABEL, getAlbum, getAlbums, getEra } from "@/lib/content";
import { loadOgFonts } from "@/lib/og-fonts";
import { ALBUM_COVERS } from "@/lib/photos";

export const alt = "Album cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getAlbums()).map((album) => ({ slug: album.slug }));
}

const PAPER = "#F4EFE6";
const INK = "#181410";

async function coverDataUri(slug: string) {
  const relPath = ALBUM_COVERS[slug];
  if (!relPath) return undefined;
  const bytes = await readFile(join(process.cwd(), "public", relPath));
  const ext = relPath.split(".").pop() === "png" ? "png" : "jpeg";
  return `data:image/${ext};base64,${bytes.toString("base64")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getAlbum(slug);
  const { anton, archivo } = await loadOgFonts();
  const fonts = [
    { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
    { name: "Archivo", data: archivo, style: "normal" as const, weight: 700 as const },
  ];

  if (!album) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: INK }} />,
      { ...size, fonts },
    );
  }

  const era = (await getEra(album.era))!;
  const accent = ACCENTS[era.accent];
  const cover = await coverDataUri(album.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 480,
            height: "100%",
            // satori chokes if `background` is present with an `undefined`
            // value, so this key is only added when there's no cover image.
            ...(cover
              ? {}
              : {
                  background: `linear-gradient(160deg, ${accent.gradient[0]}, ${accent.gradient[1]})`,
                }),
          }}
        >
          {cover ? (
            <img
              src={cover}
              width={480}
              height={630}
              style={{ objectFit: "cover" }}
              alt=""
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                fontFamily: "Anton",
                fontSize: 56,
                textAlign: "center",
                color: PAPER,
              }}
            >
              {album.title}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              transform: "rotate(-1deg)",
              background: accent.solid,
              color: accent.onSolid,
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              padding: "8px 16px",
              marginBottom: 28,
            }}
          >
            {era.title} · Era {String(era.order).padStart(2, "0")}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 84,
              lineHeight: 1.05,
              color: PAPER,
              maxWidth: 620,
            }}
          >
            {album.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontFamily: "Archivo",
              fontSize: 28,
              color: "#CFC7BB",
            }}
          >
            {album.year} · {ALBUM_TYPE_LABEL[album.type]}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
