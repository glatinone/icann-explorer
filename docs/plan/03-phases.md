# 03: Roadmap fase (untuk Kiell)

Target: MVP live dalam ±4 minggu. Satu fase = satu sesi agent + satu gate review dari kamu.

| Fase | Nama | Agent | Estimasi | Output utama | Gate (kamu cek) |
| --- | --- | --- | --- | --- | --- |
| **P0** | Repo, aturan agent, skeleton | Builder | 0,5–1 hari | Repo publik, `decisions.md`, `ASSETS.md`, routing `/id` `/en`, validator (provenance + aturan relasi), CI, security headers | Toggle bahasa jalan, validator menolak contoh yang salah |
| **P1** | Riset & verifikasi konten | Researcher (butuh web) | 3–4 hari | `content/*.json` dengan sitasi per klaim, tabel keputusan relasi, daftar "Unverified" | **Gate terpenting:** spot-check 10 klaim + tabel relasi |
| **P2** | Peta + alternatif aksesibel | Builder | 2–3 hari | `/map` dengan zona, 7 keluarga relasi yang berbeda visualnya, panel, view Tree + Relations, URL state | Pemula paham peta dan tidak membacanya sebagai hierarki |
| **P3** | Halaman konten | Builder | 2–3 hari | Home, Organizations + profil, Glossary + term, About/Sources | Profil GNSO dan ALAC enak dibaca di HP |
| **P4** | Learning paths + search | Builder | 2 hari | 4 path (termasuk Get Involved), Ctrl+K search, self-check | Jalankan path Get Involved sampai selesai |
| **P5** | QA & audit independen | Reviewer (sesi baru) | 1–2 hari | Laporan a11y, Lighthouse, link check, audit fakta, paritas ID/EN, perbaikan | Semua blocker beres |
| **P6** | Preview → uji pengguna → rilis | Builder + kamu | 2–4 hari | Preview `noindex`, uji ≥ 5 pemula, perbaikan, checklist R1–R10, baru production | **R1–R10 semua ✓ dengan bukti** |

```
Minggu 1: P0 + P1        (fondasi + kebenaran konten)
Minggu 2: P2 + mulai P3  (peta = fitur inti)
Minggu 3: P3 + P4        (halaman, path, search)
Minggu 4: P5 + P6 (preview + uji pengguna + rilis)
```
Kalau uji pengguna menemukan masalah besar di peta, rilis mundur. Itu lebih baik daripada merilis peta yang menyesatkan.

## Kenapa urutannya begini
- **Konten dulu, UI belakangan.** Peta yang cantik tapi relasinya salah lebih berbahaya daripada tidak punya peta. P1 mengunci kebenaran data. Setelah itu fase UI tinggal merender data.
- **Peta sebelum halaman.** Peta adalah alasan produk ini ada. Kalau peta gagal di uji pemula, kita pivot lebih awal.
- **Reviewer terpisah di P5.** Agent yang membangun cenderung meluluskan hasil kerjanya sendiri.

## Paralelisasi (opsional, kalau mau lebih cepat)
- P1 (riset) dan P0 (setup) bisa jalan bersamaan di dua sesi, karena P1 hanya menulis ke `content/`, `scripts/validate-content.ts`, dan `src/lib/schema.ts`.
- Jangan jalankan P2 dan P3 paralel di repo yang sama tanpa worktree terpisah. Keduanya menyentuh layout dan komponen bersama.

## Setelah MVP (backlog, jangan dikerjakan dulu)
1. **Session guide per ICANN meeting**: "Kalau kamu tertarik X, ikuti sesi Y". Ini fitur pembeda untuk Fellows.
2. **Issue explorer**: satu isu (mis. DNS abuse, registration data) dipetakan lintas kelompok, lengkap dengan timeline.
3. Node tambahan: CSC, RZERC, ISOC, IGF, PANDI (.id), node RIR individual.
4. Konteks Indonesia: PANDI, ID-IGF, APRALO members dari Indonesia.
5. Quiz / sertifikat ringan, mode "cetak cheat sheet" PDF.
6. Kontribusi komunitas lewat PR + reviewer sukarelawan dari alumni Fellowship.
