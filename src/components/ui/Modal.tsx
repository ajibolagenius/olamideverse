"use client";

import { X } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { OV_ICON_WEIGHT } from "@/lib/icons";

const emptySubscribe = () => () => {};

/**
 * Focus-trapped paste-up modal for Fan Zone handle flows and confirmations.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      trapFocus(e);
    };
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, trapFocus]);

  if (!isClient || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/55"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg border-[4px] border-ink bg-paper p-5 shadow-paste sm:p-6"
        style={{ rotate: "-0.4deg" }}
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b-[3px] border-ink pb-3">
          <h2 id={titleId} className="font-display text-2xl uppercase leading-none">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ov-btn ov-btn-ghost ov-icon-inline shrink-0 px-2.5 py-1.5 text-xs"
            aria-label="Close"
          >
            <X className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
