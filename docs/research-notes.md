# Research notes (content pass of 2026-10-20)

What was checked, what was decided, and what is still open. Everything published passed `pnpm check:quotes` (548 quotes found verbatim in their sources) on 2026-10-20.

## Modeling decisions

- **Directors are nominated, then designated.** Bylaws Sec. 7.2(a): the Empowered Community is the sole designator of every Director except the President. The NomCom, ASO, ccNSO, GNSO and the At-Large community *nominate*. The map uses `selects-members-of` for these edges and every explanation says "nominates" and names the EC step.
- **ASO `advises` the Board** rather than `develops-policy-for`, because Art. 9.1(a) says the ASO "shall advise the Board", unlike Art. 10.1 (ccNSO) and 11.1 (GNSO).
- **Empowered Community** has exactly five Decisional Participants (Art. 6, Sec. 6.1(a)): ASO, ccNSO, GNSO, ALAC, GAC. SSAC, RSSAC and NomCom are not. The previous version of the site had this wrong.
- **NomCom** has 18 voting delegates (Art. 8, Sec. 8.2). The ICANN glossary's "15" is outdated.
- **PTI → RIRs / IETF** are `related-to`, not `performs-functions-for`: no opened source states the service agreements. Upgrade them if the SLA with the RIRs and the IETF–ICANN MoU supplemental agreement are cited.
- **ICANN org `implements` Board decisions** is marked as an interpretation (Art. 2, Sec. 2.1 and the Board page); no source says "implements" outright.
- **ICANN org `reports-to` the Board** rests on Art. 15 (the Board elects and can remove the President; staff report to the President).
- **Root server operators `participates-in` RSSAC** cites the icann.org RSSAC page; the Bylaws give no RSSAC composition rule.
- Totals such as "GNSO Council: 21 seats" and "ccNSO Council: 15 + 3" are sums of Bylaws seat counts, not stated totals.

## Open questions (good next research tasks)

- **PTI Board size** is not stated: the PTI board page renders only with JavaScript and the PTI bylaws PDF was not reachable.
- **Empowered Community example** cites correspondence titles, not the letters themselves. The Board's approval date in July 2026 is inferred from letter dates.
- **Board example** is a press release (Chair/Vice Chair, 30 Oct 2025). A literal Board resolution would be stronger.
- **GAC example** is the ICANN86 Seville Communiqué listing page. A formal piece of GAC Consensus Advice from an older communiqué would show advice better.
- **ccNSO membership count**: only the 2021 figure (172 members) is citable.
- **Indonesia**: GAC member list includes Indonesia (member/observer label is filtered by JavaScript on the page). APNIC lists APJII as Indonesia's NIR. No Indonesian At-Large Structure was found on the At-Large site. A `.id` example for ccTLD would help Indonesian readers (cite the IANA Root Zone Database).
- **Perishable facts** to re-check each cycle: the current CEO, NomCom application window, GAC member/observer counts, APRALO figures and leadership (the `ralos` example), Fellowship/NextGen eligibility.

## Method

The Bylaws were read from the full page text ("As amended 3 July 2026"). Web-fetch summaries proved unreliable for exact wording (one gave ALAC as "5 per RALO + 2 NomCom"; the Bylaws say 2 per RALO + 5 NomCom), so every quote was checked against raw page text by script.
