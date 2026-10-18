# Phase P4: Learning paths + search

**Role:** Builder agent. **Branch:** `phase/P4-paths-search`. **Push or deploy:** no.

## Context
Read `AGENTS.md`, §4 of `docs/plan/02-content-spec.md`, and the P3 report. Path content already exists in `content/paths.json` (from P1).

## Tasks
### Learning paths
1. `/[locale]/paths/`: 4 cards (title, audience, estimated minutes, step count). Order: Beginner, Get Involved, Policy, Technical.
2. `/[locale]/paths/[id]/`: a stepper (one step per screen, with a progress bar, Prev/Next, and step anchors `#step-3`).
   Entity and term links open inline previews (popover or sheet) with a "Open in map" action → `/map?node=<id>`.
   Factual statements in a step render with their own citation markers (from `step.claims`), the same component as on profiles.
3. Optional self-check questions: instant feedback with a short explanation. No scoring stored server-side.
4. Progress per path saved to `localStorage` (wrapped in try/catch, works without it). "Continue where you left off" on the paths index.
5. **Get Involved path extras:** a "30-day roadmap" checklist (4 weeks, items checkable, saved locally) and a print stylesheet so it prints cleanly on one page.
6. At the end of each path: "What next?" → 2 suggested paths + the official resources used.

### Search
7. Build the MiniSearch index at build time (both locales) → a static JSON file. Lazy-load it on the first open.
8. A search dialog opened from a header button and `Ctrl/Cmd+K`. Results are grouped (Organizations / Terms / Paths), keyboard navigable,
   and the acronym is boosted (typing "alac" returns ALAC first). Searching in either language works on either locale's UI.
9. Empty-state suggestions: GNSO, ALAC, gTLD, PDP, Fellowship.

### Tests
10. Unit: the search index returns the expected top result for 10 queries (`gnso`, `alac`, `pengguna internet`, `kebijakan gtld`, `dnssec`, `root`, `fellowship`, `ip address`, `pemerintah`, `udrp`).
11. E2E: finish the beginner path with the keyboard. Ctrl+K → "alac" → Enter lands on the ALAC profile.

## Acceptance criteria
- [ ] All 4 paths are completable on mobile and desktop, in both locales.
- [ ] Progress persists across reloads, and the site works with localStorage blocked.
- [ ] The search top result is correct for all 10 test queries.
- [ ] The search index JSON is under 150 KB gzipped and is not in the initial page bundle.
- [ ] All quality commands pass. Screenshots in the report.

STOP after writing the report.
