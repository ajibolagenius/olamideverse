"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { registerFan, renameFan } from "@/lib/fanzone/actions";
import {
  fanAuthEmail,
  mapAuthError,
  validateHandle,
  validatePassword,
} from "@/lib/fanzone/auth";

export type Fan = { id: string; handle: string };
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
    } = await supabase.auth.getUser();
    if (!user) {
      setFan(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("fans")
      .select("id, handle, banned")
      .eq("id", user.id)
      .maybeSingle();
    if (data?.banned) {
      setFan(null);
      setError("This handle has been suspended.");
    } else {
      setFan(data ? { id: data.id, handle: data.handle } : null);
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

    setFan({ id: registered.id, handle: registered.handle });
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
      .select("id, handle, banned")
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
      setFan({ id: data.user.id, handle: display });
      return true;
    }

    if (row.banned) {
      await supabase.auth.signOut();
      setFan(null);
      setError("This handle has been suspended.");
      return false;
    }

    setFan({ id: row.id, handle: row.handle });
    return true;
  }, []);

  const changeHandle = useCallback(async (handle: string) => {
    setError(null);
    const renamed = await renameFan(handle);
    if (!renamed.ok) {
      setError(renamed.error);
      return false;
    }
    setFan({ id: renamed.id, handle: renamed.handle });
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
