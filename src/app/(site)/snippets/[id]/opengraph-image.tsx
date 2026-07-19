import { getEra, getSnippet, getSnippets } from "@/lib/content";
import { renderSnippetOgImage, SNIPPET_OG_SIZE } from "@/lib/og-snippet";

export const alt = "OlamideVerse audiogram snippet";
export const size = SNIPPET_OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getSnippets()).map((snippet) => ({ id: snippet.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getSnippet(id);
  if (!snippet) {
    const { ImageResponse } = await import("next/og");
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#181410" }} />,
      { ...size },
    );
  }
  const era = (await getEra(snippet.era))!;
  return renderSnippetOgImage(snippet, era.accent);
}
