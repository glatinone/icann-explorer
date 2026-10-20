# ICANN Explorer

**Independent, unofficial educational project. Not affiliated with or endorsed by ICANN.**

A bilingual (Bahasa Indonesia / English) guide for people meeting ICANN for the first time: who does what, how the groups connect, how a policy gets made, and where to take part. It explains, then links back to the official sources and programs.

- **Map** of 17 groups and 42 relationships. Each relationship type (policy, advice, accountability, implementation, selection, membership, context) has its own line pattern and arrowhead, so advice never looks like a reporting line. List and table views carry the same data for keyboard and screen-reader users.
- **Profiles** for every group: mandate, what it does, who sits in it, a real example, how to take part, and how it connects.
- **Glossary** of 34 terms, **four learning paths**, and search (Ctrl/Cmd + K).
- **Every factual sentence is footnoted** with the document, the exact article or section, a verbatim quote, and the date it was checked.

## How the content is kept honest

All content lives in `content/*.json` and is validated before every build (`pnpm build` runs `scripts/validate-content.ts`):

- Each claim needs a citation with a locator. A *fact* needs at least one Tier 1–3 source (governing documents, official ICANN pages, or an outside organization's own site about itself).
- Relationship types are restricted by endpoint: no SO, AC or community group can "report to" anything, and outside organizations can never be "part of" ICANN.
- Both languages are required for every string.

`pnpm check:quotes` fetches every cited page and confirms each quote still appears in it word for word. Run it when updating content; the source sites change.

Writing rules, source tiers and the Indonesian vocabulary list: [`docs/content-guide.md`](docs/content-guide.md). Open research questions from the last content pass: [`docs/research-notes.md`](docs/research-notes.md).

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000/id/
```

```bash
pnpm build          # validate content, then static export to out/
pnpm test           # unit tests (content rules, i18n parity, search, map geometry)
pnpm test:e2e       # Playwright + axe on the built site (run pnpm build first)
pnpm typecheck
pnpm lint
pnpm check:quotes   # network: verify every quote against its live source
pnpm check:links    # verify internal links in out/
```

## Stack

Next.js 15 static export (no server, no database, no tracking), React 19, TypeScript, Zod, MiniSearch. The map is plain SVG. Fonts: Source Serif 4 and Source Sans 3 (SIL OFL), self-hosted at build time.

## Project layout

| Path | What |
| --- | --- |
| `content/` | Entities, relationships, terms, learning paths, sources, map layout |
| `src/lib/` | Schema, validator, relationship registry, map geometry, search |
| `src/app/[locale]/` | Pages, generated for `/id` and `/en` |
| `src/components/` | UI, including `map/` |
| `src/i18n/` | Interface strings in both languages |
| `scripts/` | Content validator, quote checker, link checker |
| `tests/` | Unit (Vitest) and end-to-end (Playwright + axe) |

## License

Code: MIT. Content: CC BY 4.0. See `LICENSE`.
