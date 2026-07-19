import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const alt = "OlamideVerse — the living archive of Olamide's legacy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#181410";
const PAPER = "#F4EFE6";
const DANFO = "#F5B301";

export default async function Image() {
  const { anton, archivo } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            transform: "rotate(-1deg)",
            background: DANFO,
            color: INK,
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "10px 20px",
          }}
        >
          Fan Archive — Not affiliated with Olamide or YBNL Nation
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 128,
              lineHeight: 1,
              color: PAPER,
            }}
          >
            Olamide
            <span style={{ background: DANFO, color: INK, padding: "0 12px" }}>
              Verse
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 900,
              fontFamily: "Archivo",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#CFC7BB",
            }}
          >
            The living archive of a Bariga upstart&apos;s rise — era by era,
            album by album.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Archivo", data: archivo, style: "normal", weight: 700 },
      ],
    },
  );
}
