"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Fires one first-party pageview per client-side navigation.
 * Cookies (visitor / session ids) are set httpOnly by the collect API.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Don't track the admin console from the public tracker (also blocked server-side).
    if (pathname.startsWith("/admin")) return;

    const key = `${pathname}?${searchParams?.toString() ?? ""}`;
    if (lastSent.current === key) return;
    lastSent.current = key;

    const controller = new AbortController();
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    void fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Silent — analytics must never break the page.
    });

    return () => controller.abort();
  }, [pathname, searchParams]);

  return null;
}
