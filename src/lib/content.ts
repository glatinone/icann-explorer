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
import type { Entity, LearningPath, Relationship, Source, Term, Citation, Claim, Layout } from "./schema";

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

const citationsOf = (c: Claim | undefined): Citation[] => (c ? c.citations : []);
const claimCitations = (claims: Claim[] = []): Citation[] => claims.flatMap((c) => c.citations);

/** Latest verifiedAt across all published content, as YYYY-MM-DD. */
export function latestReviewDate(): string {
  const dates: string[] = [];
  const push = (ds: Citation[]): void => {
    for (const d of ds) if (d.verifiedAt) dates.push(d.verifiedAt);
  };
  for (const e of entities) {
    push(citationsOf(e.oneLiner));
    push(claimCitations(e.whyItExists));
    push(claimCitations(e.whatItDoes));
    push(citationsOf(e.example));
    push(claimCitations(e.getInvolved));
  }
  for (const r of relationships) push(citationsOf(r.explanation));
  for (const t of terms) push(citationsOf(t.definition));
  for (const p of paths)
    for (const s of p.steps) push(claimCitations(s.claims));
  return dates.sort().at(-1) ?? "";
}

