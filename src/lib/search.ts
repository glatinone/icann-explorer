/**
 * Client-side search over entities, terms, and paths using MiniSearch.
 * Index built in the browser from the same content JSON (small dataset),
 * lazy-created the first time the dialog opens.
 */
import MiniSearch from "minisearch";
import { entities, terms, paths } from "@/lib/content";
import type { Locale } from "@/i18n";

export interface SearchResult {
  type: "entity" | "term" | "path";
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export function buildSearchIndex(locale: Locale): MiniSearch {
  const docs: Array<{ id: string; title: string; subtitle: string; text: string; url: string }> = [];

  for (const e of entities) {
    docs.push({
      id: `e-${e.id}`,
      title: `${e.acronym} ${e.name.en} ${e.name.id}`,
      subtitle: e.name[locale],
      text: `${e.acronym} ${e.name.en} ${e.name.id} ${e.oneLiner.text.en} ${e.oneLiner.text.id}`,
      url: `/${locale}/organizations/${e.id}/`,
    });
  }
  for (const term of terms) {
    docs.push({
      id: `t-${term.id}`,
      title: term.term,
      subtitle: term.definition.text[locale],
      text: `${term.term} ${term.definition.text.en} ${term.definition.text.id}`,
      url: `/${locale}/glossary/#term-${term.id}`,
    });
  }
  for (const p of paths) {
    docs.push({
      id: `p-${p.id}`,
      title: p.title[locale],
      subtitle: p.audience[locale],
      text: `${p.title.en} ${p.title.id} ${p.audience.en} ${p.audience.id}`,
      url: `/${locale}/paths/${p.id}/`,
    });
  }

  const mini = new MiniSearch({
    fields: ["title", "subtitle"],
    storeFields: ["title", "subtitle", "url"],
  });
  mini.addAll(docs);
  return mini;
}
