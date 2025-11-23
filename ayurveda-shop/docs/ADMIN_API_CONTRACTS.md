# Admin API Contracts

This document defines the expected API endpoints and contracts for the Ayurveda eCommerce Admin Panel. These endpoints should be implemented in the NestJS backend.

## Authentication

All admin API endpoints require authentication via JWT tokens with appropriate role permissions.

### Headers
```
Authorization: Bearer <jwt_token>
X-Admin-Role: ADMIN | OPS | FINANCE | SUPPORT
```

## Base URL
```
Production: https://api.ayurveda-shop.com/admin
Development: http://localhost:3000/admin
```

---

## Dashboard APIs

### GET /api/admin/dashboard/kpis
Get key performance indicators

**Response:**
```json
{
  "gmv": 2500000,
  "gmvChange": 12.5,
  "aov": 1250,
  "aovChange": 3.2,
  "conversionRate": 3.45,
  "conversionChange": 0.8,
  "activeUsers": 1234,
  "activeUsersChange": 15.3,
  "ordersToday": 45,
  "revenueToday": 56250
}
```

### GET /api/admin/dashboard/chart-data
Get revenue and orders trend data

**Query Params:**
- `period`: `7d` | `30d` | `90d` | `1y`
- `granularity`: `hourly` | `daily` | `weekly` | `monthly`

**Response:**
```json
{
  "labels": ["Jan 1", "Jan 2", "Jan 3"],
  "revenue": [50000, 62000, 58000],
  "orders": [40, 52, 46]
}
```

---

## Products APIs

### GET /api/admin/products
List products with pagination and filters

**Query Params:**
- `page`: number (default: 0)
- `size`: number (default: 20)
- `search`: string (optional)
- `category`: string (optional)
- `dosha`: `vata` | `pitta` | `kapha` (optional)
- `status`: `draft` | `published` | `archived` (optional)
- `sortBy`: `createdAt` | `price` | `stock` | `name` (default: `createdAt`)
- `sortOrder`: `asc` | `desc` (default: `desc`)

**Response:**
```json
{
  "content": [
    {
      "id": "prod_123",
      "name": "Ashwagandha Capsules",
      "slug": "ashwagandha-capsules",
      "sku": "ASH-CAP-500",
      "description": "Premium Ashwagandha extract for stress relief",
      "shortDescription": "Stress relief supplement",
      "price": 899,
      "compareAtPrice": 1299,
      "cost": 450,
      "stock": 150,
      "lowStockThreshold": 20,
      "category": "Supplements",
      "tags": ["stress-relief", "immunity", "energy"],
      "dosha": ["vata", "kapha"],
      "benefits": ["Reduces stress", "Improves energy", "Enhances immunity"],
      "ingredients": ["Ashwagandha extract (500mg)", "Cellulose capsule"],
      "images": [
        {
          "url": "https://cdn.ayurveda.com/products/ash-main.jpg",
          "alt": "Ashwagandha Capsules",
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "id": "var_1",
          "name": "60 Capsules",
          "sku": "ASH-CAP-500-60",
          "price": 899,
          "stock": 150
        },
        {
          "id": "var_2",
          "name": "120 Capsules",
          "sku": "ASH-CAP-500-120",
          "price": 1599,
          "stock": 80
        }
      ],
      "status": "published",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-17T14:30:00Z"
    }
  ],
  "totalElements": 156,
  "totalPages": 8,
  "page": 0,
  "size": 20
}
```

### POST /api/admin/products
Create a new product

**Request Body:**
```json
{
  "name": "Triphala Powder",
  "slug": "triphala-powder",
  "sku": "TRI-POW-100",
  "description": "Traditional Ayurvedic digestive support",
  "shortDescription": "Digestive wellness",
  "price": 599,
  "cost": 250,
  "stock": 200,
  "lowStockThreshold": 30,
  "category": "Herbs & Powders",
  "tags": ["digestion", "detox"],
  "dosha": ["vata", "pitta", "kapha"],
  "benefits": ["Supports digestion", "Detoxifies", "Promotes regularity"],
  "ingredients": ["Haritaki", "Bibhitaki", "Amalaki"],
  "status": "published"
}
```

### PUT /api/admin/products/:id
Update a product

### DELETE /api/admin/products/:id
Delete a product (soft delete)

### POST /api/admin/products/bulk-import
Bulk import products from CSV

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: CSV file with columns: name, sku, price, stock, category, etc.

**Response:**
```json
{
  "imported": 45,
  "failed": 2,
  "errors": [
    {
      "row": 12,
      "error": "Duplicate SKU: ASH-CAP-500"
    }
  ]
}
```

