# API Documentation

## Frozen Food Management System - API Reference

**Base URL:** `{BACKEND_URL}/api`  
**Version:** 1.0.0  
**Authentication:** Sanctum Token (Bearer Token in Authorization header)

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "John Owner",
    "email": "owner@example.com",
    "role": "owner",
    "created_at": "2025-12-03T10:00:00Z"
  },
  "token": "token_here"
}
```

### Register
**POST** `/auth/register`

Request body:
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "staff"
}
```

### Logout
**POST** `/auth/logout`  
Authentication required: Yes

### Get Current User
**GET** `/auth/me`  
Authentication required: Yes

Response (200):
```json
{
  "id": 1,
  "name": "John Owner",
  "email": "owner@example.com",
  "role": "owner",
  "created_at": "2025-12-03T10:00:00Z"
}
```

### Update Profile
**PUT** `/auth/me`  
Authentication required: Yes

Request body:
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "profile_picture": "url_or_base64"
}
```

### Change Password
**POST** `/auth/me/password`  
Authentication required: Yes

Request body:
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

---

## User Management Endpoints

### List Users
**GET** `/users`  
Authentication required: Yes

Query parameters:
- `page` (optional): Page number, default: 1
- `limit` (optional): Results per page, default: 10

Response (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Owner",
      "email": "owner@example.com",
      "role": "owner"
    }
  ],
  "current_page": 1,
  "total": 1
}
```

### Search Users
**GET** `/users/search`  
Authentication required: Yes

Query parameters:
- `q`: Search query (searches in name and email)
- `limit` (optional): Results per page, default: 10

### Get User by ID
**GET** `/users/{id}`  
Authentication required: Yes

### Update User
**PUT** `/users/{id}`  
Authentication required: Yes

Request body:
```json
{
  "name": "Updated Name",
  "email": "email@example.com",
  "role": "staff"
}
```

### Delete User
**DELETE** `/users/{id}`  
Authentication required: Yes  
Role required: Owner

---

## Transaction Endpoints

### List Transactions
**GET** `/transactions`  
Authentication required: Yes

Query parameters:
- `page` (optional): Page number
- `limit` (optional): Results per page
- `type` (optional): Filter by type (sale, expense, restock)
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date

### Get Transaction Statistics
**GET** `/transactions/statistics`  
Authentication required: Yes

Query parameters:
- `start_date` (optional): ISO date format
- `end_date` (optional): ISO date format

Response (200):
```json
{
  "total_sales": 1000000,
  "total_expenses": 200000,
  "net_profit": 800000,
  "total_restocks": 5,
  "count": 15
}
```

### Get Daily Statistics
**GET** `/transactions/daily`  
Authentication required: Yes

Query parameters:
- `date` (optional): ISO date format, default: today

### Create Transaction
**POST** `/transactions`  
Authentication required: Yes

Request body:
```json
{
  "type": "sale",
  "amount": 50000,
  "description": "Morning sale",
  "transaction_date": "2025-12-03T10:00:00Z"
}
```

### Update Transaction
**PUT** `/transactions/{id}`  
Authentication required: Yes

### Delete Transaction
**DELETE** `/transactions/{id}`  
Authentication required: Yes

### Export Transactions
**POST** `/transactions/export`  
Authentication required: Yes

Query parameters:
- `format`: csv or pdf
- `start_date` (optional)
- `end_date` (optional)

---

## Price List Endpoints

### List Price List Items
**GET** `/price-list`  
Authentication required: Yes

Query parameters:
- `page` (optional)
- `limit` (optional)

### Create Price List Item
**POST** `/price-list`  
Authentication required: Yes

Request body:
```json
{
  "name": "Salmon Fillet",
  "price": 45000,
  "quantity": 10,
  "unit": "kg"
}
```

### Get Price List Item
**GET** `/price-list/{id}`  
Authentication required: Yes

### Update Price List Item
**PUT** `/price-list/{id}`  
Authentication required: Yes

### Delete Price List Item
**DELETE** `/price-list/{id}`  
Authentication required: Yes  
Role required: Owner

### Record Sale
**POST** `/price-list/{id}/sale`  
Authentication required: Yes

Request body:
```json
{
  "quantity": 2,
  "price": 45000
}
```

### Record Restock
**POST** `/price-list/{id}/restock`  
Authentication required: Yes

Request body:
```json
{
  "quantity": 5
}
```

---

## Approval Endpoints (Owner Only)

### List Pending Approvals
**GET** `/approvals`  
Authentication required: Yes  
Role required: Owner

### Approve User
**POST** `/approvals/{id}/approve`  
Authentication required: Yes  
Role required: Owner

### Reject User
**POST** `/approvals/{id}/reject`  
Authentication required: Yes  
Role required: Owner

Request body:
```json
{
  "reason": "Reason for rejection"
}
```

---

## Dashboard Endpoints (Owner Only)

### Dashboard Summary
**GET** `/dashboard/summary`  
Authentication required: Yes  
Role required: Owner

Response (200):
```json
{
  "total_sales": 5000000,
  "total_expenses": 1000000,
  "net_profit": 4000000,
  "total_users": 5,
  "pending_approvals": 2
}
```

### Monthly Report
**GET** `/dashboard/monthly-report`  
Authentication required: Yes  
Role required: Owner

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["Email is required", "Email must be valid"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred processing your request"
}
```

---

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer {token}
```

Tokens are obtained from the `/auth/login` endpoint and remain valid until the user logs out.

---

## Rate Limiting

The API implements rate limiting:
- **Authenticated users**: 100 requests per minute
- **Unauthenticated users**: 60 requests per minute

When rate limit is exceeded, the server returns a 429 status code.

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 100)

Response includes:
- `current_page`: Current page number
- `total`: Total number of records
- `per_page`: Results per page
- `last_page`: Last page number

---

## Sorting & Filtering

Most list endpoints support filtering:
- `sort_by`: Field to sort by
- `sort_direction`: asc or desc
- Type-specific filters: `type`, `status`, `date_range`

---

## Changelog

### Version 1.0.0 (2025-12-03)
- Initial API release
- Authentication with Sanctum
- User management
- Transaction tracking
- Price list management
- Approval workflow
- Rate limiting
