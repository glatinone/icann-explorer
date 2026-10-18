# Phase P2: Interactive ecosystem map + accessible alternatives

**Role:** Builder agent. **Branch:** `phase/P2-map`. **Push or deploy:** no.

## Context
Read `AGENTS.md`, the "Relationship modeling rules" and "Map design" sections of `docs/plan/01-architecture.md`,
`docs/decisions.md`, and `docs/reports/P1-report.md`. The content in `content/` is verified. **Don't edit content facts.**
If something looks wrong, list it in your report.

## Goal
`/[locale]/map/` is the core of the product. A newcomer should understand the shape of ICANN in under a minute,
**without** getting the impression that it's one top-down hierarchy. The same data is fully usable as Tree and Relations views.

## Tasks
1. `src/lib/graph.ts`: build React Flow nodes and edges from content + layout + the relationship registry. Pure and unit-tested.
2. Custom node: acronym (large), short name, a kind badge, and the kind accent. External nodes are muted and carry an "Outside ICANN" tag.
3. Zone background nodes (non-interactive) with captions: "Supporting Organizations: develop policy", "Advisory Committees: give advice",
   "ICANN affiliate", and "Outside ICANN: related, independent" (dashed border).
4. **Edges by visual family** (see the registry): each family has a distinct line pattern + arrowhead + text label. They must stay
   distinguishable in grayscale (add a test or screenshot proof). `part-of` is drawn as grouping and nesting, not as an arrow.
5. Family filter chips for all 7 families (defaults: Policy, Advice, Accountability, Implementation on. Selection, Membership, Context off) + entity chips.
6. Selection: click, Enter, or Space on a node → highlight its neighborhood and open the panel, and set `?node=`. Selecting an edge sets `?edge=` and shows the type, explanation, and citations.
   Esc clears the selection. URL state survives the language toggle and a reload.
7. Panel: a side panel on ≥ 1024px, a bottom sheet below that. "Connected to" is grouped by relationship type, with citation markers.
8. **Accessible alternatives (MVP-required):** a view switcher `Map · Tree · Relations` (`?view=`).
   - Tree: zones → kinds → entities, with nested headings and lists, a one-liner, and a profile link.
   - Relations: a table (From · Relationship · To · Explanation · Source), filterable by family and entity, and sortable. A proper `<table>` with `scope` headers.
   - Default under 640px = Tree.
9. Keyboard on the map: a curated Tab order (Board → SOs → ACs → committees → org → affiliate → external), arrow keys move to neighbors,
   and nodes and edges have descriptive `aria-label`s. Focus is visible. Selections are announced through an `aria-live` region.
10. Zoom controls + fit-to-view. No scroll-zoom hijack. Lazy-load React Flow.
11. Legend lists every visual family with its pattern sample and text.
12. Tests: graph builder unit tests. Playwright: keyboard-select GNSO → panel shows GNSO → toggle language → GNSO still selected;
    Relations view filtered by "Advice" shows only `advises` rows; axe on Map, Tree, and Relations has no serious or critical violations.
13. Screenshots (desktop + 375px, light + dark, plus one grayscale) → `docs/reports/img/`.

## Acceptance criteria
- [ ] All published entities render in their zones, with no overlaps at the default fit.
- [ ] Every relationship family is visually distinct in grayscale and labeled in text. Advice edges never look like reporting lines.
- [ ] The Tree and Relations views contain 100% of the published entities and relationships (test it by count).
- [ ] The map, Tree, and Relations views are fully usable by keyboard. axe is clean.
- [ ] Mobile 375px: Tree by default, the map opens in full screen, and the bottom sheet doesn't hide the selected node.
- [ ] URL state (`node`, `edge`, `view`) survives the language toggle and a reload.
- [ ] All quality commands pass. Decisions are logged.

STOP after writing the report.
