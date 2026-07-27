"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { checkSignInRateLimit, registerFan, renameFan } from "@/lib/fanzone/actions";
import {
  fanAuthEmail,
  mapAuthError,
  validateHandle,
  validatePassword,
} from "@/lib/fanzone/auth";
import {
  recordActivity,
  setPublicProfile as setPublicProfileMutation,
} from "@/lib/fanzone/mutations";

export type Fan = {
  id: string;
  handle: string;
  publicProfile: boolean;
  currentStreak: number;
  longestStreak: number;
};
export type FanState = {
  fan: Fan | null;
  loading: boolean;
  error: string | null;
  /** Create a durable handle + password account. */
  signUp: (handle: string, password: string) => Promise<boolean>;
  /** Sign in with an existing handle + password. */
  signIn: (handle: string, password: string) => Promise<boolean>;
  /** Rename the display/login handle (updates auth email + fans row). */
  changeHandle: (handle: string) => Promise<boolean>;
  /** Change password while signed in. */
  changePassword: (newPassword: string) => Promise<boolean>;
  /** Opt in/out of a public profile — makes favorites + playlist browsable by other fans. */
  setPublicProfile: (enabled: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const FanContext = createContext<FanState | null>(null);

/**
 * One shared fan session for the whole page — every FavoriteButton,
 * PlaylistButton, PollCard and CommentBox reads the same context instead
 * of running its own independent auth subscription, so signing in from
 * any one of them is instantly visible to all the others.
 */
export function FanProvider({ children }: { children: ReactNode }) {
  const [fan, setFan] = useState<Fan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadFan = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Stale refresh cookies (signed out elsewhere / rotated) — clear quietly.
    if (
      error &&
      (error.code === "refresh_token_not_found" ||
        error.code === "refresh_token_already_used" ||
        /refresh token/i.test(error.message))
    ) {
      await supabase.auth.signOut({ scope: "local" });
      setFan(null);
      setLoading(false);
      return;
    }

    if (!user) {
      setFan(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("fans")
      .select("id, handle, banned, public_profile, current_streak, longest_streak")
      .eq("id", user.id)
      .maybeSingle();
    if (data?.banned) {
      setFan(null);
      setError("This handle has been suspended.");
    } else {
      setFan(
        data
          ? {
              id: data.id,
              handle: data.handle,
              publicProfile: data.public_profile,
              currentStreak: data.current_streak,
              longestStreak: data.longest_streak,
            }
          : null,
      );
      // Don't clear a pending form error on session refresh unless we have a fan.
      if (data) setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadFan());
    return () => subscription.unsubscribe();
  }, [loadFan]);

  // Check in once per fan per browser session — a no-op on the server side
  // if today's already recorded, so it's fine to re-run on every sign-in.
  const checkedInFanId = useRef<string | null>(null);
  useEffect(() => {
    if (!fan || checkedInFanId.current === fan.id) return;
    checkedInFanId.current = fan.id;
    recordActivity().then((result) => {
      if (!result) return;
      setFan((prev) =>
        prev
          ? {
              ...prev,
              currentStreak: result.currentStreak,
              longestStreak: result.longestStreak,
            }
          : prev,
      );
    });
  }, [fan]);

  const signUp = useCallback(async (handle: string, password: string) => {
    setError(null);
    const registered = await registerFan(handle, password);
    if (!registered.ok) {
      setError(registered.error);
      return false;
    }

    // Account is created confirmed server-side — establish the browser session.
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: fanAuthEmail(registered.handle),
      password,
    });

    if (signInError || !data.user) {
      setError(
        mapAuthError(
          signInError?.message,
          "Account created — sign in with your handle + password.",
        ),
      );
      return false;
    }

    setFan({
      id: registered.id,
      handle: registered.handle,
      publicProfile: false,
      currentStreak: 0,
      longestStreak: 0,
    });
    return true;
  }, []);

  const signIn = useCallback(async (handle: string, password: string) => {
    setError(null);
    const handleErr = validateHandle(handle);
    if (handleErr) {
      setError(handleErr);
      return false;
    }
    if (!password) {
      setError("Enter your password.");
      return false;
    }

    const gate = await checkSignInRateLimit(handle);
    if (!gate.ok) {
      setError(gate.error);
      return false;
    }

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: fanAuthEmail(handle),
      password,
    });

    if (signInError || !data.user) {
      setError(mapAuthError(signInError?.message, "Couldn't sign in."));
      return false;
    }

    const { data: row } = await supabase
      .from("fans")
      .select("id, handle, banned, public_profile, current_streak, longest_streak")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!row) {
      // Legacy / orphaned auth user — create the fans row from the login handle.
      const display = handle.trim();
      const { error: insertError } = await supabase.from("fans").insert({
        id: data.user.id,
        handle: display,
      });
      if (insertError) {
        await supabase.auth.signOut();
        setError("Couldn't load your fan profile — try again.");
        return false;
      }
      setFan({
        id: data.user.id,
        handle: display,
        publicProfile: false,
        currentStreak: 0,
        longestStreak: 0,
      });
      return true;
    }

    if (row.banned) {
      await supabase.auth.signOut();
      setFan(null);
      setError("This handle has been suspended.");
      return false;
    }

    setFan({
      id: row.id,
      handle: row.handle,
      publicProfile: row.public_profile,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
    });
    return true;
  }, []);

  const changeHandle = useCallback(async (handle: string) => {
    setError(null);
    const renamed = await renameFan(handle);
    if (!renamed.ok) {
      setError(renamed.error);
      return false;
    }
    setFan((prev) => ({
      id: renamed.id,
      handle: renamed.handle,
      publicProfile: prev?.publicProfile ?? false,
      currentStreak: prev?.currentStreak ?? 0,
      longestStreak: prev?.longestStreak ?? 0,
    }));
    return true;
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    setError(null);
    const passErr = validatePassword(newPassword);
    if (passErr) {
      setError(passErr);
      return false;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sign in first.");
      return false;
    }

    const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
    if (pwError) {
      setError(mapAuthError(pwError.message, "Couldn't update password."));
      return false;
    }
    return true;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setFan(null);
    setError(null);
  }, []);

  const setPublicProfile = useCallback(async (enabled: boolean) => {
    setError(null);
    const previous = fan;
    setFan((prev) => (prev ? { ...prev, publicProfile: enabled } : prev));
    try {
      await setPublicProfileMutation(enabled);
      return true;
    } catch (err) {
      setFan(previous);
      setError(err instanceof Error ? err.message : "Couldn't update profile visibility.");
      return false;
    }
  }, [fan]);

  return (
    <FanContext.Provider
      value={{
        fan,
        loading,
        error,
        signUp,
        signIn,
        changeHandle,
        changePassword,
        setPublicProfile,
        signOut,
        clearError,
      }}
    >
      {children}
    </FanContext.Provider>
  );
}

export function useFan(): FanState {
  const ctx = useContext(FanContext);
  if (!ctx) throw new Error("useFan() must be used within <FanProvider>");
  return ctx;
}
