/**
 * Content validator CLI: loads content/*.json and runs the pure checks from
 * src/lib/validate.ts. Exits non-zero on any error.
 * An empty (or missing) content/ directory passes.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ContentInput } from "../src/lib/validate";
import { validateContent } from "../src/lib/validate";
import type { Source, Entity, Relationship, Term, LearningPath, Layout } from "../src/lib/schema";

const CONTENT_DIR = join(process.cwd(), "content");

function contentFiles(): string[] {
  try {
    return readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
}

if (contentFiles().length === 0) {
  console.log("content/ is empty or missing: nothing to validate (OK).");
  process.exit(0);
}

function loadJson<T>(file: string, fallback: T): T {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch (e) {
    console.error(`${file}: invalid JSON: ${(e as Error).message}`);
    process.exit(1);
  }
}

const input: ContentInput = {
  sources: loadJson<Source[]>(join(CONTENT_DIR, "sources.json"), []),
  entities: loadJson<Entity[]>(join(CONTENT_DIR, "entities.json"), []),
  relationships: loadJson<Relationship[]>(join(CONTENT_DIR, "relationships.json"), []),
  terms: loadJson<Term[]>(join(CONTENT_DIR, "terms.json"), []),
  paths: loadJson<LearningPath[]>(join(CONTENT_DIR, "paths.json"), []),
  layout: loadJson<Layout | null>(join(CONTENT_DIR, "layout.json"), null),
};

const issues = validateContent(input);

if (issues.length > 0) {
  console.error(`\n${issues.length} validation issue(s):`);
  for (const v of issues) console.error(`  ${v}`);
  process.exit(1);
}
console.log("All content checks passed.");
