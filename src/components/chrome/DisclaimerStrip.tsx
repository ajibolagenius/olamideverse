export default function DisclaimerStrip({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  const parts = highlight && text.includes(highlight) ? text.split(highlight) : null;

  return (
    <div className="bg-ink px-3 py-1.5 text-center text-[0.72rem] tracking-[0.08em] uppercase text-ink-muted">
      {parts ? (
        <>
          {parts[0]}
          <b className="font-semibold text-danfo">{highlight}</b>
          {parts[1]}
        </>
      ) : (
        text
      )}
    </div>
  );
}
