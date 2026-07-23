import Link from "next/link";

export default function DoorCard({
  href,
  title,
  copy,
  variant = "light",
}: {
  href: string;
  title: string;
  copy: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <Link
      href={href}
      className={`ov-paste-up ov-lift block border-[3px] border-ink p-6 shadow-paste-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 ${
        dark ? "bg-ink text-paper" : "bg-white"
      }`}
      data-tilt={dark ? "0.5" : "-0.4"}
      style={{ rotate: dark ? "0.5deg" : "-0.4deg" }}
    >
      <span
        className={`font-display mb-1.5 block text-2xl ${dark ? "text-danfo" : ""}`}
      >
        {title}
      </span>
      <span className={`text-sm ${dark ? "text-ink-muted" : "text-ink-soft"}`}>
        {copy}
      </span>
    </Link>
  );
}
