import { act, renderHook, waitFor } from "@testing-library/react";

import { HISTORY_KEY } from "../planHistory";
import useCoachPlan, { STATUS } from "./useCoachPlan";

const profile = {
  age: 34,
  height: 5.9,
  goal: "strength",
  experience: "intermediate",
  daysPerWeek: 4,
};

const serviceReturning = (plan) => ({ createPlan: jest.fn(async () => plan) });

describe("useCoachPlan", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts idle with no plan", () => {
    const { result } = renderHook(() => useCoachPlan({ service: serviceReturning({}) }));
    expect(result.current.status).toBe(STATUS.idle);
    expect(result.current.plan).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  it("moves to ready and stores the plan in history", async () => {
    const service = serviceReturning({ headline: "4-day block", sessions: [] });
    const { result } = renderHook(() => useCoachPlan({ service, now: () => 1000 }));

    await act(async () => {
      await result.current.generate(profile);
    });

    expect(result.current.status).toBe(STATUS.ready);
    expect(result.current.plan.headline).toBe("4-day block");
    expect(result.current.history).toHaveLength(1);
    expect(JSON.parse(window.localStorage.getItem(HISTORY_KEY))).toHaveLength(1);
  });

  it("surfaces a provider failure as an error state", async () => {
    const service = {
      createPlan: jest.fn(async () => {
        throw new Error("coach offline");
      }),
    };
    const { result } = renderHook(() => useCoachPlan({ service }));

    await act(async () => {
      await result.current.generate(profile);
    });

    expect(result.current.status).toBe(STATUS.error);
    expect(result.current.error).toBe("coach offline");
    expect(result.current.plan).toBeNull();
  });

  it("ignores a stale response when a newer request has been made", async () => {
    const plans = [
      { headline: "first", sessions: [] },
      { headline: "second", sessions: [] },
    ];
    let resolveFirst;
    const service = {
      createPlan: jest
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = () => resolve(plans[0]);
            })
        )
        .mockImplementationOnce(async () => plans[1]),
    };

    const { result } = renderHook(() => useCoachPlan({ service, now: () => Date.now() }));

    let firstCall;
    act(() => {
      firstCall = result.current.generate(profile);
    });
    await act(async () => {
      await result.current.generate(profile);
    });
    await act(async () => {
      resolveFirst();
      await firstCall;
    });

    await waitFor(() => expect(result.current.plan.headline).toBe("second"));
    expect(result.current.history).toHaveLength(1);
  });

  it("restores a plan from history", async () => {
    const service = serviceReturning({ headline: "stored", sessions: [] });
    const { result } = renderHook(() => useCoachPlan({ service, now: () => 2000 }));

    await act(async () => {
      await result.current.generate(profile);
    });
    const storedId = result.current.history[0].id;

    act(() => {
      result.current.reset();
    });
    expect(result.current.status).toBe(STATUS.idle);

    act(() => {
      result.current.selectFromHistory(storedId);
    });
    expect(result.current.status).toBe(STATUS.ready);
    expect(result.current.plan.headline).toBe("stored");
  });

  it("seeds history from localStorage on mount", () => {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ id: "x", headline: "previous", createdAt: 1 }])
    );
    const { result } = renderHook(() => useCoachPlan({ service: serviceReturning({}) }));
    expect(result.current.history).toHaveLength(1);
  });
});
