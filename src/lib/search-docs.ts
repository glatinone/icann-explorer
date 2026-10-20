import type { LocalizedText } from "./schema";

/** One searchable item. `path` has no locale prefix; the client adds it. */
export interface SearchDoc {
  id: string;
  type: "entity" | "term" | "path";
  acronym: string;
  title: LocalizedText;
  summary: LocalizedText;
  path: string;
}
