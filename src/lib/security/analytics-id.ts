/** GA4 (G-…) or GTM (GTM-…) measurement / container IDs only. */
const ANALYTICS_ID_RE = /^(G|GTM)-([A-Z0-9]+)$/i;

/** Returns a normalized ID or "" if invalid. */
export function normalizeAnalyticsId(raw: string | null | undefined): string {
  const id = (raw ?? "").trim();
  const match = id.match(ANALYTICS_ID_RE);
  if (!match) return "";
  return `${match[1]!.toUpperCase()}-${match[2]!.toUpperCase()}`;
}
