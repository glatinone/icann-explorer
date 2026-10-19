/**
 * Generates the OG images (1200x630) for both locales using Playwright's
 * bundled Chromium. Outputs public/og/og-id.png and public/og/og-en.png.
 * Run: node scripts/gen-og.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

const nodes = [
  ["Board", "body"],
  ["ICANN org", "body"],
  ["GNSO", "accent"],
  ["ccNSO", "accent"],
  ["ALAC", "accent"],
  ["ASO", "accent"],
];

function svgMap(accent) {
  const x = 60, y = 320;
  const positions = [
    [x + 260, y - 70],
    [x + 470, y - 70],
    [x + 60, y + 30],
    [x + 260, y + 30],
    [x + 470, y + 30],
    [x + 160, y + 130],
  ];
  const lines = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 5],
  ];
  const lineEls = lines
    .map(([a, b]) => {
      const [ax, ay] = positions[a];
      const [bx, by] = positions[b];
      return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#9aa7b5" stroke-width="2"/>`;
    })
    .join("\n");
  const nodeEls = nodes
    .map(([label, cls], i) => {
      const [nx, ny] = positions[i];
      const fill = cls === "body" ? "#1f2a37" : accent;
      return `<g><circle cx="${nx}" cy="${ny}" r="34" fill="${fill}"/><text x="${nx}" y="${ny + 4}" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600">${label}</text></g>`;
    })
    .join("\n");
  return `
    <svg width="560" height="240" viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${lineEls}
      ${nodeEls}
    </svg>`;
}

function render(locale) {
  const accent = locale === "id" ? "#0f766e" : "#1d4ed8";
  const title = locale === "id" ? "Pahami ekosistem ICANN" : "Understand the ICANN ecosystem";
  const sub =
    locale === "id"
      ? "Siapa melakukan apa, bagaimana kelompok saling terhubung, dan cara mulai berkontribusi"
      : "Who does what, how groups connect, and where to start contributing";
  const label = "INDEPENDENT, UNOFFICIAL EDUCATIONAL PROJECT";
  return `<!doctype html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;width:1200px;height:630px;background:#fbfcfd;font-family:'Segoe UI',Arial,sans-serif;color:#111827;">
  <div style="padding:56px 64px;height:calc(630px - 112px);box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;border:1px solid #e5e7eb;border-radius:8px;">
    <div style="border:2px solid ${accent};width:fit-content;padding:6px 14px;border-radius:999px;font-size:13px;letter-spacing:0.08em;color:${accent};font-weight:600;">${label}</div>
    <div>
      <div style="display:flex;align-items:center;gap:56px;">
        <div style="flex:1;">
          <h1 style="margin:0;font-size:52px;line-height:1.05;font-weight:700;">ICANN Explorer</h1>
          <p style="margin:18px 0 0;font-size:24px;line-height:1.35;color:#374151;max-width:470px;">${title}</p>
          <p style="margin:12px 0 0;font-size:16px;line-height:1.5;color:#6b7280;max-width:470px;">${sub}</p>
        </div>
        <div style="flex:0 0 560px;">${svgMap(accent)}</div>
      </div>
    </div>
    <div style="font-size:14px;color:#9aa7b5;">icann-explorer · bilingual ID/EN</div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ["id", "en"]) {
  await page.setContent(render(locale));
  await page.screenshot({ path: join(outDir, `og-${locale}.png`), type: "png" });
  console.log(`wrote public/og/og-${locale}.png`);
}
await browser.close();
