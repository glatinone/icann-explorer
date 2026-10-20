# ICANN Explorer

Independent, unofficial, bilingual (ID/EN) explainer of the ICANN ecosystem. Next.js 15 static export, no backend.

- Content lives in `content/*.json`, validated by `src/lib/schema.ts` + `src/lib/validate.ts` (runs as `prebuild`). Rules for writing it: `docs/content-guide.md`.
- Every factual sentence is a `Claim` with citations (source + locator + quote + verifiedAt). Never publish a fact you have not found in a Tier 1–3 source.
- Relationship types and their allowed endpoints: `src/lib/relationships.ts`. No SO/AC/community group `reports-to` anyone. External orgs are never `part-of` ICANN.
- IDs and URL slugs are language-neutral and identical in both locales. All UI strings go through `src/i18n/{id,en}.json`; components don't branch on locale.
- Brand: always labeled "Independent, unofficial educational project". No ICANN logo or brand colors.
- Commands: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm typecheck`, `pnpm lint`.
