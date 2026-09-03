# Catatan migrasi App Router

## Sumber dan tujuan

- Sumber: `Night-Login/night-login-website-2024`, commit `cfd2e30cbfaa0568bb360dfbc3675cc874ed81b3`.
- Tujuan: `Night-Login/night-login-website`.
- Referensi struktur: Pionir 2026, `app/` di root dengan implementasi di `src/modules`, komponen bersama, styles, dan utils.
- Scope: pembaruan dependencies dan struktur. Tidak ada redesign, fitur bisnis baru, perubahan database, atau deployment. Hasil migrasi disusun dalam commit bertahap pada branch `main` untuk dipush langsung ke repo tujuan sesuai permintaan.

## Dependencies

| Paket             | Sumber | Hasil                          |
| ----------------- | ------ | ------------------------------ |
| Next.js           | 14.0.4 | 16.3.4                         |
| React / React DOM | 18     | 19.2.8                         |
| Tailwind CSS      | 3.3.x  | 4.3.3 + `@tailwindcss/postcss` |
| NextAuth          | 4.24.7 | 4.24.15                        |
| Axios             | 1.7.x  | 1.20.0                         |
| React Toastify    | 10     | 11.1.0                         |
| Swiper            | 11     | 14.2.0                         |
| TypeScript        | 5      | 5.9.3                          |
| ESLint            | 8      | 9.39.5, flat config            |

Lockfile `pnpm-lock.yaml` menyimpan resolusi tepat semua dependencies. AOS tetap 2.3.4 karena masih merupakan rilis stabil yang tersedia. `@react-oauth/google` dihapus karena tidak dipakai; Google OAuth sudah ditangani NextAuth. `@types/next-auth` dihapus karena NextAuth menyertakan tipe sendiri. Autoprefixer tidak dibutuhkan oleh pipeline Tailwind v4. `@types/aos` dipindah ke devDependencies.

NextAuth tetap pada v4 stabil yang peer dependencies-nya mendukung Next 16 dan React 19. TypeScript 5.9 dan ESLint 9 mengikuti kombinasi tooling yang kompatibel. Registry menandai ESLint 9 deprecated, tetapi `eslint-plugin-react` yang dipakai konfigurasi resmi Next belum mendeklarasikan dukungan ESLint 10. Tidak digunakan forced peer overrides; evaluasi ulang upgrade tooling saat plugin mendukungnya. Pemilihan ini tidak berarti semua paket adalah versi mayor tertinggi.

## Mapping route dan layout

| URL                                  | Lokasi App Router                                            |
| ------------------------------------ | ------------------------------------------------------------ |
| `/`                                  | `app/(public)/page.tsx`                                      |
| `/about`                             | `app/(public)/about/page.tsx`                                |
| `/projects`                          | `app/(public)/projects/page.tsx`, redirect ke `/coming-soon` |
| `/coming-soon`                       | `app/(public)/coming-soon/page.tsx`                          |
| `/talent-pool`                       | `app/(public)/talent-pool/page.tsx`                          |
| `/wallpapers`                        | `app/(public)/wallpapers/page.tsx`                           |
| `/requests/login`                    | `app/requests/login/page.tsx`                                |
| `/requests/register`                 | `app/requests/register/page.tsx`                             |
| `/requests/payment`                  | `app/requests/payment/page.tsx`                              |
| `/onboarding`                        | `app/onboarding/page.tsx`                                    |
| `/dashboard` dan empat subhalamannya | `app/dashboard/`                                             |
| `/api/auth/*`                        | `app/api/auth/[...nextauth]/route.ts`                        |

Root layout menggantikan `_app`/`_document`. Navbar hanya muncul pada grup publik; dashboard menggunakan nested layout yang tidak dibuat ulang pada setiap fitur. Metadata menggantikan `next/head`; `next/navigation` menggantikan `next/router`. Client boundary hanya ditambahkan untuk interaksi, hooks, Swiper, serta portal. Path impor aset lama yang melintasi `../` diperbaiki menggunakan alias `@public`.

