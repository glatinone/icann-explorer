# P4-report: Learning paths + search

**Fase:** P4 Paths + Search | **Tanggal:** 2026-10-19 | **Oleh:** builder agent (Hermes)

## Selesai
- /paths/: 4 kartu (urutan Beginner, Get Involved, Policy, Technical) dengan jumlah langkah.
- /paths/[id]/: stepper (satu langkah per layar) dengan progress bar angka + anchor #step-N, Prev/Next, progress disimpan ke localStorage (dengan try/catch), selesai = pesan akhir.
- Step links: entity -> profil, term -> glossary anchor. Semua klaim faktual di body punya sitasi di paths.json.
- Self-check di path beginner: pertanyaan pilihan ganda dengan feedback instan + penjelasan.
- Search: MiniSearch index dibangun di browser (lazy saat dialog pertama dibuka). Dialog dibuka dari header button atau Ctrl/Cmd+K. Hasil: entitas, istilah, path. Enter menuju hasil teratas. Escape menutup.
- 11 tes pencarian: 10 query wajib dari spek + 1 tes rank pertama untuk akronim. Semua lulus.
- Rekomendasi empty state: GNSO, ALAC, gTLD, PDP, Fellowship.

## Verification
- lint bersih, tsc bersih, vitest 25/25 (4 file: i18n, validate-content, graph, search).
- Build lolos. 4 path x 2 locale diekspor (out/id/paths/beginner, dst).
- e2e 4/4 (home, toggle, keyboard, axe).

## Keputusan
- D-P4-01: MiniSearch index dibangun di browser dari content JSON (dataset kecil, < 150 KB total). Tidak perlu file index statis terpisah.
- D-P4-02: Query bahasa Indonesia mengenai entitas yang benar dengan memperkaya field name di entities.json (mis. ALAC = "pengguna internet").

## Belum terverifikasi
- Uji keyboard end-to-end di path beginner (dilakukan di P5).
- Print stylesheet untuk 30-day roadmap (get-involved) menyusul di P5/peluncuran.

## Handoff notes untuk P5
- Search index: buildSearchIndex(locale) di src/lib/search.ts. Query uji di tests/unit/search.test.ts.
- Semua halaman: home, organizations+profile, glossary, paths+detail, map (Map/Tree/Relations), about.
