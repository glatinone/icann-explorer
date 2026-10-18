# Phase P6: Preview → user test → release gate → public launch

**Role:** Builder agent. **Branch:** `phase/P6-launch`. **Deploy:** only the steps marked (OWNER), after Kiell confirms.

"Launched" means **all release criteria R1–R10 in `00-brief.md` are met**. A successful deploy alone is not a launch.

## Precondition
`docs/reports/P5-report.md` says **Go to preview** and has no open blockers. If it doesn't, stop.

## Part A: Prepare
1. `README.md` (public): what the project is, a screenshot, the unofficial label + disclaimer, the stack, how to run it locally, and how content and provenance work.
   Move the current orchestration README to `docs/plan/ORCHESTRATION.md` (don't delete it).
2. `CONTRIBUTING.md`: how to propose a content correction (edit the JSON, add a citation with `locator` + `verifiedAt`, follow the source trust order and relationship rules), plus how review works.
3. GitHub issue templates: "Content error" (page id, what's wrong, source), "Relationship error", "Translation issue", "Accessibility issue", "Bug".
   The site's "Report an error" links prefill the content-error template with the page id.
4. `LICENSE`: code MIT. Content CC BY 4.0 (stated in the README + footer). Leave a `TODO(Kiell)` comment to confirm it. Re-check `docs/ASSETS.md` is complete.
5. Footer: "Last content review: <latest verifiedAt>", plus links to GitHub and Report an error.
6. A feedback link from one config constant (GitHub Discussions or a form. Leave a placeholder for Kiell).
7. Final OG image (1200×630) in both locales: site name, the unofficial label, and a stylized map snippet. Its assets go into `docs/ASSETS.md`.
8. A weekly GitHub Action: `check:links` → opens an issue if anything breaks.

## Part B: Preview deploy (not public yet)
9. **(OWNER)** Connect Vercel. Deploy a **preview** with `X-Robots-Tag: noindex` and `<meta name="robots" content="noindex">`.
10. Against the preview URL: run the Playwright smoke + axe suite, check the security headers (`curl -sI`), and run Lighthouse mobile on the 5 key pages. Record everything.

## Part C: User test (owner-led)
11. Kiell runs `docs/plan/05-user-test.md` with **≥ 5 newcomers** on the preview URL and fills in `docs/reports/user-test.md`.
12. Fix the issues that showed up for ≥ 2 participants (content fixes must keep their citations). Re-run the checks in step 10.

## Part D: Release gate → public
13. Write the **R1–R10 checklist** into the report, each with evidence (link, output, screenshot). Any ✗ = stop and report.
14. **(OWNER)** After Kiell signs off on R1–R10: remove the `noindex`, promote to production, and set the production URL in config and the sitemap.
15. Smoke-test production (both locales, the toggle, the map views, Report an error) and record the results.

## Acceptance criteria
- [ ] R1–R10 all ✓, with evidence in `docs/reports/P6-report.md`.
- [ ] `docs/reports/user-test.md` exists with ≥ 5 participants.
- [ ] Production loads both locales, security headers are present, and `noindex` is gone only in production.
- [ ] README, CONTRIBUTING, LICENSE, ASSETS, and issue templates are present. The weekly link check is committed.

Write `docs/reports/P6-report.md` and STOP.
