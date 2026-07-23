"use client";

import {
  Key,
  PencilSimple,
  SignIn,
  SignOut,
  UserCircle,
  UserPlus,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { useFan } from "@/lib/fanzone/useFan";
import { OV_ICON_WEIGHT } from "@/lib/icons";

type Mode = "signin" | "signup";
type AccountPanel = "idle" | "rename" | "password";

/**
 * Fan Zone account strip — durable handle + password (no email in the UI).
 */
export default function HandlePicker({
  fanState,
  prompt = "Create a handle + password to vote, comment & save favorites.",
  onSaved,
}: {
  fanState: ReturnType<typeof useFan>;
  prompt?: string;
  /** Called right after a successful sign-in / sign-up — lets a caller
   * (e.g. a favorite button interrupted mid-click) finish what it was doing. */
  onSaved?: () => void;
}) {
  const {
    fan,
    signIn,
    signUp,
    changeHandle,
    changePassword,
    signOut,
    error,
    clearError,
  } = fanState;

  const [mode, setMode] = useState<Mode>("signup");
  const [panel, setPanel] = useState<AccountPanel>("idle");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showError = localError || error;

  const resetForm = () => {
    setHandle("");
    setPassword("");
    setPassword2("");
    setLocalError(null);
    clearError();
  };

  if (fan && panel === "idle") {
    return (
      <div className="border-[3px] border-ink bg-white px-5 py-3.5 shadow-paste-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="ov-icon-inline text-[0.9rem]">
            <UserCircle
              className="ov-icon text-oxide"
              size={20}
              weight={OV_ICON_WEIGHT}
              aria-hidden
            />
            Signed in as <b className="text-oxide">{fan.handle}</b>
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setHandle(fan.handle);
                setPanel("rename");
                setNotice(null);
              }}
              className="ov-icon-inline ov-link-underline text-sm font-bold tracking-[0.08em] uppercase text-adire"
            >
              <PencilSimple
                className="ov-icon"
                size={14}
                weight={OV_ICON_WEIGHT}
                aria-hidden
              />
              Change handle
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setPanel("password");
                setNotice(null);
              }}
              className="ov-icon-inline ov-link-underline text-sm font-bold tracking-[0.08em] uppercase text-adire"
            >
              <Key className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              Password
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
        {notice ? <p className="mt-2 text-xs text-palm">{notice}</p> : null}
      </div>
    );
  }

  if (fan && panel === "rename") {
    return (
      <div className="flex flex-wrap items-end gap-3 border-[3px] border-ink bg-adire-tint p-[18px] shadow-paste-sm">
        <label className="grid min-w-[180px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
          New handle
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            maxLength={24}
            autoComplete="username"
            className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
          />
        </label>
        <button
          type="button"
          disabled={saving || handle.trim().length < 2}
          onClick={async () => {
            setSaving(true);
            setLocalError(null);
            const ok = await changeHandle(handle);
            setSaving(false);
            if (ok) {
              setPanel("idle");
              resetForm();
              setNotice("Handle updated — use it next time you sign in.");
            }
          }}
          className="ov-btn ov-btn-danfo px-4 py-2 text-sm disabled:opacity-50"
        >
          Save handle
        </button>
        <button
          type="button"
          onClick={() => {
            setPanel("idle");
            resetForm();
          }}
          className="ov-btn ov-btn-ghost px-3 py-2 text-xs"
        >
          Cancel
        </button>
        {showError ? <span className="w-full text-xs text-oxide">{showError}</span> : null}
      </div>
    );
  }

  if (fan && panel === "password") {
    return (
      <div className="flex flex-wrap items-end gap-3 border-[3px] border-ink bg-adire-tint p-[18px] shadow-paste-sm">
        <label className="grid min-w-[160px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
          />
        </label>
        <label className="grid min-w-[160px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
          Confirm
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
            className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
          />
        </label>
        <button
          type="button"
          disabled={saving || password.length < 8}
          onClick={async () => {
            if (password !== password2) {
              setLocalError("Passwords don't match.");
              clearError();
              return;
            }
            setSaving(true);
            setLocalError(null);
            const ok = await changePassword(password);
            setSaving(false);
            if (ok) {
              setPanel("idle");
              resetForm();
              setNotice("Password updated.");
            }
          }}
          className="ov-btn ov-btn-danfo px-4 py-2 text-sm disabled:opacity-50"
        >
          Update password
        </button>
        <button
          type="button"
          onClick={() => {
            setPanel("idle");
            resetForm();
          }}
          className="ov-btn ov-btn-ghost px-3 py-2 text-xs"
        >
          Cancel
        </button>
        {showError ? <span className="w-full text-xs text-oxide">{showError}</span> : null}
      </div>
    );
  }

  return (
    <div className="border-[3px] border-ink bg-adire-tint p-[18px] shadow-paste-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9rem]">{prompt}</p>
        <div className="flex gap-1 border-2 border-ink bg-white p-0.5">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setLocalError(null);
              clearError();
            }}
            className={`ov-icon-inline px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.06em] uppercase ${
              mode === "signup" ? "bg-danfo" : "hover:bg-paper-dim"
            }`}
          >
            <UserPlus className="ov-icon" size={13} weight={OV_ICON_WEIGHT} aria-hidden />
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setLocalError(null);
              clearError();
            }}
            className={`ov-icon-inline px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.06em] uppercase ${
              mode === "signin" ? "bg-danfo" : "hover:bg-paper-dim"
            }`}
          >
            <SignIn className="ov-icon" size={13} weight={OV_ICON_WEIGHT} aria-hidden />
            Sign in
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid min-w-[160px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
          Handle
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. BarigaFan"
            maxLength={24}
            autoComplete="username"
            className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
          />
        </label>
        <label className="grid min-w-[160px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
          />
        </label>
        {mode === "signup" ? (
          <label className="grid min-w-[160px] flex-1 gap-1 text-xs font-bold tracking-[0.08em] uppercase">
            Confirm
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal"
            />
          </label>
        ) : null}
        <button
          type="button"
          disabled={
            saving ||
            handle.trim().length < 2 ||
            password.length < (mode === "signup" ? 8 : 1)
          }
          onClick={async () => {
            if (mode === "signup" && password !== password2) {
              setLocalError("Passwords don't match.");
              clearError();
              return;
            }
            setSaving(true);
            setLocalError(null);
            const ok =
              mode === "signup"
                ? await signUp(handle, password)
                : await signIn(handle, password);
            setSaving(false);
            if (ok) {
              resetForm();
              onSaved?.();
            }
          }}
          className="ov-btn ov-btn-danfo ov-icon-inline px-4 py-2 text-sm disabled:opacity-50"
        >
          {mode === "signup" ? (
            <>
              <UserPlus className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              Create account
            </>
          ) : (
            <>
              <SignIn className="ov-icon" size={14} weight={OV_ICON_WEIGHT} aria-hidden />
              Sign in
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-[0.72rem] tracking-[0.04em] text-ink-soft normal-case">
        No email needed. Your handle + password work on any device — sign out
        clears this browser only.
      </p>
      {showError ? <p className="mt-2 text-xs text-oxide">{showError}</p> : null}
    </div>
  );
}
