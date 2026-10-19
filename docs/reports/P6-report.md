# P6 Report: Preview → user test → release gate → public launch

**Fase:** P6 Launch | **Tanggal:** 2026-10-19 | **Oleh:** Hermes (sesi lanjutan setelah P5)
**Status:** PART A selesai (persiapan repo). Preview deploy, user test, dan release gate menunggu pemilik (Kiell).

---

## Part A — Persiapan (SELESAI, terverifikasi)

| # | Item | Status | Verifikasi |
| --- | --- | --- | --- |
| 1 | README publik baru; README orkestrasi dipindah ke `docs/plan/ORCHESTRATION.md` | selesai | `git status` menunjukkan rename README → ORCHESTRATION + README baru |
| 2 | `CONTRIBUTING.md` (cara koreksi konten + sitasi + review) | selesai | file ada |
| 3 | 5 template issue GitHub (content-error, relationship-error, translation-issue, accessibility-issue, bug) + config.yml | selesai | `.github/ISSUE_TEMPLATE/*.yml` ada; footer "Report an error" sudah menunjuk `content-error.yml` (sudah sejak P5) |
| 4 | `LICENSE` (kode MIT + konten CC BY 4.0, `TODO(Kiell)` konfirmasi) | selesai | file ada; TODO(Kiell) tercantum |
| 5 | Footer: `Last content review: <latest verifiedAt>` (2026-10-18) otomatis dari data + link GitHub + Report an error | selesai | `SiteFooter.tsx` memakai `latestReviewDate()`; tanggal keluar dari data, bukan hardcode |
| 6 | Link feedback dari satu konstanta config | selesai | `feedbackUrl` di `src/i18n/config.ts` (TODO(Kiell): set URL final) |
| 7 | OG image 1200×630 kedua locale | selesai | `public/og/og-id.png` + `og-en.png` digenerate `scripts/gen-og.mjs`, terdaftar di `docs/ASSETS.md` |
| 8 | Weekly GitHub Action `check:links` (buka issue otomatis kalau ada broken) | selesai | `.github/workflows/link-check.yml` ada |

## Hasil verifikasi build & test (Part A)

- `pnpm lint`: 0 errors, 0 warnings
- `pnpm typecheck`: bersih
- `pnpm test`: 25 tests lulus (4 file)
- `pnpm build`: sukses, static export ke `out/`
- `pnpm check:links`: 0 broken local links
- `pnpm test:e2e`: 11 passed (includes axe 0 serious/critical, disclaimer di semua route, language toggle)

## R1–R10 checklist (status per 2026-10-19)

| # | Kriteria | Status | Bukti |
| --- | --- | --- | --- |
| R1 | Fakta 0 unsupported, setiap klaim bersitasi + `verifiedAt` | PARTIAL | P5 fakt audit 0 unsupported; validator jalan di prebuild; `locator` klaim masih sebagian (dari P5-report) |
| R2 | Relasi tanpa pelanggaran rule; owner review tabel relasi | PARTIAL | validator 0 pelanggaran; owner sign-off belum |
| R3 | Paritas ID/EN 100%; `translation.reviewed`; reviewer native baca 5 halaman ID | PARTIAL | unit test parity ada; review native belum |
| R4 | Aksesibilitas: axe 0 serious/critical, keyboard-only run | OK | e2e axe clean; keyboard e2e lulus |
| R5 | `check:links` 0 broken | OK | 0 broken (Part A re-verified) |
| R6 | Lisensi semua aset di ASSETS.md; kode + konten license set | PARTIAL | ASSETS.md lengkap; LICENSE dibuat; `TODO(Kiell)` konfirmasi CC BY |
| R7 | Label + disclaimer tiap halaman, kedua locale, tanpa imitasi logo | OK | e2e verifikasi; tanpa logo |
| R8 | Security headers di preview URL, tanpa secret, `pnpm audit` bersih, tanpa tracker | PARTIAL | vercel.json headers ada; `pnpm audit` belum dijalankan ulang, preview belum ada |
| R9 | Uji ≥ 5 pemula di preview | NOT STARTED | `docs/reports/user-test.md` template siap |
| R10 | Lighthouse di preview URL | NOT STARTED | butuh preview URL |

## Yang menunggu Kiell (owner)

1. **(OWNER)** Connect Vercel + deploy preview `noindex` (Part B).
2. Jalankan `docs/plan/05-user-test.md` dengan ≥ 5 pemula di URL preview (Part C), isi `docs/reports/user-test.md`.
3. Konfirmasi `TODO(Kiell)`: lisensi konten CC BY 4.0 + URL feedback (`feedbackUrl` di config).
4. Setelah R1–R10 semua ✓: sign-off → hapus `noindex`, promote production (Part D).

## Deviations

- Tidak ada deviasi dari `docs/plan/phases/P6-launch.md`.

## Unverified

- Lighthouse belum dijalankan (butuh preview URL).
- `pnpm audit` (high/critical) belum dicek ulang di sesi ini — cepat, bisa saya eksekusi kalau diminta.
- Template issue GitHub belum diverifikasi render-nya di GitHub (harus dengan remote).

## Handoff notes

- OG image: kalau copy diubah, jalankan `node scripts/gen-og.mjs` (Playwright render) untuk regenerate.
- `latestReviewDate()` membaca `verifiedAt` dari semua klaim; footer otomatis ikut tanggal terbaru.
- Semua tugas Part A sudah komit di branch `phase/P6-launch`; belum di-push.
