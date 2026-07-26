/**
 * Fan Zone credential helpers.
 *
 * Supabase Auth is email+password under the hood. Fans never see an email —
 * we derive a stable synthetic address from the normalized handle so login
 * stays "handle + password" in the UI.
 *
 * Staff accounts must never use this domain (see inviteAdmin / adminLogin).
 */

/** Must be a real-looking TLD — GoTrue rejects `.local` / `.test` / `.example`. */
export const FAN_AUTH_EMAIL_DOMAIN = "fan.olamideverse.app";

export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase();
}

/** Auth login key — letters, numbers, underscore only. */
export function fanAuthEmail(handle: string): string {
  const key = normalizeHandle(handle).replace(/[^a-z0-9_]/g, "");
  return `${key}@${FAN_AUTH_EMAIL_DOMAIN}`;
}

export function isFanAuthEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${FAN_AUTH_EMAIL_DOMAIN}`);
}

export function validateHandle(handle: string): string | null {
  const trimmed = handle.trim();
  if (trimmed.length < 2 || trimmed.length > 24) {
    return "Handle must be 2–24 characters.";
  }
  if (!/^[A-Za-z0-9_]+$/.test(trimmed)) {
    return "Use letters, numbers, and underscores only.";
  }
  return null;
}

/**
 * Fan passwords: 10–72 chars, at least one letter and one number.
 * (Supabase/GoTrue also caps at 72 for bcrypt.)
 */
export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (password.length > 72) return "Password is too long.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password needs at least one letter and one number.";
  }
  if (/^\s|\s$/.test(password)) {
    return "Password can't start or end with a space.";
  }
  return null;
}

export function mapAuthError(message: string | undefined, fallback: string): string {
  const m = (message ?? "").toLowerCase();
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("email_exists") ||
    m.includes("user already registered")
  ) {
    return "That handle's taken — try another, or sign in.";
  }
  if (m.includes("email_address_invalid") || m.includes("example and test domains")) {
    return "Couldn't create that account — try again in a moment.";
  }
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return "Wrong handle or password.";
  }
  if (m.includes("rate") || m.includes("too many") || m.includes("over_email")) {
    return "Too many attempts — wait a moment and try again.";
  }
  if (m.includes("password")) {
    return "Password doesn't meet the requirements.";
  }
  return fallback;
}
