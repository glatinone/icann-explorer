/** Validates content/*.json. Runs before every build; exits non-zero on any issue. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateContent } from "../src/lib/validate";

const read = (name: string): unknown => JSON.parse(readFileSync(join(process.cwd(), "content", `${name}.json`), "utf8"));

const { content, issues } = validateContent({
  sources: read("sources"),
  entities: read("entities"),
  relationships: read("relationships"),
  terms: read("terms"),
  paths: read("paths"),
  layout: read("layout"),
});

if (issues.length > 0) {
  console.error(`${issues.length} content issue(s):`);
  for (const issue of issues) console.error(`  ${issue}`);
  process.exit(1);
}

const pending = content
  ? [...content.entities, ...content.relationships, ...content.terms].filter((x) => x.status === "needs-review").length
  : 0;
console.log(`Content OK.${pending ? ` ${pending} item(s) marked needs-review are left out of the site.` : ""}`);
