import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Skip static assets, images, and first-party analytics collect/totals —
     * those don't need a session refresh (and stale auth cookies were adding
     * hundreds of ms + AuthApiError noise on every hit).
     */
    "/((?!_next/static|_next/image|favicon.ico|media/|fonts/|api/analytics/).*)",
  ],
};