### GET /api/admin/products/export
Export products to CSV

**Query Params:**
- `filters`: JSON string of applied filters

**Response:** CSV file download

---

## Orders APIs

### GET /api/admin/orders
List orders with pagination and filters

**Query Params:**
- `page`: number
- `size`: number
- `status`: `pending` | `processing` | `shipped` | `delivered` | `cancelled`
- `search`: string (customer name, email, order number)
- `dateFrom`: ISO date string
- `dateTo`: ISO date string

**Response:**
```json
{
  "content": [
    {
      "id": "ord_123",
      "orderNumber": "ORD-2025-0001",
      "customerName": "Rajesh Kumar",
      "customerEmail": "rajesh@example.com",
      "customerId": "cust_456",
      "items": [
        {
          "productId": "prod_123",
          "productName": "Ashwagandha Capsules",
          "variantId": "var_1",
          "variantName": "60 Capsules",
          "quantity": 2,
          "price": 899,
          "total": 1798
        }
      ],
      "subtotal": 1798,
      "discount": 180,
      "shipping": 50,
      "tax": 162,
      "total": 1830,
      "status": "processing",
      "paymentStatus": "paid",
      "paymentMethod": "razorpay",
      "shippingAddress": {
        "name": "Rajesh Kumar",
        "address": "123 MG Road",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560001",
        "phone": "+91 98765 43210"
      },
      "timeline": [
        {
          "status": "pending",
          "timestamp": "2025-01-17T10:30:00Z",
          "note": "Order placed"
        },
        {
          "status": "processing",
          "timestamp": "2025-01-17T11:00:00Z",
          "note": "Payment confirmed"
        }
      ],
      "createdAt": "2025-01-17T10:30:00Z",
      "updatedAt": "2025-01-17T11:00:00Z"
    }
  ],
  "totalElements": 245,
  "totalPages": 13,
  "page": 0,
  "size": 20
}
```

### GET /api/admin/orders/:id
Get order details

### PUT /api/admin/orders/:id/status
Update order status

**Request Body:**
```json
{
  "status": "shipped",
  "note": "Shipped via BlueDart, tracking: BD123456",
  "trackingNumber": "BD123456"
}
```

### POST /api/admin/orders/:id/refund
Process refund

**Request Body:**
```json
{
  "amount": 1830,
  "reason": "Customer requested cancellation",
  "refundMethod": "original"
}
```

### GET /api/admin/orders/:id/invoice
Generate invoice PDF

**Response:** PDF file download

---

## Inventory APIs

### GET /api/admin/inventory
Get inventory status

