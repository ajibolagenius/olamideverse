type HapticKind = "tap" | "success" | "error";

const PATTERNS: Record<HapticKind, number | number[]> = {
  tap: 10,
  success: [12, 40, 18],
  error: [40, 30, 40],
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function vibrate(kind: HapticKind): void {
  if (typeof navigator === "undefined") return;
  if (prefersReducedMotion()) return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    // Some browsers throw if vibrate is blocked mid-gesture.
  }
}

/** Short Vibration API patterns. No-op when unsupported or reduced-motion. */
export const haptic = Object.assign(
  (kind: HapticKind = "tap") => vibrate(kind),
  {
    tap: () => vibrate("tap"),
    success: () => vibrate("success"),
    error: () => vibrate("error"),
  },
);
