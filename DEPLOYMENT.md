# Panduan Deployment (Railway + Vercel)

Panduan ini menjelaskan cara men-deploy aplikasi secara penuh ke cloud: Backend di **Railway** (termasuk Database) dan Frontend di **Vercel**.

## 🚀 Perubahan Penting - Vite Migration

**PENTING**: Frontend sekarang menggunakan **Vite** (bukan Create React App). Ada beberapa perubahan konfigurasi:

### Frontend Changes

- **Build Output**: `dist/` (dulu: `build/`)
- **Environment Variables**: `VITE_*` (dulu: `REACT_APP_*`)
- **Dev Port**: 3000 (dulu: 3000, tapi lebih cepat!)

---

## Bagian 1: Deploy Backend ke Railway

Railway adalah platform cloud yang sangat mudah untuk deploy aplikasi Laravel dan database MySQL.

### Step-by-Step:

1. **Daftar/Login**: Kunjungi [railway.app](https://railway.app/) dan login (bisa pakai GitHub).

2. **Buat Project Baru**: Klik "New Project" > "Deploy from GitHub repo".

3. **Pilih Repository**: Pilih repo `Tugas_metopeen`.

4. **Konfigurasi Service (Backend)**:

   - Railway akan mendeteksi folder `backend` secara otomatis atau Anda perlu menambahkannya sebagai service.
   - Pastikan **Root Directory** diatur ke `/backend`.

5. **Tambahkan Database**:

   - Di dashboard project Railway, klik "New" > "Database" > "MySQL".
   - Tunggu sampai database dibuat.

6. **Hubungkan Laravel ke MySQL**:

   - Klik service database MySQL > tab "Variables". Copy semua variabel (MYSQLHOST, MYSQLUSER, dll).
   - Klik service backend Laravel > tab "Variables".
   - Paste variabel database tadi.
   - Tambahkan variabel tambahan:
     - `APP_KEY`: (Copy dari file `.env` di laptop Anda, misal `base64:...`)
     - `APP_ENV`: `production`
     - `APP_DEBUG`: `false`
     - `FRONTEND_URL`: `https://yourapp.vercel.app` (URL Vercel lu nanti)

7. **Deploy Backend**: Klik "Deploy" dan tunggu selesai.

8. **Migrate Database**:
   - Di Railway, buka service Backend > tab "Settings" > "Deploy Command".
   - Ubah menjadi: `php artisan migrate --force`
   - Atau gunakan **Railway CLI** di laptop untuk migrate manual.

---

## Bagian 2: Deploy Frontend ke Vercel

### Step-by-Step:

1. **Login ke Vercel**: Kunjungi [vercel.com](https://vercel.com) dan login dengan GitHub.

2. **Import Project**:

   - Klik "Add New" > "Project"
   - Pilih repository `Tugas_metopeen`
   - Klik "Import"

3. **Konfigurasi Project Settings**:

   **PENTING! Pengaturan ini berbeda dari CRA:**

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default sudah OK)
   - **Output Directory**: **`dist`** ← PENTING! Bukan 'build'
   - **Install Command**: `npm install` (default OK)

4. **Environment Variables**:

   Klik "Environment Variables" dan tambahkan:

   | Name               | Value                                       |
   | ------------------ | ------------------------------------------- |
   | `VITE_BACKEND_URL` | `https://backend-production.up.railway.app` |

   **PENTING**:

   - Prefix harus `VITE_` bukan `REACT_APP_`
   - URL Railway **tanpa** `/api` di akhir
   - Gunakan `https://`

5. **Deploy**: Klik "Deploy" dan tunggu build selesai (~1-2 menit).

---

## Bagian 3: Update Project yang Sudah Ada

Jika project Vercel lu sudah ada dari deployment sebelumnya (pakai CRA), lakukan ini:

### Update Vercel Settings:

1. **Buka Project**: Di Vercel dashboard, pilih project frontend lu.

2. **Settings > General**:

   - Framework Preset: Ubah ke **Vite**
   - Root Directory: Tetap `frontend`

3. **Settings > Build & Development Settings**:

   - Build Command: `npm run build` (sudah benar)
   - Output Directory: **Ubah dari `build` ke `dist`** ← CRITICAL!
   - Install Command: `npm install` (tetap)

4. **Settings > Environment Variables**:
   - **DELETE**: `REACT_APP_BACKEND_URL`
   - **ADD NEW**:
     - Name: `VITE_BACKEND_URL`
     - Value: `https://tugasmetopeen-production.up.railway.app`
5. **Deployments > Redeploy**:
   - Pilih deployment terakhir
   - Klik titik 3 > "Redeploy"
   - Tunggu build selesai

---

## Bagian 4: Testing

1. **Cek Backend**:

   - Buka: `https://your-backend.railway.app/api/users`
   - Harusnya error 401 (Unauthenticated) - ini normal!
   - Berarti API jalan

2. **Cek Frontend**:
   - Buka URL Vercel Anda
   - Harusnya muncul halaman login
   - Coba login dengan user default:
     - Username: `owner`
     - Password: `owner123`
3. **Jika Login Berhasil**:
   - ✅ Selamat! Aplikasi Anda sudah full online!
   - Coba semua fitur (Dashboard, Transactions, etc.)

---

## 🔧 Troubleshooting

### Frontend Build Error di Vercel

**Error**: "Failed to load module" atau "dist not found"

**Fix**:

- Pastikan Output Directory = `dist` (bukan `build`)
- Check package.json: `"build": "vite build"` harus ada

---

### CORS Error

**Error**: Frontend ga bisa akses backend

**Fix**:

1. Buka `backend/config/cors.php`
2. Update `allowed_origins`:
   ```php
   'allowed_origins' => [
       'http://localhost:3000',
       'https://yourapp.vercel.app', // ← Tambah ini!
   ],
   ```
3. Push ke GitHub, Railway auto-redeploy

---

### Database Connection Error

**Error**: "SQLSTATE[HY000] [2002]"

**Fix**:

- Cek environment variables di Railway
- Pastikan `DB_HOST`, `DB_PORT`, `DB_DATABASE`, dll sudah benar
- Coba connection dari Railway CLI: `railway connect`

---

### Environment Variable ga Ke-Load

**Error**: `Cannot read VITE_BACKEND_URL` di console

**Fix**:

- Pastikan variable name prefix `VITE_` (bukan `REACT_APP_`)
- Redeploy di Vercel setelah menambah env vars
- Check di Build Logs apakah variable ke-detect

---

### PHP Version Error di Railway

**Error**: `requires php >=8.4`

**Fix**:

1. Buka `backend/composer.json`
2. Ubah `"php": "^8.2"` atau sesuaikan dengan Railway
3. Push ke GitHub

---

## 📋 Checklist Deployment

### Pre-Deployment

- [ ] Local `npm run build` berhasil (check ada folder `dist/`)
- [ ] Backend `.env` production-ready (`APP_DEBUG=false`)
- [ ] Database backup sudah dibuat
- [ ] Git committed & pushed

### Backend (Railway)

- [ ] Database MySQL created
- [ ] Environment variables set
- [ ] Migrations ran successfully
- [ ] API endpoint responding (`/api/users` returns 401)

### Frontend (Vercel)

- [ ] Output Directory = `dist`
- [ ] `VITE_BACKEND_URL` environment variable added
- [ ] Build successful
- [ ] Website loads (`https://yourapp.vercel.app`)

### Post-Deployment

- [ ] Login page works
- [ ] Login with owner credentials successful
- [ ] Dashboard loads with data
- [ ] Transactions can be created
- [ ] Dark mode toggle works
- [ ] No console errors

---

## 🚀 Quick Deploy Commands

### Push Updates

```bash
# After making changes locally
git add .
git commit -m "Your commit message"
git push origin main

# Railway & Vercel auto-deploy!
```

### Manual Railway Migrate

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run php artisan migrate
```

---

**Version**: 2.0.0 (Vite)  
**Last Updated**: December 2024  
**Deployment Platforms**: Railway + Vercel
