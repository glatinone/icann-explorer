import { entities, paths, terms } from "@/lib/content";
import type { SearchDoc } from "@/lib/search-docs";

export const dynamic = "force-static";

/** Static search index, fetched by the search dialog the first time it opens. */
export function GET(): Response {
  const docs: SearchDoc[] = [
    ...entities.map((e) => ({
      id: `entity-${e.id}`,
      type: "entity" as const,
      acronym: e.acronym,
      title: e.name,
      summary: e.oneLiner.text,
      path: `/organizations/${e.id}/`,
    })),
    ...terms.map((term) => ({
      id: `term-${term.id}`,
      type: "term" as const,
      acronym: term.acronym ?? "",
      title: term.term,
      summary: term.definition.text,
      path: `/glossary/${term.id}/`,
    })),
    ...paths.map((p) => ({
      id: `path-${p.id}`,
      type: "path" as const,
      acronym: "",
      title: p.title,
      summary: p.summary,
      path: `/paths/${p.id}/`,
    })),
  ];
  return Response.json(docs);
}
