import {
  clearSession,
  createMemoryStorage,
  isValidSession,
  readJson,
  readSession,
  SESSION_KEY,
  writeJson,
  writeSession,
} from "./storage";

const session = { accessToken: "token-123", userId: "u-1", userName: "Alex" };

describe("session storage", () => {
  let storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("round-trips a session as JSON rather than [object Object]", () => {
    writeSession(session, storage);
    expect(storage.getItem(SESSION_KEY)).toBe(JSON.stringify(session));
    expect(readSession(storage)).toEqual(session);
  });

  it("refuses to persist a payload with no access token", () => {
    expect(() => writeSession({ userId: "u-1" }, storage)).toThrow(TypeError);
    expect(() => writeSession(null, storage)).toThrow(TypeError);
  });

  it("returns null for corrupt stored data instead of throwing", () => {
    storage.setItem(SESSION_KEY, "[object Object]");
    expect(readSession(storage)).toBeNull();
  });

  it("returns null when the stored JSON is valid but not a session", () => {
    storage.setItem(SESSION_KEY, JSON.stringify({ userId: "u-1" }));
    expect(readSession(storage)).toBeNull();
  });

  it("clears the session", () => {
    writeSession(session, storage);
    clearSession(storage);
    expect(readSession(storage)).toBeNull();
  });
});

describe("isValidSession", () => {
  it.each([[null], [undefined], [{}], [{ accessToken: "" }], ["token"]])(
    "rejects %p",
    (value) => {
      expect(isValidSession(value)).toBe(false);
    }
  );

  it("accepts a session with a token", () => {
    expect(isValidSession(session)).toBe(true);
  });
});

describe("json helpers", () => {
  it("falls back when the key is missing", () => {
    expect(readJson("nope", [], createMemoryStorage())).toEqual([]);
  });

  it("falls back when the value is not JSON", () => {
    const storage = createMemoryStorage();
    storage.setItem("k", "{oops");
    expect(readJson("k", "fallback", storage)).toBe("fallback");
  });

  it("writes and reads structured values", () => {
    const storage = createMemoryStorage();
    writeJson("k", [{ id: 1 }], storage);
    expect(readJson("k", [], storage)).toEqual([{ id: 1 }]);
  });

  it("reports failure instead of throwing when the quota is exceeded", () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(writeJson("k", { a: 1 }, failing)).toBe(false);
  });
});
