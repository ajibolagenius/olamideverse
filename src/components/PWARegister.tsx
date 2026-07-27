"use client";

import { useEffect } from "react";

/** Registers the offline-support service worker (public/sw.js). Skipped in
 * development — Turbopack rewrites `/_next/static` chunk hashes on every
 * rebuild, and a cache-first SW will serve stale HMR clients (ChunkLoadError).
 * Also no-ops when the browser rejects registration. */
export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "development") {
      // Clear any SW left over from a prior production visit to this origin
      // so localhost never keeps serving cached Turbopack chunks.
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister();
      });
      if ("caches" in window) {
        void caches.keys().then((keys) => {
          for (const key of keys) {
            if (key.startsWith("ov-")) void caches.delete(key);
          }
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
