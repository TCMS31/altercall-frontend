import {
  LIMITS,
  validateCoachProfile,
  validateEmail,
  validateOtp,
  validatePassword,
  validateSignin,
  validateSignup,
  validateUsername,
} from "./validation";

describe("validateEmail", () => {
  it.each(["alex@altercall.com", "a.b+tag@sub.example.co"])("accepts %s", (value) => {
    expect(validateEmail(value)).toBeUndefined();
  });

  it.each(["", "   ", "alex", "alex@", "alex@example", "a b@example.com"])(
    "rejects %p",
    (value) => {
      expect(validateEmail(value)).toEqual(expect.any(String));
    }
  );
});

describe("validateUsername", () => {
  it("accepts a normal handle", () => {
    expect(validateUsername("alex.morgan_1")).toBeUndefined();
  });

  it("rejects one that is too short", () => {
    expect(validateUsername("ab")).toContain(`${LIMITS.usernameMin}`);
  });

  it("rejects illegal characters", () => {
    expect(validateUsername("alex morgan")).toMatch(/letters, numbers/i);
  });
});

describe("validatePassword", () => {
  it("requires a letter and a digit", () => {
    expect(validatePassword("alllettersnodigits")).toMatch(/letter and a number/i);
    expect(validatePassword("12345678")).toMatch(/letter and a number/i);
    expect(validatePassword("coach2024")).toBeUndefined();
  });

  it("enforces the minimum length", () => {
    expect(validatePassword("ab1")).toContain(`${LIMITS.passwordMin}`);
  });
});

describe("validateSignin", () => {
  it("returns no errors for a complete form", () => {
    expect(validateSignin({ email: "alex@altercall.com", password: "anything" })).toEqual({});
  });

  it("flags both fields when empty", () => {
    expect(validateSignin({})).toEqual({
      email: expect.any(String),
      password: expect.any(String),
    });
  });
});

describe("validateSignup", () => {
  const valid = {
    name: "Alex Morgan",
    username: "alex.morgan",
    email: "alex@altercall.com",
    password: "coach2024",
  };

  it("passes a valid form", () => {
    expect(validateSignup(valid)).toEqual({});
  });

  it("reports only the failing field", () => {
    expect(validateSignup({ ...valid, password: "short" })).toEqual({
      password: expect.any(String),
    });
  });
});

describe("validateOtp", () => {
  it("accepts six digits", () => {
    expect(validateOtp({ otp: "123456" })).toEqual({});
  });

  it.each([
    ["", /emailed/i],
    ["12345", /6 digits/],
    ["12a456", /digits only/i],
  ])("rejects %p", (otp, pattern) => {
    expect(validateOtp({ otp }).otp).toMatch(pattern);
  });
});

describe("validateCoachProfile", () => {
  const valid = {
    age: 34,
    height: 5.9,
    goal: "strength",
    experience: "intermediate",
    daysPerWeek: 4,
  };

  it("passes a valid profile", () => {
    expect(validateCoachProfile(valid)).toEqual({});
  });

  it("rejects an out-of-range age", () => {
    expect(validateCoachProfile({ ...valid, age: 8 }).age).toContain(`${LIMITS.ageMin}`);
  });

  it("rejects a non-numeric height", () => {
    expect(validateCoachProfile({ ...valid, height: "tall" }).height).toMatch(/number/i);
  });

  it("requires a goal and an experience level", () => {
    const errors = validateCoachProfile({ ...valid, goal: "", experience: "" });
    expect(errors).toEqual({ goal: expect.any(String), experience: expect.any(String) });
  });
});
