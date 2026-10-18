# 02: Content spec

> **Status of everything below: SEED / TO VERIFY.** The orchestrator drafted this from general knowledge
> plus a quick check of the official pages marked ✓. The P1 content agent **must verify every claim and
> relationship** against the primary sources before it goes into `content/`. Anything that can't be verified
> goes into the P1 report under "Unverified" and is left out.

## 0. Content rules recap
- **IDs:** the `id` column below is final and language-neutral. It's used as the slug in both `/id/` and `/en/`. Don't translate it or rename it.
- **Provenance:** every sentence that states a fact is a `Claim` with its own citations (source + locator + `verifiedAt`). A page-level source list doesn't count.
- **Trust order:** Tier 1 (Bylaws, charters) > Tier 2 (official ICANN/SO/AC pages) > Tier 3 (external orgs about themselves) > Tier 4 (never alone). See `AGENTS.md`.
- **Bilingual:** write EN first from the source, then ID. Set `translation.reviewed: true` only after a meaning check, not a word-for-word check.

## 1. Map nodes (MVP: 17)

| # | id | Acronym | Name | kind | scope |
| --- | --- | --- | --- | --- | --- |
| 1 | `icann-board` | Board | ICANN Board of Directors | board | icann-internal |
| 2 | `icann-org` | ICANN org | ICANN organization (staff, led by the President & CEO) | icann-org | icann-internal |
| 3 | `gnso` | GNSO | Generic Names Supporting Organization | supporting-organization | icann-internal |
| 4 | `ccnso` | ccNSO | Country Code Names Supporting Organization | supporting-organization | icann-internal |
| 5 | `aso` | ASO | Address Supporting Organization | supporting-organization | icann-internal |
| 6 | `alac` | ALAC | At-Large Advisory Committee | advisory-committee | icann-internal |
| 7 | `gac` | GAC | Governmental Advisory Committee | advisory-committee | icann-internal |
| 8 | `ssac` | SSAC | Security and Stability Advisory Committee | advisory-committee | icann-internal |
| 9 | `rssac` | RSSAC | Root Server System Advisory Committee | advisory-committee | icann-internal |
| 10 | `nomcom` | NomCom | Nominating Committee | committee | icann-internal |
| 11 | `empowered-community` | EC | Empowered Community | mechanism | icann-internal |
| 12 | `gnso-stakeholder-groups` | SGs & Cs | GNSO Stakeholder Groups and Constituencies (CSG: BC, IPC, ISPCP · NCSG: NCUC, NPOC · RrSG · RySG) | stakeholder-group | icann-internal |
| 13 | `ralos` | RALOs | Regional At-Large Organizations (AFRALO, APRALO, EURALO, LACRALO, NARALO) | regional-organization | icann-internal |
| 14 | `pti` | PTI / IANA | Public Technical Identifiers (performs the IANA functions) | affiliate | icann-affiliate |
| 15 | `rirs` | RIRs | Regional Internet Registries (AFRINIC, APNIC, ARIN, LACNIC, RIPE NCC), coordinated via the NRO | external | external |
| 16 | `ietf` | IETF | Internet Engineering Task Force | external | external |
| 17 | `root-server-operators` | RSOs | Root server operators | external | external |

GNSO sub-groups and the five RALOs are **one cluster node each** in MVP. On their profile page they get a sub-list
(name + one line + official link). Don't make separate map nodes for them yet.

**Phase 2 candidates (not MVP):** CSC, RZERC, ISOC, IGF, ccTLD managers (e.g. PANDI for .id), individual RIR nodes.

## 2. Relationships (seed, verify each one)

Types and visual families are defined in `01-architecture.md` → **Relationship modeling rules**. If a source supports only a
weaker statement than the seed, **downgrade the type** (e.g. `advises` → `related-to`). Don't stretch the source to fit the seed.

**Policy** (`develops-policy-for`)
| from | to | note for the explanation |
| --- | --- | --- |
| gnso | icann-board | substantive gTLD policy via the PDP. The GNSO Council manages the PDP |
| ccnso | icann-board | global policies for ccTLDs, a **narrow** scope. Most ccTLD policy is set locally by each ccTLD manager |
| aso | icann-board | global IP address policy developed bottom-up in the RIR communities. The Board ratifies it (verify the exact mechanism) |

**Advice** (`advises`. Not binding, not a reporting line)
| from | to | note |
| --- | --- | --- |
| alac | icann-board | interests of individual Internet users |
| gac | icann-board | public policy advice from governments. Bylaws set a special procedure if the Board doesn't follow GAC advice (verify, cite the article) |
| ssac | icann-board | security and integrity of naming and addressing systems |
| rssac | icann-board | operation, administration, security, and integrity of the root server system |

