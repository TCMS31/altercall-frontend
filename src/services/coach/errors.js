/** Error raised by a coaching provider so callers can distinguish it from a bug. */
export class CoachError extends Error {
  constructor(message, { code = "coach_failed", cause } = {}) {
    super(message);
    this.name = "CoachError";
    this.code = code;
    this.cause = cause;
  }
}

export const COACH_ERROR_CODES = {
  timeout: "coach_timeout",
  network: "coach_network",
  badResponse: "coach_bad_response",
  failed: "coach_failed",
};
