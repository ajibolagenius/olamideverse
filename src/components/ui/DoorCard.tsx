import type { Icon } from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { OV_ICON_WEIGHT, renderIcon, renderNavIcon } from "@/lib/icons";

export default function DoorCard({
  href,
  title,
  copy,
  variant = "light",
  icon,
}: {
  href: string;
  title: string;
  copy: string;
  variant?: "light" | "dark";
  icon?: Icon;
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
      {icon
        ? renderIcon(icon, {
            className: `ov-icon mb-3 ${dark ? "text-danfo" : "text-oxide"}`,
            size: 28,
          })
        : renderNavIcon(href, {
            className: `ov-icon mb-3 ${dark ? "text-danfo" : "text-oxide"}`,
            size: 28,
          })}
      <span
        className={`font-display mb-1.5 block text-2xl ${dark ? "text-danfo" : ""}`}
      >
        {title}
      </span>
      <span className={`text-sm ${dark ? "text-ink-muted" : "text-ink-soft"}`}>
        {copy}
      </span>
      <span
        className={`ov-icon-inline mt-4 text-xs font-bold tracking-[0.08em] uppercase ${
          dark ? "text-danfo" : "text-adire"
        }`}
      >
        Enter
        <ArrowRight className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
      </span>
    </Link>
  );
}
