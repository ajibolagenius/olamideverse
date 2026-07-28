"use client";

import { useEffect, useRef } from "react";
import { notify } from "@/lib/feedback";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Bridges admin redirect flashes (`?saved=` / `?error=`) into the shared
 * toast system, then strips those query keys so a refresh doesn't re-fire.
 */
export default function AdminFlashBridge({
  saved,
  error,
}: {
  saved?: string | string[] | undefined;
  error?: string | string[] | undefined;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    const savedValue = firstParam(saved);
    const errorValue = firstParam(error);
    if (!savedValue && !errorValue) return;
    fired.current = true;

    if (savedValue) {
      notify.success("Saved.");
    } else if (errorValue) {
      notify.error(`Something went wrong (${errorValue}).`);
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    url.searchParams.delete("error");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, "", next);
  }, [saved, error]);

  return null;
}
