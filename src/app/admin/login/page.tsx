import { redirect } from "next/navigation";
import { adminLogin } from "@/lib/admin/actions/auth";
import { getAdminSession } from "@/lib/admin/auth";

const ERRORS: Record<string, string> = {
  missing: "Email and password are required.",
  invalid: "Invalid email or password.",
  unauthorized: "This account is not an admin.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md border-4 border-danfo bg-paper p-8 shadow-[8px_8px_0_#F5B301]">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          OlamideVerse
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase">Admin</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in with your staff account. Fan Zone anonymous sessions are
          cleared on login.
        </p>

        {error ? (
          <p className="mt-4 border-2 border-ink bg-oxide px-3 py-2 text-sm text-paper">
            {ERRORS[error] ?? error}
          </p>
        ) : null}

        <form action={adminLogin} className="mt-6 space-y-4">
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full border-2 border-ink bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border-2 border-ink bg-white px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="w-full border-2 border-ink bg-danfo px-3 py-3 text-sm font-bold uppercase tracking-wide text-ink"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
