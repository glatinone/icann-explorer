import { test, expect } from "@playwright/test";

test("home loads in both locales with unofficial label visible", async ({ page }) => {
  await page.goto("/id/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Proyek edukasi independen dan tidak resmi").first()).toBeVisible();

  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Independent, unofficial educational project").first()).toBeVisible();
});

test("language toggle keeps the path and query", async ({ page }) => {
  await page.goto("/id/organizations/?x=1#a");
  const toggle = page.locator(".language-toggle");
  await expect(toggle).toBeVisible();
  // no-JS fallback href points at the other locale root
  const href = await toggle.getAttribute("href");
  expect(href).toBe("/en/");
  // with JS, clicking rewrites only the locale segment
  await toggle.click();
  await expect(page).toHaveURL(/\/en\/organizations\/\?x=1#a/);
});

test("keyboard: skip link and nav work", async ({ page }) => {
  await page.goto("/id/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeInViewport();
});

test("axe: no serious or critical violations on home", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/id/");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious, JSON.stringify(serious.map((v) => v.id))).toEqual([]);
});