**Response:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "productName": "Ashwagandha Capsules",
      "sku": "ASH-CAP-500-60",
      "stock": 150,
      "lowStockThreshold": 20,
      "status": "in_stock",
      "warehouse": "WH-BLR",
      "lastRestocked": "2025-01-10T00:00:00Z"
    }
  ],
  "lowStockCount": 12,
  "outOfStockCount": 3
}
```

### GET /api/admin/inventory/alerts
Get low stock alerts

### POST /api/admin/inventory/adjust
Adjust inventory levels

**Request Body:**
```json
{
  "productId": "prod_123",
  "variantId": "var_1",
  "adjustment": 50,
  "reason": "Restock from supplier",
  "warehouse": "WH-BLR"
}
```

### GET /api/admin/inventory/forecast
Get reorder suggestions (ML-powered)

**Response:**
```json
{
  "suggestions": [
    {
      "productId": "prod_123",
      "productName": "Ashwagandha Capsules",
      "currentStock": 15,
      "forecastedDemand": 120,
      "suggestedReorder": 150,
      "daysUntilStockout": 5,
      "priority": "high"
    }
  ]
}
```

---

## Customers APIs

### GET /api/admin/customers
List customers

**Response:**
```json
{
  "content": [
    {
      "id": "cust_123",
      "fullName": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "phone": "+91 98765 43210",
      "totalOrders": 12,
      "totalSpent": 24500,
      "ltv": 28000,
      "segment": "vip",
      "createdAt": "2024-06-15T00:00:00Z",
      "lastOrderAt": "2025-01-17T10:30:00Z"
    }
  ]
}
```

### GET /api/admin/customers/:id
Get customer details

### PUT /api/admin/customers/:id
Update customer

### POST /api/admin/customers/:id/notes
Add customer note

### DELETE /api/admin/customers/:id/gdpr
GDPR delete/anonymize customer data

---

## Promotions APIs

### GET /api/admin/promotions
List promotions

### POST /api/admin/promotions
Create promotion

**Request Body:**
```json
{
  "code": "SUMMER2025",
  "type": "percentage",
  "value": 20,
  "description": "Summer sale - 20% off",
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "usageLimit": 1000,
  "minPurchase": 999,
  "isActive": true
}
```

### PUT /api/admin/promotions/:id
Update promotion

### DELETE /api/admin/promotions/:id
Delete promotion

---

## Content APIs

### GET /api/admin/content/blog
List blog posts

### POST /api/admin/content/blog
Create blog post

**Request Body:**
```json
{
  "title": "Understanding Your Dosha",
  "slug": "understanding-your-dosha",
  "excerpt": "Learn about the three doshas...",
  "content": "# Understanding Your Dosha\n\n...",
  "author": "Dr. Priya Sharma",
  "status": "published",
  "tags": ["dosha", "ayurveda-basics"]
}
```

### GET /api/admin/content/banners
List banners

### POST /api/admin/content/banners
Create banner

### PUT /api/admin/content/banners/reorder
Reorder banners

**Request Body:**
```json
{
  "banners": [
    { "id": "ban_2", "position": 1 },
    { "id": "ban_1", "position": 2 },
    { "id": "ban_3", "position": 3 }
  ]
}
```

---

## Users & Roles APIs

### GET /api/admin/users
List admin users

### POST /api/admin/users
Create admin user

**Request Body:**
```json
{
  "fullName": "Amit Sharma",
  "email": "amit@ayurveda.com",
  "password": "SecurePassword123!",
  "roles": ["ADMIN"],
  "isActive": true
}
```

### GET /api/admin/roles
List roles and permissions

### POST /api/admin/roles
Create role

### GET /api/admin/audit-logs
Get audit logs

**Query Params:**
- `page`: number
- `size`: number
- `userId`: string (optional)
- `action`: `CREATE` | `UPDATE` | `DELETE` (optional)
- `dateFrom`: ISO date string
- `dateTo`: ISO date string

---

## Webhooks APIs

### GET /api/admin/webhooks
List webhooks

### POST /api/admin/webhooks
Create webhook

**Request Body:**
```json
{
  "url": "https://api.example.com/webhooks/orders",
  "events": ["order.created", "order.updated"],
  "secret": "whsec_your_secret_here",
  "isActive": true
}
```

### GET /api/admin/webhooks/:id/deliveries
Get webhook delivery history

### POST /api/admin/webhooks/deliveries/:id/retry
Retry failed webhook delivery

---

## Feature Flags APIs

### GET /api/admin/feature-flags
List feature flags

### POST /api/admin/feature-flags
Create feature flag

**Request Body:**
```json
{
  "name": "New Checkout Flow",
  "key": "new_checkout_flow",
  "description": "Enable redesigned checkout",
  "enabled": true,
  "rolloutPercentage": 50,
  "targetAudience": "percentage"
}
```

### PUT /api/admin/feature-flags/:id
Update feature flag

### POST /api/admin/feature-flags/:id/toggle
Toggle feature flag on/off

---

## ML Integration APIs

### POST /api/admin/ml/retrain
Trigger ML model retraining

**Request Body:**
```json
{
  "model": "product_recommendations",
  "datasetVersion": "2025-01-17"
}
```

### GET /api/admin/ml/models
List ML models and their versions

### GET /api/admin/ml/recommendations/preview
Preview ML recommendations

**Query Params:**
- `userId`: string
- `limit`: number (default: 10)

**Response:**
```json
{
  "userId": "cust_123",
  "recommendations": [
    {
      "productId": "prod_456",
      "productName": "Triphala Powder",
      "score": 0.89,
      "reason": "Based on purchase history and browsing"
    }
  ]
}
```

---

## Settings APIs

### GET /api/admin/settings
Get all settings

### PUT /api/admin/settings
Update settings

**Request Body:**
```json
{
  "siteName": "Ayurveda Shop",
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "paymentGateways": {
    "razorpay": {
      "enabled": true,
      "keyId": "rzp_***",
      "keySecret": "***"
    },
    "stripe": {
      "enabled": false
    }
  },
  "shipping": {
    "freeShippingThreshold": 1999,
    "standardRate": 50,
    "expressRate": 150
  },
  "email": {
    "fromAddress": "orders@ayurveda-shop.com",
    "fromName": "Ayurveda Shop"
  }
}
```

### POST /api/admin/settings/sitemap/regenerate
Regenerate sitemap

### POST /api/admin/settings/cache/clear
Clear application cache

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-01-17T10:30:00Z",
  "path": "/api/admin/users"
}
```

Common status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error