**Accountability** (`reports-to`, `exercises-powers-over`)
| from | type | to | note |
| --- | --- | --- | --- |
| icann-org | reports-to | icann-board | the Board appoints and oversees the President & CEO, who leads ICANN org |
| empowered-community | exercises-powers-over | icann-board | community powers, e.g. removing directors and rejecting budgets (verify the full list) |

**Implementation** (`implements`, `performs-functions-for`)
| from | type | to | note |
| --- | --- | --- | --- |
| icann-org | implements | icann-board | ICANN org implements policies and decisions the Board adopts |
| pti | performs-functions-for | icann-org | PTI performs the IANA naming functions under contract with ICANN (verify the wording) |

**Selection** (`selects-members-of`, `appoints-liaison-to`)
| from | type | to | note |
| --- | --- | --- | --- |
| nomcom | selects-members-of | icann-board | 8 voting directors (verify, Bylaws Art. 7) |
| gnso / ccnso / aso | selects-members-of | icann-board | 2 directors each (verify) |
| alac | selects-members-of | icann-board | 1 director, selected by the At-Large community (verify the exact wording and the correct `from`) |
| gac / ssac / rssac / ietf | appoints-liaison-to | icann-board | non-voting liaisons (verify) |

**Membership** (`part-of`, `participates-in`)
| from | type | to | note |
| --- | --- | --- | --- |
| gnso-stakeholder-groups | part-of | gnso | they elect the GNSO Council members |
| ralos | part-of | alac | the At-Large community structure. RALOs select some ALAC members (verify. `part-of` might need to be `participates-in`) |
| gnso, ccnso, aso, alac, gac | participates-in | empowered-community | "Decisional Participants" (verify) |
| rirs | participates-in | aso | the NRO Number Council serves as the ASO Address Council (verify) |
| root-server-operators | participates-in | rssac | (verify) |

**Context** (`related-to`. Hidden by default, no authority implied)
| from | to | note |
| --- | --- | --- |
| pti | ietf | IANA maintains protocol parameter registries defined by IETF standards |
| pti | rirs | IANA allocates IP address blocks and ASNs to the RIRs |
| pti | root-server-operators | root zone management feeds what root servers serve |
| ssac | rssac | overlapping security and stability topics |
| alac | gnso | At-Large participates in GNSO PDP working groups |
| gac | gnso | GAC input into gTLD policy (e.g. early engagement in PDPs) |

> ⚠️ Relationships the orchestrator deliberately did **not** seed, because they are commonly mis-stated:
> "GNSO reports to the Board", "ALAC is part of the GNSO", "ICANN controls the RIRs / IETF", and "GAC decides".
> If you find yourself writing one of these, stop.

## 3. Glossary seed (~40 terms)
DNS · domain name · top-level domain (TLD) · gTLD · ccTLD · IDN · root zone · root server · registry · registrar ·
registrant · IP address · IPv4 / IPv6 · ASN · IANA functions · PDP · EPDP · consensus policy · Public Comment ·
multistakeholder model · Bylaws · Board resolution · GNSO Council · working group · constituency · stakeholder group ·
At-Large Structure (ALS) · individual member (At-Large) · RALO · DNSSEC · DNS abuse · registration data / RDAP (formerly WHOIS) ·
New gTLD Program / Next Round · UDRP · Universal Acceptance (UA) · ICANN Public Meeting (Community Forum / Policy Forum / AGM) ·
Fellowship · NextGen@ICANN · ICANN Learn · ICANN Account & ICANN Join · Statement of Interest (SOI) · NRO

