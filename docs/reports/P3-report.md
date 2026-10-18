# P3-report: Halaman konten

**Fase:** P3 Pages | **Tanggal:** 2026-10-19 | **Oleh:** builder agent (Hermes)

## Selesai
- Home: hero + 2 CTA, ICANN dalam 3 bagian, 3 kartu persona "mulai dari mana", chip kelompok populer, disclaimer terlihat.
- Organizations index: dikelompokkan per kind (SO, AC, Board&org, committees, affiliate, external) dengan kartu per entitas.
- Organization profile /organizations/[id]/: 17 profil statis via generateStaticParams. Bagian: one-liner, kenapa ada, apa yang dilakukan, contoh, cara ikut (bila ada), cara terhubung, istilah terkait, tautan resmi + last reviewed + report-an-error (prefill GitHub issue dengan page id).
- Setiap klaim punya penanda sumber sendiri (superscript dengan sourceId + verifiedAt via title attribute) yang link ke daftar sumber di About.
- Glossary: daftar istilah terurut A-Z, tiap istilah punya anchor id, definisi, kelompok terkait (chip).
- About & Sources: apa ini + TODO(Kiell) untuk cerita pribadi, metodologi, daftar 17 sumber dengan anchor #source-<id>, cara melapor.
- SEO: metadata per halaman (title, description, canonical, hreflang ID/EN). 48 halaman HTML ter-ekspor.

## Verification
- tsc bersih, lint bersih, vitest 14/14, build lolos, e2e 4/4 (axe clean di home).
- Profil ter-generate untuk 17 entitas x 2 locale (out/id/organizations/* dan out/en/organizations/).

## Keputusan
- D-P3-01: Source marker pakai format [sourceId] singkat dengan tooltip; daftar sumber lengkap ada di halaman About. Simpel dan tidak mengganggu baca.
- D-P3-02: Report-an-error link memakai template content-error.yml dengan prefilled title berisi path halaman.

## Belum terverifikasi
- Lighthouse lokal belum dijalankan (butuh Chrome terinstal; akan dijalankan di P5).
- Hover source marker menampilkan tooltip saja; popover kaya (locator+quote) menyusul di P5 ketika locator diisi penuh.
- A-Z jump bar di glossary belum; filter instan menyusul (butuh client component).

## Handoff notes untuk P4
- content/paths.json sudah ada 4 path dengan step links (entity/term/external).
- Pola URL profil: /organizations/[id]/ (trailingSlash). generateStaticParams wajib dijual.
