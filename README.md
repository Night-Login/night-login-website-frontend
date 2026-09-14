# Night Login Website

Website Night Login dengan Next.js App Router. Migrasi ini mempertahankan konten, aset, URL, dan fitur dari [website 2024](https://github.com/Night-Login/night-login-website-2024), dengan struktur modular mengikuti pola Pionir.

## Menjalankan lokal

Gunakan Node.js 24 LTS dan pnpm 10.24.0.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Buka [localhost:3000](http://localhost:3000). Halaman publik bisa dilihat tanpa backend. Login, registrasi, onboarding, request proyek, dan QRIS membutuhkan backend lama serta konfigurasi di `.env.local`.

- `NEXT_PUBLIC_BACKEND_URL`: URL backend yang dapat diakses browser. Di-bundle saat build; rebuild bila diubah.
- `BACKEND_URL`: override opsional untuk request backend dari server. Hapus/comment bila ingin mengikuti `NEXT_PUBLIC_BACKEND_URL`.
- `NEXTAUTH_SECRET`: secret sesi, wajib di produksi. Generate dengan perintah pada `.env.example`.
- `NEXTAUTH_URL`: origin website, misalnya `http://localhost:3000` atau domain produksi.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`: kredensial aplikasi OAuth yang sudah ada.

Callback OAuth tetap `/api/auth/callback/google` dan `/api/auth/callback/github`. Jangan commit secret. Tidak ada kredensial produksi yang dibawa dari repo lain.

## Struktur

```text
app/
  (public)/             # Home, About, Projects, Talent Pool, Wallpapers
  api/auth/             # NextAuth GET/POST route handler
  dashboard/            # Shared dashboard layout dan route
  onboarding/
  requests/             # Login, register, payment
src/
  components/
    Contexts/           # SessionProvider dan lifecycle animasi
    Elements/           # Button, footer, chatbot
    Layouts/            # Navbar, layout publik, layout dashboard
  modules/              # Halaman, komponen, dan data berdasarkan fitur
  styles/               # Global CSS dan penyesuaian kompatibilitas Tailwind
  utils/
    auth/               # Auth options dan helper sesi
    http/               # API client
    types/              # Kontrak API dan augmentasi NextAuth
public/                 # 75 aset asli, tanpa perubahan isi
tests/                  # Kontrak migrasi, checksum aset, tes integrasi auth
docs/legacy/            # Dokumentasi sumber, bukan spesifikasi fitur baru
proxy.ts                # Proteksi route dashboard (pengganti middleware.ts)
```

`page.tsx` hanya menyusun route dan metadata. Simpan implementasi fitur di `src/modules/<fitur>`, komponen lintas fitur di `src/components`, dan data statis di folder `data` milik fitur. Gunakan `@/*` untuk `src/*` dan `@public/*` untuk aset yang diimpor.

## Quality checks

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:integration
pnpm audit
```

`pnpm check` menjalankan lint, typecheck, unit/kontrak migrasi, dan build. Tes integrasi membutuhkan hasil build, menyalakan server produksi dan backend simulasi di port lokal acak, lalu mematikannya. Tidak ada request login, registrasi, atau pembayaran yang dikirim ke layanan produksi oleh tes ini.

Untuk preview hasil build: `pnpm start`. Server lokal default hanya mendengarkan loopback. Jika deployment memerlukan bind publik, jalankan `pnpm exec next start --hostname 0.0.0.0` di lingkungan deployment yang sesuai.

## Batas scope

Ini migrasi, bukan penambahan fitur. `/projects` tetap redirect ke `/coming-soon`; History, Guide, FAQ dashboard, contoh profil Talent Pool, dan statistik contoh dipertahankan sebagaimana sumber. Beberapa quick action dashboard masih menunjuk fitur yang belum ada. Chatbot tetap bergantung pada layanan eksternal lama.

Rincian keputusan, versi dependencies, perubahan kompatibilitas, serta kebutuhan pengujian produksi ada di [catatan migrasi](docs/MIGRATION.md).

Test
