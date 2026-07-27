import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const OG_ALT =
  "OlamideVerse — the living archive of Olamide's legacy";
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#181410";
const PAPER = "#F4EFE6";
const DANFO = "#F5B301";

export type OgSection = {
  /** Short tag next to the wordmark, e.g. "Archive", "Timeline". */
  eyebrow: string;
  /** Big Anton headline — the page title. */
  title: string;
  /** One-line sub-copy under the headline. */
  tagline: string;
};

/**
 * Shared Open Graph card. Called with no args for the site root's brand
 * card; called with a `section` for every other static/index page so each
 * gets a distinct title instead of the identical homepage wordmark card.
 */
export async function renderDefaultOgImage(section?: OgSection) {
  const { anton, archivo } = await loadOgFonts();
  const fonts = [
    { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
    { name: "Archivo", data: archivo, style: "normal" as const, weight: 700 as const },
  ];

  if (!section) {
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
      { ...OG_SIZE, fonts },
    );
  }

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
          OlamideVerse — {section.eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 104,
              lineHeight: 1.05,
              color: PAPER,
              maxWidth: 1000,
            }}
          >
            {section.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 900,
              fontFamily: "Archivo",
              fontSize: 28,
              lineHeight: 1.35,
              color: "#CFC7BB",
            }}
          >
            {section.tagline}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
