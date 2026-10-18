import { describe, it, expect } from "vitest";
import type { Entity, Relationship, Source } from "@/lib/schema";
import { validateContent, type ContentInput } from "@/lib/validate";

const tier1: Source = {
  id: "bylaws",
  title: "ICANN Bylaws",
  url: "https://www.icann.org/resources/pages/governance/bylaws-en",
  publisher: "ICANN",
  tier: 1,
  languages: ["en"],
  accessed: "2026-10-18",
};

function entity(over: Partial<Entity>): Entity {
  return {
    id: "gnso",
    kind: "supporting-organization",
    scope: "icann-internal",
    acronym: "GNSO",
    name: { id: "Organisasi Pendukung GNSO", en: "GNSO Supporting Organization" },
    oneLiner: {
      text: { id: "Satu kalimat", en: "One line." },
      kind: "fact",
      citations: [{ sourceId: "bylaws", verifiedAt: "2026-10-18" }],
      translation: { original: "en", reviewed: true },
    },
    whyItExists: [],
    whatItDoes: [],
    example: {
      text: { id: "Contoh", en: "Example." },
      kind: "fact",
      citations: [{ sourceId: "bylaws", verifiedAt: "2026-10-18" }],
      translation: { original: "en", reviewed: true },
    },
    officialUrl: "https://gnso.icann.org/",
    relatedTermIds: [],
    status: "published",
    lastReviewed: "2026-10-18",
    ...over,
  };
}

function relation(over: Partial<Relationship>): Relationship {
  return {
    id: "gnso-reports-to-board",
    from: "gnso",
    to: "icann-board",
    type: "reports-to",
    label: { id: "bertanggung jawab kepada", en: "reports to" },
    explanation: {
      text: { id: "Penjelasan.", en: "Explanation." },
      kind: "fact",
      citations: [{ sourceId: "bylaws", verifiedAt: "2026-10-18" }],
      translation: { original: "en", reviewed: true },
    },
    status: "published",
    ...over,
  };
}

function baseInput(): ContentInput {
  return {
    sources: [tier1],
    entities: [entity({}), entity({ id: "icann-board", kind: "board", scope: "icann-internal" })],
    relationships: [],
    terms: [],
    paths: [],
    layout: null,
  };
}

describe("validateContent", () => {
  it("passes a clean skeleton", () => {
    expect(validateContent(baseInput())).toEqual([]);
  });

  it("rejects an SO that reports-to the Board", () => {
    const input = baseInput();
    input.relationships = [relation({})];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes('SO/AC must not "reports-to"'))).toBe(true);
  });

  it("rejects an external entity that is part-of an ICANN-internal entity", () => {
    const input = baseInput();
    input.entities = [
      ...input.entities,
      entity({ id: "ietf", kind: "external", scope: "external", acronym: "IETF" }),
    ];
    input.relationships = [
      relation({
        id: "ietf-part-of-icann",
        from: "ietf",
        to: "gnso",
        type: "part-of",
      }),
    ];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes("cannot be part-of an ICANN-internal entity"))).toBe(true);
  });

  it("rejects a fact that only has a Tier 4 citation", () => {
    const tier4: Source = { ...tier1, id: "blog", tier: 4, title: "A blog post" };
    const input = baseInput();
    input.sources = [tier1, tier4];
    input.entities = [
      entity({
        oneLiner: {
          text: { id: "Klaim.", en: "Claim." },
          kind: "fact",
          citations: [{ sourceId: "blog", verifiedAt: "2026-10-18" }],
          translation: { original: "en", reviewed: true },
        },
      }),
    ];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes("needs Tier 1-3"))).toBe(true);
  });

  it("rejects an unknown sourceId in a citation", () => {
    const input = baseInput();
    input.entities = [
      entity({
        oneLiner: {
          text: { id: "Klaim.", en: "Claim." },
          kind: "fact",
          citations: [{ sourceId: "nope", verifiedAt: "2026-10-18" }],
          translation: { original: "en", reviewed: true },
        },
      }),
    ];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes('unknown sourceId "nope"'))).toBe(true);
  });

  it("rejects a non-ASCII entity id", () => {
    const input = baseInput();
    input.entities = [
      entity({ id: "günso" }),
      entity({ id: "icann-board", kind: "board", scope: "icann-internal" }),
    ];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes("schema violation"))).toBe(true);
  });

  it("rejects a claim missing the Indonesian text", () => {
    const input = baseInput();
    const bad = entity({});
    (bad.oneLiner as { text: { id: string; en: string } }).text = { id: "", en: "Only English." };
    input.entities = [bad, entity({ id: "icann-board", kind: "board", scope: "icann-internal" })];
    const issues = validateContent(input);
    expect(issues.some((i) => i.includes("Indonesian text is required"))).toBe(true);
  });
});
