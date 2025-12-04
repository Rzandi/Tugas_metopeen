# Architecture Overview

## Frozen Food Management System - System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (React 19)                       │
│  ┌───────────────┐  ┌────────────┐  ┌──────────────────────┐   │
│  │  Components   │  │   Hooks    │  │  Context & State     │   │
│  │  (Lazy Load)  │  │  (Custom)  │  │  Management          │   │
│  └───────────────┘  └────────────┘  └──────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Error Boundary  │  Loading Spinner  │  Route Protection  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Services (API calls via Axios)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/HTTPS (REST API)
                      │ Base: REACT_APP_BACKEND_URL
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   Backend (Laravel 12)                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes (api.php)                                    │   │
│  │  - Auth endpoints (login, logout, me)                    │   │
│  │  - User management                                        │   │
│  │  - Transactions (CRUD + statistics)                      │   │
│  │  - Price list                                            │   │
│  │  - Approvals (Owner only)                                │   │
│  │  - Dashboard (Owner only)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐    │
│  │  Controllers                                             │    │
│  │  - AuthController     - UserController                   │    │
│  │  - TransactionController - PriceListController          │    │
│  │  - ApprovalController                                    │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐    │
│  │  Services (Business Logic)                              │    │
│  │  - BaseService (CRUD base)                              │    │
│  │  - TransactionService (stats, reports)                  │    │
│  │  - AuthService (if needed)                              │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐    │
│  │  Models (Eloquent ORM)                                   │    │
│  │  - User           - Transaction                          │    │
│  │  - PriceList      - (Others as needed)                   │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                        │
└─────────────────────────▼───────────────────────────────────────┘
                          │
                 ┌────────┴────────┐
                 │                  │
        ┌────────▼──────┐   ┌──────▼──────┐
        │   MySQL DB    │   │   File      │
        │   - users     │   │   Storage   │
        │   - trans.    │   │   - images  │
        │   - price_    │   │   - exports │
        │   - etc.      │   │             │
        └───────────────┘   └─────────────┘
```

---

## Project Structure

### Frontend (`/frontend`)

```
frontend/
├── public/
│   └── index.html           # Entry point
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx      # Error handling
│   │   ├── LoadingSpinner.jsx     # Loading UI
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── TransactionForm.jsx    # Transaction input
│   │   ├── ReportView.jsx         # Reports
│   │   ├── PriceList.jsx          # Product management
│   │   ├── ApprovalInbox.jsx      # Pending approvals
│   │   ├── UserManagement.jsx     # User management (Owner)
│   │   ├── Settings.jsx           # User settings
│   │   ├── Navbar.jsx             # Navigation
│   │   └── LoginForm.jsx          # Authentication
│   ├── services/
│   │   └── api.js                 # Axios configuration & API calls
│   ├── context/
│   │   └── ThemeContext.jsx       # Theme/dark mode
│   ├── hooks/
│   │   └── (custom hooks)
│   ├── utils/
│   │   ├── storage.js             # LocalStorage utilities
│   │   └── formatters.js          # Format helpers
│   ├── App.jsx                    # Main component with routing
│   ├── App.css                    # Global styles
│   ├── index.js                   # React DOM render
│   ├── index.css                  # Global CSS
│   ├── config.js                  # Environment-based config
│   └── setupTests.js              # Test configuration
├── package.json                   # Dependencies
├── .env                           # Environment variables (dev)
├── .env.example                   # Template for .env
├── craco.config.js                # CRA override config
├── tailwind.config.js             # Tailwind CSS config
├── jsconfig.json                  # JS path aliases
└── README.md
```

### Backend (`/backend`)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── PriceListController.php
│   │   │   └── ApprovalController.php
│   │   └── Middleware/
│   │       └── RateLimitMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   └── PriceList.php
│   ├── Services/
│   │   ├── BaseService.php        # Base CRUD service
│   │   └── TransactionService.php # Business logic
│   └── Notifications/
│       └── NewAdminRegistration.php
├── bootstrap/
│   └── app.php                    # App bootstrapping
├── config/
│   ├── app.php                    # App configuration
│   ├── auth.php                   # Authentication
│   ├── cors.php                   # CORS settings
│   ├── database.php               # Database config
│   ├── l5-swagger.php             # Swagger/OpenAPI config
│   └── (other configs)
├── database/
│   ├── migrations/                # Database schema
│   ├── seeders/                   # Sample data
│   │   ├── DatabaseSeeder.php
│   │   ├── OwnerSeeder.php
│   │   └── PriceListSeeder.php
│   └── factories/                 # Factories for testing
├── routes/
│   ├── api.php                    # API routes (v1)
│   └── web.php                    # Web routes (if needed)
├── storage/
│   ├── app/                       # File storage
│   ├── logs/                      # Application logs
│   └── framework/                 # Framework temp files
├── tests/
│   ├── Feature/                   # Feature tests
│   └── Unit/                      # Unit tests
├── composer.json                  # PHP dependencies
├── .env                           # Environment variables
├── .env.example                   # Template for .env
├── phpunit.xml                    # PHPUnit config
└── README.md
```

