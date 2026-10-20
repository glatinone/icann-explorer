/**
 * Renders the social preview images (1200x630) for both locales with Playwright's Chromium.
 * Run: node scripts/gen-og.mjs  → public/og/og-id.png, public/og/og-en.png
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og");
mkdirSync(outDir, { recursive: true });

const COPY = {
  id: {
    label: "Proyek edukasi independen dan tidak resmi",
    title: "Siapa menentukan cara kerja nama dan nomor internet, dan bagaimana kamu bisa ikut bersuara.",
    parts: ["Komunitas", "Dewan", "ICANN org"],
    verbs: ["mengusulkan", "menjalankan"],
  },
  en: {
    label: "Independent, unofficial educational project",
    title: "Who decides how internet names and numbers work, and how you can have a say.",
    parts: ["Community", "Board", "ICANN org"],
    verbs: ["proposes", "implements"],
  },
};

const box = (text, color) =>
  `<div style="padding:14px 22px;background:#fffdf8;border:1px solid #dcd7cc;border-top:5px solid ${color};border-radius:10px;font-weight:700;font-size:24px">${text}</div>`;
const arrow = (text) =>
  `<div style="display:flex;flex-direction:column;align-items:center;color:#5c6067;font-size:16px;padding:0 10px">${text}<div style="font-size:26px;line-height:1">→</div></div>`;

function render(locale) {
  const c = COPY[locale];
  return `<!doctype html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;width:1200px;height:630px;background:#f5f3ee;color:#1c1d1f;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="box-sizing:border-box;height:630px;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;border-left:14px solid #a03b1c">
    <div>
      <div style="font-size:18px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6067;font-weight:600">ICANN Explorer · ${c.label}</div>
      <h1 style="margin:28px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:58px;line-height:1.08;font-weight:700;max-width:1000px">${c.title}</h1>
    </div>
    <div style="display:flex;align-items:center">
      ${box(c.parts[0], "#2457a0")}${arrow(c.verbs[0])}${box(c.parts[1], "#1c1d1f")}${arrow(c.verbs[1])}${box(c.parts[2], "#2f6b47")}
      <div style="margin-left:auto;font-size:22px;font-weight:700;color:#a03b1c">ID · EN</div>
    </div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ["id", "en"]) {
  await page.setContent(render(locale));
  await page.screenshot({ path: join(outDir, `og-${locale}.png`) });
  console.log(`wrote public/og/og-${locale}.png`);
}
await browser.close();
