export type FeedbackVariant = "success" | "error" | "info" | "warning";

export type ToastInput = {
  message: string;
  variant?: FeedbackVariant;
  /** Auto-dismiss ms. Defaults: success/info/warning 3200, error 5000. */
  duration?: number;
  haptic?: boolean;
};

export type ToastItem = {
  id: string;
  message: string;
  variant: FeedbackVariant;
  duration: number;
  createdAt: number;
};

export type BannerAction = {
  label: string;
  onClick: () => void;
};

export type BannerInput = {
  id: string;
  message: string;
  variant?: FeedbackVariant;
  dismissible?: boolean;
  action?: BannerAction;
};

export type BannerItem = {
  id: string;
  message: string;
  variant: FeedbackVariant;
  dismissible: boolean;
  action?: BannerAction;
};

export type FeedbackState = {
  toasts: ToastItem[];
  banners: BannerItem[];
};

export const MAX_TOASTS = 3;
export const DEFAULT_TOAST_DURATION = 3200;
export const ERROR_TOAST_DURATION = 5000;
