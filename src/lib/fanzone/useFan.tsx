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

export type Fan = { id: string; handle: string };
export type FanState = {
  fan: Fan | null;
  loading: boolean;
  error: string | null;
  setHandle: (handle: string) => Promise<boolean>;
  signOut: () => Promise<void>;
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
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // onAuthStateChange fires once immediately with the current session (or
    // lack of one), then again on every future change — so subscribing is
    // the initial fetch too, no separate direct call needed.
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadFan());
    return () => subscription.unsubscribe();
  }, [loadFan]);

  const setHandle = useCallback(async (handle: string) => {
    setError(null);
    const supabase = createClient();
    let {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const { data, error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError || !data.user) {
        setError("Couldn't start a session — try again.");
        return false;
      }
      user = data.user;
    }

    const { error: upsertError } = await supabase
      .from("fans")
      .upsert({ id: user.id, handle }, { onConflict: "id" });

    if (upsertError) {
      setError(
        upsertError.code === "23505"
          ? "That handle's taken — try another."
          : "Couldn't save that handle — try again.",
      );
      return false;
    }

    setFan({ id: user.id, handle });
    return true;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setFan(null);
    setError(null);
  }, []);

  return (
    <FanContext.Provider value={{ fan, loading, error, setHandle, signOut }}>
      {children}
    </FanContext.Provider>
  );
}

export function useFan(): FanState {
  const ctx = useContext(FanContext);
  if (!ctx) throw new Error("useFan() must be used within <FanProvider>");
  return ctx;
}
