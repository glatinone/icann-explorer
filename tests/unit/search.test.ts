import { describe, expect, it } from "vitest";
import { GET } from "@/app/search-index.json/route";
import { createIndex, searchIds } from "@/lib/search";
import type { SearchDoc } from "@/lib/search-docs";

const docs = (await GET().json()) as SearchDoc[];
const index = createIndex(docs);
const top = (q: string, n = 3): string[] => searchIds(index, q).slice(0, n);

describe("search", () => {
  it("indexes every organization, term and path", () => {
    expect(docs.filter((d) => d.type === "entity").length).toBe(17);
    expect(docs.filter((d) => d.type === "term").length).toBeGreaterThanOrEqual(30);
    expect(docs.filter((d) => d.type === "path").length).toBe(4);
  });

  it.each([
    ["gnso", "entity-gnso"],
    ["alac", "entity-alac"],
    ["ssac", "entity-ssac"],
    ["udrp", "term-udrp"],
    ["dnssec", "term-dnssec"],
    ["fellowship", "term-fellowship"],
  ])("puts %s first", (q, id) => {
    expect(top(q, 1)).toEqual([id]);
  });

  it.each([
    ["pemerintah", "entity-gac"],
    ["governments", "entity-gac"],
    ["nomor IP", "entity-rirs"],
    ["root server", "entity-root-server-operators"],
  ])("finds %s by topic in either language", (q, id) => {
    expect(searchIds(index, q).slice(0, 5)).toContain(id);
  });

  it("tolerates a typo in longer words", () => {
    expect(searchIds(index, "registar").slice(0, 3)).toContain("term-registrar");
  });
});
