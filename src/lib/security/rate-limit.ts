import { createServiceClient } from "@/lib/supabase/admin";
import { createHash } from "node:crypto";

/** Hash client IP (or fallback) so raw addresses aren't stored as rate-limit keys. */
export function hashClientKey(raw: string, namespace: string): string {
  const base = raw.trim() || "unknown";
  return createHash("sha256").update(`${namespace}:${base}`).digest("hex").slice(0, 32);
}

export function clientIpFromHeaders(headers: Headers): string {
  // `x-vercel-forwarded-for` is appended by Vercel's edge network itself and
  // can't be set by the client — prefer it over `x-forwarded-for`, whose
  // leftmost (client-controlled) entry a direct HTTP caller can set to any
  // value on every request, defeating IP-keyed rate limiting entirely.
  const vercelForwarded = headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    const first = vercelForwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    // Without a trusted platform header, the only hop a reverse proxy chain
    // guarantees wasn't set by the client is the last one appended.
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Durable Postgres rate limit via security-definer RPC (service role).
 * Returns true when the request is allowed.
 *
 * `failOpen`: when true (analytics), a missing/broken limiter still allows
 * the request so a pre-migration deploy doesn't freeze the site. Signup
 * should leave this false (fail closed).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  opts: { failOpen?: boolean } = {},
): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("check_rate_limit failed", error.message);
      return Boolean(opts.failOpen);
    }
    return Boolean(data);
  } catch (err) {
    console.error("check_rate_limit exception", err);
    return Boolean(opts.failOpen);
  }
}
