"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Fan = { id: string; handle: string };

/**
 * Fan identity for the browser. Mirrors the design's `ovfz_handle` flow —
 * pick a handle, you're "signed in" — but backed by a real (anonymous)
 * Supabase session instead of a bare localStorage string, so writes carry
 * a real auth.uid() for RLS. Anonymous sign-in only happens the moment a
 * fan actually submits a handle, not on page load, so casual visitors
 * don't mint a throwaway auth user for nothing.
 */
export function useFan() {
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
      .select("id, handle")
      .eq("id", user.id)
      .maybeSingle();
    setFan(data);
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

  return { fan, loading, error, setHandle };
}
