import { NextResponse, type NextRequest } from "next/server";
import {
  cookieOptions,
  parseUuidCookie,
  recordPageview,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
} from "@/lib/analytics/collect";
import {
  checkRateLimit,
  clientIpFromHeaders,
  hashClientKey,
} from "@/lib/security/rate-limit";

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

  const ip = clientIpFromHeaders(request.headers);
  const ipKey = hashClientKey(ip, "analytics");
  const hasVisitorCookie = Boolean(
    parseUuidCookie(request.cookies.get(VISITOR_COOKIE)?.value),
  );

  // Burst cap — all hits from one IP.
  const allowedBurst = await checkRateLimit(`analytics:burst:${ipKey}`, 60, 60, {
    failOpen: true,
  });
  if (!allowedBurst) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
  }

  // New-visitor minting is stricter (cookie-less callers).
  if (!hasVisitorCookie) {
    const allowedNew = await checkRateLimit(`analytics:new:${ipKey}`, 10, 3600, {
      failOpen: true,
    });
    if (!allowedNew) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }
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
