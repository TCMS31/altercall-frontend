import { COACH_ERROR_CODES } from "../errors";
import { createRemoteCoachProvider, normalisePlanResponse } from "./remoteCoachProvider";

const profile = {
  age: 34,
  height: 5.9,
  goal: "strength",
  experience: "intermediate",
  daysPerWeek: 4,
};
const url = "https://coach.example.test/plan";

const jsonResponse = (payload, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => payload,
});

describe("normalisePlanResponse", () => {
  it("passes through a structured plan", () => {
    const plan = normalisePlanResponse(
      { headline: "Hello", sessions: [{ day: "Monday", blocks: [] }] },
      profile
    );
    expect(plan.source).toBe("remote");
    expect(plan.sessions).toHaveLength(1);
  });

  it("adapts the legacy workoutSuggestion string", () => {
    const plan = normalisePlanResponse({ workoutSuggestion: "  Squat heavy.  " }, profile);
    expect(plan.summary).toBe("Squat heavy.");
    expect(plan.sessions).toEqual([]);
  });

  it.each([[null], ["a string"], [{}], [{ workoutSuggestion: "   " }]])(
    "rejects %p",
    (payload) => {
      expect(() => normalisePlanResponse(payload, profile)).toThrow(/plan|response/i);
    }
  );
});

describe("createRemoteCoachProvider", () => {
  it("is unavailable when no url is configured", () => {
    expect(createRemoteCoachProvider({ url: "", fetchImpl: () => {} }).isAvailable()).toBe(
      false
    );
  });

  it("is available once a url is configured", () => {
    expect(createRemoteCoachProvider({ url, fetchImpl: () => {} }).isAvailable()).toBe(true);
  });

  it("posts the profile as JSON", async () => {
    const fetchImpl = jest.fn(async () =>
      jsonResponse({ sessions: [{ day: "Monday", blocks: [] }] })
    );
    await createRemoteCoachProvider({ url, fetchImpl }).createPlan(profile);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [calledUrl, init] = fetchImpl.mock.calls[0];
    expect(calledUrl).toBe(url);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual(profile);
  });

  it("raises a CoachError for a non-2xx reply", async () => {
    const fetchImpl = async () => jsonResponse({}, { ok: false, status: 503 });
    await expect(
      createRemoteCoachProvider({ url, fetchImpl }).createPlan(profile)
    ).rejects.toMatchObject({ name: "CoachError", code: COACH_ERROR_CODES.failed });
  });

  it("raises a CoachError for unreadable JSON", async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token");
      },
    });
    await expect(
      createRemoteCoachProvider({ url, fetchImpl }).createPlan(profile)
    ).rejects.toMatchObject({ code: COACH_ERROR_CODES.badResponse });
  });

  it("maps a network failure to a CoachError", async () => {
    const fetchImpl = async () => {
      throw new TypeError("Failed to fetch");
    };
    await expect(
      createRemoteCoachProvider({ url, fetchImpl }).createPlan(profile)
    ).rejects.toMatchObject({ code: COACH_ERROR_CODES.network });
  });

  it("maps an abort to a timeout CoachError", async () => {
    const fetchImpl = async () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      throw error;
    };
    await expect(
      createRemoteCoachProvider({ url, fetchImpl, timeoutMs: 5 }).createPlan(profile)
    ).rejects.toMatchObject({ code: COACH_ERROR_CODES.timeout });
  });
});
