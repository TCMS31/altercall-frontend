import { buildPlan, distributeTrainingDays, GOALS } from "./planner";

const baseProfile = {
  age: 34,
  height: 5.9,
  goal: "strength",
  experience: "intermediate",
  daysPerWeek: 4,
};

describe("distributeTrainingDays", () => {
  it.each([2, 3, 4, 5, 6])("returns %i distinct days", (count) => {
    const days = distributeTrainingDays(count);
    expect(days).toHaveLength(count);
    expect(new Set(days).size).toBe(count);
  });

  it("clamps nonsense input into a usable week", () => {
    expect(distributeTrainingDays(99)).toHaveLength(7);
    expect(distributeTrainingDays("not a number")).toHaveLength(3);
  });
});

describe("buildPlan", () => {
  it("builds one session per requested training day", () => {
    const plan = buildPlan({ ...baseProfile, daysPerWeek: 5 });
    expect(plan.sessions).toHaveLength(5);
    expect(plan.weeklyLoad.sessions).toBe(5);
  });

  it("gives every session four prescribed blocks", () => {
    const plan = buildPlan(baseProfile);
    plan.sessions.forEach((session) => {
      expect(session.blocks).toHaveLength(4);
      session.blocks.forEach((block) => {
        expect(block.name).toEqual(expect.any(String));
        expect(block.prescription).toEqual(expect.any(String));
      });
    });
  });

  it("varies the opening movement across the week", () => {
    const plan = buildPlan(baseProfile);
    const openers = plan.sessions.map((session) => session.blocks[0].name);
    expect(new Set(openers).size).toBe(plan.sessions.length);
  });

  it("is deterministic for the same profile", () => {
    expect(buildPlan(baseProfile)).toEqual(buildPlan(baseProfile));
  });

  it.each(GOALS.map((goal) => goal.id))("produces a plan for the %s goal", (goal) => {
    const plan = buildPlan({ ...baseProfile, goal });
    expect(plan.goal).toBe(goal);
    expect(plan.focusAreas.length).toBeGreaterThan(0);
    expect(plan.summary).toEqual(expect.any(String));
  });

  it("falls back to a known goal when given an unknown one", () => {
    expect(buildPlan({ ...baseProfile, goal: "time-travel" }).goal).toBe("strength");
  });

  it("scales session length with experience", () => {
    const beginner = buildPlan({ ...baseProfile, experience: "beginner" });
    const advanced = buildPlan({ ...baseProfile, experience: "advanced" });
    expect(advanced.sessions[0].durationMin).toBeGreaterThan(beginner.sessions[0].durationMin);
  });

  it("adds an age-specific coaching note for older athletes", () => {
    const plan = buildPlan({ ...baseProfile, age: 58 });
    expect(plan.coachingNotes.join(" ")).toMatch(/Over 50/);
  });

  it("adds a note about long levers for tall athletes", () => {
    const plan = buildPlan({ ...baseProfile, height: 6.4 });
    expect(plan.coachingNotes.join(" ")).toMatch(/Long levers/);
  });

  it("does not attach a height note for an unspecified height", () => {
    const plan = buildPlan({ ...baseProfile, height: undefined });
    expect(plan.coachingNotes.join(" ")).not.toMatch(/levers/);
  });
});
