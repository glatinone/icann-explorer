import MiniSearch from "minisearch";
import type { SearchDoc } from "./search-docs";

type Indexed = SearchDoc & { titleEn: string; titleId: string; summaryEn: string; summaryId: string };

export type SearchIndex = MiniSearch<Indexed>;

export function createIndex(docs: SearchDoc[]): SearchIndex {
  const index = new MiniSearch<Indexed>({
    fields: ["acronym", "titleEn", "titleId", "summaryEn", "summaryId"],
    storeFields: ["acronym"],
    searchOptions: {
      boost: { acronym: 4, titleEn: 2, titleId: 2 },
      prefix: true,
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
      combineWith: "AND",
    },
  });
  index.addAll(
    docs.map((d) => ({
      ...d,
      titleEn: d.title.en,
      titleId: d.title.id,
      summaryEn: d.summary.en,
      summaryId: d.summary.id,
    })),
  );
  return index;
}

/** Returns matching doc ids, best first. Falls back to OR matching when an AND query finds nothing. */
export function searchIds(index: SearchIndex, q: string, limit = 12): string[] {
  const query = q.trim();
  if (!query) return [];
  let hits = index.search(query);
  if (hits.length === 0) hits = index.search(query, { combineWith: "OR" });
  // An exact acronym ("GNSO") beats anything that merely contains it ("GNSO SGs").
  const exact = query.toLowerCase();
  const ids = hits.map((h) => String(h.id));
  const first = ids.filter((id) => index.getStoredFields(id)?.acronym?.toString().toLowerCase() === exact);
  return [...first, ...ids.filter((id) => !first.includes(id))].slice(0, limit);
}
