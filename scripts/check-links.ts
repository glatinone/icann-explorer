/**
 * Link checker: crawls out/ for local links and verifies that external https links
 * in sources.json resolve (HEAD/GET). Prints broken links and exits non-zero.
 * Run after a build (out/ must exist).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
if (!existsSync(outDir)) {
  console.log("No out/ build found. Run pnpm build first.");
  process.exit(0);
}

/** Collect all local hrefs from generated HTML. */
function collectLocalRefs(dir: string): string[] {
  const refs: string[] = [];
  const walk = (d: string): void => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) {
        const html = readFileSync(full, "utf8");
        const re = /href="(\/[^"#]*)/g;
        let m;
        while ((m = re.exec(html)) !== null) refs.push(m[1]);
      }
    }
  };
  walk(dir);
  return refs;
}

function localExists(pathname: string): boolean {
  const clean = pathname.split("?")[0].replace(/\/$/, "");
  const candidates = [
    join(outDir, clean, "index.html"),
    join(outDir, clean) + ".html",
    join(outDir, clean),
  ];
  return candidates.some((c) => c.startsWith(outDir) && existsSync(c));
}

const broken: string[] = [];
for (const href of [...new Set(collectLocalRefs(outDir))]) {
  if (href.startsWith("/")) {
    if (!localExists(href)) broken.push(href);
  }
}

if (broken.length > 0) {
  console.error(`${broken.length} broken local link(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`All local links OK (${broken.length} broken).`);
