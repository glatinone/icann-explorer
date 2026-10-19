# Contributing to ICANN Explorer

Thanks for helping make the ICANN ecosystem easier to understand. This project is an **independent, unofficial educational project** and every fact on the site must stay source-backed.

## Two ways to contribute

1. **Open an issue** using one of the GitHub issue templates ("Content error", "Relationship error", "Translation issue", "Accessibility issue", "Bug"). Use the "Report an error" link in the site footer to prefill the content-error template with the page id.
2. **Open a pull request** that edits the JSON in `content/` directly. Keep every claim cited.

## Proposing a content correction

1. Find the entity, term, or relationship in `content/`.
2. Edit the relevant claim in `content/entities.json`, `content/relationships.json`, or `content/terms.json`.
3. Every claim **must** keep at least one citation. Add a citation with:
   - `sourceId`: a source from `content/sources.json` (follow the source trust order: official ICANN pages first, then official documents, then trusted secondary sources).
   - `locator`: where in the source the claim appears (section or paragraph, when available).
   - `verifiedAt`: the date you verified it (`YYYY-MM-DD`). Never backdate.
4. Update the citation — do not remove an old one silently; if a fact changed, add the new citation and note the change.
5. Run the validator before opening the PR: `pnpm validate:content`.
6. Add or update a unit test if the change affects modeling rules.

### Relationship rules (validated)

- No Supporting Organization or Advisory Committee `reports-to` anyone.
- No external entity is `part-of` ICANN; external groups are marked `scope: external` and connected with the appropriate relationship type.
- Advice flows are `advises`, not `reports-to` or `oversees`.

## Review process

- Fixes are reviewed by a maintainer. Content changes are checked against the cited source before merging.
- The "Report an error" link on the site opens a prefilled GitHub issue that goes through the same review.

## Getting started

```bash
pnpm install
pnpm dev
pnpm test
```

```bash
pnpm build          # runs the content validator, then static export
pnpm check:links    # verifies all local links resolve
```
