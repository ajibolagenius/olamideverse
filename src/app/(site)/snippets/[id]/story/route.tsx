import { getEra, getSnippet, getSnippets } from "@/lib/content";
import { renderSnippetStoryImage } from "@/lib/og-snippet";

export async function generateStaticParams() {
  return (await getSnippets()).map((snippet) => ({ id: snippet.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const snippet = await getSnippet(id);
  if (!snippet) {
    return new Response("Not found", { status: 404 });
  }
  const era = (await getEra(snippet.era))!;
  return renderSnippetStoryImage(snippet, era.accent);
}
