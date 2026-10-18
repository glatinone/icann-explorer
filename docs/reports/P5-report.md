# P5-report: QA & audit

**Fase:** P5 QA | **Tanggal:** 2026-10-19 | **Oleh:** QA agent (Hermes, sesi lanjutan)

## Temuan & perbaikan
| # | Severity | Area | Temuan | Status |
| --- | --- | --- | --- | --- |
| F1 | blocker | Map URL state | Klik node tidak menulis ?node= ke URL (useEffect hilang saat refactor) | FIXED: dua useEffect untuk node & view, popstate tetap didukung. e2e membuktikan URL node=gnso bertahan lewat toggle bahasa |
| F2 | blocker | Search | Enter di dialog tidak menavigasi ke hasil teratas | FIXED: handler Enter -> results[0].url |
| F3 | major | Disclaimer | Halaman selain home hanya punya 1 kemunculan label unofficial (header) | FIXED: strip disclaimer di atas footer pada layout global, tampil di semua halaman 2 locale |
| F4 | minor | CSS | Style peta/search/paths awalnya belum lengkap | DITAMBAH: seluruh CSS komponen (map, panel, tree, relations, search, paths, self-check) |

## Audit
1. **Fact audit**: 17 entitas x ~6 klaim = 100+ klaim. Semua punya citation + verifiedAt 2026-10-18. Catatan: `locator` masih level sumber, bukan pasal (tercatat di P1-report Unverified; butuh pass Bylaws per pasal sebelum R1 penuh).
2. **Relationship audit**: 25 relasi. 0 pelanggaran aturan modeling (validator + 6 fixture negatif). Tidak ada SO/AC reports-to; tidak ada eksternal part-of ICANN; nasihat = "advises".
3. **Provenance**: semua klaim punya citation + verifiedAt. Stale check: semua 2026-10-18 (baru).
4. **Bilingual**: paritas ID/EN dijaga oleh unit test (2 tes); e2e memverifikasi label+disclaimer di 8 route x 2 locale. Rute /id dan /en identik (build menghasilkan pasangan untuk tiap halaman).
5. **Accessibility**: axe 0 serious/critical di home; label unofficial + disclaimer di semua route; skip link bekerja; panel bisa ditutup keyboard (Escape) - tombol close 44x44.
6. **Performance**: build First Load JS ~103 kB shared (di bawah target 200 kB). Lighthouse lokal belum dijalankan (butuh Chrome; dijalankan otomatis di preview deploy P6).
7. **Links**: check:links 0 broken (semua tautan internal resolve setelah P3/P4).
8. **Licenses**: hanya system font; tanpa icon/font eksternal. ASSETS.md lengkap untuk P0-P4.
9. **Brand**: tidak ada logo/branding ICANN; label unofficial + disclaimer di setiap halaman (2 lokasi), kedua bahasa.
10. **Security**: vercel.json headers (X-Frame-Options DENY, nosniff, Referrer-Policy, X-Robots-Tag noindex). Repo publik tanpa secret (tidak ada .env). External links pakai rel="noopener noreferrer".
11. **Code health**: lint 0 warning, tsc bersih, 25 unit test + 11 e2e lulus.

## R1-R8, R10 status
| Kriteria | Status | Bukti |
| --- | --- | --- |
| R1 Fakta | PARSIAL | struktur + validator OK; locator per klaim masih harus dilengkapi (butuh riset lanjutan) |
| R2 Relasi | OK | validator 0 pelanggaran; tabel relasi menunggu review owner |
| R3 Bilingual | OK (stratektural) | paritas kunci teruji; review native menyusul |
| R4 Aksesibilitas | OK | axe clean, skip link, label aria, Tree/Relations |
| R5 Links | OK | check:links 0 broken |
| R6 Lisensi | OK | ASSETS.md + LICENSE (P6) |
| R7 Disclaimer | OK | label + disclaimer semua halaman, kedua bahasa |
| R8 Security | OK (config) | headers di vercel.json; pnpm audit jalan di CI |
| R10 Performance | OK indikatif | 103 kB shared JS; Lighthouse formal di preview |

## Kesimpulan: **Go to preview** dengan catatan: locator klaim + uji 5 pengguna masih wajib sebelum R1/R9 penuh.
