# Keputusan (append-only log)

Aturan: satu baris per keputusan. Format: ID | tanggal | keputusan | alasan | oleh.
Jangan mengubah entri lama; tambahkan entri baru di bawah.

## Keputusan owner (seeded dari P0)

| ID | Tanggal | Keputusan | Alasan | Oleh |
| --- | --- | --- | --- | --- |
| D-OWNER-01 | 2026-10-18 | Nama "ICANN Explorer", dipakai deskriptif, selalu dengan label "Independent, unofficial educational project". Tanpa logo/desain yang menyerupai situs resmi, tanpa domain yang terkesan resmi | merek & kepercayaan | owner |
| D-OWNER-02 | 2026-10-18 | Hosting MVP sebagai situs statis di Vercel | tidak butuh backend | owner |
| D-OWNER-03 | 2026-10-18 | Repository publik sejak hari pertama (tidak boleh ada rahasia atau info sensitif) | transparansi + koreksi komunitas | owner |
| D-OWNER-04 | 2026-10-18 | Setiap klaim penting punya sitasinya sendiri, tanggal verifikasi, dan dua bahasa | akurasi | owner |
| D-OWNER-05 | 2026-10-18 | Peta dimodelkan per jenis relasi, bukan sebagai satu hierarki | menghindari misrepresentasi ICANN | owner |
| D-OWNER-06 | 2026-10-18 | Satu fase per sesi agent, dengan report + review gate | kontrol kualitas | owner |
| D-OWNER-07 | 2026-10-18 | Tidak ada rilis publik sebelum audit fakta, aksesibilitas, bilingual lolos, dan kriteria rilis R1-R10 terpenuhi | disiplin rilis | owner |

## Keputusan agent/builder

| ID | Tanggal | Keputusan | Alasan | Oleh |
| --- | --- | --- | --- | --- |
| D-P0-01 | 2026-10-18 | Bahasa default = id, EN = bahasa kedua. Toggle mengganti segmen locale dan mempertahankan path, query, hash | prioritas audiens Indonesia; bahasa terpisah dari identitas | builder |
| D-P0-02 | 2026-10-18 | Stack: Next.js 15 (App Router, static export) + pnpm + Tailwind-style CSS variables (tanpa framework CSS) + React Flow (@xyflow/react) + zod | statis, tanpa backend, deploys ke Vercel; Tailwind diganti CSS variables murni biar kontrol penuh dan kecil | builder |
| D-P0-03 | 2026-10-18 | Router: app dir dengan [locale] segment; konten data di content/*.json divalidasi oleh validator | static export Vercel friendly | builder |
| D-P0-04 | 2026-10-18 | Terminologi Indonesia mengikuti keputusan owner: policy=kebijakan, advice=nasihat, dsb (lihat README plan methods P1) | konsistensi istilah | builder |

| D-P1-01 | 2026-10-18 | part-of diizinkan untuk icann-affiliate -> icann-internal (PTI bagian struktur ICANN) | fakta struktural Bylaws | builder |
| D-P1-02 | 2026-10-18 | related-to diizinkan external -> icann-affiliate (IETF <-> IANA functions) | hubungan teknis nyata | builder |
| D-P1-03 | 2026-10-18 | locator per klaim masih kosong di P1; diisi penuh di P5 audit | P1 fokus struktur + bahasa | builder |
