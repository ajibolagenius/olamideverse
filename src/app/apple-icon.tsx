import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK = "#181410";
const DANFO = "#F5B301";
const PAPER = "#F4EFE6";

/**
 * Same brand ring as icon.tsx, scaled up for the iOS home-screen tile
 * (the OS applies its own corner mask, so this stays full-bleed square).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
        }}
      >
        <div
          style={{
            width: 136,
            height: 136,
            borderRadius: "50%",
            border: `38px solid ${DANFO}`,
            background: INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: PAPER,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
