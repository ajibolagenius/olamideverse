"use client";

import { PencilSimple, SignOut, UserCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { useFan } from "@/lib/fanzone/useFan";
import { OV_ICON_WEIGHT } from "@/lib/icons";

/**
 * The sign-in strip from Fan Zone — not real auth, just a fan
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
  const { fan, setHandle, signOut, error } = fanState;
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (fan && !editing) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-[3px] border-ink bg-white px-5 py-3.5 shadow-paste-sm">
        <span className="ov-icon-inline text-[0.9rem]">
          <UserCircle className="ov-icon text-oxide" size={20} weight={OV_ICON_WEIGHT} aria-hidden />
          Signed in as <b className="text-oxide">{fan.handle}</b>
        </span>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setDraft(fan.handle);
              setEditing(true);
            }}
            className="ov-icon-inline ov-link-underline text-sm font-bold tracking-[0.08em] uppercase text-adire"
          >
            <PencilSimple className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
            Change handle
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="ov-icon-inline text-sm font-bold tracking-[0.08em] uppercase text-ink-soft hover:text-oxide"
          >
            <SignOut className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-[3px] border-ink bg-adire-tint p-[18px] shadow-paste-sm">
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
        className="ov-btn ov-btn-danfo px-4 py-2 text-sm disabled:opacity-50"
      >
        Save
      </button>
      {fan && editing ? (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="ov-btn ov-btn-ghost px-3 py-2 text-xs"
        >
          Cancel
        </button>
      ) : null}
      {error ? <span className="w-full text-xs text-oxide">{error}</span> : null}
    </div>
  );
}
