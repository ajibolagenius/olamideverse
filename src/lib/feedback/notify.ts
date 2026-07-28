import { haptic as hapticFn } from "./haptic";
import {
  dismissBanner,
  dismissToast,
  pushToast,
  showBanner,
} from "./store";
import type { BannerInput, FeedbackVariant, ToastInput } from "./types";

function toast(message: string, variant: FeedbackVariant, opts?: Omit<ToastInput, "message" | "variant">) {
  return pushToast({ message, variant, ...opts });
}

/** Imperative toasts — usable from event handlers without React hooks. */
export const notify = {
  success(message: string, opts?: Omit<ToastInput, "message" | "variant">) {
    return toast(message, "success", opts);
  },
  error(message: string, opts?: Omit<ToastInput, "message" | "variant">) {
    return toast(message, "error", opts);
  },
  info(message: string, opts?: Omit<ToastInput, "message" | "variant">) {
    return toast(message, "info", opts);
  },
  warning(message: string, opts?: Omit<ToastInput, "message" | "variant">) {
    return toast(message, "warning", opts);
  },
  dismiss: dismissToast,
};

/** Sticky dismissible banners (playlist import, etc.). */
export const banner = {
  show(input: BannerInput) {
    return showBanner(input);
  },
  dismiss: dismissBanner,
};

export const haptic = hapticFn;
