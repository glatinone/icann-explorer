/**
 * Fetches every cited source and checks that each citation's `quote` appears in it, word for word
 * (ignoring case, punctuation and whitespace). Network-dependent, so it runs on demand, not in CI.
 *
 *   node scripts/check-quotes.mjs            # report
 *   node scripts/check-quotes.mjs --json     # machine-readable list of misses
 */
import { readFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(`../content/${name}.json`, import.meta.url), "utf8"));
const sources = new Map(read("sources").map((s) => [s.id, s]));

const citations = [];
const walk = (value, where) => {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${where}[${i}]`));
  else if (value && typeof value === "object") {
    if (typeof value.sourceId === "string" && "verifiedAt" in value) citations.push({ ...value, where });
    else for (const [k, v] of Object.entries(value)) walk(v, where ? `${where}.${k}` : k);
  }
};
for (const name of ["entities", "relationships", "terms", "paths"]) {
  read(name).forEach((item) => walk(item, `${name}:${item.id}`));
}

const normalize = (s) =>
  s
    .replace(/\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .normalize("NFKD")
    .replace(/[‘’“”"'`]/g, "")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .toLowerCase()
    // Compare letter streams only: markup inside a sentence ("ICANN</a>'s") must not break a match.
    .replace(/[^a-z0-9]+/g, "");

const pageText = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// One request at a time per run, with backoff on 429: icann.org rate-limits bursts.
let queue = Promise.resolve();
function politeFetch(url) {
  const run = queue.then(async () => {
    for (let attempt = 0; ; attempt++) {
      const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (ICANN Explorer quote check)" }, redirect: "follow" });
      if (r.status !== 429 || attempt === 4) return r;
      await sleep(4000 * (attempt + 1));
    }
  });
  queue = run.then(() => sleep(400), () => sleep(400));
  return run;
}
async function textOf(url) {
  if (!pageText.has(url)) {
    pageText.set(
      url,
      politeFetch(url)
        .then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const html = await r.text();
          const decoded = html.replace(/\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
          return normalize(decoded.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
        })
        .catch((e) => ({ error: String(e.message ?? e) })),
    );
  }
  return pageText.get(url);
}

const misses = [];
const unreachable = new Map();
let checked = 0;
await Promise.all(
  citations
    .filter((c) => c.quote)
    .map(async (c) => {
      const source = sources.get(c.sourceId);
      if (!source) return;
      const url = c.url ?? source.url;
      const text = await textOf(url);
      if (typeof text !== "string") {
        unreachable.set(url, text.error);
        return;
      }
      checked++;
      if (!text.includes(normalize(c.quote))) misses.push({ where: c.where, sourceId: c.sourceId, url, quote: c.quote });
    }),
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ checked, misses, unreachable: Object.fromEntries(unreachable) }, null, 2));
} else {
  console.log(`${checked} quotes checked, ${misses.length} not found, ${unreachable.size} source(s) unreachable.`);
  for (const m of misses) console.log(`  MISS ${m.where} [${m.sourceId}]\n       "${m.quote}"`);
  for (const [url, err] of unreachable) console.log(`  UNREACHABLE ${url}: ${err}`);
}
process.exitCode = misses.length > 0 ? 1 : 0;
