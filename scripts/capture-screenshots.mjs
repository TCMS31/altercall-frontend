/**
 * Captures the README screenshots against a locally served production build.
 *
 * Prerequisites:
 *   npm run build
 *   npx serve -s build -l 8560        (or any static server with SPA fallback)
 *   npx playwright install chromium
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:8560 node scripts/capture-screenshots.mjs
 *
 * The planner runs entirely in the browser, so no backend is needed. A session is
 * injected into localStorage to get past the route guard.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:8560";
const OUT_DIR = process.env.OUT_DIR ?? "docs/screenshots";
const VIEWPORT = { width: 1440, height: 900 };

const SESSION = {
  accessToken: "demo-access-token",
  refreshToken: "demo-refresh-token",
  userId: "u-demo",
  userName: "Alex Morgan",
  userEmail: "alex@altercall.com",
};

const generate = async (page, { age, height, goal, experience, daysPerWeek }) => {
  await page.fill("#age", String(age));
  await page.fill("#height", String(height));
  await page.selectOption("#goal", goal);
  await page.selectOption("#experience", experience);
  await page.selectOption("#daysPerWeek", String(daysPerWeek));
  await page.getByRole("button", { name: /generate plan/i }).click();
  await page.getByRole("heading", { level: 3 }).waitFor();
  await page.waitForTimeout(250);
};

const run = async () => {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  const bytesByRoute = {};
  context.on("response", async (response) => {
    const url = response.url();
    if (!url.endsWith(".js") && !url.endsWith(".css")) return;
    const key = response.request().frame().url();
    try {
      bytesByRoute[key] = (bytesByRoute[key] ?? 0) + (await response.body()).length;
    } catch {
      /* redirected or aborted */
    }
  });

  const page = await context.newPage();

  // 1. Sign-in
  await page.goto(`${BASE_URL}/signin`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT_DIR}/01-signin.png` });

  // 2. Sign-up
  await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT_DIR}/02-signup.png` });

  // Authenticate for the guarded routes.
  await context.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ["altercall.session", JSON.stringify(SESSION)]
  );
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // Build a few plans so the history panel is populated, not empty.
  await generate(page, {
    age: 29,
    height: 5.6,
    goal: "fat-loss",
    experience: "beginner",
    daysPerWeek: 3,
  });
  await generate(page, {
    age: 41,
    height: 6.2,
    goal: "endurance",
    experience: "intermediate",
    daysPerWeek: 5,
  });
  await generate(page, {
    age: 34,
    height: 5.9,
    goal: "strength",
    experience: "advanced",
    daysPerWeek: 4,
  });

  // 3. Planner with a generated plan and populated history
  await page.screenshot({ path: `${OUT_DIR}/03-planner.png` });

  // 4. A previous plan restored from history, scrolled to show the saved list
  await page.getByRole("button", { name: /improve endurance/i }).click();
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 430));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT_DIR}/04-plan-history.png` });

  console.log(JSON.stringify(bytesByRoute, null, 2));
  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
