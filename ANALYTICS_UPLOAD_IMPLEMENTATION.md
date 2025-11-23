# 🚀 Analytics & Product Upload System - Complete Implementation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features Implemented](#features-implemented)
4. [Database Schema](#database-schema)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Security & Privacy](#security--privacy)
8. [Deployment Guide](#deployment-guide)
9. [API Documentation](#api-documentation)
10. [Testing](#testing)

---

## 🎯 Overview

This implementation adds a comprehensive analytics system and product upload capability to the Ayurveda eCommerce platform. The system is designed with privacy-first principles, GDPR compliance, and production-ready scalability.

### Key Features

✅ **User Location Detection** (IP-based + GPS with permission)
✅ **Device & Browser Tracking** (hardware info, network type, OS)
✅ **Analytics Event System** (session tracking, batching, offline support)
✅ **Product Image Upload** (S3/Cloudinary, automatic optimization)
✅ **GDPR Compliance** (IP hashing, anonymization)
✅ **Rate Limiting** (DDoS protection)
✅ **Ayurveda-Specific Fields** (doshas, ingredients, benefits)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐│
│  │ Device Detector  │  │ Location Detector│  │ Session Track ││
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘│
│           │                     │                     │        │
│           └──────────────┬──────┴─────────────────────┘        │
│                          │                                      │
│                   ┌──────▼───────┐                             │
│                   │  Analytics   │                             │
│                   │    Client    │                             │
│                   │  (Batching + │                             │
│                   │   Offline)   │                             │
│                   └──────┬───────┘                             │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ HTTPS (REST API)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      SERVER (NestJS)                            │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │   Analytics   │  │    Upload    │  │     Products       │  │
│  │    Module     │  │    Module    │  │      Module        │  │
│  │               │  │              │  │   (Ayurveda)       │  │
│  │ - Location    │  │ - S3 Service │  │                    │  │
│  │ - Device      │  │ - Image Proc │  │ - Images           │  │
│  │ - Events      │  │ - Sharp      │  │ - Doshas           │  │
│  └───────┬───────┘  └──────┬───────┘  └─────────┬──────────┘  │
│          │                 │                     │             │
│          └─────────────────┼─────────────────────┘             │
│                            │                                   │
│                     ┌──────▼──────┐                            │
│                     │   Prisma    │                            │
│                     │     ORM     │                            │
│                     └──────┬──────┘                            │
└────────────────────────────┼───────────────────────────────────┘
                             │
              ┌──────────────┴─────────────┐
              │                            │
        ┌─────▼──────┐            ┌────────▼────────┐
        │ PostgreSQL │            │   AWS S3        │
        │  Database  │            │ (Image Storage) │
        │            │            │                 │
        │ - Products │            │ - Optimized     │
        │ - Analytics│            │ - Thumbnails    │
        │ - Images   │            │ - WebP Format   │
        └────────────┘            └─────────────────┘
```

---

## ✨ Features Implemented

### SECTION 1: User Location Detection ✅

**Frontend (Next.js)**
- ✅ Timezone detection via `Intl.DateTimeFormat().resolvedOptions().timeZone`
- ✅ IP geolocation via `ip-api.com` (free, no API key required)
- ✅ GPS location with explicit user permission
- ✅ Fallbacks for blocked access
- ✅ 1-hour caching to reduce API calls

**Backend (NestJS)**
- ✅ `POST /analytics/location` endpoint
- ✅ GDPR-compliant IP hashing (SHA-256 with salt)
- ✅ Database storage in `user_location_logs`
- ✅ Summary analytics: `GET /analytics/summary/locations`

### SECTION 2: Device & Environment Tracking ✅

**Tracked Information:**
- ✅ Device type (Mobile/Tablet/Desktop)
- ✅ Operating System (iOS, Android, Windows, macOS, Linux)
- ✅ Browser (Chrome, Safari, Edge, Firefox, Opera)
- ✅ Device RAM (via Device Memory API)
- ✅ CPU cores (via Hardware Concurrency API)
- ✅ Network type (slow-2g/3g/4g/5g)
- ✅ Online/Offline status
- ✅ Screen dimensions
- ✅ Color scheme (dark/light mode)
- ✅ Touch capability

**Backend:**
- ✅ `POST /analytics/device` endpoint
- ✅ Database storage in `user_device_logs`
- ✅ Summary analytics: `GET /analytics/summary/devices`

### SECTION 3: Combined Analytics Events ✅

**Features:**
- ✅ `POST /analytics/event` endpoint (combines location + device + event)
- ✅ Session tracking with UUID (30-minute timeout)
- ✅ Event batching (sends every 30 seconds or 10 events)
- ✅ Offline backup (localStorage queue)
- ✅ Automatic retry on connection restore
- ✅ Pre-defined event types:
  - `session_start`
  - `page_view`
  - `product_view`
  - `add_to_cart`
  - `purchase`

### SECTION 4-5: Product Upload + Image Upload ✅

**Product API:**
- ✅ `POST /products` - Create product with Ayurveda fields
- ✅ `PUT /products/:id` - Update product
- ✅ Ayurveda fields: ingredients, benefits, dosha tags, usage instructions

**Image Upload:**
- ✅ `POST /upload/image` - Single image upload
- ✅ `POST /upload/images` - Multiple image upload (max 10)
- ✅ `DELETE /upload/image/:id` - Delete uploaded image
- ✅ AWS S3 integration with signed URLs
- ✅ Automatic image optimization (Sharp):
  - Resize to max 2000x2000
  - Convert to WebP (85% quality)
  - Generate thumbnails (400x400)
- ✅ MIME type validation (JPEG, PNG, WebP, GIF)
- ✅ File size limit (10MB)
- ✅ Metadata storage in database

### SECTION 6-7: CDN + Security ✅

**Next.js Configuration:**
- ✅ S3 `remotePatterns` configured in `next.config.ts`
- ✅ CloudFront CDN support
- ✅ Automatic WebP format
- ✅ Lazy loading + priority images

**Security:**
- ✅ IP address hashing (SHA-256 with salt)
- ✅ Rate limiting (100 requests/min global)
- ✅ NestJS ValidationPipe (class-validator)
- ✅ JWT authentication for admin endpoints
- ✅ Role-based access control (Admin/Manager)

### SECTION 8: Database Schema ✅

**New Tables:**
```sql
- user_location_logs (country, region, city, lat/long, timezone, ip_hash)
- user_device_logs (device type, OS, browser, hardware info)
- analytics_events (event type, data, location_id, device_id)
- image_uploads (S3 key, URL, thumbnail, dimensions, uploader)
```

**Updated Tables:**
```sql
- products (added: subcategory, ingredients, benefits, dosha_*, usage_instructions, seo_keywords)
- product_images (fixed: added id, is_primary, timestamps)
```

**Migrations:**
- ✅ SQL migration file: `ayurveda-api/prisma/migrations/add_analytics_and_ayurveda_fields.sql`

---

## 🗄️ Database Schema

### Analytics Tables

**user_location_logs**
```sql
CREATE TABLE user_location_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  ip_hash VARCHAR(255),  -- SHA-256 hashed IP
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  timezone VARCHAR(100),
  accuracy VARCHAR(50),  -- high/medium/low
  created_at TIMESTAMP DEFAULT NOW()
);
```

**user_device_logs**
```sql
CREATE TABLE user_device_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  device_type VARCHAR(50),    -- mobile/tablet/desktop
  os VARCHAR(100),
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  device_ram VARCHAR(50),
  cpu_cores INTEGER,
  network_type VARCHAR(50),
  is_online BOOLEAN,
  screen_width INTEGER,
  screen_height INTEGER,
  color_scheme VARCHAR(20),
  has_touch BOOLEAN,
  user_agent VARCHAR(1000),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**analytics_events**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  event_type VARCHAR(100),    -- session_start, page_view, etc.
  event_data TEXT,           -- JSON
  location_id UUID,
  device_id UUID,
  page_url VARCHAR(1000),
  referrer VARCHAR(1000),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**image_uploads**
```sql
CREATE TABLE image_uploads (
  id UUID PRIMARY KEY,
  filename VARCHAR(500),
  original_name VARCHAR(500),
  mime_type VARCHAR(100),
  size_bytes INTEGER,
  s3_key VARCHAR(1000),
  s3_bucket VARCHAR(255),
  url VARCHAR(1000),
  thumbnail_url VARCHAR(1000),
  width INTEGER,
  height INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Backend Implementation

### File Structure

```
ayurveda-api/
├── src/
│   ├── analytics/
│   │   ├── dto/
│   │   │   ├── create-location.dto.ts
│   │   │   ├── create-device.dto.ts
│   │   │   └── create-event.dto.ts
│   │   ├── utils/
│   │   │   └── ip-hasher.util.ts
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── analytics.module.ts
│   │
│   ├── upload/
│   │   ├── dto/
│   │   │   └── upload-response.dto.ts
│   │   ├── services/
│   │   │   ├── s3.service.ts
│   │   │   └── image-processor.service.ts
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   └── upload.module.ts
│   │
│   └── products/
│       └── dto/
│           └── create-product.dto.ts (updated with Ayurveda fields)
│
└── prisma/
    ├── schema.prisma (updated)
    └── migrations/
        └── add_analytics_and_ayurveda_fields.sql
```

### Key Services

**IP Hasher (GDPR Compliance)**
```typescript
export class IpHasher {
  static hash(ip: string, salt?: string): string {
    if (salt) {
      return createHmac('sha256', salt).update(ip).digest('hex');
    }
    return createHash('sha256').update(ip).digest('hex');
  }

  static anonymize(ip: string): string {
    // IPv4: 192.168.1.100 → 192.168.1.0
    // IPv6: 2001:db8::1 → 2001:db8::
  }
}
```

**S3 Service (Image Upload)**
```typescript
export class S3Service {
  async upload(file: Buffer, originalName: string, mimeType: string): Promise<S3UploadResult> {
    const key = this.generateFileName(originalName, 'products');
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    }));
    return { key, url, bucket };
  }
}
```

**Image Processor (Sharp)**
```typescript
export class ImageProcessorService {
  async optimize(imageBuffer: Buffer): Promise<ProcessedImage> {
    return await sharp(imageBuffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
  }

  async generateThumbnail(imageBuffer: Buffer): Promise<ProcessedImage> {
    return await sharp(imageBuffer)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
  }
}
```

---

## 💻 Frontend Implementation

### File Structure

```
ayurveda-shop/
├── lib/
│   └── analytics/
│       ├── device-detector.ts
│       ├── location-detector.ts
│       ├── session-tracker.ts
│       └── analytics-client.ts
│
└── app/
    └── api/
        └── geolocation/
            └── route.ts
```

### Usage Examples

**Initialize Analytics**
```typescript
import { analytics } from '@/lib/analytics/analytics-client';

// In app/layout.tsx or _app.tsx
useEffect(() => {
  analytics.initialize(false); // true to request GPS permission
}, []);
```

**Track Events**
```typescript
// Page view
analytics.trackPageView('Product Detail');

// Product view
analytics.trackProductView(product.id, product.name);

// Add to cart
analytics.trackAddToCart(product.id, quantity);

// Purchase (sent immediately)
analytics.trackPurchase(order.id, order.total, order.items);

// Custom event
analytics.track('custom_event', { key: 'value' });
```

**Session Management**
```typescript
import { SessionTracker } from '@/lib/analytics/session-tracker';

const sessionId = SessionTracker.getSessionId();
SessionTracker.clearSession(); // Logout
```

---

## 🔒 Security & Privacy

### GDPR Compliance

1. **IP Address Hashing**
   - All IP addresses are hashed using SHA-256 with a secret salt
   - Original IPs are NEVER stored in the database
   - Hash is one-way (cannot reverse to get original IP)

2. **GPS Permission**
   - Precise location is ONLY collected with explicit user permission
   - Browser-native permission dialog
   - Falls back to IP-based geolocation if denied

3. **Data Anonymization**
   - IP addresses can be anonymized (last octet removed)
   - Location accuracy levels: high/medium/low

4. **User Rights**
   - Easy to implement data deletion (filter by user_id or session_id)
   - Export functionality can be added to analytics endpoints

### Rate Limiting

```typescript
// Global rate limit
ThrottlerModule.forRoot([{
  ttl: 60000,   // 1 minute
  limit: 100,   // 100 requests per minute
}])

// Analytics endpoints are public but rate-limited
// Admin endpoints require JWT + role-based access
```

---

## 🚀 Deployment Guide

### Prerequisites

1. **Database**: PostgreSQL 12+
2. **Storage**: AWS S3 bucket + IAM user with PutObject/DeleteObject permissions
3. **Node.js**: 18+ (for NestJS and Next.js)

### Step 1: Database Setup

```bash
cd ayurveda-api

# 1. Create .env file from example
cp .env.example .env

# 2. Update DATABASE_URL in .env
# 3. Run migration
psql -U postgres -d ayurveda_db -f prisma/migrations/add_analytics_and_ayurveda_fields.sql

# 4. Generate Prisma client
npx prisma generate
```

### Step 2: AWS S3 Setup

```bash
# 1. Create S3 bucket (e.g., "ayurveda-uploads")
aws s3 mb s3://ayurveda-uploads --region us-east-1

# 2. Set public-read ACL
aws s3api put-bucket-acl --bucket ayurveda-uploads --acl public-read

# 3. Configure CORS
aws s3api put-bucket-cors --bucket ayurveda-uploads --cors-configuration file://cors.json

# 4. Create IAM user with programmatic access
# 5. Attach policy: AmazonS3FullAccess (or custom policy)

# 6. Add credentials to .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=ayurveda-uploads
AWS_REGION=us-east-1
```

### Step 3: Backend Deployment

```bash
cd ayurveda-api

# Install dependencies
npm install

# Build
npm run build

# Start
npm run start:prod
```

### Step 4: Frontend Deployment

```bash
cd ayurveda-shop

# Create .env.local
cp .env.example .env.local

# Update API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Build
npm run build

# Start
npm run start
```

---

## 📚 API Documentation

### Analytics Endpoints

**POST /analytics/location**
```json
{
  "userId": "optional-user-id",
  "sessionId": "session-uuid",
  "ip": "will-be-hashed",
  "country": "India",
  "region": "Maharashtra",
  "city": "Mumbai",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "timezone": "Asia/Kolkata",
  "accuracy": "high"
}
```

**POST /analytics/device**
```json
{
  "userId": "optional-user-id",
  "sessionId": "session-uuid",
  "deviceType": "mobile",
  "os": "Android 14",
  "browser": "Chrome",
  "browserVersion": "120.0",
  "deviceRam": "8GB",
  "cpuCores": 8,
  "networkType": "4g",
  "isOnline": true,
  "screenWidth": 1080,
  "screenHeight": 2400,
  "colorScheme": "dark",
  "hasTouch": true,
  "userAgent": "..."
}
```

**POST /analytics/event**
```json
{
  "userId": "optional-user-id",
  "sessionId": "session-uuid",
  "eventType": "product_view",
  "eventData": { "productId": "123", "productName": "Ashwagandha" },
  "location": { /* location data */ },
  "device": { /* device data */ },
  "pageUrl": "https://example.com/product/ashwagandha",
  "referrer": "https://google.com"
}
```

**GET /analytics/summary/events** (Admin)
```bash
GET /analytics/summary/events?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer <jwt_token>
```

Response:
```json
[
  { "eventType": "page_view", "count": 12345 },
  { "eventType": "product_view", "count": 5678 },
  { "eventType": "add_to_cart", "count": 1234 },
  { "eventType": "purchase", "count": 456 }
]
```

### Upload Endpoints

**POST /upload/image** (Admin)
```bash
curl -X POST http://localhost:3000/upload/image \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@product.jpg"
```

Response:
```json
{
  "id": "uuid",
  "url": "https://ayurveda-uploads.s3.us-east-1.amazonaws.com/...",
  "thumbnailUrl": "https://ayurveda-uploads.s3.us-east-1.amazonaws.com/...",
  "s3Key": "products/...",
  "originalName": "product.jpg",
  "sizeBytes": 123456,
  "mimeType": "image/webp",
  "width": 1920,
  "height": 1080
}
```

**POST /products** (Admin)
```json
{
  "name": "Organic Ashwagandha",
  "slug": "organic-ashwagandha",
  "description": "Premium quality Ashwagandha root powder",
  "price": 599,
  "sku": "ASH-500G",
  "category": "Herbs",
  "subcategory": "Adaptogens",
  "ingredients": "100% Organic Ashwagandha (Withania somnifera)",
  "benefits": "Reduces stress, improves energy, supports immunity",
  "doshaVata": true,
  "doshaPitta": false,
  "doshaKapha": true,
  "usageInstructions": "Take 1-2 teaspoons daily with warm milk",
  "images": [
    { "url": "https://...", "altText": "Ashwagandha front", "order": 0 }
  ]
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Backend
cd ayurveda-api
npm run test

# Frontend
cd ayurveda-shop
npm run test
```

### E2E Tests

```bash
cd ayurveda-shop
npm run test:e2e
```

### Manual Testing

**Analytics:**
1. Open browser DevTools → Network tab
2. Navigate pages → Check `POST /analytics/event` calls
3. Check localStorage → `ayurveda_session_id` and `ayurveda_analytics_queue`
4. Go offline → Events should queue
5. Go online → Events should flush

**Upload:**
1. Login as admin
2. Navigate to Products → New Product
3. Upload image (JPEG/PNG)
4. Check S3 bucket for optimized WebP + thumbnail
5. Verify database entry in `image_uploads` table

---

## 📊 Monitoring & Analytics Dashboard

The admin dashboard can be extended to show:

- **Real-time analytics** (using `GET /analytics/summary/*` endpoints)
- **Geographic heatmap** (top countries/cities)
- **Device breakdown** (mobile vs desktop)
- **Event funnel** (page view → product view → add to cart → purchase)
- **Session duration** (average time on site)

---

## 🎉 Summary

This implementation provides a **production-ready, privacy-compliant analytics system** with **enterprise-grade image upload capabilities**. All features from the requirements have been implemented:

✅ Location detection (timezone, IP, GPS)
✅ Device & browser tracking
✅ Analytics event system with batching
✅ Product upload with Ayurveda fields
✅ Image upload with S3 + optimization
✅ GDPR compliance (IP hashing)
✅ Rate limiting & security
✅ Database migrations
✅ Admin dashboard ready
✅ CDN configuration
✅ Comprehensive documentation

**Next Steps:**
1. Deploy to production (follow deployment guide)
2. Configure CloudFront CDN for better performance
3. Set up monitoring (New Relic, Datadog, or custom dashboard)
4. Implement data retention policies (auto-delete old analytics)

---

**Questions or Issues?**
- Backend API: Check `ayurveda-api/src/` for full source code
- Frontend: Check `ayurveda-shop/lib/analytics/` for client implementation
- Database: Run migration SQL file in `ayurveda-api/prisma/migrations/`

**Created by:** Claude (Anthropic)
**Date:** November 17, 2025
**Version:** 1.0.0
