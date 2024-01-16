/**
 * Single place where the application reads its environment.
 *
 * Vite inlines `import.meta.env.VITE_*` at build time. `getEnv` takes the source
 * as an argument so tests can pass a plain object instead of patching globals.
 */

const DEFAULTS = {
  graphqlUri: "http://localhost:8000/graphql",
  coachApiUrl: "",
  coachTimeoutMs: 12000,
};

const firstNonEmpty = (value, fallback) =>
  value === undefined || value === null || String(value).trim() === ""
    ? fallback
    : String(value).trim();

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getEnv = (source = import.meta.env) => ({
  /** GraphQL endpoint backing sign-up / sign-in / OTP confirmation. */
  graphqlUri: firstNonEmpty(source.VITE_GRAPHQL_URI, DEFAULTS.graphqlUri),
  /** Optional remote coaching model endpoint. Empty string = use the built-in planner. */
  coachApiUrl: firstNonEmpty(source.VITE_COACH_API_URL, DEFAULTS.coachApiUrl),
  /** Abort the remote coach after this many milliseconds. */
  coachTimeoutMs: toPositiveInt(source.VITE_COACH_TIMEOUT_MS, DEFAULTS.coachTimeoutMs),
});

/** True when a remote coaching model has been configured for this build. */
export const isRemoteCoachConfigured = (env = getEnv()) => Boolean(env.coachApiUrl);

export { DEFAULTS as ENV_DEFAULTS };
