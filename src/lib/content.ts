/**
 * Loads content at build time. The validator runs in prebuild, so the data is
 * guaranteed to pass the schema by the time pages import this module.
 */
import entitiesData from "../../content/entities.json";
import relationshipsData from "../../content/relationships.json";
import termsData from "../../content/terms.json";
import pathsData from "../../content/paths.json";
import sourcesData from "../../content/sources.json";
import layoutData from "../../content/layout.json";
import type { Entity, LearningPath, Relationship, Source, Term, Layout } from "./schema";

export const entities = entitiesData as unknown as Entity[];
export const relationships = relationshipsData as unknown as Relationship[];
export const terms = termsData as unknown as Term[];
export const sources = sourcesData as unknown as Source[];
export const paths = pathsData as unknown as LearningPath[];
export const layout = layoutData as unknown as Layout;

export function entityById(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function termById(id: string): Term | undefined {
  return terms.find((t) => t.id === id);
}

export function sourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function relationshipsFor(entityId: string): Relationship[] {
  return relationships.filter((r) => r.from === entityId || r.to === entityId);
}
