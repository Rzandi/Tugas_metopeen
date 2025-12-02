# Tugas Metopeen - Frozen Food Management System

A full-stack web application for managing a frozen food business, featuring transaction recording, inventory management, and user roles (Owner & Staff).

## Tech Stack

### Frontend

- **React.js**: UI Library
- **Tailwind CSS v4**: Styling
- **Anime.js v4**: Animations
- **React Bits**: Advanced UI effects (Waves)
- **Recharts**: Data visualization

### Backend

- **Laravel**: PHP Framework
- **MySQL**: Database
- **Sanctum**: API Authentication

## Features

- **Role-Based Access**:
  - **Owner**: Full access, approve/reject staff, view reports, manage users.
  - **Staff**: Record transactions, view daily summary.
- **Transaction Management**: Record sales and expenses.
- **Dashboard**: Visual analytics of sales and expenses.
- **Profile Management**: Update profile details and upload profile pictures.
- **Responsive Design**: Optimized for desktop and mobile.

## Setup Instructions

### Backend

1.  Navigate to `backend` directory: `cd backend`
2.  Install dependencies: `composer install`
3.  Copy `.env.example` to `.env` and configure database.
4.  Run migrations: `php artisan migrate`
5.  Link storage: `php artisan storage:link`
6.  Start server: `php artisan serve`

### Frontend

1.  Navigate to `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start development server: `npm start`

## Deployment

- **Backend**: Ready for deployment on Railway/Vercel.
- **Frontend**: Ready for deployment on Vercel/Netlify.
