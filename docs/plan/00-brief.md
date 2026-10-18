# 00: Product brief

## One line
An interactive, bilingual map of the ICANN ecosystem that lets a newcomer understand **who does what,
how groups connect, how an issue becomes policy, and where they can start contributing**, in minutes.

## Origin
Kiell attended ICANN87 as a Fellow and found that the hard part for newcomers isn't motivation. It's the wall
of acronyms (GNSO, ALAC, ccNSO, SSAC…) and not knowing which group matters for which topic.
Official resources exist (ICANN for Beginners, ICANN Learn, "Find Your Group"), but they're spread across many
pages and don't show the relationships visually. This site connects them and links back to them.

## Target users
| Persona | Need |
| --- | --- |
| **Curious outsider** (student, dev, civil society) | "What is ICANN and why should I care?" |
| **New Fellow / NextGen / first-time meeting attendee** | "Which sessions and which groups are relevant to me?" |
| **Would-be contributor** | "How do I actually join a working group or comment on policy?" |
| **Indonesian audience** | All of the above, in natural Bahasa Indonesia |

## Product principles
1. **Visual first.** Understand relationships before memorizing acronyms.
2. **Beginner friendly.** Plain language, but technically accurate.
3. **Bilingual.** ID and EN at parity. Switching language keeps your place.
4. **Source-backed.** Every important claim links to an official source.
5. **Community-aware.** Explain different mandates. Don't flatten everything into one org chart.
6. **Points outward.** The goal is to send people to the official programs (ICANN Learn, At-Large, Fellowship), not replace them.

## MVP scope (must ship)
| Feature | User can… |
| --- | --- |
| Interactive ecosystem map | Pick a group and see its role and connections in a side panel. Relationship types (policy, advice, accountability, implementation, selection, membership, context) are visually and textually distinct |
| Accessible map alternatives | Explore the same data as a **Tree** (hierarchical list) or a **Relations** table, fully by keyboard or screen reader |
| Group profile pages | Read the mandate, purpose, example, how it connects, official links, last reviewed date |
| Connected glossary | Go from a term (e.g. "gTLD", "PDP") to the groups that deal with it |
| Learning paths | Follow 4 guided paths: Beginner, Policy, Technical, **Get Involved** |
| ID/EN toggle | Switch language on any page without losing the current page or selected node |
| Search | Find groups and terms by name or acronym from anywhere |
| Sources & About | Methodology, sources list, disclaimer, how to report an error |

## Explicitly NOT in MVP
Login, comments, forums, AI chatbot, open contribution UI, CMS, database, meeting schedule scraping, newsletter,
analytics that need cookies. Corrections come in through GitHub issues or PRs, or a simple feedback link.

## Content scope for MVP
- **~16 map nodes** (see `02-content-spec.md`): the core ICANN structure plus a few clearly marked external orgs.
- **~40 glossary terms.**
- **4 learning paths.**

## Success metrics (comprehension, not traffic)
Tested with 5–10 newcomers (script in `05-user-test.md`):
- **Task completion ≥ 80%**: e.g. "Find who develops gTLD policy recommendations" and "Find the group that represents individual internet users".
- **Comprehension**: ≥ 70% can explain the difference between a Supporting Organization, an Advisory Committee, the Board, and ICANN org after a 10-minute session.
- **Confidence**: average self-rating for "I feel ready to follow an ICANN session" rises by ≥ 1.5 on a 1–5 scale.
- **Time to first answer** for "What does ALAC do?": under 60 seconds from the home page.

## Non-functional targets
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90 (mobile)
- WCAG 2.2 AA. Works on a 375px screen, keyboard only, and with a screen reader (the map has Tree and Relations alternatives)
- First load JS for the home page < 200 KB gzipped (the map route can be heavier, lazy-loaded)
- 0 broken external links at launch

## Release criteria (public launch = ALL of these, not "it deployed")
| # | Criterion | Evidence |
| --- | --- | --- |
| R1 | **Facts:** P5 fact audit has 0 unsupported claims. Every published claim has a citation with `verifiedAt` | P5 report, validator output |
| R2 | **Relationships:** no modeling-rule violations. The owner has reviewed the full Relations table | validator + owner sign-off |
| R3 | **Bilingual:** 100% ID/EN parity. Every claim has `translation.reviewed: true`. A native reviewer has read the 5 key pages in ID | validator + reviewer note |
| R4 | **Accessibility:** axe has 0 serious/critical. A keyboard-only run of map → profile → path → search passes. Tree and Relations views work | P5 report |
| R5 | **Links:** `check:links` has 0 broken. Every internal link resolves | P5/P6 report |
| R6 | **Licenses:** every font, icon, and image is listed in `docs/ASSETS.md` with a compatible license. Code + content licenses are set | `docs/ASSETS.md`, `LICENSE` |
| R7 | **Disclaimer & brand:** "Independent, unofficial educational project" label + footer disclaimer on every page, both locales. No ICANN logo or brand imitation | screenshots |
| R8 | **Basic security:** security headers present (checked on the preview URL), no secrets in repo, `pnpm audit` has no high/critical, no third-party trackers | P6 report |
| R9 | **User test:** ≥ 5 newcomers tested on the **preview** deploy. Targets met, or the gaps are fixed or documented with the owner's approval | `docs/reports/user-test.md` |
| R10 | **Performance:** Lighthouse targets above are met on the preview URL | P6 report |
