export default function EmptyState({
  message = "No items yet — check back as the archive grows.",
}: {
  message?: string;
}) {
  return (
    <div className="border-2 border-dashed border-ink-soft p-8 text-center text-sm text-ink-soft">
      {message}
    </div>
  );
}
