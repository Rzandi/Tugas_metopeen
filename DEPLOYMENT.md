# Panduan Deployment (Railway + Vercel)

Panduan ini menjelaskan cara men-deploy aplikasi secara penuh ke cloud: Backend di **Railway** (termasuk Database) dan Frontend di **Vercel**.

## Bagian 1: Deploy Backend ke Railway

Railway adalah platform cloud yang sangat mudah untuk deploy aplikasi Laravel dan database MySQL.

1.  **Daftar/Login**: Kunjungi [railway.app](https://railway.app/) dan login (bisa pakai GitHub).
2.  **Buat Project Baru**: Klik "New Project" > "Deploy from GitHub repo".
3.  **Pilih Repository**: Pilih repo `Tugas_metopeen`.
4.  **Konfigurasi Service (Backend)**:
    - Railway akan mendeteksi folder `backend` secara otomatis atau Anda perlu menambahkannya sebagai service.
    - Pastikan **Root Directory** diatur ke `/backend`.
5.  **Tambahkan Database**:
    - Di dashboard project Railway, klik "New" > "Database" > "MySQL".
    - Tunggu sampai database dibuat.
6.  **Hubungkan Laravel ke MySQL**:
    - Klik service database MySQL > tab "Variables". Copy semua variabel (MYSQLHOST, MYSQLUSER, dll).
    - Klik service backend Laravel > tab "Variables".
    - Paste variabel database tadi.
    - Tambahkan variabel tambahan:
      - `APP_KEY`: (Copy dari file `.env` di laptop Anda, misal `base64:...`)
      - `APP_DEBUG`: `false`
      - `APP_URL`: (Kosongkan dulu, nanti diisi setelah deploy berhasil)
7.  **Deploy**: Railway akan otomatis deploy. Tunggu sampai sukses.
8.  **Generate Public Domain**:
    - Di service backend, ke tab "Settings" > "Networking" > "Generate Domain".
    - Copy domain yang muncul (misal: `backend-production.up.railway.app`). Ini adalah **API URL** Anda.

## Bagian 2: Deploy Frontend ke Vercel

1.  **Login Vercel**: Buka [vercel.com](https://vercel.com).
2.  **Add New Project**: Import repo `Tugas_metopeen`.
3.  **Konfigurasi Project**:
    - **Framework Preset**: Create React App (atau Vite, sesuaikan deteksi).
    - **Root Directory**: Klik Edit, pilih folder `frontend`.
4.  **Environment Variables**:
    - Tambahkan variable baru:
      - **Name**: `REACT_APP_BACKEND_URL`
      - **Value**: `https://backend-production.up.railway.app` (Paste domain dari Railway tadi, **tanpa** `/api` dan pastikan pakai `https://`).
5.  **Deploy**: Klik Deploy.

## Bagian 3: Finalisasi

1.  **Cek Database**:
    - Karena database baru, Anda perlu menjalakan migrasi.
    - Di Railway, buka service Backend > tab "Settings" > "Deploy Command".
    - Ubah menjadi: `php artisan migrate:fresh --seed --force` (Hanya untuk deploy pertama! Setelah itu hapus `--seed` agar data tidak hilang).
    - Atau gunakan **Railway CLI** di laptop untuk migrate manual.
2.  **Testing**:
    - Buka URL Vercel Anda.
    - Coba login dengan user default (owner/owner123).
    - Jika berhasil, selamat! Aplikasi Anda sudah full online.

## Troubleshooting

- **CORS Error**: Jika frontend gagal akses backend, pastikan di `backend/config/cors.php` atau `.env`, `ALLOWED_ORIGINS` diisi dengan URL Vercel Anda (atau `*` untuk sementara).
- **Database Error**: Pastikan variabel environment DB di Railway sudah benar dan sesuai dengan yang dibutuhkan Laravel.
- **PHP Version Error**: Jika error `requires php >=8.4`, tambahkan Environment Variable di Railway:
  - **Name**: `NIXPACKS_PHP_VERSION`
  - **Value**: `8.4`
