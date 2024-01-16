import { ENV_DEFAULTS, getEnv, isRemoteCoachConfigured } from "./env";

describe("getEnv", () => {
  it("falls back to sane defaults", () => {
    expect(getEnv({})).toEqual({
      graphqlUri: ENV_DEFAULTS.graphqlUri,
      coachApiUrl: ENV_DEFAULTS.coachApiUrl,
      coachTimeoutMs: ENV_DEFAULTS.coachTimeoutMs,
    });
  });

  it("treats an empty or whitespace value as unset", () => {
    expect(getEnv({ VITE_GRAPHQL_URI: "   " }).graphqlUri).toBe(ENV_DEFAULTS.graphqlUri);
  });

  it("reads configured values and trims them", () => {
    const source = {
      VITE_GRAPHQL_URI: " https://api.example.test/graphql ",
      VITE_COACH_API_URL: "https://coach.example.test/plan",
      VITE_COACH_TIMEOUT_MS: "2500",
    };

    expect(getEnv(source)).toEqual({
      graphqlUri: "https://api.example.test/graphql",
      coachApiUrl: "https://coach.example.test/plan",
      coachTimeoutMs: 2500,
    });
  });

  it("ignores a non-numeric or negative timeout", () => {
    expect(getEnv({ VITE_COACH_TIMEOUT_MS: "soon" }).coachTimeoutMs).toBe(
      ENV_DEFAULTS.coachTimeoutMs
    );
    expect(getEnv({ VITE_COACH_TIMEOUT_MS: "-5" }).coachTimeoutMs).toBe(
      ENV_DEFAULTS.coachTimeoutMs
    );
  });
});

it("reads the build-time environment by default", () => {
  expect(getEnv().graphqlUri).toBe(ENV_DEFAULTS.graphqlUri);
});

describe("isRemoteCoachConfigured", () => {
  it("is false with no coach url", () => {
    expect(isRemoteCoachConfigured({ coachApiUrl: "" })).toBe(false);
  });

  it("is true once a url is present", () => {
    expect(isRemoteCoachConfigured({ coachApiUrl: "https://coach.example.test" })).toBe(true);
  });
});
