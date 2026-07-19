import { Fragment } from "react";

/**
 * Renders `*italic*` spans inside frontmatter-sourced plain strings (album
 * titles in era context paragraphs). Not general markdown — just this one
 * pattern, since frontmatter strings aren't run through the MDX pipeline.
 */
export default function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
