import { createCoachRegistry } from "./registry";

const provider = (id, priority, available = true) => ({
  id,
  label: id,
  priority,
  isAvailable: () => available,
  createPlan: async () => ({ id }),
});

describe("createCoachRegistry", () => {
  it("orders providers by descending priority", () => {
    const registry = createCoachRegistry([provider("low", 0), provider("high", 10)]);
    expect(registry.list().map((entry) => entry.id)).toEqual(["high", "low"]);
  });

  it("resolves the highest-priority available provider", () => {
    const registry = createCoachRegistry([provider("local", 0), provider("remote", 10, false)]);
    expect(registry.resolve().id).toBe("local");
  });

  it("lists only available providers, best first", () => {
    const registry = createCoachRegistry([
      provider("local", 0),
      provider("remote", 10),
      provider("offline", 5, false),
    ]);
    expect(registry.available().map((entry) => entry.id)).toEqual(["remote", "local"]);
  });

  it("replaces a provider registered under an existing id", () => {
    const registry = createCoachRegistry([provider("local", 0)]);
    registry.register({ ...provider("local", 99), label: "replacement" });
    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0].label).toBe("replacement");
  });

  it("rejects a provider that does not satisfy the contract", () => {
    expect(() => createCoachRegistry([{ id: "broken" }])).toThrow(/missing/i);
    expect(() => createCoachRegistry([{ createPlan: () => {} }])).toThrow(/id/i);
  });

  it("returns null when nothing is available", () => {
    expect(createCoachRegistry([provider("remote", 10, false)]).resolve()).toBeNull();
  });
});
