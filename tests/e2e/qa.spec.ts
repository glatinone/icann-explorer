import { test, expect } from "@playwright/test";

test("map: tree view shows all 17 entities", async ({ page }) => {
  await page.goto("/id/map/?view=tree");
  const items = page.locator(".tree-view a");
  await expect(items).toHaveCount(17);
});

test("map: relations filtered by Advice shows only advice rows", async ({ page }) => {
  await page.goto("/id/map/?view=relations");
  await page.selectOption(".relations-filters select >> nth=0", "advice");
  const rows = page.locator(".relations-table tbody tr");
  const n = await rows.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    await expect(rows.nth(i)).toContainText(/nasihat|memberi nasihat|advises/i);
  }
});

test("map: click GNSO opens panel, node survives language toggle", async ({ page }) => {
  await page.goto("/id/map/");
  await page.locator('g.map-node[aria-label^="GNSO"]').click();
  await expect(page.locator(".node-panel")).toBeVisible();
  await expect(page).toHaveURL(/node=gnso/);
  await page.locator(".language-toggle").click();
  await expect(page).toHaveURL(/\/en\/map\/.*node=gnso/);
  await expect(page.locator(".node-panel")).toBeVisible();
});

test("search: Ctrl+K opens, typing alac finds ALAC, Enter navigates to profile", async ({ page }) => {
  await page.goto("/id/");
  await page.keyboard.press("Control+k");
  await page.getByRole("dialog").waitFor();
  await page.keyboard.type("alac");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/id\/organizations\/alac\//);
});

test("path: complete beginner path with clicks", async ({ page }) => {
  await page.goto("/id/paths/beginner/");
  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Lanjut" }).click();
  }
  await expect(page.getByText("Selesai!")).toBeVisible();
});

test("glossary: entry anchors and related chips resolve", async ({ page }) => {
  await page.goto("/id/glossary/#term-gtld");
  await expect(page.locator("#term-gtld")).toBeAttached();
  const relatedLink = page.locator(".glossary-related a").first();
  if ((await relatedLink.count()) > 0) {
    const href = await relatedLink.getAttribute("href");
    expect(href).toMatch(/^\/(id|en)\/organizations\//);
  }
});

test("unofficial label and disclaimer visible on every key route in both locales", async ({ page }) => {
  for (const locale of ["id", "en"]) {
    for (const path of ["/", "/map/", "/organizations/", "/organizations/gnso/", "/glossary/", "/paths/", "/paths/beginner/", "/about/"]) {
      await page.goto(`/${locale}${path}`);
      const labelCount = await page
        .getByText(/Proyek edukasi independen dan tidak resmi|Independent, unofficial educational project/)
        .count();
      expect(labelCount).toBeGreaterThanOrEqual(2);
    }
  }
});
