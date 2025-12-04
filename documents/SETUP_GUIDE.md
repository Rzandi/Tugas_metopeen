# Development Setup Guide

## Prerequisites

Before you start, ensure you have:
- Node.js 18+ (check: `node --version`)
- PHP 8.4+ (check: `php --version`)
- Composer (check: `composer --version`)
- MySQL 8.0+ or SQLite (for local development)
- Git

---

## Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/Rzandi/Tugas_metopeen.git
cd Tugas_metopeen
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
php artisan key:generate
composer install
php artisan migrate
php artisan db:seed
php artisan serve
# Backend runs on http://localhost:8000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm start
# Frontend runs on http://localhost:3000
```

### 4. Access Application
- **URL**: http://localhost:3000
- **Default login**: 
  - Email: `owner@example.com`
  - Password: `owner123`

---

## Detailed Backend Setup

### Step 1: Environment Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```dotenv
APP_NAME="Frozen Food Management"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (choose one)
# SQLite (simpler for local development):
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# OR MySQL:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frozen_food_db
DB_USERNAME=root
DB_PASSWORD=

# Frontend CORS
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:5173
```

### Step 2: Install Dependencies

```bash
# Install PHP packages
composer install

# Generate application key
php artisan key:generate

# Create database file (if using SQLite)
touch database/database.sqlite
```

### Step 3: Database Setup

```bash
# Run migrations
php artisan migrate

# Seed sample data (creates owner user, price list, etc.)
php artisan db:seed

# OR fresh setup with seeders:
php artisan migrate:fresh --seed
```

### Step 4: File Storage

```bash
# Create storage symlink for file uploads
php artisan storage:link
```

### Step 5: Start Development Server

```bash
# Option 1: Simple server
php artisan serve
# Runs on http://localhost:8000

# Option 2: With auto-reload and other services
npm run dev
# Runs server + queue + logs + vite (from composer script)
```

---

## Detailed Frontend Setup

### Step 1: Environment Configuration

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```dotenv
REACT_APP_BACKEND_URL=http://localhost:8000
GENERATE_SOURCEMAP=false
REACT_APP_API_TIMEOUT=30000
```

### Step 2: Install Dependencies

```bash
npm install
# Or if using yarn:
yarn install
```

### Step 3: Start Development Server

```bash
npm start
# Runs on http://localhost:3000

# Or for production build:
npm run build
npm run preview
```

---

## Database Setup Details

### Option A: SQLite (Recommended for Local Development)

**Advantages**: No setup required, file-based
**Disadvantages**: Single-user, slower with large datasets

```bash
# Already configured in .env.example
# Just run migrations:
php artisan migrate:fresh --seed
```

### Option B: MySQL (Recommended for Production)

**Setup on Windows**:
1. Install MySQL Community Server from `mysql.com`
2. Create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE frozen_food_db;
   EXIT;
   ```

3. Update `.env`:
   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_DATABASE=frozen_food_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. Run migrations:
   ```bash
   php artisan migrate:fresh --seed
   ```

---

## Verifying Installation

### Frontend Health Check

```bash
# Access frontend
http://localhost:3000

# Open DevTools (F12) → Console
# Should not show errors
# Check network tab for API calls
```

### Backend Health Check

```bash
# Test API endpoint
curl http://localhost:8000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"owner123"}'

# Should return: { "user": {...}, "token": "..." }
```

---

## Common Issues & Solutions

### Issue: CORS Error
**Error**: `No 'Access-Control-Allow-Origin' header`

**Solution**:
1. Check `backend/.env`:
   ```dotenv
   SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
   ```
2. Check `backend/config/cors.php` has your frontend URL in `allowed_origins`
3. Restart backend: `php artisan serve`

