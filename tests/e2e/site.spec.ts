import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const KEY_PAGES = ["/id/", "/en/map/", "/id/organizations/gnso/", "/en/glossary/pdp/", "/id/paths/beginner/", "/en/about/"];

test.describe("every key page", () => {
  for (const path of KEY_PAGES) {
    test(`${path} renders, is labeled unofficial, and has no serious axe violations`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator(".brand-note")).toHaveText(path.startsWith("/id") ? /tidak resmi/ : /unofficial/);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
      const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
});

test("the language toggle keeps the page, the map selection and the view", async ({ page }) => {
  await page.goto("/id/map/?node=gac&view=table");
  await page.locator(".lang-toggle").click();
  await expect(page).toHaveURL(/\/en\/map\/\?.*node=gac/);
  await expect(page).toHaveURL(/view=table/);
});

test("selecting a group on the map opens its panel and writes the URL", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/id/map/");
  await page.locator('g.node[aria-label^="ALAC,"]').click();
  await expect(page.locator(".map-panel .panel-title")).toContainText("ALAC");
  await expect(page).toHaveURL(/node=alac/);
  await page.locator(".connection-button").first().click();
  await expect(page).toHaveURL(/edge=/);
  await expect(page.locator(".panel-sources li").first()).toBeVisible();
});

test("the map works by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/map/");
  const board = page.locator('g.node[aria-label^="Board,"]');
  await board.focus();
  await page.keyboard.press("Enter");
  await expect(board).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator('g.node[aria-label^="GNSO,"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(board).toHaveAttribute("aria-pressed", "false");
});

test("small screens start on the list view without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/id/map/");
  await expect(page.locator(".map-list")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("search finds a group by acronym and opens it with Enter", async ({ page }) => {
  await page.goto("/en/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("ssac");
  await expect(page.locator("#search-results li").first()).toContainText("SSAC");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/organizations\/ssac\/$/);
});

test("footnote numbers jump to the source list", async ({ page }) => {
  await page.goto("/en/organizations/icann-board/");
  const first = page.locator(".cite a").first();
  const target = await first.getAttribute("href");
  await first.click();
  await expect(page.locator(target!)).toBeInViewport();
});

test("self-check gives feedback", async ({ page }) => {
  await page.goto("/id/paths/beginner/");
  const check = page.locator(".self-check").first();
  await check.locator("label").first().click();
  await expect(check.locator(".self-check-result")).not.toBeEmpty();
});
