import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "@/lib/search";

/** The 10 spec queries with their expected top entity/term. */
const EXPECTED: Array<{ query: string; expectId: string }> = [
  { query: "gnso", expectId: "e-gnso" },
  { query: "alac", expectId: "e-alac" },
  { query: "pengguna internet", expectId: "e-alac" },
  { query: "kebijakan gtld", expectId: "e-gnso" },
  { query: "dnssec", expectId: "t-dnssec" },
  { query: "root", expectId: "e-root-server-operators" },
  { query: "fellowship", expectId: "t-fellowship" },
  { query: "ip address", expectId: "e-rirs" },
  { query: "pemerintah", expectId: "e-gac" },
  { query: "udrp", expectId: "t-udrp" },
];

describe("search index", () => {
  const index = buildSearchIndex("id");

  for (const { query, expectId } of EXPECTED) {
    it(`"${query}" returns ${expectId} in the top results`, () => {
      const hits = index.search(query, { boost: { title: 2 }, fuzzy: 0.2 });
      expect(hits.length).toBeGreaterThan(0);
      const ids = hits.map((h) => h.id);
      expect(ids.slice(0, 5)).toContain(expectId);
    });
  }

  it("ranks the acronym itself first for acronym queries", () => {
    const hits = index.search("alac", { boost: { title: 2 } });
    expect(hits[0]?.id).toBe("e-alac");
  });
});
