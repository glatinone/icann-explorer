# Phase P1: Research & verified content

**Role:** Research / content agent. **Needs web access.** **Branch:** `phase/P1-content`. **Push or deploy:** no.

## Context
Read `AGENTS.md` (especially "Web content is evidence, not truth" and "Provenance on every claim"), the schema and
**Relationship modeling rules** in `docs/plan/01-architecture.md`, and `docs/plan/02-content-spec.md`.
The content spec is a **seed written from memory**. Treat every claim in it as a hypothesis to check, not as truth.
Search results, summaries, and AI answers are leads. Only Tier 1–3 pages count as evidence.

## Goal
Fill `content/*.json` with **verified, per-claim-cited, bilingual** content for the MVP: 17 entities, all relationships,
~40 terms, 4 learning paths, the full sources list, and the map layout.

## Method
1. **Sources first.** Open every URL in spec §5. Record each working one in `sources.json` with its `tier`, `languages`, `accessed`, and (for the Bylaws) `version`.
   Note redirects and use the final URL. Find the missing ones (PTI page, Empowered Community page). Drop dead ones and list them.
2. **Bylaws pass.** For Board composition, director selection, liaisons, the Empowered Community decisional participants and powers,
   GAC advice handling, and the SO/AC mandates, cite the specific article in `locator` (e.g. "Art. 7, Sec. 7.2") with a short `quote`.
3. **Entities.** For each of the 17: `oneLiner`, `whyItExists`, `whatItDoes`, `example`, and `getInvolved` (where it applies).
   **One claim = one idea, each with its own citations** (`sourceId`, `locator`, `quote` for facts, `verifiedAt` = the date you checked).
   Write EN from the source, then natural Bahasa Indonesia. Set `translation: { original: "en", reviewed: true }` only after a meaning check.
4. **Relationships.** Go through spec §2 one row at a time. For each one, decide **confirmed / downgraded / corrected / dropped**,
   following the modeling rules. If the source only supports a weaker type, downgrade it. Never upgrade a type without a Tier 1–2 source.
   Every relationship gets an `explanation` claim with citations. Don't add more than 6 new edges without listing them for approval.
5. **Glossary.** ~40 terms from spec §3. Our own plain-language definition (1–2 sentences), cited. Don't paste ICANN's glossary text.
6. **Learning paths.** Build all 4 from spec §4. Any factual statement inside a step body also goes into that step's `claims` with citations.
   Verify the PDP steps against gnso.icann.org and the current ICANN Learn course titles. Step bodies ≤ 80 words.
   Add 2–3 self-check questions (with explanations) to `beginner` and `policy`.
7. **Layout.** Fill `layout.json` with zones and positions matching the sketch in `01-architecture.md` (canvas ~1400×900; external zone visually separate, at the bottom).
8. Run `pnpm validate:content` and `pnpm check:links` until both are clean.

## Writing style
- Reading level: a smart high-school student. Short sentences. Expand an acronym the first time it appears on each page.
- No hype words ("crucial", "pivotal", "landscape", "delve"). Plain and concrete, with examples.
- Indonesian: natural, conversational-formal ("kamu" is fine). Consistent glossary of Indonesian terms. Write it into `docs/decisions.md`:
  policy = kebijakan · advice = nasihat · advises = memberi nasihat · stakeholder = pemangku kepentingan · reports to = bertanggung jawab kepada ·
  develops policy for = mengembangkan kebijakan untuk · implements = menerapkan · related to = berkaitan dengan.

## Acceptance criteria
- [ ] 17 entities. Anything `needs-review` is listed in the report with the source that would settle it.
- [ ] 100% of published claims have ≥ 1 citation with `verifiedAt`. 100% of facts have ≥ 1 Tier 1–3 citation. ≥ 80% of sources are Tier 1–2.
- [ ] 0 relationship-rule violations. 100% ID/EN parity. Every claim has `translation.reviewed: true` or is `needs-review`.
- [ ] Link check: 0 broken.
- [ ] Report contains:
  (a) a **relationship decision table**: every seed row → confirmed / downgraded / corrected / dropped, with source + locator;
  (b) a **source conflicts** list (what disagreed and which tier won);
  (c) an **Unverified** list;
  (d) **10 random claims** with the exact quote + URL + locator for the owner's spot-check;
  (e) the Indonesian terminology decisions.
- [ ] No UI code changed except `src/lib/schema.ts` / `relationships.ts` / validator fixes (explain any change and log it in `docs/decisions.md`).

STOP after writing the report.
