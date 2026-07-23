export default function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}