### Shared (`/shared`)

```
shared/
└── constants.js                   # Shared constants
    - USER_ROLES (owner, staff)
    - TRANSACTION_TYPES (sale, expense, restock)
    - API_STATUS (HTTP status codes)
    - CACHE_KEYS
    - PAGINATION defaults
    - VALIDATION_RULES
    - FEATURES flags
```

### Documentation (`/documents`)

```
documents/
├── README.md                      # Project overview
├── DEPLOYMENT.md                  # Railway/Vercel guide
├── CHANGELOG.md                   # Version history
├── API_DOCUMENTATION.md           # API reference
├── ARCHITECTURE.md                # System design (this file)
├── SETUP_GUIDE.md                 # Local development setup
├── DEVELOPMENT_WORKFLOW.md        # Git workflow & conventions
└── TROUBLESHOOTING.md             # Common issues & solutions
```

---

## Key Technologies

### Frontend Stack
- **React 19**: UI library with latest features
- **React Router 7**: Client-side routing
- **Tailwind CSS 4**: Utility-first CSS
- **Radix UI**: Headless UI components
- **Recharts**: Data visualization
- **Anime.js 4**: Animations
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Framer Motion**: Advanced animations
- **Lucide React**: Icon library

### Backend Stack
- **Laravel 12**: PHP web framework
- **MySQL 8**: Relational database
- **Sanctum**: API authentication
- **Eloquent ORM**: Database abstraction
- **Vite**: Asset bundler

---

## Authentication Flow

```
1. User inputs credentials → LoginForm
         │
         ▼
2. API call: POST /api/auth/login
         │
         ▼
3. Backend validates credentials
         │
         ▼
4. Returns: { user, token } or error
         │
         ▼
5. Store in localStorage: activeUser
         │
         ▼
6. Set Authorization header: Bearer {token}
         │
         ▼
7. Subsequent requests include token
         │
         ▼
8. Backend validates via Sanctum middleware
         │
         ▼
9. Request proceeds or returns 401 Unauthorized
```

---

## Data Flow

### Transaction Creation Flow

```
TransactionForm (Component)
         │
         ├─ User fills form
         │
         ├─ Validation (React Hook Form + Zod)
         │
         ├─ Submit handler
         │
         ▼
API Service (services/api.js)
         │
         ├─ POST /api/transactions
         ├─ Headers: { Authorization: Bearer token }
         │
         ▼
Backend Route (routes/api.php)
         │
         ├─ Middleware: auth:sanctum
         │
         ▼
TransactionController
         │
         ├─ Validate input
         │
         ▼
TransactionService
         │
         ├─ Business logic
         │
         ▼
Transaction Model
         │
         ├─ Database insert
         │
         ▼
Return response to frontend
         │
         ▼
Update component state
         │
         ▼
Refresh Dashboard
```

