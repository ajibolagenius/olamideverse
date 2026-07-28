"use client";

import { useSyncExternalStore } from "react";
import {
  getFeedbackSnapshot,
  subscribeFeedback,
} from "@/lib/feedback/store";
import Banner from "./Banner";
import Toast from "./Toast";

const emptySnapshot = { toasts: [], banners: [] };

function getServerSnapshot() {
  return emptySnapshot;
}

export default function FeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts, banners } = useSyncExternalStore(
    subscribeFeedback,
    getFeedbackSnapshot,
    getServerSnapshot,
  );

  return (
    <>
      {children}
      {banners.length > 0 ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex flex-col"
          aria-label="Notices"
        >
          <div className="pointer-events-auto">
            {banners.map((item) => (
              <Banner key={item.id} banner={item} />
            ))}
          </div>
        </div>
      ) : null}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
}
