"use client";

import { ArrowsClockwise } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { OV_ICON_WEIGHT } from "@/lib/icons";

const UPDATE_CHECK_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Tells a returning visitor a new build just went live. `sw.js` is
 * skipWaiting/clients.claim (see public/sw.js), so the moment a fresh
 * deploy's worker takes over an already-open tab, `controllerchange` fires —
 * that's the signal, not the registration itself (PWARegister owns that).
 * `hadControllerAtLoad` filters out the very first install, which also
 * fires `controllerchange` but isn't "an update".
 */
export default function AppUpdateNotice() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const hadControllerAtLoad = Boolean(navigator.serviceWorker.controller);
    const onControllerChange = () => {
      if (hadControllerAtLoad) setUpdateReady(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let registration: ServiceWorkerRegistration | undefined;
    navigator.serviceWorker.ready.then((reg) => {
      registration = reg;
    });

    // Browsers only auto-check sw.js for byte changes on navigation (and at
    // most every 24h) — poll while the tab is open so long-lived sessions
    // still hear about a deploy.
    const poll = window.setInterval(() => {
      registration?.update().catch(() => {});
    }, UPDATE_CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        registration?.update().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <Modal
      open={updateReady}
      onClose={() => setUpdateReady(false)}
      title="New version available"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        The archive just shipped an update. See what changed on the{" "}
        <Link
          href="/changelog"
          className="ov-link-underline font-semibold text-ink hover:text-oxide"
        >
          changelog
        </Link>
        , then update to load the latest build.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="ov-btn ov-btn-danfo ov-icon-inline px-4 py-2 text-sm"
        >
          <ArrowsClockwise className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
          Update
        </button>
        <button
          type="button"
          onClick={() => setUpdateReady(false)}
          className="ov-btn ov-btn-ghost px-4 py-2 text-sm"
        >
          Later
        </button>
      </div>
    </Modal>
  );
}
