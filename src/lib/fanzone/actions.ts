"use server";

import {
  fanAuthEmail,
  mapAuthError,
  normalizeHandle,
  validateHandle,
  validatePassword,
} from "@/lib/fanzone/auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type FanAuthResult =
  | { ok: true; id: string; handle: string }
  | { ok: false; error: string };

/**
 * Create a confirmed fan account without sending Auth mail.
 * Client signs in afterward with the same handle + password.
 */
export async function registerFan(
  handle: string,
  password: string,
): Promise<FanAuthResult> {
  const handleErr = validateHandle(handle);
  if (handleErr) return { ok: false, error: handleErr };
  const passErr = validatePassword(password);
  if (passErr) return { ok: false, error: passErr };

  const display = handle.trim();
  const email = fanAuthEmail(display);

  try {
    const service = createServiceClient();

    const { data: taken } = await service
      .from("fans")
      .select("id")
      .ilike("handle", display)
      .maybeSingle();
    if (taken) {
      return { ok: false, error: "That handle's taken — try another, or sign in." };
    }

    const { data: created, error: createError } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { handle: display, fan: true },
    });

    if (createError || !created.user) {
      return {
        ok: false,
        error: mapAuthError(createError?.message, "Couldn't create that account."),
      };
    }

    const { error: insertError } = await service.from("fans").insert({
      id: created.user.id,
      handle: display,
    });

    if (insertError) {
      await service.auth.admin.deleteUser(created.user.id);
      return {
        ok: false,
        error:
          insertError.code === "23505"
            ? "That handle's taken — try another, or sign in."
            : "Couldn't save your handle — try again.",
      };
    }

    return { ok: true, id: created.user.id, handle: display };
  } catch {
    return { ok: false, error: "Fan Zone auth isn't configured on the server." };
  }
}

/**
 * Rename handle + auth login key without triggering confirmation email.
 */
export async function renameFan(handle: string): Promise<FanAuthResult> {
  const handleErr = validateHandle(handle);
  if (handleErr) return { ok: false, error: handleErr };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const display = handle.trim();
  const service = createServiceClient();

  const { data: me } = await service
    .from("fans")
    .select("id, handle, banned")
    .eq("id", user.id)
    .maybeSingle();

  if (!me) return { ok: false, error: "Couldn't load your fan profile." };
  if (me.banned) return { ok: false, error: "This handle has been suspended." };
  if (normalizeHandle(display) === normalizeHandle(me.handle)) {
    return { ok: false, error: "That's already your handle." };
  }

  const { data: taken } = await service
    .from("fans")
    .select("id")
    .ilike("handle", display)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) {
    return { ok: false, error: "That handle's taken — try another." };
  }

  const { error: authError } = await service.auth.admin.updateUserById(user.id, {
    email: fanAuthEmail(display),
    email_confirm: true,
    user_metadata: { handle: display, fan: true },
  });
  if (authError) {
    return {
      ok: false,
      error: mapAuthError(authError.message, "Couldn't rename that handle."),
    };
  }

  const { error: updateError } = await service
    .from("fans")
    .update({ handle: display })
    .eq("id", user.id);

  if (updateError) {
    // Best-effort rollback of the auth email to the previous handle.
    await service.auth.admin.updateUserById(user.id, {
      email: fanAuthEmail(me.handle),
      email_confirm: true,
      user_metadata: { handle: me.handle, fan: true },
    });
    return {
      ok: false,
      error:
        updateError.code === "23505"
          ? "That handle's taken — try another."
          : "Couldn't rename that handle.",
    };
  }

  return { ok: true, id: user.id, handle: display };
}
