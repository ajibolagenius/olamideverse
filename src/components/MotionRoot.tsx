"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initMotion } from "@/lib/motion";

/**
 * Mounted once in the root layout; re-runs the motion setup after every
 * navigation so newly rendered pages get their scroll triggers.
 * Also stamps `html.js` — the CSS that hides paste-up elements pre-animation
 * only applies once JS is known to be running.
 */
export default function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    return initMotion();
  }, [pathname]);

  return null;
}
