# Frozen Food Management System

Aplikasi manajemen penjualan dan pengeluaran untuk toko frozen food.

## Teknologi yang Digunakan

### Frontend

- React 18
- Vite
- Axios untuk API calls
- React Router untuk navigasi

### Backend

- Laravel 10
- MySQL database
- Laravel Sanctum untuk authentication
- CORS protection

## Persyaratan Sistem

- Node.js 18+
- PHP 8.1+
- MySQL 8.0+
- Composer

## Instalasi

1. Clone repository:

```bash
git clone <repository-url>
cd frozen-food-system
```

2. Install dependencies frontend:

```bash
npm install
```

3. Install dependencies backend:

```bash
cd backend
composer install
npm install
```

4. Setup environment:

```bash
cp .env.example .env
php artisan key:generate
```

5. Setup database:

- Buat database MySQL baru: `frozen_food_db`
- Update konfigurasi database di `.env`

```bash
php artisan migrate:fresh --seed
```

## Menjalankan Aplikasi

1. Backend (di terminal pertama):

```bash
cd backend
php artisan serve
```

2. Frontend (di terminal kedua):

```bash
npm run dev
```

## Default Users

1. Owner:

- Username: owner
- Password: owner123

2. Staff:

- Username: staff
- Password: staff123

## Fitur

- [x] Login/Register
- [x] Dashboard dengan ringkasan
- [x] Input transaksi (penjualan/pengeluaran)
- [x] Laporan transaksi (owner only)
- [x] Manajemen staff (owner only)
- [x] Update profil
- [x] Role-based access control
- [x] Manajemen Daftar Harga & Stok
- [x] Approval Workflow untuk Admin
- [x] Dark Mode Support
- [x] Mobile Responsive Design

## Struktur Direktori

```
frozen-food-system/
├── src/                    # Frontend source files
│   ├── components/        # React components
│   ├── services/          # API services
│   └── utils/            # Utility functions
├── backend/               # Laravel backend
│   ├── app/              # Application code
│   ├── database/         # Migrations & seeds
│   └── routes/           # API routes
└── public/               # Static files
```

## API Endpoints

### Public Routes

- POST /api/auth/login
- POST /api/auth/register

### Protected Routes

- GET /api/users
- PUT /api/users/{id}
- DELETE /api/users/{id}
- GET /api/transactions
- POST /api/transactions
- DELETE /api/transactions/{id}
- GET /api/transactions/summary

## Testing

Aplikasi ini dilengkapi dengan automated testing untuk backend.

```bash
cd backend
php artisan test
```

## Kontribusi

1. Fork repository
2. Buat branch baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -am 'Menambah fitur baru'`
4. Push ke branch: `git push origin fitur-baru`
5. Submit pull request

```

```
