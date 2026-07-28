import { haptic } from "./haptic";
import type {
  BannerInput,
  BannerItem,
  FeedbackState,
  ToastInput,
  ToastItem,
} from "./types";
import {
  DEFAULT_TOAST_DURATION,
  ERROR_TOAST_DURATION,
  MAX_TOASTS,
} from "./types";

type Listener = () => void;

let state: FeedbackState = { toasts: [], banners: [] };
const listeners = new Set<Listener>();
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
let idCounter = 0;

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: FeedbackState) {
  state = next;
  emit();
}

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

function defaultDuration(variant: ToastItem["variant"]): number {
  return variant === "error" ? ERROR_TOAST_DURATION : DEFAULT_TOAST_DURATION;
}

function scheduleDismiss(id: string, duration: number) {
  if (duration <= 0) return;
  const existing = dismissTimers.get(id);
  if (existing) clearTimeout(existing);
  dismissTimers.set(
    id,
    setTimeout(() => {
      dismissTimers.delete(id);
      dismissToast(id);
    }, duration),
  );
}

export function getFeedbackSnapshot(): FeedbackState {
  return state;
}

export function subscribeFeedback(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function pushToast(input: ToastInput): string {
  const variant = input.variant ?? "info";
  const duration = input.duration ?? defaultDuration(variant);
  const id = nextId("toast");
  const toast: ToastItem = {
    id,
    message: input.message,
    variant,
    duration,
    createdAt: Date.now(),
  };

  const toasts = [...state.toasts, toast];
  while (toasts.length > MAX_TOASTS) {
    const dropped = toasts.shift();
    if (dropped) {
      const timer = dismissTimers.get(dropped.id);
      if (timer) clearTimeout(timer);
      dismissTimers.delete(dropped.id);
    }
  }

  setState({ ...state, toasts });
  scheduleDismiss(id, duration);

  if (input.haptic !== false) {
    if (variant === "success") haptic.success();
    else if (variant === "error") haptic.error();
  }

  return id;
}

export function dismissToast(id: string) {
  const timer = dismissTimers.get(id);
  if (timer) clearTimeout(timer);
  dismissTimers.delete(id);
  if (!state.toasts.some((t) => t.id === id)) return;
  setState({
    ...state,
    toasts: state.toasts.filter((t) => t.id !== id),
  });
}

export function showBanner(input: BannerInput): string {
  const item: BannerItem = {
    id: input.id,
    message: input.message,
    variant: input.variant ?? "info",
    dismissible: input.dismissible ?? true,
    action: input.action,
  };
  const banners = state.banners.filter((b) => b.id !== item.id).concat(item);
  setState({ ...state, banners });
  return item.id;
}

export function dismissBanner(id: string) {
  if (!state.banners.some((b) => b.id === id)) return;
  setState({
    ...state,
    banners: state.banners.filter((b) => b.id !== id),
  });
}
