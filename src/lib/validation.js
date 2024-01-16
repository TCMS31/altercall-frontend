/**
 * Form validation rules.
 *
 * These are plain functions over plain objects - no React, no Formik - so they can
 * be unit tested directly and reused by any form library.
 */

export const LIMITS = {
  usernameMin: 3,
  usernameMax: 32,
  passwordMin: 8,
  nameMin: 2,
  ageMin: 13,
  ageMax: 100,
  heightMinFt: 3,
  heightMaxFt: 8,
  otpLength: 6,
  daysPerWeekMin: 2,
  daysPerWeekMax: 6,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

const compact = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));

export const validateEmail = (value) => {
  if (isBlank(value)) return "Email is required";
  if (!EMAIL_PATTERN.test(String(value).trim())) return "Enter a valid email address";
  return undefined;
};

export const validateUsername = (value) => {
  if (isBlank(value)) return "Username is required";
  const trimmed = String(value).trim();
  if (trimmed.length < LIMITS.usernameMin)
    return `Username must be at least ${LIMITS.usernameMin} characters`;
  if (trimmed.length > LIMITS.usernameMax)
    return `Username must be ${LIMITS.usernameMax} characters or fewer`;
  if (!USERNAME_PATTERN.test(trimmed))
    return "Use letters, numbers, dots, dashes or underscores only";
  return undefined;
};

export const validatePassword = (value) => {
  if (isBlank(value)) return "Password is required";
  const raw = String(value);
  if (raw.length < LIMITS.passwordMin)
    return `Password must be at least ${LIMITS.passwordMin} characters`;
  if (!/[a-zA-Z]/.test(raw) || !/[0-9]/.test(raw))
    return "Password must contain a letter and a number";
  return undefined;
};

const validateNumberInRange = (value, { label, min, max }) => {
  if (isBlank(value)) return `${label} is required`;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return `${label} must be a number`;
  if (parsed < min || parsed > max) return `${label} must be between ${min} and ${max}`;
  return undefined;
};

export const validateSignin = (values = {}) =>
  compact({
    email: validateEmail(values.email),
    password: isBlank(values.password) ? "Password is required" : undefined,
  });

export const validateSignup = (values = {}) =>
  compact({
    name: isBlank(values.name)
      ? "Name is required"
      : String(values.name).trim().length < LIMITS.nameMin
        ? `Name must be at least ${LIMITS.nameMin} characters`
        : undefined,
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  });

export const validateOtp = (values = {}) => {
  const code = String(values.otp ?? "").trim();
  if (!code) return { otp: "Enter the code we emailed you" };
  if (!/^[0-9]+$/.test(code)) return { otp: "The code is digits only" };
  if (code.length !== LIMITS.otpLength)
    return { otp: `The code is ${LIMITS.otpLength} digits` };
  return {};
};

export const validateCoachProfile = (values = {}) =>
  compact({
    age: validateNumberInRange(values.age, {
      label: "Age",
      min: LIMITS.ageMin,
      max: LIMITS.ageMax,
    }),
    height: validateNumberInRange(values.height, {
      label: "Height",
      min: LIMITS.heightMinFt,
      max: LIMITS.heightMaxFt,
    }),
    daysPerWeek: validateNumberInRange(values.daysPerWeek, {
      label: "Training days",
      min: LIMITS.daysPerWeekMin,
      max: LIMITS.daysPerWeekMax,
    }),
    goal: isBlank(values.goal) ? "Pick a goal" : undefined,
    experience: isBlank(values.experience) ? "Pick an experience level" : undefined,
  });
