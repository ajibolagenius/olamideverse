import Link from "next/link";
import { AdminMobileNav, AdminSidebarNav } from "@/components/admin/AdminNav";
import { adminLogout } from "@/lib/admin/actions/auth";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <header className="z-30 flex shrink-0 items-center justify-between border-b-[6px] border-ink bg-paper px-4 py-3 sm:px-6">
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
          <Link href="/" className="ov-btn ov-btn-ghost px-2 py-1 text-[0.7rem]">
            View site
          </Link>
          <form action={adminLogout}>
            <button type="submit" className="ov-btn ov-btn-ink px-2 py-1 text-[0.7rem]">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-0 md:gap-6">
        <aside className="hidden min-h-0 w-56 shrink-0 overflow-y-auto overscroll-contain border-r-[3px] border-ink/20 bg-paper-dim/40 p-4 md:block">
          <AdminSidebarNav role={admin.role} />
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6">
          <AdminMobileNav role={admin.role} />
          {children}
        </div>
      </div>
    </div>
  );
}
