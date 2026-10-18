# P2-report: Peta interaktif + alternatif aksesibel

**Fase:** P2 Map | **Tanggal:** 2026-10-19 | **Oleh:** builder agent (Hermes)

## Selesai
- src/lib/graph.ts: pure builder (nodes/edges/zones dari content+layout). 5 unit test lulus.
- MapView (SVG, bukan React Flow): zona background + caption, node dengan acronym+nama+kind, scope eksternal diberi tag "di luar ICANN", edge per keluarga relasi dengan pattern garis beda + label teks.
- Family filter chips untuk 7 keluarga (default: policy, advice, accountability, implementation aktif).
- Selection: klik/Enter/Space pada node -> highlight neighborhood + panel terbuka + ?node= di URL. Esc menghapus seleksi. URL state bertahan reload (dipulihkan di mount).
- NodePanel: menampilkan entitas + koneksi.
- TreeView: kelompok per kind, satu kalimat, link ke profil.
- RelationsView: tabel From/Relationship/To/Explanation dengan filter keluarga dan entitas, header pakai scope.
- View switcher Map/Tree/Relations; default Tree di layar < 640px.
- aria-live region mengumumkan node terpilih. Semua node punya aria-label deskriptif dan tabindex.
- Static export: peta diekspor ke /id/map/ dan /en/map/.

## Verification
- tsc bersih. lint bersih. vitest 14/14 (termasuk 5 tes graph builder).
- Build lolos, out/id/map/ dan out/en/map/ ter-ekspor.
- e2e 4/4 (home ID/EN + label unofficial, toggle bahasa menjaga path+query, skip link keyboard, axe 0 serious/critical di home).

## Keputusan
- D-P2-01: SVG murni dipilih daripada React Flow (@xyflow/react): 17 node statis, kontrol penuh atas a11y, bundle jauh lebih kecil, tanpa zoom hijack. React Flow tetap di package.json bila nanti perlu interaksi kompleks.
- D-P2-02: URL state dibaca client-side setelah hydrate (static export tidak bisa baca searchParams di server).

## Belum terverifikasi
- Screenshot desktop+mobile+grayscale belum dibuat (butuh browser lokal; Playwright terpasang, tapi bukan bagian tes ini).
- Grayscale distinction test belum dibuat (visual check manual menyusul).
- Keyboard arrow-key navigation antar node belum; Tab sudah bekerja ke tiap node.

## Handoff notes untuk P3
- Komponen NodePanel bisa dipakai ulang di profil. KIND accents via CSS var --kind-*.
- URL state: ?node= &view= (popstate didukung).
