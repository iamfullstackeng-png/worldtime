// Versioned key so a future breaking change to the persisted shape can bump to
// `_v2` and orphan the old data without writing a migration.
export const STORAGE_KEY = 'tw_auth_v1';

// Every sessionStorage access is wrapped in try/catch. Browsers throw under
// quota exhaustion, in Safari private mode (historically), and the global is
// undefined under Node / SSR / tests without jsdom. These helpers never throw —
// the slice treats absence and corruption identically: start logged out.

function getStorage() {
  try {
    if (typeof globalThis.sessionStorage === 'undefined') return null;
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
}

function isValidSession(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.user &&
    typeof value.user === 'object' &&
    typeof value.user.email === 'string'
  );
}

export function readSession() {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSession(parsed)) return null;
    return { user: { email: parsed.user.email } };
  } catch {
    return null;
  }
}

export function writeSession(session) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota exceeded or storage unavailable — degrade silently.
  }
}

export function clearSession() {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to do.
  }
}