## Kompatibilitas tampilan

- Seluruh 75 file `public/` disalin byte-for-byte dan diverifikasi SHA-256.
- Konten, logo, Poppins/Plus Jakarta Sans, warna merah `#D62340`, dan komposisi lama dipertahankan.
- Utility Tailwind dimigrasikan mengikuti v4; konfigurasi tema lama dimuat melalui `@config` agar token brand tetap berlaku. Default palette dan beberapa reset CSS v3 dipertahankan untuk mengurangi pergeseran tampilan.
- Navbar membaca `usePathname`; menu mobile ditutup saat route berubah.
- AOS diinisialisasi dari provider dan diperbarui setelah navigasi App Router. Animasi dinonaktifkan saat pengguna memilih reduced motion.
- Penyaringan Talent Pool dihitung dari data/filter, tanpa state duplikat di effect.

## Auth dan API

Kontrak login/register, OAuth, onboarding, dan transaksi tetap mengarah ke endpoint backend lama. Ini bukan migrasi backend.

- Proteksi dashboard memakai `proxy.ts` dan sesi JWT NextAuth yang diverifikasi.
- Setelah onboarding, `update()` menyegarkan klaim dari endpoint backend `/api/v1/onboarding/status`. Nilai role/status yang dikirim client tidak dipercaya. Ini mencegah loop dashboard–onboarding akibat klaim JWT yang kedaluwarsa.
- Token OAuth Google/GitHub tidak dipakai sebagai pengganti access token backend.
- Logging payload password dan kode verifikasi dari sumber dihapus; logging auth tidak mencetak request atau token.
- Fallback OAuth lama masih dapat membuat sesi NextAuth jika backend OAuth gagal, tetapi sesi itu tidak memiliki token backend. Backend dan OAuth wajib diuji sebelum produksi.
- Role, otorisasi data, validasi pembayaran, dan kontrol akses bisnis tetap harus ditegakkan backend, bukan hanya proxy atau UI.

## Verifikasi

- `pnpm install --frozen-lockfile`: instalasi dapat diulang dengan lockfile.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- `pnpm test`: 15 route lama, 75 checksum aset, larangan impor Pages Router, kontrak auth, dan layout dashboard.
- `pnpm test:integration`: render halaman publik, redirect Projects, proteksi lima route dashboard, login benar/salah, pembaruan onboarding berbasis backend, penolakan perubahan role dari client, dan logout.
- `pnpm audit`: audit aplikasi dan tooling. Hasil pada pengerjaan migrasi: tidak ada kerentanan yang dikenal.
- Pemeriksaan browser: homepage desktop dibandingkan dengan deployment lama, render homepage di frame 390 × 844, navigasi publik, pencarian/filter Talent Pool, modal profil dan tab, serta form auth. Beberapa peringatan rasio gambar SVG dari sumber masih muncul di mode development, tanpa error runtime aplikasi pada pemeriksaan.

Tes integrasi menggunakan kredensial fiktif dan backend lokal sementara. Hasil ini bukan bukti bahwa integrasi produksi sudah berfungsi.

## Sebelum produksi

1. Isi environment dan secret dari pengelola backend/OAuth. Tidak ada secret yang ditebak atau diambil dari proyek lain.
2. Verifikasi login credentials, callback Google/GitHub, registrasi, onboarding tiap role, expiry sesi, serta CORS backend pada origin baru.
3. Uji request proyek dan pembayaran memakai sandbox penyedia pembayaran; jangan anggap toast sukses sebagai verifikasi dana masuk.
4. Periksa layanan chatbot `ai.dundorma.dev`: saat pemeriksaan browser, DNS layanan gagal baik di versi lama maupun baru.
5. Pertahankan repo/deployment lama sampai pengujian produksi dan cutover disetujui. Tidak ada data produksi atau riwayat Git sumber yang dihapus.

Dokumen `docs/legacy` adalah arsip sumber, termasuk fitur rencana dan keterbatasan yang belum diimplementasikan. Jangan menganggap PRD lama sebagai daftar fitur yang sudah selesai.
