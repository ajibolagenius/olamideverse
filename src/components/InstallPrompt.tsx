"use client";

import { useEffect, useState } from "react";

/**
 * A quiet "install this" affordance, shown at most once per session.
 *
 * Deliberately not a modal and not a first-visit interrupt: it waits for the
 * browser to say the app is actually installable (`beforeinstallprompt`),
 * shows a strip the reader can ignore, and never comes back once dismissed.
 *
 * Safari never fires `beforeinstallprompt`, so iOS simply sees nothing rather
 * than a button that cannot work.
 */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "ov-install-dismissed";

export default function InstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    // Already installed — the browser still fires the event in some cases.
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // Private mode or blocked storage cannot preserve dismissal state.
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setEvent(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!event) return null;

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — it just reappears next session.
    }
    setEvent(null);
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setEvent(null);
  }

  return (
    <div className="border-t-2 border-ink bg-paper-dim px-5 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-[0.8rem] leading-snug">
          Keep the archive on your home screen — it reads offline once you have
          visited a page.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={install}
            className="ov-btn border-2 border-ink bg-danfo px-3 py-1.5 text-[0.72rem] font-bold tracking-[0.06em] uppercase"
          >
            Install
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="border-2 border-ink bg-white px-3 py-1.5 text-[0.72rem] font-bold tracking-[0.06em] uppercase hover:bg-danfo"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
