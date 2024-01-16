import { CoachError, COACH_ERROR_CODES } from "../errors";

const DEFAULT_TIMEOUT_MS = 12000;

/** Accept both the structured plan shape and the legacy `{ workoutSuggestion }` string. */
export const normalisePlanResponse = (payload, profile) => {
  if (!payload || typeof payload !== "object") {
    throw new CoachError("The coaching service returned an unreadable response", {
      code: COACH_ERROR_CODES.badResponse,
    });
  }

  if (Array.isArray(payload.sessions) && payload.sessions.length > 0) {
    return {
      goal: payload.goal ?? profile.goal,
      experience: payload.experience ?? profile.experience,
      headline: payload.headline ?? "Coaching plan",
      summary: payload.summary ?? "",
      focusAreas: Array.isArray(payload.focusAreas) ? payload.focusAreas : [],
      weeklyLoad: payload.weeklyLoad ?? {
        sessions: payload.sessions.length,
        estimatedMinutes: payload.sessions.length * 60,
        intensity: "Moderate",
      },
      sessions: payload.sessions,
      coachingNotes: Array.isArray(payload.coachingNotes) ? payload.coachingNotes : [],
      source: "remote",
    };
  }

  if (typeof payload.workoutSuggestion === "string" && payload.workoutSuggestion.trim()) {
    return {
      goal: profile.goal,
      experience: profile.experience,
      headline: "Coaching plan",
      summary: payload.workoutSuggestion.trim(),
      focusAreas: [],
      weeklyLoad: { sessions: 0, estimatedMinutes: 0, intensity: "Unspecified" },
      sessions: [],
      coachingNotes: [],
      source: "remote",
    };
  }

  throw new CoachError("The coaching service returned no plan", {
    code: COACH_ERROR_CODES.badResponse,
  });
};

const timeoutError = (timeoutMs, cause) =>
  new CoachError(`The coaching service did not answer within ${timeoutMs}ms`, {
    code: COACH_ERROR_CODES.timeout,
    cause,
  });

const requestPlan = async (doFetch, url, profile, signal, timeoutMs) => {
  try {
    return await doFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw timeoutError(timeoutMs, error);
    throw new CoachError("Could not reach the coaching service", {
      code: COACH_ERROR_CODES.network,
      cause: error,
    });
  }
};

const readJson = async (response, timeoutMs) => {
  try {
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") throw timeoutError(timeoutMs, error);
    throw new CoachError("The coaching service returned invalid JSON", {
      code: COACH_ERROR_CODES.badResponse,
      cause: error,
    });
  }
};

/**
 * Talks to a hosted coaching model. The URL is injected, never hardcoded, and an
 * unset URL simply makes the provider unavailable rather than failing at runtime.
 */
export const createRemoteCoachProvider = ({
  url,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl,
} = {}) => ({
  id: "remote",
  label: "Hosted coaching model",
  priority: 10,
  isAvailable: () => Boolean(url) && typeof (fetchImpl ?? globalThis.fetch) === "function",
  async createPlan(profile) {
    const doFetch = fetchImpl ?? globalThis.fetch;
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    // The timer covers the body as well as the headers: a service that answers
    // quickly and then stalls mid-stream would otherwise hang the planner.
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const response = await requestPlan(doFetch, url, profile, controller?.signal, timeoutMs);
      if (!response.ok) {
        throw new CoachError(`The coaching service replied with HTTP ${response.status}`, {
          code: COACH_ERROR_CODES.failed,
        });
      }
      return normalisePlanResponse(await readJson(response, timeoutMs), profile);
    } finally {
      if (timer) clearTimeout(timer);
    }
  },
});

export default createRemoteCoachProvider;
