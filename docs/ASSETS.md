# Daftar aset

Setiap font, ikon, dan gambar yang dipakai harus tercatat di sini dengan lisensi yang kompatibel.

| Aset | Sumber | Lisensi | Dipakai di |
| --- | --- | --- | --- |
| System font stack (ui-sans-serif, system-ui, Segoe UI, Roboto) | Sistem operasi | Publik (bundle OS) | Seluruh situs; tidak ada font custom yang di-download |
| React Flow (@xyflow/react) | npm | MIT | Peta interaktif (fase P2) |
| Ikon | Tidak ada ikon custom/font ikon; gunakan teks dan bentuk CSS | - | - |
| OG image `public/og/og-id.png`, `public/og/og-en.png` | Dibuat sendiri lewat `scripts/gen-og.mjs` (Playwright render) | Apache-2.0/MIT (kode repo), konten CC BY 4.0 | Metadata open graph /id dan /en (1200×630) |

Catatan: fase P0 tidak menambahkan font atau ikon eksternal. Semua aset baru wajib ditambahkan di sini sebelum dipakai di build.
