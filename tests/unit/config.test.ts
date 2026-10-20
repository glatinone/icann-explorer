import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("vercel.json", () => {
  const config = JSON.parse(readFileSync(join(__dirname, "../../vercel.json"), "utf8"));

  it("redirects the bare domain to the default locale", () => {
    expect(config.redirects).toContainEqual(expect.objectContaining({ source: "/", destination: "/id/" }));
  });

  it("keeps preview deployments out of search engines", () => {
    const preview = config.headers.find((h: { has?: Array<{ value: string }> }) => h.has);
    expect(new RegExp(preview.has[0].value).test("icann-explorer-abc.vercel.app")).toBe(true);
    expect(new RegExp(preview.has[0].value).test("icann-explorer.example.org")).toBe(false);
  });
});
