# AgriShop Pro API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-production-domain.com
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
1. [Health & System](#health--system)
2. [Authentication](#authentication-endpoints)
3. [Equipment](#equipment-endpoints)
4. [Orders](#order-endpoints)
5. [Suppliers](#supplier-endpoints)
6. [Loyalty Program](#loyalty-program-endpoints)

---

## Health & System

### Get Health Status
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-05-16T23:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production"
}
```

### Get Detailed Health
```http
GET /health/detailed
```
**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-05-16T23:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "services": {
    "database": {
      "status": "healthy",
      "state": "connected",
      "host": "localhost",
      "name": "agrishop-pro"
    },
    "memory": {
      "status": "healthy",
      "rss": "150MB",
      "heapTotal": "100MB",
      "heapUsed": "75MB"
    }
  }
}
```

### Readiness Probe
```http
GET /ready
```

### Liveness Probe
```http
GET /live
```

### Get Metrics
```http
GET /metrics
```

### Get Version
```http
GET /version
```

---

## Authentication Endpoints

### Register Farmer
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210",
  "address": {
    "village": "Sample Village",
    "district": "Sample District",
    "state": "Maharashtra",
    "pincode": "123456"
  },
  "farmSize": 5.5,
  "crops": ["wheat", "rice"]
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Login
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer",
    "phone": "9876543210",
    "address": { ... },
    "farmSize": 5.5,
    "crops": ["wheat", "rice"]
  }
}
```

---

## Equipment Endpoints

### Get All Equipment
```http
GET /api/equipment?page=1&limit=10&category=tractor&search=mahindra
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `brand` (optional): Filter by brand
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search in name and description
- `sortBy` (optional): Sort field (e.g., 'price', '-price', 'name')

**Response:**
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Mahindra 575 DI",
      "category": "tractor",
      "brand": "Mahindra",
      "price": 650000,
      "description": "Powerful 47 HP tractor",
      "specifications": { ... },
      "images": ["url1", "url2"],
      "stock": 5,
      "rating": 4.5
    }
  ]
}
```

### Get Equipment by ID
```http
GET /api/equipment/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Mahindra 575 DI",
    "category": "tractor",
    "brand": "Mahindra",
    "price": 650000,
    "description": "Powerful 47 HP tractor",
    "specifications": {
      "horsepower": "47 HP",
      "engine": "2730 CC",
      "gears": "8 Forward + 2 Reverse"
    },
    "images": ["url1", "url2"],
    "stock": 5,
    "rating": 4.5,
    "reviews": []
  }
}
```

### Create Equipment (Admin Only)
```http
POST /api/equipment
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Mahindra 575 DI",
  "category": "tractor",
  "brand": "Mahindra",
  "price": 650000,
  "description": "Powerful 47 HP tractor",
  "specifications": {
    "horsepower": "47 HP",
    "engine": "2730 CC"
  },
  "images": ["url1", "url2"],
  "stock": 5
}
```

### Update Equipment (Admin Only)
```http
PUT /api/equipment/:id
```
**Headers:** `Authorization: Bearer <admin_token>`

### Delete Equipment (Admin Only)
```http
DELETE /api/equipment/:id
```
**Headers:** `Authorization: Bearer <admin_token>`

---

## Order Endpoints

### Create Order
```http
POST /api/orders
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "equipment": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "deliveryAddress": {
    "street": "123 Farm Road",
    "village": "Sample Village",
    "district": "Sample District",
    "state": "Maharashtra",
    "pincode": "123456"
  },
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "orderNumber": "ORD-1234567890",
    "farmer": "507f1f77bcf86cd799439011",
    "equipment": { ... },
    "quantity": 1,
    "totalAmount": 650000,
    "status": "pending",
    "paymentStatus": "pending",
    "deliveryAddress": { ... }
  }
}
```

### Get My Orders
```http
GET /api/orders/my-orders?page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

### Get Order by ID
```http
GET /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`

### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

