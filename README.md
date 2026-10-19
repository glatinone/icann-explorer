# ICANN Explorer

**Independent, unofficial educational project.** ICANN Explorer is an interactive, bilingual (Bahasa Indonesia / English) guide to the ICANN ecosystem. It helps newcomers understand who does what, how groups connect, how an issue becomes policy, and where to start contributing.

This project is **not affiliated with or endorsed by ICANN**. It is a public-facing, source-backed explainer that links out to the official ICANN resources.

## Screenshot

![ICANN Explorer map](https://github.com/glatinone/icann-explorer/raw/main/public/og/og-en.png)

## Stack

- **Next.js 15** (static export, App Router, `/id` and `/en` locales)
- **React Flow** for the interactive map, with accessible Tree and Relations alternatives
- **MiniSearch** for Ctrl+K search
- **TypeScript**, **Zod**, **Vitest**, **Playwright**, **axe-core**

## How content and provenance work

All pages are rendered from verified JSON in `content/`. Every claim carries at least one citation with a source, an optional locator, and a `verifiedAt` date. A validator runs before every build (`pnpm build` runs `validate-content.ts` automatically) and rejects unverified facts, wrong relationships, or missing translations.

See `CONTRIBUTING.md` for how to propose a correction, and `docs/plan/ORCHESTRATION.md` for the full project plan and phase history.

## Run locally

```bash
pnpm install
pnpm dev
```

Other scripts:

```bash
pnpm build          # validates content, then static export to out/
pnpm test           # unit tests (vitest)
pnpm test:e2e       # Playwright smoke + axe suite
pnpm typecheck
pnpm lint
pnpm check:links    # verifies all local links resolve after a build
```

## Licensing

- **Code:** MIT (see `LICENSE`).
- **Content:** CC BY 4.0 (see `LICENSE`). <!-- TODO(Kiell): confirm CC BY 4.0 for the content -->

## Project structure

| Path | Purpose |
| --- | --- |
| `content/` | Verified source data (entities, relationships, terms, paths, sources, layout) |
| `src/` | Next.js app, components, i18n, validation schemas |
| `scripts/` | Content validator, link checker |
| `tests/` | Unit tests and Playwright e2e |
| `docs/` | Full plan, orchestration doc, phase reports |
