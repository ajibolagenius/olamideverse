import { ImageResponse } from "next/og";
import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Snippet } from "@/lib/content-schema";
import { loadOgFonts } from "@/lib/og-fonts";
import { waveformBars } from "@/lib/waveform";

export const SNIPPET_OG_SIZE = { width: 1200, height: 630 };

const INK = "#181410";
const PAPER = "#F4EFE6";

export async function renderSnippetOgImage(
  snippet: Snippet,
  accentName: AccentName,
) {
  const { anton, archivo } = await loadOgFonts();
  const accent = ACCENTS[accentName];
  const bars = waveformBars(snippet.waveformSeed, 42);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: accent.solid,
            color: accent.onSolid,
            padding: "14px 22px",
            transform: "rotate(-0.8deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Audiogram · {snippet.year}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 36,
              lineHeight: 1,
            }}
          >
            {snippet.track}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 5,
            height: 110,
            marginTop: 40,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 14,
                height: Math.round(h * 100),
                background: i % 5 === 0 ? accent.solid : PAPER,
                opacity: i % 5 === 0 ? 1 : 0.55,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontFamily: "Anton",
            fontSize: 52,
            lineHeight: 1.15,
            color: PAPER,
            maxWidth: 1040,
          }}
        >
          “{snippet.quote}”
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid #3A332B",
            paddingTop: 22,
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#CFC7BB",
          }}
        >
          <div style={{ display: "flex" }}>
            {snippet.albumTitle} · OlamideVerse
          </div>
          <div style={{ display: "flex", color: accent.solid }}>Share a snippet</div>
        </div>
      </div>
    ),
    {
      ...SNIPPET_OG_SIZE,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Archivo", data: archivo, style: "normal", weight: 700 },
      ],
    },
  );
}
