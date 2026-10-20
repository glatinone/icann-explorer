import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("vercel.json", () => {
  const config = JSON.parse(readFileSync(join(__dirname, "../../vercel.json"), "utf8"));

  it("redirects the bare domain to the default locale", () => {
    expect(config.redirects).toContainEqual(expect.objectContaining({ source: "/", destination: "/id/" }));
  });

  it("keeps preview deployments, but not production, out of search engines", () => {
    const preview = config.headers.find((h: { has?: Array<{ value: string }> }) => h.has);
    const noindex = new RegExp(preview.has[0].value);
    expect(noindex.test("icann-explorer-1d1305igm-securepe8alt-1967s-projects.vercel.app")).toBe(true);
    expect(noindex.test("icann-explorer-git-remake-securepe8alt-1967s-projects.vercel.app")).toBe(true);
    expect(noindex.test("icann-explorer.vercel.app")).toBe(false);
  });
});