---

## Security Architecture

### Authentication
- **Sanctum**: Token-based API authentication
- **CORS**: Whitelist specific origins (localhost:3000, localhost:5173, production domain)
- **Rate Limiting**: 100 requests/minute per user

### Authorization
- **Role-based access control**: Owner vs Staff
- **Route middleware**: `auth:sanctum` + `role:owner`
- **Frontend guards**: Role checks before rendering

### Best Practices
- ✅ Password hashing (bcrypt)
- ✅ HTTPS in production
- ✅ Bearer token in Authorization header (not in URL)
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation on both frontend & backend
- ✅ CSRF protection via Sanctum

---

## API Design

### Versioning
- Base: `/api` (implied v1)
- Future: `/api/v2` if needed

### Response Format
All responses follow REST conventions:
- **2xx**: Success
- **4xx**: Client error (validation, auth, permissions)
- **5xx**: Server error

Standard error response:
```json
{
  "message": "Error description",
  "errors": {
    "field": ["error message"]
  }
}
```

### Pagination
List endpoints support:
- `page`: Page number (default: 1)
- `limit`: Per page (default: 10, max: 100)

Response includes metadata:
```json
{
  "data": [],
  "current_page": 1,
  "total": 100,
  "per_page": 10,
  "last_page": 10
}
```

---

## Database Schema

### Key Tables
- **users**: Authentication & user data
  - id, name, email, password, role, profile_picture, created_at
- **transactions**: Sales/expenses/restocks
  - id, user_id, type, amount, description, transaction_date
- **price_lists**: Product inventory
  - id, name, price, quantity, unit, created_at
- **approvals**: Pending user registrations
  - id, user_id, status, created_at

---

## Performance Optimization

### Frontend
- ✅ Lazy loading routes with React.lazy + Suspense
- ✅ Code splitting by route
- ✅ Asset minification & bundling
- ✅ Image optimization
- ✅ Caching with localStorage
- ✅ Reduced bundle size (removed unused deps)

### Backend
- ✅ Database query optimization
- ✅ Pagination on list endpoints
- ✅ Caching where appropriate
- ✅ Rate limiting to prevent abuse

---

## Deployment Architecture

### Development
- Frontend: `npm start` (localhost:3000)
- Backend: `php artisan serve` (localhost:8000)
- Database: Local SQLite or MySQL

### Production (Railway + Vercel)
```
GitHub Repository
    │
    ├─ Frontend: Deploy to Vercel
    │  └─ Branch: main → vercel.json auto-deploy
    │
    └─ Backend: Deploy to Railway
       └─ Branch: main → docker → Railway builds
       └─ Database: Railway MySQL service
```

Environment setup in deployment platform:
- **Frontend (Vercel)**:
  - `REACT_APP_BACKEND_URL`: Production API URL
  - Auto builds on git push

- **Backend (Railway)**:
  - `APP_ENV`: production
  - `APP_DEBUG`: false
  - `DB_HOST`, `DB_USER`, etc.: From Railway MySQL
  - Auto migrates on deploy

---

## Monitoring & Logging

### Frontend Logging
- Development: Console logs for debugging
- Production: Error reporting service (optional via REACT_APP_ENABLE_ERROR_REPORTING)

### Backend Logging
- Laravel logs in `storage/logs/`
- Request logging for debugging
- Error tracking for production issues

---

## Future Enhancements

1. **TypeScript**: Migrate both frontend & backend
2. **Testing**: Jest + React Testing Library for frontend, PHPUnit for backend
3. **GraphQL**: Optional alternative API layer
4. **WebSockets**: Real-time notifications
5. **Mobile App**: React Native version
6. **Analytics**: User behavior tracking
7. **Advanced Reports**: PDF export, charts, forecasting
8. **Two-factor authentication**: Enhanced security

---

## Development Workflow

See `DEVELOPMENT_WORKFLOW.md` for:
- Git branching strategy
- Commit conventions
- PR process
- Code review guidelines

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0
