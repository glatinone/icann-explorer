# ICANN Explorer: paket orkestrasi

Folder ini adalah **repo calon website** sekaligus **paket instruksi untuk AI agent builder**.
Kamu (Kiell) = product owner. Aku (Claude) = orchestrator yang menulis plan.
Agent (Claude Code / Codex / Cursor / dll) = eksekutor.

Website-nya: peta interaktif bilingual (ID/EN) untuk outsider yang mau paham ekosistem ICANN
dan tahu jalur untuk mulai ikut terlibat. Ini proyek edukasi publik yang **tidak resmi** dan tidak terafiliasi dengan ICANN.

---

## Isi paket

| File | Untuk siapa | Fungsi |
| --- | --- | --- |
| `AGENTS.md` | Agent (dibaca otomatis tiap sesi) | Aturan tetap: stack, konvensi, aturan akurasi, definition of done |
| `CLAUDE.md` | Claude Code | Pointer ke `AGENTS.md` |
| `docs/plan/00-brief.md` | Kamu + agent | Visi, scope MVP, non-goals, metrik sukses |
| `docs/plan/01-architecture.md` | Agent | Stack, struktur folder, skema data, routing i18n, desain peta |
| `docs/plan/02-content-spec.md` | Agent konten | Daftar node, relasi, glosarium awal, learning paths, sumber resmi |
| `docs/plan/03-phases.md` | Kamu | Ringkasan 7 fase, timeline, gate review |
| `docs/plan/phases/P0..P6-*.md` | Agent | **Prompt siap tempel**, satu per fase |
| `docs/plan/04-review-gates.md` | Kamu | Checklist yang kamu cek sebelum lanjut ke fase berikutnya |
| `docs/plan/05-user-test.md` | Kamu | Skrip uji coba dengan 5–10 pemula |

---

## Cara menjalankan (alur boss → agent)

1. Buka terminal di folder `icann-explorer/` lalu jalankan agent di sana.
2. Untuk tiap fase, tempel isi file `docs/plan/phases/Px-*.md` sebagai prompt.
   Satu fase = satu sesi agent. Jangan gabung fase.
3. Agent selesai → dia menulis `docs/reports/Px-report.md`, lalu **berhenti**.
4. Kamu cek pakai `docs/plan/04-review-gates.md`. Lolos → lanjut ke fase berikutnya. Tidak lolos → tempel temuanmu, minta agent memperbaiki di fase yang sama.
5. Kalau mau second opinion, bawa report-nya ke aku dan aku review sebagai orchestrator.

Urutan fase:

```
P0 Setup ─► P1 Content & data ─► P2 Peta interaktif ─► P3 Halaman ─► P4 Paths + search ─► P5 QA ─► P6 Launch
             (agent riset)        (agent builder)                                         (agent reviewer)
```

P1 sebaiknya dikerjakan agent dengan akses web (untuk verifikasi sumber).
P5 sebaiknya dikerjakan **sesi agent yang berbeda** dari builder supaya review-nya benar-benar independen.

---

## Keputusan product owner (sudah final, 2026-10-18)

| Keputusan | Isi |
| --- | --- |
| Nama | `ICANN Explorer`, dipakai secara deskriptif, selalu dengan label **"Independent, unofficial educational project"**. Tanpa logo atau desain yang mengesankan situs resmi, dan tidak pakai domain yang terkesan resmi |
| Hosting | Vercel, situs statis |
| Repository | Publik sejak P0 (tidak boleh ada rahasia atau info sensitif) |
| Konten | Setiap klaim penting punya sumbernya sendiri, tanggal verifikasi, dan versi ID + EN |
| Arsitektur | Peta dimodelkan per jenis relasi, bukan satu hierarki |
| AI agents | Satu fase per sesi, dengan report (selesai · keputusan · belum terverifikasi) dan review gate |
| Rilis | Tidak rilis publik sebelum kriteria R1–R10 terpenuhi (fakta, aksesibilitas, bilingual, tautan, lisensi, disclaimer, keamanan dasar, uji pengguna) |

Semua keputusan ini di-seed ke `docs/decisions.md` di P0. Keputusan berikutnya dari agent ditambahkan ke log yang sama.

## Lima penguatan dari review owner (sudah masuk ke paket)
1. **Aturan pemodelan relasi**: 12 tipe relasi dalam 7 keluarga visual. Validator menolak SO/AC yang `reports-to` dan entitas eksternal yang `part-of` ICANN (`01-architecture.md`).
2. **Content provenance per klaim**: `Citation` berisi sumber + locator + kutipan + `verifiedAt`, dan urutan kepercayaan sumber Tier 1–4 (`AGENTS.md`).
3. **Bahasa terpisah dari identitas**: ID dan slug netral bahasa, sama di `/id` dan `/en`. Toggle mempertahankan path, query, dan hash.
4. **Aksesibilitas masuk MVP**: view Tree + Relations, navigasi keyboard, WCAG 2.2 AA.
5. **Kriteria rilis R1–R10**: P6 = preview `noindex` → uji pengguna → checklist → baru production (`00-brief.md`).
