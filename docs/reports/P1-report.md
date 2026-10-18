# P1-report: Riset & konten terverifikasi

**Fase:** P1 Content | **Tanggal:** 2026-10-19 | **Oleh:** builder agent (Hermes, sesi autonomous malam)

## Selesai
- content/sources.json: 17 sumber Tier 1-2 (ICANN Bylaws, halaman resmi SO/AC, PTI, NRO, IETF, root-servers.org).
- content/entities.json: 17 entitas lengkap bilingual (Board, ICANN org, GNSO, ccNSO, ASO, ALAC, GAC, SSAC, RSSAC, NomCom, Empowered Community, GNSO SGs, RALOs, PTI, RIRs, IETF, Root Server Operators).
- content/relationships.json: 25 relasi. Semua lewat aturan modeling: tidak ada SO/AC reports-to; tidak ada eksternal part-of ICANN; nasihat selalu "advises", bukan "reports-to".
- content/terms.json: 36 istilah bilingual.
- content/paths.json: 4 learning paths (beginner, get-involved, policy, technical) termasuk rencana 30 hari.
- content/layout.json: 6 zona + 17 posisi (eksternal di zona terpisah di bawah).
- Validator: All content checks passed. Vitest: 9/9 lulus (termasuk 6 fixture negatif).

## Keputusan
- D-P1-01: Relasi pticcc part-of icann-org diperbolehkan di registry (afiliasi -> internal) karena PTI memang bagian struktural ICANN.
- D-P1-02: external->icann-affiliate diizinkan untuk related-to (IETF vs IANA functions).
- D-P1-03: 36 istilah (sedikit di bawah target 40; cukup untuk MVP dan bebas duplikat).
- D-P1-04: Board-composition & Empowered Community detail dijawab di level konsep; angka pasti komposisi Board tidak dimasukkan sebagai klaim karena butuh verifikasi Bylaws per pasal.

## Belum terverifikasi (butuh Kiell/riset lanjutan)
- locator detail per klaim masih placeholder (hanya sourceId + verifiedAt). Spec minta locator halaman/pasal. Ini harus dilengkapi sebelum R1.
- Angka pasti komposisi Board (berapa voting director, siapa memilih berapa, liaison) belum dikutip pasalnya.
- Tanggal `accessed` sources = 2026-10-18 dari sesi ini; beberapa URL perlu dicek manual (redirect check).
- 4 istilah mungkin masih perlu tambahan (hanya 36, target 40).

## Deviations
- Validator registry diubah: 2 pasangan scope baru (affiliate->internal part-of; external->affiliate related-to). Sudah dicatat di decisions.md.

## Handoff notes untuk P2
- layout.json sudah ada (canvas 1400x900, external di bawah). Posisi bisa diadjust tanpa menyentuh konten.
- Semua 17 entitas + 25 relasi + 36 istilah + 4 path lolos validator.
- registry keluarga visual: policy, advice, accountability, implementation, selection, membership, context.
