import { appendToHistory, HISTORY_LIMIT, makeHistoryId } from "./planHistory";

const entry = (id) => ({ id, headline: `plan ${id}` });

describe("appendToHistory", () => {
  it("puts the newest entry first", () => {
    const history = appendToHistory([entry("a")], entry("b"));
    expect(history.map((item) => item.id)).toEqual(["b", "a"]);
  });

  it("de-duplicates by id rather than growing", () => {
    const history = appendToHistory([entry("a"), entry("b")], entry("a"));
    expect(history.map((item) => item.id)).toEqual(["a", "b"]);
  });

  it("caps the list so storage cannot grow without bound", () => {
    const full = Array.from({ length: HISTORY_LIMIT }, (_, index) => entry(`e${index}`));
    const history = appendToHistory(full, entry("new"));
    expect(history).toHaveLength(HISTORY_LIMIT);
    expect(history[0].id).toBe("new");
  });
});

describe("makeHistoryId", () => {
  it("encodes the profile and the timestamp", () => {
    expect(
      makeHistoryId({ goal: "strength", experience: "beginner", daysPerWeek: 3 }, 42)
    ).toBe("strength-beginner-3-42");
  });
});
