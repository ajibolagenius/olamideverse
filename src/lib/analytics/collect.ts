import { createServiceClient } from "@/lib/supabase/admin";
import {
  BOT_UA,
  DEDUPE_WINDOW_MS,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
} from "./constants";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** In-memory dedupe for the current serverless instance. Best-effort. */
const recentHits = new Map<string, number>();

function pruneDedupe(now: number) {
  if (recentHits.size < 2_000) return;
  for (const [key, ts] of recentHits) {
    if (now - ts > DEDUPE_WINDOW_MS) recentHits.delete(key);
  }
}

export function isBotUserAgent(ua: string | null) {
  if (!ua) return false;
  return BOT_UA.test(ua);
}

export function classifyDevice(ua: string | null): "mobile" | "tablet" | "desktop" | "unknown" {
  if (!ua) return "unknown";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function normalizePath(raw: string): string | null {
  try {
    const path = raw.startsWith("http")
      ? new URL(raw).pathname
      : raw.split("?")[0]?.split("#")[0] ?? "";
    if (!path.startsWith("/")) return null;
    if (/^\/(admin|api)(\/|$)/i.test(path)) return null;
    if (path.length > 500) return null;
    // Collapse accidental doubleslash / trailing junk.
    const clean = path.replace(/\/{2,}/g, "/");
    return clean === "" ? "/" : clean;
  } catch {
    return null;
  }
}

export function referrerHost(referrer: string | null, siteOrigin: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (siteOrigin) {
      const origin = new URL(siteOrigin).host;
      if (url.host === origin) return null; // internal nav
    }
    return url.host.slice(0, 200);
  } catch {
    return null;
  }
}

export function parseUuidCookie(value: string | undefined): string | null {
  if (!value || !UUID_RE.test(value)) return null;
  return value.toLowerCase();
}

export function newId() {
  return crypto.randomUUID();
}

export type CollectResult = {
  ok: boolean;
  ignored?: boolean;
  visitorId: string;
  sessionId: string;
  totals?: { visitors: number; pageviews: number };
  error?: string;
};

export async function recordPageview(input: {
  path: string;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
  siteOrigin: string | null;
  visitorCookie?: string;
  sessionCookie?: string;
}): Promise<CollectResult> {
  if (isBotUserAgent(input.userAgent)) {
    return {
      ok: true,
      ignored: true,
      visitorId: parseUuidCookie(input.visitorCookie) ?? newId(),
      sessionId: parseUuidCookie(input.sessionCookie) ?? newId(),
    };
  }

  const path = normalizePath(input.path);
  if (!path) {
    return {
      ok: true,
      ignored: true,
      visitorId: parseUuidCookie(input.visitorCookie) ?? newId(),
      sessionId: parseUuidCookie(input.sessionCookie) ?? newId(),
    };
  }

  const visitorId = parseUuidCookie(input.visitorCookie) ?? newId();
  const sessionId = parseUuidCookie(input.sessionCookie) ?? newId();

  const dedupeKey = `${visitorId}:${path}`;
  const now = Date.now();
  pruneDedupe(now);
  const last = recentHits.get(dedupeKey);
  if (last && now - last < DEDUPE_WINDOW_MS) {
    return { ok: true, ignored: true, visitorId, sessionId };
  }
  recentHits.set(dedupeKey, now);

  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("record_analytics_pageview", {
    p_path: path,
    p_visitor_id: visitorId,
    p_session_id: sessionId,
    p_referrer_host: referrerHost(input.referrer, input.siteOrigin),
    p_device: classifyDevice(input.userAgent),
    p_country: input.country?.slice(0, 2).toUpperCase() || null,
  });

  if (error) {
    return { ok: false, visitorId, sessionId, error: error.message };
  }

  const payload = data as {
    ok?: boolean;
    total_visitors?: number;
    total_pageviews?: number;
    error?: string;
  } | null;

  if (payload && payload.ok === false) {
    return {
      ok: true,
      ignored: true,
      visitorId,
      sessionId,
      error: payload.error,
    };
  }

  return {
    ok: true,
    visitorId,
    sessionId,
    totals: {
      visitors: Number(payload?.total_visitors ?? 0),
      pageviews: Number(payload?.total_pageviews ?? 0),
    },
  };
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE };
