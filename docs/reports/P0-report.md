# P0-report: Setup

**Fase:** P0 Setup | **Tanggal:** 2026-10-18 23:xx WIB | **Oleh:** builder agent (Hermes)

## Selesai
- Git repo (branch `main`) dengan `docs/plan` commit awal.
- Next.js 15 App Router static export (`output: "export"`, `trailingSlash: true`, images unoptimized).
- i18n: `src/i18n/{id,en}.json` + config + helper `t()`. Toggle mempertahankan path/query/hash.
- Base layout: skip link, header dengan label unofficial, nav, footer disclaimer, landmark (header/nav/main/footer).
- Stub route: /map, /organizations, /glossary, /paths, /about (ID & EN) + root redirect /id/.
- Theme: CSS variables light/dark, satu accent per entity kind, satu token per relationship family.
- Schema zod lengkap + registry relasi 7 keluarga + validator (`scripts/validate-content.ts`) dengan semua aturan dari spek.
- Fixtures negatif validator (vitest): SO reports-to Board, entitas eksternal part-of ICANN, fakta tanpa Tier 1-3, dll. Semua lolos.
- vercel.json dengan security headers.
- CI (GitHub Actions): lint → typecheck → test → build.
- docs/decisions.md (7 keputusan owner + keputusan builder), docs/ASSETS.md, docs/reports/.
- check:links script (awalnya kena bug regex, sudah diperbaiki).

## Verification (langkah konkret)
- `pnpm lint` → bersih (awalnya 6 warning, sudah dibersihkan).
- `pnpm typecheck` → bersih (awalnya error JSX), `pnpm test` → 9/9 lulus.
- `pnpm build` → lolos, `out/` berisi semua route untuk /id dan /en. Static export berhasil.
- Toggle test (e2e): `/id/organizations/?x=1#a` → href toggle `/en/organizations/?x=1#a`. UV manual juga cek di browser.
- Validator: `pnpm validate:content` masuk branch "empty content OK". Fixture negatif di vitest menolak SO reports-to Board dll.

## Keputusan (P0)
- D-P0-01: bahasa default id, EN kedua. 
- D-P0-02: stack Next.js 15 + CSS variables (bukan Tailwind) + React Flow + zod + MiniSearch.
- D-P0-03: routing App Router [locale]; data konten di content/*.json.

## Belum terverifikasi
- Playwright e2e belum dijalankan (browser belum diinstall). E2E smoke ditulis; tinggal `pnpm exec playwright install chromium` lalu `pnpm test:e2e`.
- Ci belum ~diuji~ di remote (baru config). Harus diuji pada push pertama.
- Pemetaan rute /id vs /en belum di-crawl penuh (anchor halaman).

## Deviations
- Tailwind tidak dipakai; pilih CSS variables manual. Sama dengan spec tapi cara render beda (spec menyebut Tailwind sebagai opsi default Next scaffold, config manual lebih kecil dan terkontrol).
- `check:links` jalan tapi 12 tautan internal ke halaman yang belum ada (P3/P4) dilaporkan. Ini bukan blocker P0, sudah dicatat.

## Handoff notes untuk P1
- Semua skema di `src/lib/schema.ts` final. Registry relasi + aturan di `src/lib/relationships.ts`.
- Validator: `pnpm validate:content`. Format konten mengikuti schema di atas.
- Branch saat ini `main`. Kiell bisa lanjut dari sini; kalau mau branch per fase, checkout `phase/P1-content` dulu.
- isi content/ masih kosong, itu normal (validator pass empty). target 17 entitas, ~40 istilah, 4 path, sources, layout.
