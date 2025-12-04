# Tugas Metopeen - Frozen Food Management System

A modern full-stack web application for managing a frozen food business, featuring transaction recording, inventory management, user roles, and real-time analytics.

## 🚀 Tech Stack

### Frontend

- **Vite 5.4**: Next-generation frontend tooling with HMR
- **React.js 18**: UI Library with hooks
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Production-ready animation library
- **Anime.js v4**: Advanced JavaScript animation engine
- **Recharts**: Composable charting library for data visualization
- **Axios**: Promise-based HTTP client

### Backend

- **Laravel 10.x**: Modern PHP framework
- **MySQL 8.0**: Relational database
- **Laravel Sanctum**: SPA & API authentication
- **Laravel Eloquent**: Database ORM

## ✨ Features

### Core Features

- **Role-Based Access Control**:

  - **Owner**: Full access, approve/reject admin, view reports, manage users
  - **Admin**: Requires owner approval, manage inventory, view analytics
  - **Staff**: Auto-approved, record transactions, view daily summary

- **Transaction Management**: Record sales (penjualan) and expenses (pengeluaran) with automatic stock sync

- **Inventory Management** (Daftar Barang):

  - Product catalog with categorization
  - Real-time stock tracking
  - Quick sale/restock actions
  - Low stock warnings

- **Dashboard Analytics**:

  - Visual charts with Recharts (daily/monthly/yearly views)
  - Real-time statistics (sales, expenses, net profit)
  - Transaction history with adjustable quantities
  - Comparison with previous periods

- **User Management**:

  - Profile picture upload (max 2MB)
  - Password strength indicator
  - Last login tracking
  - User approval workflow

- **Notifications System**:
  - Real-time approval notifications
  - Low stock alerts
  - Unread count indicator

### UI/UX Features

- **Dark Mode**: Smooth theme switching with persistent preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Animations**: Entrance animations and micro-interactions
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Engaging illustrations and messages

## 🔧 Setup Instructions

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL 8.0
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_DATABASE=frozen_food_db
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database (optional - creates default owner)
php artisan db:seed

# Link storage for profile pictures
php artisan storage:link

# Start development server
php artisan serve
```

Default owner credentials:

- Username: `owner`
- Password: `owner123`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Update .env with backend URL
# VITE_BACKEND_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000` or `http://127.0.0.1:3000`

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
# Output: dist/ folder
```

### Backend

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🚀 Deployment

### Backend (Railway)

- Deploy Laravel backend with MySQL database
- Set environment variables (`APP_ENV=production`, `APP_DEBUG=false`)
- Run migrations automatically or via Railway CLI
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

### Frontend (Vercel)

- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_BACKEND_URL=https://your-backend.railway.app`
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

## 🔐 Security Features

- Laravel Sanctum token-based authentication
- CORS configuration for frontend-backend communication
- Rate limiting on authentication endpoints (10 requests/minute)
- Password hashing with Bcrypt (12 rounds)
- CSRF protection
- SQL injection prevention via Eloquent ORM

## 📊 Performance Optimizations

- N+1 query resolution (20-100x faster on large datasets)
- Database query optimization with aggregations
- Lazy loading for React components
- Asset optimization with Vite
- Image optimization for profile pictures

## 📝 License

This project is proprietary software for educational purposes.

## 👨‍💻 Author

**Zandi**  
Tugas Metode Penelitian - Frozen Food Management

---

**Version**: 2.0.0  
**Last Updated**: December 2024  
**Framework**: Laravel 10 + Vite + React 18
