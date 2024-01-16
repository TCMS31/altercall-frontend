import { createCoachRegistry, createCoachService } from "./index";

const profile = {
  age: 34,
  height: 5.9,
  goal: "strength",
  experience: "intermediate",
  daysPerWeek: 4,
};

const silentLogger = { warn: () => {} };

const stubProvider = (id, priority, impl) => ({
  id,
  label: `${id} provider`,
  priority,
  isAvailable: () => true,
  createPlan: impl,
});

describe("createCoachService", () => {
  it("uses the highest-priority provider and reports it", async () => {
    const registry = createCoachRegistry([
      stubProvider("local", 0, async () => ({ headline: "local" })),
      stubProvider("remote", 10, async () => ({ headline: "remote" })),
    ]);

    const plan = await createCoachService({ registry, logger: silentLogger }).createPlan(
      profile
    );

    expect(plan.headline).toBe("remote");
    expect(plan.providerId).toBe("remote");
    expect(plan.degraded).toBe(false);
  });

  it("falls back to the next provider and flags the plan as degraded", async () => {
    const registry = createCoachRegistry([
      stubProvider("local", 0, async () => ({ headline: "local" })),
      stubProvider("remote", 10, async () => {
        throw new Error("upstream exploded");
      }),
    ]);

    const plan = await createCoachService({ registry, logger: silentLogger }).createPlan(
      profile
    );

    expect(plan.providerId).toBe("local");
    expect(plan.degraded).toBe(true);
    expect(plan.degradedReason).toBe("upstream exploded");
  });

  it("propagates the error when every provider fails", async () => {
    const registry = createCoachRegistry([
      stubProvider("local", 0, async () => {
        throw new Error("local exploded");
      }),
    ]);

    await expect(
      createCoachService({ registry, logger: silentLogger }).createPlan(profile)
    ).rejects.toThrow("local exploded");
  });

  it("throws when nothing is registered", async () => {
    await expect(
      createCoachService({
        registry: createCoachRegistry([]),
        logger: silentLogger,
      }).createPlan(profile)
    ).rejects.toThrow(/no coaching provider/i);
  });

  it("degrades to the built-in planner with no environment configured", async () => {
    const plan = await createCoachService({ logger: silentLogger }).createPlan(profile);
    expect(plan.providerId).toBe("local");
    expect(plan.sessions).toHaveLength(4);
  });
});
