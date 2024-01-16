/**
 * Single place where the application reads its environment.
 *
 * Create React App inlines `process.env` at build time, so every value has to be
 * read through an explicit `process.env.REACT_APP_*` member expression. Reading
 * them lazily (rather than at module scope) keeps the module testable: a test can
 * mutate `process.env` and call `getEnv()` again.
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

export const getEnv = () => ({
  /** GraphQL endpoint backing sign-up / sign-in / OTP confirmation. */
  graphqlUri: firstNonEmpty(process.env.REACT_APP_GRAPHQL_URI, DEFAULTS.graphqlUri),
  /** Optional remote coaching model endpoint. Empty string = use the built-in planner. */
  coachApiUrl: firstNonEmpty(process.env.REACT_APP_COACH_API_URL, DEFAULTS.coachApiUrl),
  /** Abort the remote coach after this many milliseconds. */
  coachTimeoutMs: toPositiveInt(
    process.env.REACT_APP_COACH_TIMEOUT_MS,
    DEFAULTS.coachTimeoutMs
  ),
});

/** True when a remote coaching model has been configured for this build. */
export const isRemoteCoachConfigured = (env = getEnv()) => Boolean(env.coachApiUrl);

export { DEFAULTS as ENV_DEFAULTS };
