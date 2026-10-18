# Phase P0: Repo, agent rules & skeleton

**Role:** Builder agent. **Branch:** `phase/P0-setup`. **Push:** only step 14, and only after Kiell confirms. **Deploy:** no.

## Context
Read `AGENTS.md`, `docs/plan/00-brief.md`, and `docs/plan/01-architecture.md` first. This folder already contains
`README.md`, `AGENTS.md`, `CLAUDE.md`, and `docs/`. **Don't overwrite or delete them.**

## Goal
A running, empty-but-correct skeleton: the docs structure, Next.js static export, language-neutral routing,
a base layout with the unofficial label, accessibility and quality tooling, and CI. No real content yet.

## Tasks
1. `git init` (if needed). Scaffold Next.js (App Router, TS strict, Tailwind, ESLint, `src/` dir) **into this folder**, keeping the existing files. Use pnpm.
2. **Docs structure:**
   - `docs/decisions.md`: the append-only log, seeded with the owner decisions below.
   - `docs/ASSETS.md`: a table (asset · source URL · license · where it's used). Add every font and icon you introduce.
   - `docs/reports/` with a `.gitkeep`.
3. `next.config`: `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`.
4. Deps: `@xyflow/react`, `zod`, `minisearch`, `clsx`. Dev deps: `vitest`, `@playwright/test`, `@axe-core/playwright`, `tsx`, `prettier`.
5. Scripts: `dev`, `build`, `lint`, `typecheck` (`tsc --noEmit`), `test` (vitest run), `test:e2e`, `validate:content`, `check:links`, and `prebuild` → `validate:content`.
6. **i18n (language separate from identity):** `src/i18n/{id,en}.json`, `config.ts` (locales, default `id`), and a typed `t()` helper.
   The toggle swaps only the locale segment and keeps the path, query, and hash. Add a test that fails when a key is missing in either dictionary.
   `src/app/page.tsx` redirects to `/id/` (static-export-safe).
7. `[locale]/layout.tsx`: a skip link, a header (site name **ICANN Explorer**, a visible label **"Independent, unofficial educational project" / "Proyek edukasi independen dan tidak resmi"**,
   nav: Map · Organizations · Glossary · Paths · About, a language toggle), and a footer with the disclaimer (text below). Landmarks: `header`, `nav`, `main`, `footer`.
8. Stub pages for every route in `01-architecture.md` (heading + "coming soon" text from i18n).
9. Theme: CSS variables for light and dark, one accent per entity kind, and one style token per **relationship visual family** (placeholder values are fine). Colors must not resemble ICANN branding. Visible focus ring.
10. `src/lib/schema.ts` with the full zod schemas from `01-architecture.md` (Source with tier, Citation, Claim with translation provenance, Relationship with the full type registry),
    `src/lib/relationships.ts` (the registry: type → family, allowed endpoint scopes, label), and `scripts/validate-content.ts`
    implementing **every check** in "What validate-content.ts enforces". Empty `content/*.json` must pass.
    Add Vitest fixtures that **fail** for: a fact without a Tier 1–3 citation, an SO `reports-to` the Board, an external entity `part-of` an internal entity, a missing `id`/`en` text, and a non-ASCII ID.
11. `vercel.json` with the security headers from `01-architecture.md`.
12. Tests: Playwright smoke (`/id/` loads, the toggle → `/en/` keeps the path and query) + axe on the home page.
13. GitHub Actions: install → lint → typecheck → test → build, plus Dependabot (or `pnpm audit --audit-level high`).
14. **(OWNER)** Kiell creates a **public** GitHub repo. After he confirms, add the remote and push `main` + this branch. Before pushing, run a secrets check (`git grep -nE "(api[_-]?key|secret|token|password)\s*[:=]"`, plus no `.env` files committed).
15. Write `docs/reports/P0-report.md`.

**Owner decisions to seed `docs/decisions.md`:**
```
D-OWNER-01 | 2026-10-18 | Name "ICANN Explorer", used descriptively, always with the label "Independent, unofficial educational project" | trademark and trust | owner
D-OWNER-02 | 2026-10-18 | Host the MVP as a static site on Vercel | no backend needed | owner
D-OWNER-03 | 2026-10-18 | Public repository from day one (no secrets or confidential info allowed) | transparency + community corrections | owner
D-OWNER-04 | 2026-10-18 | Every important claim has its own citation, verification date, and both languages | accuracy | owner
D-OWNER-05 | 2026-10-18 | The map is modeled by relationship type, not as a single hierarchy | avoid misrepresenting ICANN | owner
D-OWNER-06 | 2026-10-18 | One phase per agent session, with a report + review gate | quality control | owner
D-OWNER-07 | 2026-10-18 | No public launch before the fact, accessibility, and bilingual QA pass and the release criteria R1–R10 are met | release discipline | owner
```

**Disclaimer text (footer):**
- EN: "ICANN Explorer is an independent, unofficial educational project. It is not affiliated with or endorsed by ICANN. Always check the official sources cited on each page."
- ID: "ICANN Explorer adalah proyek edukasi independen dan tidak resmi. Proyek ini tidak berafiliasi dengan dan tidak didukung oleh ICANN. Selalu periksa sumber resmi yang dikutip di setiap halaman."

## Acceptance criteria
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass. `out/` contains `/id/` and `/en/` for every route.
- [ ] `/id/organizations/?x=1#a` toggles to `/en/organizations/?x=1#a`.
- [ ] The unofficial label and the disclaimer are visible on every page, in both locales, at 375px too.
- [ ] Every negative validator fixture fails for the right reason.
- [ ] axe shows no serious/critical violations on the home page. Keyboard: the skip link and nav work.
- [ ] `docs/decisions.md` and `docs/ASSETS.md` exist and are filled in. Existing plan files are untouched.
- [ ] No secrets in the repo.

STOP after writing the report.
