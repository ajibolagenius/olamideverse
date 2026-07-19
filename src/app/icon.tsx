import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const INK = "#181410";
const DANFO = "#F5B301";
const PAPER = "#F4EFE6";

/**
 * Brand mark: a danfo-yellow ring with a paper center on ink ground — reads
 * as both a vinyl record and the "O" of Olamide (docs/VISUAL-IDENTITY.md
 * palette). No text at this size; Anton glyphs don't hold up at 32px.
 */
export default function Icon() {
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
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `7px solid ${DANFO}`,
            background: INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
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
