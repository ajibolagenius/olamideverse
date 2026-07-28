/**
 * roll-by — the only looping motion on the site. Content is rendered twice
 * so the CSS 0 → -50% translate loops seamlessly. The animated strip is
 * decorative; a static copy is exposed to assistive tech.
 */
export default function Ticker({
  items,
  className = "bg-danfo border-b-3 border-ink",
}: {
  items: string[];
  className?: string;
}) {
  const strip = (prefix: string) => (
    <span>
      {items.map((item) => (
        <span key={`${prefix}-${item}`} className="mr-12">
          {item}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`ov-marquee py-1.5 text-[0.8rem] font-bold tracking-[0.14em] uppercase ${className}`}>
      <p className="sr-only">{items.join(" · ")}</p>
      <div className="ov-marquee-track" aria-hidden="true">
        {strip("a")}
        {strip("b")}
      </div>
    </div>
  );
}
