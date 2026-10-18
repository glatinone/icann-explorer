# 04: Gate review (checklist untuk Kiell)

Pakai ini setelah agent menulis `docs/reports/Px-report.md`. Waktu cek per gate: 10–20 menit (P1 dan P6 lebih lama).
Kalau ada yang gagal, tempel poinnya ke agent: *"Gate Px gagal di poin berikut: … Perbaiki di branch yang sama, update report-nya, lalu STOP."*

## Selalu (setiap fase)
- [ ] Report memuat **tiga hal wajib**: (1) apa yang selesai, (2) keputusan yang dibuat, (3) apa yang belum terverifikasi.
- [ ] Keputusan baru juga tercatat di `docs/decisions.md`. Tidak ada keputusan lama yang dibatalkan diam-diam.
- [ ] Semua acceptance criteria dicentang dengan **cara verifikasinya**, bukan cuma "done".
- [ ] `pnpm build` lolos di mesinmu sendiri (jangan cuma percaya report).
- [ ] Bagian "Deviations" dan "Unverified" sudah kamu baca. Deviasi yang tidak kamu setujui → minta di-revert.
- [ ] Tidak ada fitur di luar scope (cek `git diff --stat main`).
- [ ] Ada "Handoff notes" yang cukup jelas untuk agent fase berikutnya.

## P0: Setup
- [ ] `pnpm dev`, buka `/id/organizations/?x=1`, klik toggle, lalu cek hasilnya `/en/organizations/?x=1`.
- [ ] Label "Proyek edukasi independen dan tidak resmi" terlihat di header, juga di HP.
- [ ] Validator menolak contoh yang salah: SO `reports-to` Board, entitas eksternal `part-of` ICANN, dan fakta tanpa sumber Tier 1–3 (lihat output test-nya).
- [ ] `docs/decisions.md` berisi 7 keputusan owner. `docs/ASSETS.md` sudah ada.
- [ ] Repo publik sudah kamu buat dan tidak ada rahasia di dalamnya.

## P1: Konten (gate paling penting, jangan buru-buru)
- [ ] Ambil 10 klaim dari daftar spot-check, buka sumber dan locator-nya, lalu pastikan kutipannya benar-benar ada.
- [ ] Baca **tabel keputusan relasi**. Apakah ada relasi yang "naik pangkat" tanpa sumber kuat? Yang di-downgrade wajar?
- [ ] Cek 4 hal yang paling sering salah:
  1. Komposisi Board (jumlah voting director, siapa memilih berapa, liaison), dengan pasal Bylaws.
  2. GAC: **memberi nasihat**, bukan memutuskan. Prosedur khusus kalau Board tidak mengikuti nasihat GAC punya sumber.
  3. Tidak ada SO/AC yang `reports-to` siapa pun.
  4. RIR / IETF / root server operators ditandai **di luar** ICANN.
- [ ] Tidak ada fakta yang hanya bersumber Wikipedia, blog, atau jawaban AI.
- [ ] Baca 3 profil versi Indonesia (GNSO, ALAC, ASO): natural? Istilahnya konsisten dengan daftar istilah di `decisions.md`?
- [ ] Daftar "Unverified" masuk akal dan tidak diam-diam dimasukkan ke konten.

## P2: Peta
- [ ] Tunjukkan peta ke 1 orang awam selama 60 detik tanpa penjelasan. Tanya: "Siapa yang bikin kebijakan domain .com dkk?", "Siapa yang mewakili pengguna internet biasa?", dan **"Apakah ALAC atasan atau bawahan Board?"** (jawaban yang benar: bukan keduanya, ALAC memberi nasihat).
- [ ] Lihat screenshot grayscale. Apakah garis nasihat, kebijakan, dan akuntabilitas tetap bisa dibedakan?
- [ ] Coba view **Tree** dan **Relations**. Datanya sama dengan peta? Bisa dipakai tanpa mouse?
- [ ] Coba di HP sungguhan.
- [ ] Pilih node → ganti bahasa → node masih terpilih.

## P3: Halaman
- [ ] Profil GNSO dan ALAC di HP: 8 bagian lengkap. **Setiap klaim** punya penanda sumbernya sendiri, bukan cuma daftar di bawah.
- [ ] Hover atau tap penanda sumber: muncul locator, tanggal verifikasi, dan kutipan.
- [ ] Tulis paragraf "Kenapa proyek ini ada" di halaman About (placeholder `TODO(Kiell)`). Ini suara kamu, bukan suara agent.
- [ ] Coba 3 istilah glosarium acak, lalu cek apakah relasinya nyambung ke kelompok yang benar.

## P4: Paths + search
- [ ] Jalani path **Get Involved** sampai habis. Sebagai alumni Fellowship, apakah kamu setuju dengan urutannya? Ada yang kurang?
- [ ] Ctrl+K, ketik "pengguna internet", lalu cek apakah ALAC muncul.
- [ ] Print roadmap 30 hari, lalu cek apakah muat di 1 halaman.

## P5: QA independen
- [ ] Report berakhir dengan **Go to preview**. Tidak ada blocker yang masih open.
- [ ] Fact-audit: 0 unsupported. Relationship-audit: tidak ada catatan "terbaca sebagai hierarki" yang belum diperbaiki.
- [ ] Tabel status R1–R8 dan R10: semua ✓, atau ada rencana jelas sebelum P6.

## P6: Preview → uji pengguna → rilis
- [ ] Preview deploy pakai `noindex`. Uji **≥ 5 pemula** di URL preview (`05-user-test.md`).
- [ ] Masalah yang muncul di ≥ 2 peserta sudah diperbaiki.
- [ ] Putuskan lisensi dan URL feedback (placeholder `TODO(Kiell)`). Cek `docs/ASSETS.md` lengkap.
- [ ] `curl -sI <preview-url>` menunjukkan security headers.
- [ ] **R1–R10 semua ✓ dengan bukti.** Baru setelah itu kamu promote ke production.
- [ ] Buka URL produksi di HP. Klik "Report an error", lalu cek apakah issue ter-prefill.
