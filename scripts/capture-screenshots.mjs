/**
 * Captures the README screenshots against a production build.
 *
 *   npm run build
 *   npm run preview -- --port 8560
 *   BASE_URL=http://127.0.0.1:8560 node scripts/capture-screenshots.mjs
 *
 * Needs the `playwright` package and its Chromium (`npx playwright install chromium`).
 * No backend is involved: every GraphQL request is answered from the demo
 * fixtures below, and the planner runs in the browser.
 */
import { mkdirSync } from "node:fs";

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:8560";
const OUT_DIR = process.env.OUT_DIR ?? "docs/screenshots";
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const DEMO_COACH = {
  name: "Alex Morgan",
  username: "alex.morgan",
  email: "alex@example.com",
  password: "demo-pass-1",
};

const GRAPHQL_FIXTURES = {
  Signin: {
    signin: {
      __typename: "SigninMutation",
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      userId: "u-demo",
      userName: DEMO_COACH.name,
      userEmail: DEMO_COACH.email,
    },
  },
  SignUp: {
    signup: {
      __typename: "SignupMutation",
      user: { __typename: "UserType", username: DEMO_COACH.username, email: DEMO_COACH.email },
    },
  },
  UserConfirmation: { confirmUser: { __typename: "ConfirmUserMutation", success: true } },
};

// The API sits on another origin than the preview server, so the fake
// responses need CORS headers just like the real ones would.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const mockGraphql = (context) =>
  context.route("**/graphql", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS_HEADERS });
      return;
    }
    const { operationName } = route.request().postDataJSON() ?? {};
    const data = GRAPHQL_FIXTURES[operationName];
    await route.fulfill({
      status: data ? 200 : 400,
      headers: CORS_HEADERS,
      contentType: "application/json",
      body: JSON.stringify(data ? { data } : { errors: [{ message: "Unknown operation" }] }),
    });
  });

const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
};

const signIn = async (page) => {
  await page.goto(`${BASE_URL}/signin`, { waitUntil: "networkidle" });
  await page.getByLabel(/email or username/i).fill(DEMO_COACH.username);
  await page.getByLabel(/password/i).fill(DEMO_COACH.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.getByRole("heading", { name: /session planner/i }).waitFor();
};

const generate = async (page, { age, height, goal, experience, daysPerWeek }) => {
  await page.fill("#age", String(age));
  await page.fill("#height", String(height));
  await page.selectOption("#goal", goal);
  await page.selectOption("#experience", experience);
  await page.selectOption("#daysPerWeek", String(daysPerWeek));
  await page.getByRole("button", { name: /generate plan/i }).click();
  await page.getByRole("heading", { level: 3 }).waitFor();
};

const PROFILES = [
  { age: 29, height: 5.6, goal: "fat-loss", experience: "beginner", daysPerWeek: 3 },
  { age: 41, height: 6.2, goal: "endurance", experience: "intermediate", daysPerWeek: 5 },
  { age: 34, height: 5.9, goal: "strength", experience: "advanced", daysPerWeek: 4 },
];

const newPage = async (browser, viewport) => {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await mockGraphql(context);
  return context.newPage();
};

const captureDesktop = async (browser) => {
  const page = await newPage(browser, DESKTOP);

  await page.goto(`${BASE_URL}/signin`, { waitUntil: "networkidle" });
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/01-signin.png` });

  await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle" });
  await page.getByLabel(/full name/i).fill(DEMO_COACH.name);
  await page.getByLabel(/username/i).fill(DEMO_COACH.username);
  await page.getByLabel(/email/i).fill(DEMO_COACH.email);
  await page.getByLabel(/^password/i).fill(DEMO_COACH.password);
  await page.getByRole("button", { name: /create account/i }).click();
  await page.getByRole("dialog", { name: /confirm your email/i }).waitFor();
  await page.getByLabel(/confirmation code/i).fill("482913");
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/02-signup-confirm.png` });

  await signIn(page);
  for (const profile of PROFILES) await generate(page, profile);
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/03-planner.png` });

  await page.getByRole("button", { name: /improve endurance/i }).click();
  await page.getByRole("heading", { name: /recent plans/i }).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -90));
  await page.mouse.move(0, 0);
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/04-plan-history.png` });

  await page.context().close();
};

const captureMobile = async (browser) => {
  const page = await newPage(browser, MOBILE);

  await page.goto(`${BASE_URL}/signin`, { waitUntil: "networkidle" });
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/05-mobile-signin.png` });

  await signIn(page);
  await generate(page, PROFILES[2]);
  await page.evaluate(() => {
    const panel = [...document.querySelectorAll("h2")].find((h) => /this week/i.test(h.textContent));
    window.scrollTo(0, panel.getBoundingClientRect().top + window.scrollY - 80);
  });
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/06-mobile-plan.png` });

  await page.context().close();
};

const run = async () => {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    await captureDesktop(browser);
    await captureMobile(browser);
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
