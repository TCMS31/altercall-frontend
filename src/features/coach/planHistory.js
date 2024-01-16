import { readJson, writeJson } from "../../lib/storage";

export const HISTORY_KEY = "altercall.planHistory";
export const HISTORY_LIMIT = 8;

/** Newest first, capped, so the list never grows without bound. */
export const appendToHistory = (history, entry, limit = HISTORY_LIMIT) =>
  [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, limit);

export const loadHistory = () => {
  const stored = readJson(HISTORY_KEY, []);
  return Array.isArray(stored) ? stored.slice(0, HISTORY_LIMIT) : [];
};

export const saveHistory = (history) => writeJson(HISTORY_KEY, history.slice(0, HISTORY_LIMIT));

/** Stable id from the profile plus a timestamp, no uuid dependency needed. */
export const makeHistoryId = (profile, now = Date.now()) =>
  `${profile.goal}-${profile.experience}-${profile.daysPerWeek}-${now}`;