### Cancel Order
```http
PUT /api/orders/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

---

## Supplier Endpoints

### Get All Suppliers (Admin Only)
```http
GET /api/suppliers?page=1&limit=10&search=mahindra&verified=true
```
**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search by name, company, or email
- `verified`: Filter by verification status
- `categories`: Filter by categories
- `sortBy`: Sort field

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Rajesh Kumar",
      "companyName": "Mahindra Dealers",
      "email": "rajesh@mahindra.com",
      "phone": "9876543210",
      "address": { ... },
      "categories": ["tractor", "harvester"],
      "brands": ["Mahindra", "John Deere"],
      "rating": 4.5,
      "isVerified": true,
      "totalPurchases": 50,
      "totalAmount": 32500000
    }
  ]
}
```

### Create Supplier (Admin Only)
```http
POST /api/suppliers
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "companyName": "Mahindra Dealers",
  "email": "rajesh@mahindra.com",
  "phone": "9876543210",
  "address": {
    "street": "123 Industrial Area",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "gstNumber": "27AABCU9603R1ZM",
  "panNumber": "AABCU9603R",
  "categories": ["tractor", "harvester"],
  "brands": ["Mahindra", "John Deere"],
  "paymentTerms": {
    "creditDays": 30,
    "advancePercentage": 20
  },
  "bankDetails": {
    "accountName": "Mahindra Dealers",
    "accountNumber": "1234567890",
    "bankName": "HDFC Bank",
    "ifscCode": "HDFC0001234",
    "branch": "Mumbai Main"
  },
  "rating": 4.5,
  "isVerified": true
}
```

### Update Supplier (Admin Only)
```http
PUT /api/suppliers/:id
```

### Delete Supplier (Admin Only)
```http
DELETE /api/suppliers/:id
```

### Get Supplier Statistics (Admin Only)
```http
GET /api/suppliers/stats
```

---

## Loyalty Program Endpoints

### Get My Loyalty Program
```http
GET /api/loyalty/my-loyalty
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "farmer": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "points": 5000,
    "tier": "Silver",
    "totalSpent": 150000,
    "totalOrders": 3,
    "referralCode": "REF123ABC",
    "pointsHistory": [
      {
        "points": 1500,
        "type": "earned",
        "description": "Points earned from order",
        "date": "2026-05-15T10:00:00.000Z"
      }
    ],
    "rewards": [],
    "referrals": []
  }
}
```

### Redeem Points
```http
POST /api/loyalty/redeem
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "points": 5000,
  "rewardName": "₹500 Discount Voucher",
  "rewardDescription": "Get ₹500 off on your next purchase"
}
```

### Apply Referral Code
```http
POST /api/loyalty/apply-referral
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "referralCode": "REF123ABC"
}
```

### Get Rewards Catalog
```http
GET /api/loyalty/rewards-catalog
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "name": "₹500 Discount Voucher",
      "description": "Get ₹500 off on your next purchase",
      "pointsRequired": 5000,
      "category": "discount"
    }
  ]
}
```

### Get Leaderboard
```http
GET /api/loyalty/leaderboard?limit=10&type=points
```

**Query Parameters:**
- `limit`: Number of top members (default: 10)
- `type`: Sort by 'points', 'spent', or 'orders'

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "farmer": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      "points": 15000,
      "tier": "Gold",
      "totalSpent": 500000,
      "totalOrders": 10
    }
  ]
}
```

### Get All Loyalty Programs (Admin Only)
```http
GET /api/loyalty/all?tier=Gold&minPoints=5000
```
**Headers:** `Authorization: Bearer <admin_token>`

### Update Reward Status (Admin Only)
```http
PUT /api/loyalty/reward/:farmerId/:rewardId
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "approved"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Default:** 100 requests per 15 minutes per user/IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP

When rate limit is exceeded, you'll receive a `429` status code.

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Sorting

Use the `sortBy` query parameter:
- Ascending: `sortBy=price`
- Descending: `sortBy=-price`
- Multiple fields: `sortBy=category,-price`

---

## Filtering

Most list endpoints support filtering via query parameters:
- Exact match: `?category=tractor`
- Range: `?minPrice=100000&maxPrice=500000`
- Search: `?search=mahindra`
- Boolean: `?verified=true`

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (never in localStorage for sensitive apps)
3. **Handle token expiration** and refresh as needed
4. **Implement retry logic** for failed requests
5. **Use pagination** for large datasets
6. **Cache responses** where appropriate
7. **Monitor rate limits** and implement backoff strategies

---

## Support

For API support, contact: support@agrishop-pro.com

**Last Updated:** May 16, 2026  
**API Version:** 1.0.0