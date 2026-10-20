# Research notes (content pass of 2026-10-20)

What was checked, what was decided, and what is still open. Everything published passed `pnpm check:quotes` (553 quotes found verbatim in their sources) on 2026-10-20 (updated after pass 2).

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

## Resolved in research pass 2 (2026-10-20)

- **Board example** now leads with a literal Board resolution: Resolution 2026.05.03.14 (one-time US$1,000,000 IGF contribution), from the approved resolutions of the 3 May 2026 regular meeting (https://www.icann.org/en/board-activities-and-meetings/materials/approved-resolutions-regular-meeting-of-the-icann-board-03-05-2026-en). The press-release sentence on the Chair and Vice Chair stays as a second sentence.
- **GAC example** is now a formal piece of GAC Consensus Advice: 2023-03-20 IGO protections, delivered via the ICANN76 Cancun Communique, status "Consensus met" (https://gac.icann.org/advice/itemized/202303-20-igo-protections). The page is GAC's itemized-advice record that names the communique; the communique PDF itself was not quoted. The ICANN86 listing-page example was dropped (its source entry was removed because nothing cites it now).
- **.id example** added to the ccNSO entity, ID and EN, from the IANA Root Zone Database (https://www.iana.org/domains/root/db/id.html): category ccTLD, manager PANDI, related redelegation report dated 2013-05-24.
- **PTI Board size**: pti.icann.org renders only with JavaScript and the Bylaws (Sec. 16.2) do not state a number. An ICANN Board resolution of 13 December 2017 recites "the PTI Bylaws, at Section 5.2.1, authorizes the PTI Board to have five Directors" (https://www.icann.org/en/board-activities-and-meetings/materials/approved-resolutions-special-meeting-of-the-icann-board-13-12-2017-en). Added to PTI whoIsIn, worded as that resolution's statement. Still open: confirm against the current PTI Bylaws, since the 2017 text may have been amended (Bylaws 16.2 requires EC approval for changes to the PTI Board size, so a change is unlikely).
- **Perishable facts re-checked** against live pages on 2026-10-20, no change needed: CEO (Kurtis Lindqvist, CEO Corner page), GAC counts (185 Members, 41 Observers), NomCom 2026 timeline (no 2027 timeline published yet), APRALO leadership (Choudhury; Ignacio and Jana as Vice-Chairs; Chew, Babu, Siddiqui in ALAC), Fellowship (21+) and NextGen (18 to 30) eligibility. All matching quotes still pass the quote check.

## Open questions (good next research tasks)

- **Empowered Community example** cites correspondence titles, not the letters themselves. The Board's approval date in July 2026 is inferred from letter dates. Not attempted this pass.
- **ccNSO membership count**: only the 2021 figure (172 members) is citable. No newer count found on icann.org/ccnso pages.
- **Indonesia**: GAC member list includes Indonesia (member/observer label is filtered by JavaScript on the page). APNIC lists APJII as Indonesia's NIR. No Indonesian At-Large Structure was found on the At-Large site.
- **Perishable facts** to re-check each cycle: the current CEO, NomCom application window (next cycle not yet published), GAC member/observer counts, APRALO figures and leadership (the `ralos` example), Fellowship/NextGen eligibility.

## Method

The Bylaws were read from the full page text ("As amended 3 July 2026"). Web-fetch summaries proved unreliable for exact wording (one gave ALAC as "5 per RALO + 2 NomCom"; the Bylaws say 2 per RALO + 5 NomCom), so every quote was checked against raw page text by script.
