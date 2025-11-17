# Ayurveda E-Commerce - NestJS Backend Auto-Setup Script (PowerShell)
# This script creates a complete NestJS backend to replace Spring Boot

$ErrorActionPreference = "Stop"

Write-Host "🚀 Creating NestJS Backend for Ayurveda E-Commerce..." -ForegroundColor Blue
Write-Host ""

$PROJECT_NAME = "ayurveda-nestjs-api"

# Step 1: Create NestJS project
Write-Host "Step 1: Creating NestJS project..." -ForegroundColor Cyan
npx @nestjs/cli new $PROJECT_NAME --package-manager pnpm --skip-git
Set-Location $PROJECT_NAME

# Step 2: Install dependencies
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add @nestjs/swagger @nestjs/throttler @nestjs/cache-manager cache-manager
pnpm add @prisma/client bcrypt class-validator class-transformer
pnpm add prisma zod helmet compression

pnpm add -D @types/bcrypt @types/passport-jwt @types/node

# Step 3: Initialize Prisma
Write-Host "Step 3: Initializing Prisma..." -ForegroundColor Cyan
npx prisma init

# Step 4: Create Prisma schema
Write-Host "Step 4: Creating Prisma schema..." -ForegroundColor Cyan
@"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(uuid())
  username        String    @unique
  email           String    @unique
  password        String
  fullName        String
  phoneNumber     String?
  twoFaEnabled    Boolean   @default(false)
  twoFaSecret     String?
  failedAttempts  Int       @default(0)
  lockedUntil     DateTime?
  lastLoginAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  roles           UserRole[]
  auditEvents     AuditEvent[]

  @@map("users")
}

model Role {
  id          String     @id @default(uuid())
  name        String     @unique
  description String?
  createdAt   DateTime   @default(now())
  users       UserRole[]

  @@map("roles")
}

model UserRole {
  userId    String
  roleId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@id([userId, roleId])
  @@map("user_roles")
}

model Product {
  id               String      @id @default(uuid())
  sku              String      @unique
  name             String
  slug             String      @unique
  description      String?
  shortDescription String?
  price            Decimal     @db.Decimal(10, 2)
  compareAtPrice   Decimal?    @db.Decimal(10, 2)
  costPrice        Decimal?    @db.Decimal(10, 2)
  status           String      @default("draft")
  category         String?
  brand            String?
  tags             String[]
  images           Json        @default("[]")
  weightGrams      Int?
  isFeatured       Boolean     @default(false)
  seoTitle         String?
  seoDescription   String?
  stockQuantity    Int         @default(0)
  lowStock         Boolean     @default(false)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  orderItems       OrderItem[]
  stocks           Stock[]

  @@map("products")
}

model Order {
  id                String      @id @default(uuid())
  orderNumber       String      @unique
  customerId        String
  status            String      @default("pending")
  paymentStatus     String      @default("pending")
  fulfillmentStatus String      @default("unfulfilled")
  subtotal          Decimal     @db.Decimal(10, 2)
  taxAmount         Decimal     @default(0) @db.Decimal(10, 2)
  shippingAmount    Decimal     @default(0) @db.Decimal(10, 2)
  discountAmount    Decimal     @default(0) @db.Decimal(10, 2)
  total             Decimal     @db.Decimal(10, 2)
  couponCode        String?
  shippingAddress   Json
  trackingNumber    String?
  carrier           String?
  utmSource         String?
  utmMedium         String?
  utmCampaign       String?
  notes             String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  customer          Customer    @relation(fields: [customerId], references: [id])
  items             OrderItem[]
  auditEvents       AuditEvent[]

  @@map("orders")
}

model OrderItem {
  id             String   @id @default(uuid())
  orderId        String
  productId      String
  sku            String
  productName    String
  quantity       Int
  unitPrice      Decimal  @db.Decimal(10, 2)
  lineTotal      Decimal  @db.Decimal(10, 2)
  discountAmount Decimal  @default(0) @db.Decimal(10, 2)
  createdAt      DateTime @default(now())
  order          Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product        Product  @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Customer {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  email       String   @unique
  phoneNumber String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      Order[]

  @@map("customers")
}

model Stock {
  id          String   @id @default(uuid())
  productId   String
  sku         String
  quantity    Int
  location    String   @default("warehouse")
  reason      String?
  createdAt   DateTime @default(now())
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("stocks")
}

model AuditEvent {
  id          String   @id @default(uuid())
  entityType  String
  entityId    String
  action      String
  userId      String?
  changes     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  order       Order?   @relation(fields: [entityId], references: [id], onDelete: Cascade)

  @@map("audit_events")
}
"@ | Out-File -FilePath prisma\schema.prisma -Encoding UTF8

# Step 5: Create .env file
Write-Host "Step 5: Creating .env file..." -ForegroundColor Cyan
@"
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ayurveda_admin"

# JWT
JWT_SECRET="your-secret-key-change-in-production-minimum-256-bits-required"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=3333
NODE_ENV=development

# Frontend
ADMIN_UI_URL="http://localhost:3000"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_REGION=ap-south-1
AWS_S3_BUCKET=ayurveda-media
"@ | Out-File -FilePath .env -Encoding UTF8

# Step 6: Generate Prisma Client
Write-Host "Step 6: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host ""
Write-Host "✅ NestJS backend created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. cd $PROJECT_NAME"
Write-Host "  2. Update .env with your database credentials"
Write-Host "  3. pnpm prisma migrate dev (if database exists)"
Write-Host "  4. pnpm start:dev"
Write-Host ""
Write-Host "Then update your Next.js .env:"
Write-Host "  NEXT_PUBLIC_API_URL=http://localhost:3333"
Write-Host ""
Write-Host "Access Swagger docs at: http://localhost:3333/api/docs"
Write-Host ""
