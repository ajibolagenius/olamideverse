import Link from "next/link";
import { adminLogout } from "@/lib/admin/actions/auth";
import { ADMIN_NAV } from "@/lib/admin/nav";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#F4EFE6] text-ink">
      <header className="z-30 flex shrink-0 items-center justify-between border-b-4 border-ink bg-paper px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-display text-xl uppercase tracking-wide">
            OV <span className="bg-danfo px-1 text-ink">Admin</span>
          </Link>
          <span className="hidden text-[0.7rem] uppercase tracking-[0.12em] text-ink-soft sm:inline">
            {admin.role}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-ink-soft sm:inline">{admin.email}</span>
          <Link
            href="/"
            className="border-2 border-ink bg-white px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide hover:bg-danfo"
          >
            View site
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="border-2 border-ink bg-ink px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-paper"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-0 md:gap-6">
        <aside className="hidden min-h-0 w-56 shrink-0 overflow-y-auto overscroll-contain border-r-2 border-ink/15 p-4 md:block">
          <nav className="space-y-6">
            {ADMIN_NAV.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items
                    .filter(
                      (item) => !item.roles || item.roles.includes(admin.role),
                    )
                    .map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block border-l-2 border-transparent px-2 py-1.5 text-sm font-medium text-ink hover:border-danfo hover:bg-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6">
          <nav className="mb-6 flex gap-2 overflow-x-auto md:hidden">
            {ADMIN_NAV.flatMap((s) => s.items)
              .filter((item) => !item.roles || item.roles.includes(admin.role))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 border-2 border-ink bg-white px-2 py-1 text-[0.65rem] font-semibold uppercase"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}
