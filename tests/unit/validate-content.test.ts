/* eslint-disable @typescript-eslint/no-explicit-any -- these tests poke at deep JSON fixtures on purpose */
import { describe, expect, it } from "vitest";
import entities from "../../content/entities.json";
import layout from "../../content/layout.json";
import paths from "../../content/paths.json";
import relationships from "../../content/relationships.json";
import sources from "../../content/sources.json";
import terms from "../../content/terms.json";
import { publishedOnly, validateContent, type RawContent } from "@/lib/validate";

/** A fresh, mutable copy of the real content for each test. */
function content(): {
  sources: Array<Record<string, unknown>>;
  entities: Array<Record<string, any>>;
  relationships: Array<Record<string, any>>;
  terms: Array<Record<string, any>>;
  paths: Array<Record<string, any>>;
  layout: Record<string, any>;
} {
  return structuredClone({ sources, entities, relationships, terms, paths, layout });
}

const issuesOf = (raw: RawContent): string[] => validateContent(raw, "2026-12-31").issues;

describe("the shipped content", () => {
  it("passes every check", () => {
    expect(issuesOf(content())).toEqual([]);
  });

  it("has a map position for every entity", () => {
    for (const e of entities) expect(layout.positions, e.id).toHaveProperty(e.id);
  });

  it("models the Empowered Community with exactly its five Decisional Participants", () => {
    const participants = relationships
      .filter((r) => r.to === "empowered-community" && r.type === "participates-in")
      .map((r) => r.from)
      .sort();
    expect(participants).toEqual(["alac", "aso", "ccnso", "gac", "gnso"]);
  });
});

describe("validateContent rejects", () => {
  it("an SO that reports to the Board", () => {
    const c = content();
    const r = structuredClone(c.relationships[0]);
    Object.assign(r, { id: "gnso--reports-to--icann-board", from: "gnso", to: "icann-board", type: "reports-to" });
    c.relationships.push(r);
    expect(issuesOf(c).some((i) => i.includes("only ICANN org may report"))).toBe(true);
  });

  it("an external organization that is part of ICANN", () => {
    const c = content();
    const r = structuredClone(c.relationships[0]);
    Object.assign(r, { id: "ietf--part-of--gnso", from: "ietf", to: "gnso", type: "part-of" });
    c.relationships.push(r);
    expect(issuesOf(c).some((i) => i.includes('"part-of" is not allowed from external'))).toBe(true);
  });

  it("a fact that rests only on a Tier 4 source", () => {
    const c = content();
    c.sources.push({ id: "a-blog", title: "A blog", url: "https://example.com/", publisher: "Someone", tier: 4, languages: ["en"], accessed: "2026-10-20" });
    c.entities[0].oneLiner.kind = "fact";
    c.entities[0].oneLiner.citations = [{ sourceId: "a-blog", locator: "para 1", verifiedAt: "2026-10-20" }];
    expect(issuesOf(c).some((i) => i.includes("needs at least one Tier 1-3"))).toBe(true);
  });

  it("a citation without a locator", () => {
    const c = content();
    delete c.entities[0].oneLiner.citations[0].locator;
    expect(issuesOf(c).length).toBeGreaterThan(0);
  });

  it("a citation verified in the future", () => {
    const c = content();
    c.entities[0].oneLiner.citations[0].verifiedAt = "2099-01-01";
    expect(issuesOf(c).some((i) => i.includes("in the future"))).toBe(true);
  });

  it("a claim missing its Indonesian text", () => {
    const c = content();
    c.entities[0].oneLiner.text.id = "";
    expect(issuesOf(c).some((i) => i.includes("Indonesian text is required"))).toBe(true);
  });

  it("a relationship id that doesn't match its endpoints", () => {
    const c = content();
    c.relationships[0].id = "something--advises--else";
    expect(issuesOf(c).length).toBeGreaterThan(0);
  });

  it("a link to an unknown term", () => {
    const c = content();
    c.entities[0].relatedTermIds.push("no-such-term");
    expect(issuesOf(c).some((i) => i.includes('unknown term "no-such-term"'))).toBe(true);
  });
});

describe("publishedOnly", () => {
  it("drops needs-review entities and every relationship that touches them", () => {
    const { content: parsed } = validateContent(content(), "2026-12-31");
    const c = structuredClone(parsed!);
    c.entities = c.entities.map((e) => (e.id === "gnso" ? { ...e, status: "needs-review" as const } : e));
    const out = publishedOnly(c);
    expect(out.entities.find((e) => e.id === "gnso")).toBeUndefined();
    expect(out.relationships.some((r) => r.from === "gnso" || r.to === "gnso")).toBe(false);
  });
});
