import { ENV_DEFAULTS, getEnv, isRemoteCoachConfigured } from "./env";

describe("getEnv", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it("falls back to sane defaults", () => {
    delete process.env.REACT_APP_GRAPHQL_URI;
    delete process.env.REACT_APP_COACH_API_URL;
    delete process.env.REACT_APP_COACH_TIMEOUT_MS;

    expect(getEnv()).toEqual({
      graphqlUri: ENV_DEFAULTS.graphqlUri,
      coachApiUrl: ENV_DEFAULTS.coachApiUrl,
      coachTimeoutMs: ENV_DEFAULTS.coachTimeoutMs,
    });
  });

  it("treats an empty or whitespace value as unset", () => {
    process.env.REACT_APP_GRAPHQL_URI = "   ";
    expect(getEnv().graphqlUri).toBe(ENV_DEFAULTS.graphqlUri);
  });

  it("reads configured values and trims them", () => {
    process.env.REACT_APP_GRAPHQL_URI = " https://api.example.test/graphql ";
    process.env.REACT_APP_COACH_API_URL = "https://coach.example.test/plan";
    process.env.REACT_APP_COACH_TIMEOUT_MS = "2500";

    expect(getEnv()).toEqual({
      graphqlUri: "https://api.example.test/graphql",
      coachApiUrl: "https://coach.example.test/plan",
      coachTimeoutMs: 2500,
    });
  });

  it("ignores a non-numeric or negative timeout", () => {
    process.env.REACT_APP_COACH_TIMEOUT_MS = "soon";
    expect(getEnv().coachTimeoutMs).toBe(ENV_DEFAULTS.coachTimeoutMs);
    process.env.REACT_APP_COACH_TIMEOUT_MS = "-5";
    expect(getEnv().coachTimeoutMs).toBe(ENV_DEFAULTS.coachTimeoutMs);
  });
});

describe("isRemoteCoachConfigured", () => {
  it("is false with no coach url", () => {
    expect(isRemoteCoachConfigured({ coachApiUrl: "" })).toBe(false);
  });

  it("is true once a url is present", () => {
    expect(isRemoteCoachConfigured({ coachApiUrl: "https://coach.example.test" })).toBe(true);
  });
});
