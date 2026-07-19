import { ImageResponse } from "next/og";
import { ACCENTS } from "@/lib/accents";
import { getEra, getEras } from "@/lib/content";
import { loadOgFonts } from "@/lib/og-fonts";

export const alt = "Era cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getEras()).map((era) => ({ era: era.slug }));
}

const INK = "#181410";
const PAPER = "#F4EFE6";

export default async function Image({
  params,
}: {
  params: Promise<{ era: string }>;
}) {
  const era = await getEra((await params).era);
  const { anton, archivo } = await loadOgFonts();
  const fonts = [
    { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
    { name: "Archivo", data: archivo, style: "normal" as const, weight: 700 as const },
  ];

  if (!era) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: INK }} />,
      { ...size, fonts },
    );
  }

  const accent = ACCENTS[era.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(160deg, ${accent.gradient[0]}, ${accent.gradient[1]})`,
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            transform: "rotate(-1deg)",
            background: INK,
            color: PAPER,
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "10px 20px",
          }}
        >
          OlamideVerse — Era {String(era.order).padStart(2, "0")}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 104,
              lineHeight: 1.02,
              color: PAPER,
              maxWidth: 950,
            }}
          >
            {era.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 1,
              color: PAPER,
            }}
          >
            {era.years}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
