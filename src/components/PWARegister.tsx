"use client";

import { useEffect } from "react";

/** Registers the offline-support service worker (public/sw.js). Silently
 * no-ops in browsers/contexts without support (e.g. localhost over http in
 * some setups) — this is a progressive enhancement, not a requirement. */
export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
