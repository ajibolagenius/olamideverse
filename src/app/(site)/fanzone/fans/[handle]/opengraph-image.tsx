import { ImageResponse } from "next/og";
import { BADGES } from "@/lib/fanzone/badges";
import { getFanByHandle, getFanStats } from "@/lib/fanzone/queries";
import { loadOgFonts } from "@/lib/og-fonts";

export const alt = "Public fan profile — OlamideVerse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#181410";
const PAPER = "#F4EFE6";
const DANFO = "#F5B301";
const CARD = "#241E18";
const CARD_BORDER = "#3A332B";

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { anton, archivo } = await loadOgFonts();
  const fonts = [
    { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
    { name: "Archivo", data: archivo, style: "normal" as const, weight: 700 as const },
  ];

  const fan = await getFanByHandle(decodeURIComponent((await params).handle));

  if (!fan) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: INK }} />,
      { ...size, fonts },
    );
  }

  const stats = await getFanStats(fan.id);
  const earned = BADGES.filter((b) => b.earned(stats)).length;

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
          OlamideVerse — Public Fan Zone profile
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 96,
              lineHeight: 1.05,
              color: PAPER,
              maxWidth: 1000,
            }}
          >
            @{fan.handle}
          </div>
          <div style={{ display: "flex", marginTop: 32, gap: 20 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: CARD,
                border: `2px solid ${CARD_BORDER}`,
                padding: "16px 28px",
              }}
            >
              <div style={{ display: "flex", fontFamily: "Anton", fontSize: 44, color: DANFO }}>
                {stats.longestStreak}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Archivo",
                  fontSize: 18,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#CFC7BB",
                }}
              >
                day best streak
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: CARD,
                border: `2px solid ${CARD_BORDER}`,
                padding: "16px 28px",
              }}
            >
              <div style={{ display: "flex", fontFamily: "Anton", fontSize: 44, color: DANFO }}>
                {earned}/{BADGES.length}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Archivo",
                  fontSize: 18,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#CFC7BB",
                }}
              >
                stamps earned
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
