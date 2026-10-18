# Phase P5: Independent QA & audit

**Role:** Reviewer agent. **Use a fresh session that did NOT build P0–P4.** **Branch:** `phase/P5-qa`. **Push or deploy:** no.

## Context
Read `AGENTS.md`, `docs/plan/00-brief.md` (targets + **release criteria R1–R10**), `docs/decisions.md`, and every report in `docs/reports/`.
Your job is to **find problems**, not to confirm success. Be skeptical of earlier reports, including their "verified" claims.

## Audit
1. **Fact audit.** Sample ≥ 25 claims across entities, relationships, terms, and path steps. Include **every** Board-composition,
   Empowered Community, and GAC-advice claim. For each one: open the source, check that the `quote` and `locator` are really there, and mark it
   supported / partially / unsupported. Flag any fact that rests only on Tier 4.
2. **Relationship audit.** Review the full Relations table. For each row: is the type the most specific one the source supports?
   Is anything implying a reporting line where there's only advice? Is anything external drawn as part of ICANN? Is the map readable as a single hierarchy?
3. **Provenance audit.** Claims without their own citation? Pages that rely only on a bottom-of-page source list? Stale `verifiedAt` (> 6 months)?
4. **Bilingual audit.** ID/EN parity. Same IDs and slugs across locales (crawl `out/id` vs `out/en` and diff the route lists).
   Unnatural or literal Indonesian. Terminology consistent with `docs/decisions.md`. Untranslated UI strings.
5. **Accessibility (WCAG 2.2 AA).** axe on every route type, including the map Tree and Relations views. A keyboard-only run of map → profile → path → search.
   Screen-reader labels on nodes, edges, and the panel. Contrast in both themes. Focus visible. Reflow at 320px.
6. **Performance.** Lighthouse mobile on Home, Map, the GNSO profile, Glossary, and the Beginner path, against the brief targets.
7. **Links.** `pnpm check:links` + crawl `out/` for internal links.
8. **Licenses.** Every font, icon, and image in the build appears in `docs/ASSETS.md` with a compatible license. No unlisted assets.
9. **Brand and legal.** The unofficial label and disclaimer are on every page in both locales. No ICANN logo, colors, or layout imitation. No bulk-copied official text.
10. **Basic security.** Security headers are configured in `vercel.json`. No secrets in git history (`git log -p | grep` for key patterns). `pnpm audit` has no high/critical. No third-party scripts or trackers. External links use `noopener`.
11. **Code health.** No `any`, no dead components, no console errors, no hard-coded strings.

## Fix policy
- **Blocker** (wrong fact, wrong relationship type, broken core flow, a11y serious/critical, broken link, missing disclaimer, unlicensed asset): fix it in this phase. A content fix must cite a source and update `verifiedAt`.
- **Major**: fix it if it takes < 30 min each. Otherwise list it.
- **Minor**: list it only.

## Deliverable
`docs/reports/P5-report.md` with: a findings table (id · severity · area · description · evidence · status), the fact-audit table,
the relationship-audit notes, Lighthouse scores, screenshots, and a **status table for R1–R8 and R10** (R9 = user test happens in P6).
End with **Go to preview / No-go**.

STOP after writing the report.
