"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin/nav";
import type { AdminRole } from "@/lib/admin/types";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {ADMIN_NAV.map((section) => {
        const items = section.items.filter(
          (item) => !item.roles || item.roles.includes(role),
        );
        if (!items.length) return null;
        return (
          <div key={section.title}>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {section.title}
            </p>
            <ul className="space-y-1">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "block border-l-[3px] border-danfo bg-white px-2 py-1.5 text-sm font-bold text-ink shadow-paste-sm"
                          : "block border-l-[3px] border-transparent px-2 py-1.5 text-sm font-medium text-ink hover:border-danfo hover:bg-white"
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto md:hidden">
      {ADMIN_NAV.flatMap((s) => s.items)
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "ov-btn ov-btn-danfo shrink-0 px-2 py-1 text-[0.65rem]"
                  : "ov-btn ov-btn-ghost shrink-0 px-2 py-1 text-[0.65rem]"
              }
            >
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}
