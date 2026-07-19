import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie on every request, gates /admin/*,
 * and applies CMS redirects + maintenance mode for the public site.
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

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isAdmin = pathname.startsWith("/admin");
    const isLogin = pathname === "/admin/login";

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
    if (!isAdmin && !pathname.startsWith("/_next")) {
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
