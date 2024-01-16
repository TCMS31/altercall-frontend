/**
 * Session persistence.
 *
 * The browser's `localStorage` throws in private-mode Safari and in some embedded
 * webviews, and it only stores strings - writing an object yields the string
 * "[object Object]". Both failure modes are handled here so that no caller has to
 * think about them.
 */

export const SESSION_KEY = "altercall.session";

// The Apollo error link clears the session outside React, so the provider needs
// a way to hear about it; otherwise the UI stays "signed in" with no token.
const sessionListeners = new Set();

export const subscribeToSession = (listener) => {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
};

const notifySessionListeners = (session) => {
  sessionListeners.forEach((listener) => listener(session));
};

const createMemoryStorage = () => {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
};

/** Returns `window.localStorage` when it is usable, otherwise an in-memory stand-in. */
export const resolveStorage = () => {
  try {
    const probe = "__altercall_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return createMemoryStorage();
  }
};

export const isValidSession = (session) =>
  Boolean(
    session &&
    typeof session === "object" &&
    typeof session.accessToken === "string" &&
    session.accessToken.length > 0
  );

export const readSession = (storage = resolveStorage()) => {
  try {
    const parsed = JSON.parse(storage.getItem(SESSION_KEY));
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const writeSession = (session, storage = resolveStorage()) => {
  if (!isValidSession(session)) {
    throw new TypeError("writeSession requires a session with an accessToken");
  }
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  notifySessionListeners(session);
  return session;
};

export const clearSession = (storage = resolveStorage()) => {
  storage.removeItem(SESSION_KEY);
  notifySessionListeners(null);
};

/** Generic namespaced JSON helpers, used by the locally persisted plan history. */
export const readJson = (key, fallback, storage = resolveStorage()) => {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value, storage = resolveStorage()) => {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export { createMemoryStorage };
