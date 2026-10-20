/**
 * Build-time content access. Server components only: client components get the data they need as props.
 * `pnpm build` runs the full validator first (prebuild), so a schema failure here means someone skipped it.
 */
import entitiesData from "../../content/entities.json";
import relationshipsData from "../../content/relationships.json";
import termsData from "../../content/terms.json";
import pathsData from "../../content/paths.json";
import sourcesData from "../../content/sources.json";
import layoutData from "../../content/layout.json";
import { publishedOnly, validateContent } from "./validate";
import type { Entity, EntityKind, LearningPath, Relationship, Source, Term } from "./schema";

const result = validateContent({
  entities: entitiesData,
  relationships: relationshipsData,
  terms: termsData,
  paths: pathsData,
  sources: sourcesData,
  layout: layoutData,
});
if (!result.content) {
  throw new Error(`Content failed schema validation:\n${result.issues.join("\n")}`);
}

const content = publishedOnly(result.content);

export const { entities, relationships, terms, paths, sources, layout } = content;

const byId = <T extends { id: string }>(items: T[]): Map<string, T> => new Map(items.map((i) => [i.id, i]));
const entityMap = byId(entities);
const termMap = byId(terms);
const sourceMap = byId(sources);
const pathMap = byId(paths);

export const getEntity = (id: string): Entity | undefined => entityMap.get(id);
export const getTerm = (id: string): Term | undefined => termMap.get(id);
export const getSource = (id: string): Source | undefined => sourceMap.get(id);
export const getPath = (id: string): LearningPath | undefined => pathMap.get(id);

export function relationshipsOf(entityId: string): Relationship[] {
  return relationships.filter((r) => r.from === entityId || r.to === entityId);
}

export const termsSorted: Term[] = [...terms].sort((a, b) => a.term.en.localeCompare(b.term.en, "en"));

/** Display order for grouped lists: how a newcomer meets the structure. */
export const KIND_ORDER: EntityKind[] = [
  "board",
  "icann-org",
  "supporting-organization",
  "stakeholder-group",
  "advisory-committee",
  "regional-organization",
  "committee",
  "mechanism",
  "affiliate",
  "external",
];

export function entitiesByKind(): Array<{ kind: EntityKind; entities: Entity[] }> {
  return KIND_ORDER.map((kind) => ({ kind, entities: entities.filter((e) => e.kind === kind) })).filter(
    (g) => g.entities.length > 0,
  );
}

/** Latest verifiedAt across everything published. */
export const lastReviewed: string = (() => {
  let latest = "";
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") {
      const v = (value as { verifiedAt?: unknown }).verifiedAt;
      if (typeof v === "string" && v > latest) latest = v;
      Object.values(value).forEach(visit);
    }
  };
  visit([entities, relationships, terms, paths]);
  return latest;
})();
