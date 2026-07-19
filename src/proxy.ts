import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Skip static assets and images — no session-relevant cookies to
     * refresh for those.
     */
    "/((?!_next/static|_next/image|favicon.ico|media/|fonts/).*)",
  ],
};