Each term: our own plain-language definition (ID + EN), a source (usually the ICANN Acronyms and Terms page or the group's site), and links to related entities and terms.

## 4. Learning paths

### `beginner`: "ICANN dalam 15 menit" (≈15 min)
1. What ICANN coordinates: unique identifiers (names, numbers, protocol parameters). What it does **not** do: it doesn't control internet content, isn't a government, and doesn't run the internet.
2. Three parts: Community, Board, ICANN org.
3. Supporting Organizations **develop policy**. Advisory Committees **give advice**. Show the difference in the map.
4. How an issue becomes policy (simplified, 5 steps) → link to the Policy path.
5. Who is **outside** ICANN but connected: RIRs, IETF, root server operators.
6. Self-check: three quick questions.

### `policy`: "Dari isu jadi kebijakan" (≈20 min)
GNSO PDP lifecycle (verify the steps against gnso.icann.org): issue raised → Issue Report → GNSO Council initiates the PDP → charter + working group → Initial Report → **Public Comment** → Final Report → Council vote → Board consideration (and AC advice, incl. GAC) → implementation by ICANN org.
Also covers: where outsiders can plug in (Public Comment, joining WGs via At-Large or a constituency), and how ccNSO and ASO policy differ.

### `technical`: "DNS, angka, dan root" (≈20 min)
DNS basics → root zone & root servers (RSSAC, RSOs) → IP addresses & ASNs (IANA → RIRs → ISPs, ASO's role) → IANA/PTI and the IETF protocol registries → SSAC and DNS security topics (DNSSEC, DNS abuse) → Universal Acceptance & IDNs.

### `get-involved`: "Dari outsider jadi kontributor" (≈20 min + a 30-day plan)
1. Start with **ICANN for Beginners** ✓ and the **ICANN Learn** courses (verify the current course titles. Candidates: Introduction to ICANN, DNS Fundamentals, Policy Development Fundamentals).
2. Create an **ICANN Account** and use **ICANN Join** to sign up for groups ✓.
3. Use **Find Your ICANN Group** ✓ to match your background to a group.
4. Easiest door for individuals: **At-Large**. Many working groups are open **without** At-Large membership ✓. Asia-Pacific people → **APRALO**.
5. Join an **ICANN Public Meeting** remotely. Pick 2–3 sessions from the schedule.
6. Make a first contribution: read a document open for **Public Comment** and submit a comment, or ask a question in a WG.
7. Level up: **Fellowship** ✓ (mentor + training + travel support, priority for underserved and underrepresented groups) and **NextGen@ICANN** ✓ (students from the region hosting the meeting).
8. Connect with your **regional engagement team** (APAC for Indonesia).
9. Beyond ICANN: ISOC, IGF, IETF. Each has its own way to participate.
10. A printable **30-day roadmap**: Week 1 basics → Week 2 pick one topic → Week 3 join a community → Week 4 first contribution.

## 5. Sources (seed list for `sources.json`)
✓ = the orchestrator confirmed the page exists on 2026-10-18. Everything else: the agent must verify.

**Beginner and engagement**
- ✓ ICANN for Beginners: https://www.icann.org/en/beginners
- ✓ Find Your ICANN Group: https://www.icann.org/en/beginners/find-your-icann-group
- ✓ Programs for Professionals and Students: https://www.icann.org/en/beginners/programs-for-professionals-and-students
- Courses and Learning: https://www.icann.org/en/beginners/courses-and-learning
- Connect with Your Regional Team: https://www.icann.org/en/beginners/connect-with-your-regional-team
- ICANN Learn: https://learn.icann.org/
- Engagement calendar: https://www.icann.org/en/engagement-calendar
- ICANN Public Meetings: https://meetings.icann.org/
- Public Comment: https://www.icann.org/public-comments
- Fellowship: https://www.icann.org/fellowshipprogram
- NextGen@ICANN: https://www.icann.org/public-responsibility-support/nextgen
- ICANN history: https://www.icann.org/history

**Structure and governance**
- ✓ Community and groups: https://www.icann.org/en/community
- Developing policy: https://www.icann.org/policy
- Bylaws: https://www.icann.org/en/governance/bylaws
- Acronyms and Terms: https://www.icann.org/en/icann-acronyms-and-terms
- About the Board: https://www.icann.org/en/board/about
- Empowered Community: find the official page (likely under icann.org/ec)
- NomCom: https://www.icann.org/nomcom

**Groups** (✓ = listed on the official community / Find Your Group pages)
- ✓ GNSO https://gnso.icann.org/ · ✓ ccNSO https://ccnso.icann.org/ · ✓ ASO https://aso.icann.org/
- ✓ ALAC / At-Large https://atlarge.icann.org/ · ✓ At-Large Get Involved https://atlarge.icann.org/get-involved
- At-Large individual members: https://atlarge.icann.org/individual-members
- ✓ GAC https://gac.icann.org/ · ✓ SSAC https://www.icann.org/en/ssac · ✓ RSSAC https://www.icann.org/en/rssac
- ✓ Constituencies: BC https://www.bizconst.org/ · IPC https://www.ipconstituency.org/ · ISPCP https://www.ispcp.info/ ·
  NCUC https://www.ncuc.org/ · NPOC https://npoc.org/ · RrSG https://rrsg.org/ · RySG https://www.rysg.info/

**Technical and external**
- IANA https://www.iana.org/ · PTI (find the official page)
- NRO https://www.nro.net/ · Root servers https://root-servers.org/ · IETF https://www.ietf.org/
- ISOC https://www.internetsociety.org/ · IGF https://www.intgovforum.org/

## 6. Profile page template (every entity)
1. **In one sentence**: `oneLiner`
2. **Why it exists**: `whyItExists`
3. **What it does**: `whatItDoes` (3–5 bullets)
4. **How it connects**: a mini map of its neighbors plus the relationship list (edge label + explanation)
5. **Example**: `example` (a real issue, e.g. GNSO → registration data policy after GDPR, via the EPDP)
6. **How to get involved**: `getInvolved` (if any)
7. **Official resources**: `officialUrl` + sources
8. **Last reviewed**: `lastReviewed` + a "Report an error" link (GitHub issue prefilled with the page id)

Each claim shows its own numbered citation marker (hover or focus shows the source, locator, verified date, and quote).
The list at the bottom of the page collects those citations. It never replaces them.
