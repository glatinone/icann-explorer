/**
 * Content checks beyond the zod schemas: referential integrity, provenance, and the
 * relationship modeling rules. Pure (no I/O) so it can be unit-tested directly.
 * Returns human-readable issues; an empty array means the content passes.
 */
import { z } from "zod";
import {
  entitySchema,
  layoutSchema,
  learningPathSchema,
  relationshipSchema,
  sourceSchema,
  termSchema,
  type Claim,
  type Entity,
  type Layout,
  type LearningPath,
  type Relationship,
  type Source,
  type Term,
} from "./schema";
import { RELATIONSHIPS } from "./relationships";

export interface RawContent {
  sources: unknown;
  entities: unknown;
  relationships: unknown;
  terms: unknown;
  paths: unknown;
  layout: unknown;
}

export interface Content {
  sources: Source[];
  entities: Entity[];
  relationships: Relationship[];
  terms: Term[];
  paths: LearningPath[];
  layout: Layout;
}

export interface ValidationResult {
  content: Content | null;
  issues: string[];
}

function formatZod(file: string, error: z.ZodError): string[] {
  return error.issues.map((i) => `${file} ${i.path.join(".") || "$"}: ${i.message}`);
}

export function validateContent(raw: RawContent, today = new Date().toISOString().slice(0, 10)): ValidationResult {
  const issues: string[] = [];
  const parse = <T>(file: string, schema: z.ZodType<T>, value: unknown): T | null => {
    const result = schema.safeParse(value);
    if (result.success) return result.data;
    issues.push(...formatZod(file, result.error));
    return null;
  };

  const sources = parse("sources.json", z.array(sourceSchema), raw.sources);
  const entities = parse("entities.json", z.array(entitySchema), raw.entities);
  const relationships = parse("relationships.json", z.array(relationshipSchema), raw.relationships);
  const terms = parse("terms.json", z.array(termSchema), raw.terms);
  const paths = parse("paths.json", z.array(learningPathSchema), raw.paths);
  const layout = parse("layout.json", layoutSchema, raw.layout);
  if (!sources || !entities || !relationships || !terms || !paths || !layout) return { content: null, issues };

  const add = (where: string, message: string): void => {
    issues.push(`${where}: ${message}`);
  };

  for (const [file, items] of [
    ["sources.json", sources],
    ["entities.json", entities],
    ["relationships.json", relationships],
    ["terms.json", terms],
    ["paths.json", paths],
  ] as const) {
    const seen = new Set<string>();
    for (const { id } of items) {
      if (seen.has(id)) add(`${file} ${id}`, "duplicate id");
      seen.add(id);
    }
  }

  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const entityById = new Map(entities.map((e) => [e.id, e]));
  const termIds = new Set(terms.map((t) => t.id));
  const usedSources = new Set<string>();

  const checkClaim = (where: string, claim: Claim): void => {
    let hasStrongSource = false;
    claim.citations.forEach((c, i) => {
      const source = sourceById.get(c.sourceId);
      if (!source) {
        add(`${where}.citations[${i}]`, `unknown source "${c.sourceId}"`);
        return;
      }
      usedSources.add(source.id);
      if (source.tier <= 3) hasStrongSource = true;
      if (c.verifiedAt > today) add(`${where}.citations[${i}]`, `verifiedAt ${c.verifiedAt} is in the future`);
    });
    if (claim.kind === "fact" && !hasStrongSource) add(where, "a fact needs at least one Tier 1-3 citation");
  };

  for (const e of entities) {
    const base = `entities.json ${e.id}`;
    checkClaim(`${base}.oneLiner`, e.oneLiner);
    checkClaim(`${base}.whyItExists`, e.whyItExists);
    e.whatItDoes.forEach((c, i) => checkClaim(`${base}.whatItDoes[${i}]`, c));
    checkClaim(`${base}.whoIsIn`, e.whoIsIn);
    checkClaim(`${base}.example`, e.example);
    e.getInvolved?.forEach((c, i) => checkClaim(`${base}.getInvolved[${i}]`, c));
    for (const t of e.relatedTermIds) if (!termIds.has(t)) add(base, `unknown term "${t}"`);
    if (!layout.positions[e.id]) add(base, "has no position in layout.json");
  }

  const pairs = new Set<string>();
  for (const r of relationships) {
    const where = `relationships.json ${r.id}`;
    checkClaim(`${where}.explanation`, r.explanation);
    const from = entityById.get(r.from);
    const to = entityById.get(r.to);
    if (!from) add(where, `unknown entity "${r.from}"`);
    if (!to) add(where, `unknown entity "${r.to}"`);
    if (!from || !to) continue;
    if (r.from === r.to) add(where, "an entity cannot relate to itself");

    const info = RELATIONSHIPS[r.type];
    if (!info.allowed.some(([a, b]) => a === from.scope && b === to.scope)) {
      add(where, `"${r.type}" is not allowed from ${from.scope} to ${to.scope}`);
    }
    if (r.type === "reports-to" && from.kind !== "icann-org") {
      add(where, "only ICANN org may report to anything; SOs, ACs and community groups never do");
    }
    const pair = [r.from, r.to].sort().join("|") + `|${info.family}`;
    if (info.family === "accountability" && pairs.has(pair)) add(where, "two accountability relationships for one pair");
    pairs.add(pair);
  }

  for (const t of terms) {
    const where = `terms.json ${t.id}`;
    checkClaim(`${where}.definition`, t.definition);
    for (const id of t.relatedEntityIds) if (!entityById.has(id)) add(where, `unknown entity "${id}"`);
    for (const id of t.relatedTermIds) if (!termIds.has(id)) add(where, `unknown term "${id}"`);
  }

  for (const p of paths) {
    p.steps.forEach((step, i) => {
      const where = `paths.json ${p.id}.steps[${i}]`;
      step.claims?.forEach((c, j) => checkClaim(`${where}.claims[${j}]`, c));
      for (const link of step.links) {
        if (link.type === "entity" && !entityById.has(link.id)) add(where, `unknown entity "${link.id}"`);
        if (link.type === "term" && !termIds.has(link.id)) add(where, `unknown term "${link.id}"`);
        if (link.type === "source") {
          if (!sourceById.has(link.id)) add(where, `unknown source "${link.id}"`);
          else usedSources.add(link.id);
        }
      }
    });
  }

  for (const id of Object.keys(layout.positions)) {
    if (!entityById.has(id)) add("layout.json", `position for unknown entity "${id}"`);
  }
  for (const s of sources) if (!usedSources.has(s.id)) add(`sources.json ${s.id}`, "source is never cited");

  return { content: { sources, entities, relationships, terms, paths, layout }, issues };
}

/** Drops needs-review items and anything that points at them, so the site only shows published content. */
export function publishedOnly(content: Content): Content {
  const entities = content.entities.filter((e) => e.status === "published");
  const entityIds = new Set(entities.map((e) => e.id));
  const terms = content.terms.filter((t) => t.status === "published");
  const termIds = new Set(terms.map((t) => t.id));
  return {
    ...content,
    entities: entities.map((e) => ({ ...e, relatedTermIds: e.relatedTermIds.filter((id) => termIds.has(id)) })),
    relationships: content.relationships.filter(
      (r) => r.status === "published" && entityIds.has(r.from) && entityIds.has(r.to),
    ),
    terms: terms.map((t) => ({
      ...t,
      relatedEntityIds: t.relatedEntityIds.filter((id) => entityIds.has(id)),
      relatedTermIds: t.relatedTermIds.filter((id) => termIds.has(id)),
    })),
    paths: content.paths.map((p) => ({
      ...p,
      steps: p.steps.map((s) => ({
        ...s,
        links: s.links.filter(
          (l) => (l.type !== "entity" || entityIds.has(l.id)) && (l.type !== "term" || termIds.has(l.id)),
        ),
      })),
    })),
  };
}
