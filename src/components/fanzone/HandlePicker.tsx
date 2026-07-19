"use client";

import { useState } from "react";
import type { useFan } from "@/lib/fanzone/useFan";

/**
 * The sign-in strip from Fan Zone.dc.html — not real auth, just a fan
 * handle, but backed by useFan()'s anonymous-session flow underneath.
 */
export default function HandlePicker({
  fanState,
  prompt = "Pick a fan handle to vote, comment & save favorites.",
  onSaved,
}: {
  fanState: ReturnType<typeof useFan>;
  prompt?: string;
  /** Called right after a handle is successfully saved — lets a caller
   * (e.g. a favorite button interrupted mid-click) finish what it was doing. */
  onSaved?: () => void;
}) {
  const { fan, setHandle, error } = fanState;
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (fan && !editing) {
    return (
      <div className="flex items-center justify-between border-[3px] border-ink bg-white px-5 py-3.5 shadow-paste-sm">
        <span className="text-[0.9rem]">
          Signed in as <b className="text-oxide">{fan.handle}</b>
        </span>
        <button
          type="button"
          onClick={() => {
            setDraft(fan.handle);
            setEditing(true);
          }}
          className="text-sm font-bold tracking-[0.08em] uppercase text-adire hover:underline"
        >
          Change handle
        </button>
      </div>
    );
  }

  return (
    <div className="ov-paste-up flex flex-wrap items-center gap-3 border-[3px] border-ink bg-adire-tint p-[18px] shadow-paste-sm">
      <span className="min-w-[220px] flex-1 text-[0.9rem]">{prompt}</span>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. BarigaFan"
        maxLength={24}
        className="min-w-[180px] border-2 border-ink bg-white px-3 py-2 text-sm"
      />
      <button
        type="button"
        disabled={saving || draft.trim().length < 2}
        onClick={async () => {
          setSaving(true);
          const ok = await setHandle(draft.trim());
          setSaving(false);
          if (ok) {
            setEditing(false);
            onSaved?.();
          }
        }}
        className="border-2 border-ink bg-danfo px-4 py-2 text-sm font-bold tracking-[0.05em] uppercase text-ink disabled:opacity-50"
      >
        Save
      </button>
      {error ? <span className="w-full text-xs text-oxide">{error}</span> : null}
    </div>
  );
}
