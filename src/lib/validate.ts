
/**
 * Pure content-checking logic (no I/O), so it can be unit-tested directly.
 * Returns an array of human-readable issue strings. Empty = pass.
 */
import {
  claim as claimSchema,
  entitySchema,
  learningPathSchema,
  layoutSchema,
  relationshipSchema,
  sourceSchema,
  termSchema,
} from "./schema";
import type { Claim, Entity, LearningPath, Relationship, Source, Term, Layout } from "./schema";
import { RELATIONSHIP_REGISTRY } from "./relationships";

export interface ContentInput {
  sources: Source[];
  entities: Entity[];
  relationships: Relationship[];
  terms: Term[];
  paths: LearningPath[];
  layout?: Layout | null;
}

const issues: string[] = [];
function issue(file: string, path: string, message: string): void {
  issues.push(`${file} ${path}: ${message}`);
}

function schemaIssue(file: string, path: string, detail: string): void {
  issue(file, path, `schema violation: ${detail}`);
}

function checkEach<T>(
  file: string,
  items: T[],
  schema: { safeParse(v: unknown): { success: boolean; data?: T; error?: { issues: Array<{ path: (string | number)[]; message: string }> } } },
  label: string,
): T[] {
  const out: T[] = [];
  for (const item of items) {
    const result = schema.safeParse(item);
    if (result.success) out.push(result.data as T);
    else schemaIssue(file, `${label}`, result.error!.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; "));
  }
  return out;
}

const sourceById = new Map<string, Source>();
export function validateContent(input: ContentInput): string[] {
  issues.length = 0;
  const { sources, entities, relationships, terms, paths, layout } = input;
  sourceById.clear();
  for (const s of sources) sourceById.set(s.id, s);

  const parsedSources = checkEach("sources.json", sources, sourceSchema, "source");
  const parsedEntities = checkEach("entities.json", entities, entitySchema, "entity");
  const parsedRelationships = checkEach("relationships.json", relationships, relationshipSchema, "relationship");
  const parsedTerms = checkEach("terms.json", terms, termSchema, "term");
  const parsedPaths = checkEach("paths.json", paths, learningPathSchema, "path");

  if (layout) {
    const parsed = layoutSchema.safeParse(layout);
    if (!parsed.success) {
      issue("layout.json", "$", parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }
  }

  const entityIds = new Set(parsedEntities.map((e) => e.id));
  const termIds = new Set(parsedTerms.map((t) => t.id));
  function checkClaim(claimObj: unknown, file: string, path: string): void {
    const parsed = claimSchema.safeParse(claimObj);
    if (!parsed.success) {
      issue(file, path, parsed.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; "));
      return;
    }
    const c = parsed.data as Claim;
    if (c.citations.length === 0) {
      issue(file, path, "claim has no citations");
      return;
    }
    for (const [i, cit] of c.citations.entries()) {
      const src = sourceById.get(cit.sourceId);
      if (!src) {
        issue(file, `${path}.citations[${i}]`, `unknown sourceId "${cit.sourceId}"`);
        continue;
      }
      if (c.kind === "fact" && (src.tier < 1 || src.tier > 3)) {
        issue(file, `${path}.citations[${i}]`, `fact rests on Tier ${src.tier} source "${cit.sourceId}" (needs Tier 1-3)`);
      }
    }
  }

  for (const e of parsedEntities) {
    const base = `entity:${e.id}`;
    checkClaim(e.oneLiner, "entities.json", `${base}.oneLiner`);
    e.whyItExists.forEach((c, i) => checkClaim(c, "entities.json", `${base}.whyItExists[${i}]`));
    e.whatItDoes.forEach((c, i) => checkClaim(c, "entities.json", `${base}.whatItDoes[${i}]`));
    checkClaim(e.example, "entities.json", `${base}.example`);
    (e.getInvolved ?? []).forEach((c, i) => checkClaim(c, "entities.json", `${base}.getInvolved[${i}]`));
  }

  const entityById = new Map(parsedEntities.map((e) => [e.id, e]));

  for (const r of parsedRelationships) {
    if (!entityById.has(r.from)) issue("relationships.json", r.id, `unknown from-entity "${r.from}"`);
    if (!entityById.has(r.to)) issue("relationships.json", r.id, `unknown to-entity "${r.to}"`);
    const info = RELATIONSHIP_REGISTRY[r.type as keyof typeof RELATIONSHIP_REGISTRY];
    if (!info) {
      issue("relationships.json", r.id, `unknown relationship type "${r.type}"`);
    } else {
      const fromEntity = entityById.get(r.from);
      const toEntity = entityById.get(r.to);
      if (fromEntity && toEntity) {
        const allowed = info.allowed.some(([a, b]) => a === fromEntity.scope && b === toEntity.scope);
        if (!allowed) {
          issue("relationships.json", r.id, `relationship type "${r.type}" does not allow ${fromEntity.scope} -> ${toEntity.scope}`);
        }
      }
      checkClaim(r.explanation, "relationships.json", r.id);
    }
    if (r.type === "reports-to") {
      const from = entityById.get(r.from);
      if (from && (from.kind === "supporting-organization" || from.kind === "advisory-committee")) {
        issue("relationships.json", r.id, `SO/AC must not "reports-to" anyone (found ${r.from} -> ${r.to})`);
      }
    }
    if (r.type === "part-of") {
      const from = entityById.get(r.from);
      const to = entityById.get(r.to);
      if (from && to && from.scope === "external" && to.scope === "icann-internal") {
        issue("relationships.json", r.id, `external entity "${r.from}" cannot be part-of an ICANN-internal entity`);
      }
    }
  }

  for (const t of parsedTerms) {
    checkClaim(t.definition, "terms.json", `term:${t.id}`);
    for (const id of t.relatedEntityIds) {
      if (!entityIds.has(id)) issue("terms.json", `term:${t.id}.relatedEntityIds`, `unknown entity "${id}"`);
    }
    for (const id of t.relatedTermIds) {
      if (!termIds.has(id)) issue("terms.json", `term:${t.id}.relatedTermIds`, `unknown term "${id}"`);
    }
  }

  for (const p of parsedPaths) {
    p.steps.forEach((step, i) => {
      (step.claims ?? []).forEach((c: unknown, j: number) => checkClaim(c, "paths.json", `${p.id}.steps[${i}].claims[${j}]`));
    });
  }

  function duplicateCheck(items: Array<{ id: string }>, file: string): void {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.id)) issue(file, item.id, "duplicate id");
      seen.add(item.id);
    }
  }
  duplicateCheck(parsedSources, "sources.json");
  duplicateCheck(parsedEntities, "entities.json");
  duplicateCheck(parsedRelationships, "relationships.json");
  duplicateCheck(parsedTerms, "terms.json");

  return [...issues];
}
