# P6 Report: Preview → user test → release gate → public launch

**Fase:** P6 Launch | **Tanggal:** 2026-10-19 | **Oleh:** Hermes
**Status:** Part A dan Part B (preview deploy) selesai dan terverifikasi live. Part C (user test) dan Part D (production) menunggu Kiell.

**Preview URL:** https://icann-explorer-71asue4ra-securepe8alt-1967s-projects.vercel.app
**Vercel project:** securepe8alt-1967s-projects/icann-explorer (prj_Dy3aDkrAaTbkZDEiHIF9ldqt5W9r)
**GitHub:** terhubung ke https://github.com/glatinone/icann-explorer

---

## Part A - Persiapan (SELESAI, terverifikasi)

| # | Item | Status | Verifikasi |
| --- | --- | --- | --- |
| 1 | README publik baru; README orkestrasi dipindah ke docs/plan/ORCHESTRATION.md | selesai | rename + README baru |
| 2 | CONTRIBUTING.md (koreksi konten + sitasi + review) | selesai | file ada |
| 3 | 5 template issue GitHub + config.yml | selesai | .github/ISSUE_TEMPLATE/*.yml |
| 4 | LICENSE (kode MIT + konten CC BY 4.0, TODO(Kiell)) | selesai | file ada |
| 5 | Footer "Last content review: 2026-10-18" otomatis dari data | selesai | latestReviewDate() di SiteFooter.tsx |
| 6 | Link feedback dari satu konstanta config | selesai | feedbackUrl di src/i18n/config.ts |
| 7 | OG image 1200x630 kedua locale | selesai | public/og/og-{id,en}.png, terdaftar di ASSETS.md |
| 8 | Weekly GitHub Action check:links | selesai | .github/workflows/link-check.yml |

## Part B - Preview deploy (SELESAI, live)

- Vercel project dibuat dan terhubung ke repo GitHub.
- Deploy protection (SSO) dimatikan untuk preview supaya bisa diuji publik dan dipakai user test.
- noindex hanya berlaku di host *.vercel.app (vercel.json dengan has: host), jadi production nanti otomatis indexable tanpa edit config.
- Security headers live: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Robots-Tag noindex.
- Rute live dicek 200: /, /id/, /en/, /id/map/, /en/map/, /id/organizations/, /id/organizations/gnso/, /en/organizations/gnso/, /id/paths/get-involved/, /id/about/, /en/about/, /og/og-id.png, /og/og-en.png, /icon.svg.
- Playwright smoke + QA + axe dijalankan terhadap URL preview: 11/11 passed.

### Bug nyata yang ditemukan karena deploy (semua sudah diperbaiki)

1. Favicon 404 di semua halaman, menyebabkan console error dan best-practices turun. Ditambah public/icon.svg dan icons di metadata.
2. role="tablist" dipakai untuk deretan link di halaman peta, axe gagal aria-required-children (a11y 95). Diganti nav aria-label, sekarang a11y 100.
3. X-Robots-Tag noindex global akan ikut menimpa production. Sekarang scoped ke host *.vercel.app.
4. vercel.json header pattern "/.*" invalid di Vercel, deploy gagal. Diganti /(.*).
5. postcss 8.4.31 (2 high + 2 moderate advisory) dari next dioverride ke >=8.5.23 di pnpm-workspace.yaml karena pnpm v12 mengabaikan field pnpm di package.json. Sekarang pnpm audit --prod: 0 known vulnerabilities.

## Hasil verifikasi build dan test

| Cek | Hasil |
| --- | --- |
| pnpm lint | 0 error, 0 warning |
| pnpm typecheck | bersih |
| pnpm test | 25 tests lulus |
| pnpm build | sukses |
| pnpm check:links | 0 broken |
| pnpm audit --prod | 0 known vulnerabilities |
| pnpm test:e2e (lokal) | 11 passed |
| pnpm test:e2e (preview URL) | 11 passed |

## Lighthouse (desktop, preview URL)

| Halaman | Perf | A11y | Best practices |
| --- | --- | --- | --- |
| /id/ | 99 | 100 | 100 |
| /en/ | 100 | 100 | 96 lalu 100 setelah fix favicon |
| /id/map/ | 100 | 100 | 100 |
| /id/organizations/gnso/ | 100 | 100 | 96 lalu 100 setelah fix favicon |
| /id/paths/get-involved/ | 100 | 100 | 96 lalu 100 setelah fix favicon |

SEO sengaja 63 karena noindex di preview, sesuai rencana. Perlu diukur ulang di production.

## Checklist R1-R10 (status per 2026-10-19)

| # | Kriteria | Status | Bukti |
| --- | --- | --- | --- |
| R1 | Fakta 0 unsupported, tiap klaim bersitasi + verifiedAt | PARTIAL | P5 audit 0 unsupported; validator jalan di prebuild; sebagian klaim belum punya locator |
| R2 | Relasi tanpa pelanggaran; owner review tabel relasi | PARTIAL | validator 0 pelanggaran; sign-off owner belum |
| R3 | Paritas ID/EN 100%; reviewer native baca 5 halaman | PARTIAL | unit parity ada; review native belum |
| R4 | Aksesibilitas axe 0 serious/critical, keyboard-only | OK | axe clean di 11 e2e, Lighthouse a11y 100 |
| R5 | check:links 0 broken | OK | 0 broken |
| R6 | Lisensi aset lengkap | PARTIAL | ASSETS.md + LICENSE ada; TODO(Kiell) konfirmasi CC BY |
| R7 | Label dan disclaimer tiap halaman, tanpa imitasi logo | OK | e2e verifikasi kedua locale |
| R8 | Security headers, tanpa secret, audit bersih, tanpa tracker | OK untuk preview | headers live terverifikasi; audit 0 vulns; tidak ada tracker |
| R9 | Uji minimal 5 pemula di preview | NOT STARTED | docs/reports/user-test.md siap; URL preview siap |
| R10 | Lighthouse di preview | OK untuk preview | tabel di atas |

## Yang menunggu Kiell

1. Jalankan docs/plan/05-user-test.md dengan minimal 5 pemula di URL preview, isi docs/reports/user-test.md (R9).
2. Konfirmasi dua TODO(Kiell): lisensi konten CC BY 4.0 dan URL feedback final.
3. Setelah user test selesai dan R1/R2/R3 ditutup: sign-off R1-R10, lalu vercel deploy --prod dan set NEXT_PUBLIC_SITE_URL ke domain produksi (canonical masih fallback ke github.io sampai di-set).

## Deviations

- Step 9 di rencana bertanda (OWNER), dieksekusi atas instruksi Kiell ("bisa deploy sendiri nanti aku approve"). Login Vercel memakai akun securepe8alt-1967 lewat device flow yang di-approve owner.

## Unverified

- Canonical di preview masih https://glatinone.github.io/icann-explorer/... karena NEXT_PUBLIC_SITE_URL belum di-set; perlu di-set sebelum production.
- Template issue GitHub belum dicek render di web GitHub.
- Lighthouse desktop saja; mobile belum dijalankan.

## Handoff notes

- Regenerate OG: node scripts/gen-og.mjs.
- Build + deploy: vercel build --yes --target preview lalu vercel deploy --prebuilt --yes. Vercel butuh pnpm di PATH; shim ada di ~/.npm-global/pnpm.cmd.
- latestReviewDate() otomatis ikut tanggal verifiedAt terbaru.
- Semua perubahan ada di branch phase/P6-launch, belum di-push ke GitHub.
