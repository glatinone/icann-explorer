# Phase P3: Content pages

**Role:** Builder agent. **Branch:** `phase/P3-pages`. **Push or deploy:** no.

## Context
Read `AGENTS.md`, `docs/plan/00-brief.md`, §6 "Profile page template" in `docs/plan/02-content-spec.md`, and the P2 report.
Reuse the P2 components (node badge, kind colors, mini-graph) where it makes sense.

## Pages
1. **Home** `/[locale]/`
   - Hero: one sentence on what this is, plus 2 CTAs: "Explore the map" and "Start the beginner path".
   - "ICANN in 3 parts": Community · Board · ICANN org (3 cards linking to profiles).
   - "Where do I start?": 3 persona cards (Curious · Attending a meeting · Want to contribute) → the matching learning path.
   - A strip of "popular groups" (GNSO, ALAC, GAC, SSAC).
   - The unofficial disclaimer, visible above the footer as well.
2. **Organizations index**: grouped by kind (SOs, ACs, Board & org, Committees & mechanisms, Outside ICANN), with a card per entity.
3. **Organization profile** `/[locale]/organizations/[id]/`: follows the 8-section template exactly. "How it connects" = a small static
   neighbor graph + a relationship list. Source markers on claims + a sources list. "Report an error" → a prefilled GitHub issue URL
   (repo URL from a single config constant). `generateStaticParams` for all entities.
4. **Glossary** `/[locale]/glossary/`: A–Z jump bar, filter by related group, and an instant text filter. **Term page**: definition,
   related groups (chips → profile and map), related terms, sources.
5. **About & Sources** `/[locale]/about/`: what this is, why it exists (the ICANN87 Fellow story, 2–3 sentences, first person from Kiell; leave a
   `TODO(Kiell)` placeholder for him to write), methodology (how claims are sourced and reviewed, fact vs interpretation), the full sources
   list grouped by publisher, the disclaimer, and how to report errors or contribute.
6. SEO: per-page `metadata` (title, description) in both locales, `hreflang` alternates, `sitemap.xml`, `robots.txt`, and a basic OG image.

## Acceptance criteria
- [ ] Every profile shows all 8 sections (or hides `getInvolved` cleanly when it's absent).
- [ ] Every claim on a profile shows its source marker, and every marker links correctly.
- [ ] Glossary filtering works without a full reload. Every related chip resolves.
- [ ] Both locales build for every page. No missing-translation fallbacks show up (add a test that fails on missing keys).
- [ ] 375px is readable: line length, tap targets ≥ 44px.
- [ ] Lighthouse mobile (local) on Home and the GNSO profile: Accessibility ≥ 95, Performance ≥ 90.
- [ ] All quality commands pass. Screenshots in the report.

STOP after writing the report.
