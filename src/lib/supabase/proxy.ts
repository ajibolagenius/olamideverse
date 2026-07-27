import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isAuthCookieName(name: string) {
  return (
    name.startsWith("sb-") &&
    (name.includes("-auth-token") || name.endsWith("-auth-token-code-verifier"))
  );
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  for (const { name } of request.cookies.getAll()) {
    if (!isAuthCookieName(name)) continue;
    request.cookies.delete(name);
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

function isStaleRefreshError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; message?: string; status?: number };
  const code = (err.code ?? "").toLowerCase();
  const message = (err.message ?? "").toLowerCase();
  return (
    code === "refresh_token_not_found" ||
    code === "refresh_token_already_used" ||
    message.includes("refresh token") ||
    (err.status === 400 && message.includes("refresh"))
  );
}

/**
 * Refreshes the Supabase session cookie on every request, gates /admin/*,
 * and applies CMS redirects + maintenance mode for the public site.
 *
 * Stale / revoked refresh tokens are cleared instead of spamming
 * AuthApiError across every navigation.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  let user: { id: string } | null = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      if (isStaleRefreshError(error)) {
        clearSupabaseAuthCookies(request, response);
      }
      user = null;
    } else {
      user = data.user;
    }
  } catch (error) {
    if (isStaleRefreshError(error)) {
      clearSupabaseAuthCookies(request, response);
    }
    user = null;
  }

  if (isAdmin && !isLogin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("disabled")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin || admin.disabled) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  if (isLogin && user) {
    const { data: admin } = await supabase
      .from("admin_users")
      .select("disabled")
      .eq("user_id", user.id)
      .maybeSingle();
    if (admin && !admin.disabled) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Public CMS redirects (skip admin + static-ish)
  if (!isAdmin && !pathname.startsWith("/_next") && !pathname.startsWith("/api/")) {
    const { data: redir } = await supabase
      .from("cms_redirects")
      .select("to_path, permanent")
      .eq("from_path", pathname)
      .maybeSingle();
    if (redir?.to_path) {
      const url = request.nextUrl.clone();
      url.pathname = redir.to_path;
      return NextResponse.redirect(url, redir.permanent ? 308 : 307);
    }
  }

  return response;
}
