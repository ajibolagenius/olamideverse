import { NextResponse, type NextRequest } from "next/server";
import {
  cookieOptions,
  recordPageview,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
} from "@/lib/analytics/collect";

export const runtime = "nodejs";

type Body = {
  path?: string;
  referrer?: string | null;
};

export async function POST(request: NextRequest) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path : "";
  if (!path) {
    return NextResponse.json({ ok: false, error: "path_required" }, { status: 400 });
  }

  const result = await recordPageview({
    path,
    referrer:
      typeof body.referrer === "string"
        ? body.referrer
        : request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
    country:
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry"),
    siteOrigin: request.nextUrl.origin,
    visitorCookie: request.cookies.get(VISITOR_COOKIE)?.value,
    sessionCookie: request.cookies.get(SESSION_COOKIE)?.value,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "collect_failed" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({
    ok: true,
    ignored: Boolean(result.ignored),
    totals: result.totals ?? null,
  });

  res.cookies.set(
    VISITOR_COOKIE,
    result.visitorId,
    cookieOptions(VISITOR_COOKIE_MAX_AGE),
  );
  res.cookies.set(
    SESSION_COOKIE,
    result.sessionId,
    cookieOptions(SESSION_COOKIE_MAX_AGE),
  );

  return res;
}
