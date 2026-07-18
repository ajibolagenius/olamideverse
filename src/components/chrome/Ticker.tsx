/**
 * roll-by — the only looping motion on the site. Content is rendered twice
 * (second copy aria-hidden) so the CSS 0 → -50% translate loops seamlessly.
 */
export default function Ticker({
  items,
  className = "bg-danfo border-b-[3px] border-ink",
}: {
  items: string[];
  className?: string;
}) {
  const strip = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="mr-12">
          {item}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`ov-marquee py-1.5 text-[0.8rem] font-bold tracking-[0.14em] uppercase ${className}`}>
      <div className="ov-marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