### Issue: Database Connection Error
**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
1. Ensure MySQL is running
2. Check `.env` DB credentials:
   ```bash
   DB_HOST=127.0.0.1  # Not localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Create database if missing:
   ```bash
   mysql -u root -p -e "CREATE DATABASE frozen_food_db;"
   ```

### Issue: "No Application Key"
**Error**: `No application key has been specified`

**Solution**:
```bash
php artisan key:generate
```

### Issue: npm modules not found
**Error**: `Cannot find module 'react'`

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Error**: `Address already in use`

**Solution**:
```bash
# Kill process on port (Linux/Mac)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port (Windows PowerShell)
$port = 8001
php artisan serve --port=$port
```

---

## Database Seeding

### Default Seeded Data

After `php artisan db:seed`, you get:

**Owner User**:
- Email: `owner@example.com`
- Password: `owner123`
- Role: `owner`

**Sample Price List Items**:
- Various frozen food products with prices
- Quantities for inventory tracking

### Custom Seeding

To add more data:

```bash
# Create new seeder
php artisan make:seeder CustomSeeder

# Edit app/database/seeders/CustomSeeder.php

# Run specific seeder
php artisan db:seed --class=CustomSeeder

# Or reset all data and re-seed
php artisan migrate:fresh --seed
```

---

## IDE Setup

### VS Code Extensions (Recommended)

**Frontend Development**:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

**Backend Development**:
- PHP Intelephense
- Laravel Artisan
- Laravel Goto

**Both**:
- Git Graph
- Thunder Client or REST Client

### Configuration Files

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  }
}
```

---

## Git Setup

```bash
# Clone repository
git clone https://github.com/Rzandi/Tugas_metopeen.git
cd Tugas_metopeen

# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

---

## Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in coverage mode
npm test -- --coverage

# Run specific test file
npm test -- TestName.test.js
```

### Backend Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/AuthTest.php

# Run with coverage
php artisan test --coverage
```

---

## Building for Production

### Frontend Build

```bash
cd frontend

# Create optimized build
npm run build

# Output in: frontend/build/
# Ready to deploy to Vercel, Netlify, etc.

# Test production build locally
npm run preview
# Runs on http://localhost:3000 (simulated)
```

### Backend Build

```bash
cd backend

# Clear optimization files
php artisan optimize:clear

# Optimize for production
php artisan optimize

# Build frontend assets
npm run build
```

---

## Environment Variables Reference

### Frontend (.env)

| Variable | Example | Purpose |
|----------|---------|---------|
| REACT_APP_BACKEND_URL | http://localhost:8000 | API base URL |
| GENERATE_SOURCEMAP | false | Disable sourcemaps in production |
| REACT_APP_API_TIMEOUT | 30000 | API request timeout (ms) |
| REACT_APP_ENABLE_ANALYTICS | false | Analytics toggle |
| REACT_APP_ENABLE_ERROR_REPORTING | false | Error reporting toggle |

### Backend (.env)

| Variable | Example | Purpose |
|----------|---------|---------|
| APP_ENV | local | Environment (local/production) |
| APP_DEBUG | true | Enable debug mode |
| APP_URL | http://localhost:8000 | Application URL |
| DB_CONNECTION | mysql | Database driver |
| DB_HOST | 127.0.0.1 | Database host |
| DB_DATABASE | frozen_food_db | Database name |
| DB_USERNAME | root | Database user |
| DB_PASSWORD | password | Database password |

---

## Troubleshooting Checklist

Before asking for help:
- [ ] Ran `composer install` and `npm install`
- [ ] Generated app key: `php artisan key:generate`
- [ ] Ran migrations: `php artisan migrate`
- [ ] Seeded database: `php artisan db:seed`
- [ ] Checked `.env` files match `.env.example`
- [ ] Restarted servers after changes
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Checked console for errors (F12)
- [ ] Checked Laravel logs: `storage/logs/`

---

## Next Steps

1. Read `ARCHITECTURE.md` for system design
2. Review `API_DOCUMENTATION.md` for API endpoints
3. Check `DEPLOYMENT.md` for production setup
4. Start developing your features!

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0
