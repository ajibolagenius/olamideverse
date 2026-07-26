import { createServiceClient } from "@/lib/supabase/admin";
import { createHash } from "node:crypto";

/** Hash client IP (or fallback) so raw addresses aren't stored as rate-limit keys. */
export function hashClientKey(raw: string, namespace: string): string {
  const base = raw.trim() || "unknown";
  return createHash("sha256").update(`${namespace}:${base}`).digest("hex").slice(0, 32);
}

export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
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
