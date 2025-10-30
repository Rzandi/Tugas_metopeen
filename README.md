# 🚀 Full-Stack Application - Tugas Metopeen

Modern full-stack web application yang dibangun dengan FastAPI, React, MongoDB, dan Tailwind CSS.

## ✨ Fitur Utama

### Backend (FastAPI)
- ✅ Modern **Lifespan Context Manager** (menggantikan deprecated event handlers)
- ✅ **Comprehensive Error Handling** dengan logging detail
- ✅ **MongoDB Integration** dengan Motor (async driver)
- ✅ **RESTful API** dengan proper HTTP status codes
- ✅ **CORS Configuration** untuk cross-origin requests
- ✅ **Pydantic Models** untuk data validation
- ✅ **UUID** untuk ID generation (JSON serializable)

### Frontend (React)
- ✅ **Mobile Responsive** - bekerja sempurna di semua devices
- ✅ **Loading States** dengan animasi
- ✅ **Toast Notifications** untuk user feedback
- ✅ **Modern UI/UX** dengan gradient backgrounds
- ✅ **Glassmorphism Design** untuk aesthetic modern
- ✅ **Lucide Icons** untuk visual clarity
- ✅ **Custom Scrollbar** dengan purple theme
- ✅ **React Router** untuk navigation
- ✅ **Axios** untuk API calls

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.110.1
- **Database**: MongoDB dengan Motor 3.3.1
- **Validation**: Pydantic 2.12.3
- **Server**: Uvicorn 0.25.0

### Frontend
- **Framework**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI (shadcn/ui)
- **HTTP Client**: Axios 1.13.1
- **Icons**: Lucide React
- **Build Tool**: Create React App dengan Craco

### Database
- **MongoDB**: Local instance pada port 27017

## 📦 Instalasi & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
yarn install
```

### Environment Variables

**Backend** (`/app/backend/.env`):
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```

**Frontend** (`/app/frontend/.env`):
```env
REACT_APP_BACKEND_URL=https://code-doctor-56.preview.emergentagent.com
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

## 🚀 Running the Application

### Menggunakan Supervisor (Production)

```bash
# Start semua services
sudo supervisorctl start all

# Restart specific service
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# Check status
sudo supervisorctl status
```

### Development Mode

**Backend**:
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Frontend**:
```bash
cd frontend
yarn start
```

## 📱 Responsive Design

Aplikasi ini telah ditest dan bekerja sempurna di:
- 📱 **Mobile**: iPhone, Android (390x844)
- 📱 **Tablet**: iPad, Android Tablets (768x1024)
- 💻 **Desktop**: 1920x1080 dan lebih tinggi

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔌 API Endpoints

### Health Check
```http
GET /api/
```
**Response**:
```json
{
  "message": "Hello World",
  "status": "healthy"
}
```

### Create Status Check
```http
POST /api/status
Content-Type: application/json

{
  "client_name": "User_123"
}
```
**Response**:
```json
{
  "id": "uuid-here",
  "client_name": "User_123",
  "timestamp": "2025-10-30T17:12:54.123Z"
}
```

### Get All Status Checks
```http
GET /api/status
```
**Response**:
```json
[
  {
    "id": "uuid-here",
    "client_name": "User_123",
    "timestamp": "2025-10-30T17:12:54.123Z"
  }
]
```

## 📝 Code Quality

### Backend
- ✅ Type hints dengan Pydantic
- ✅ Async/await untuk operations
- ✅ Comprehensive error handling
- ✅ Structured logging
- ✅ No Python linting errors

### Frontend
- ✅ React Hooks best practices
- ✅ Component composition
- ✅ Error boundaries
- ✅ Loading states
- ✅ No ESLint errors

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (#8B5CF6 to #EC4899)
- **Background**: Dark gradient (slate-900 to purple-900)
- **Text**: White and slate-300
- **Accents**: Green-400 (success), Red-400 (error)

### UI Components
- Glassmorphism cards dengan backdrop blur
- Gradient backgrounds dengan animation
- Custom purple scrollbar
- Smooth transitions dan hover effects
- Toast notifications untuk feedback

## 🔧 Perbaikan yang Telah Dilakukan

### Backend
1. ✅ **Replaced deprecated `@app.on_event`** dengan modern lifespan context manager
2. ✅ **Added comprehensive error handling** di semua endpoints
3. ✅ **Implemented structured logging** untuk debugging
4. ✅ **Added global exception handler** untuk unhandled errors
5. ✅ **Improved database connection management** dengan proper lifecycle

### Frontend
1. ✅ **Made UI fully responsive** untuk mobile, tablet, dan desktop
2. ✅ **Added loading states** dengan spinner animations
3. ✅ **Implemented toast notifications** untuk user feedback
4. ✅ **Created modern UI design** dengan gradients dan glassmorphism
5. ✅ **Added custom scrollbar** dengan purple theme
6. ✅ **Improved error display** untuk better UX

## 📊 Project Structure

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Custom styles
│   │   ├── index.js       # Entry point
│   │   ├── components/    # UI components (shadcn/ui)
│   │   └── hooks/         # Custom hooks
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── .env              # Frontend environment variables
├── tests/                 # Test directory
└── README.md             # This file
```

## 🧪 Testing

Aplikasi telah ditest dengan:
- ✅ Manual testing di berbagai viewport sizes
- ✅ API endpoint testing dengan Axios
- ✅ MongoDB operations testing
- ✅ Error handling scenarios
- ✅ Loading states verification
- ✅ Toast notifications functionality

## 📚 Dependencies

### Key Backend Dependencies
- `fastapi==0.110.1` - Modern web framework
- `motor==3.3.1` - Async MongoDB driver
- `pydantic>=2.6.4` - Data validation
- `uvicorn==0.25.0` - ASGI server
- `python-dotenv>=1.0.1` - Environment variables

### Key Frontend Dependencies
- `react@19.0.0` - UI library
- `axios@1.8.4` - HTTP client
- `lucide-react@0.507.0` - Icon library
- `tailwindcss@3.4.17` - CSS framework
- `@radix-ui/*` - Unstyled UI components

## 🤝 Contributing

Untuk contribute ke project ini:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Made with ❤️ using FastAPI, React, and MongoDB

---

**Note**: Aplikasi ini sudah production-ready dengan proper error handling, logging, dan mobile-responsive design.
