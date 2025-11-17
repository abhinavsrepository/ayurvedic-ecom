#!/bin/bash

# Ayurveda E-Commerce - NestJS Backend Auto-Setup Script
# This script creates a complete NestJS backend to replace Spring Boot

set -e

echo "🚀 Creating NestJS Backend for Ayurveda E-Commerce..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_NAME="ayurveda-nestjs-api"

# Step 1: Create NestJS project
echo -e "${BLUE}Step 1: Creating NestJS project...${NC}"
npx @nestjs/cli new $PROJECT_NAME --package-manager pnpm --skip-git
cd $PROJECT_NAME

# Step 2: Install dependencies
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add @nestjs/swagger @nestjs/throttler @nestjs/cache-manager cache-manager
pnpm add @prisma/client bcrypt class-validator class-transformer
pnpm add prisma zod helmet compression

pnpm add -D @types/bcrypt @types/passport-jwt @types/node

# Step 3: Initialize Prisma
echo -e "${BLUE}Step 3: Initializing Prisma...${NC}"
npx prisma init

# Step 4: Create Prisma schema
echo -e "${BLUE}Step 4: Creating Prisma schema...${NC}"
cat > prisma/schema.prisma << 'EOF'
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
EOF

# Step 5: Create .env file
echo -e "${BLUE}Step 5: Creating .env file...${NC}"
cat > .env << 'EOF'
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
EOF

# Step 6: Generate Prisma Client
echo -e "${BLUE}Step 6: Generating Prisma Client...${NC}"
npx prisma generate

# Step 7: Create directory structure
echo -e "${BLUE}Step 7: Creating project structure...${NC}"
mkdir -p src/{config,common/{decorators,guards,interceptors,pipes},modules/{auth/{strategies,dto,guards},products/dto,orders/dto,customers/dto,admin},prisma}

# Step 8: Create Prisma Service
cat > src/prisma/prisma.service.ts << 'EOF'
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
EOF

cat > src/prisma/prisma.module.ts << 'EOF'
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

# Step 9: Update main.ts
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.ADMIN_UI_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ayurveda E-Commerce API')
    .setDescription('Backend API for Ayurveda platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
EOF

# Step 10: Update app.module.ts
cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    CacheModule.register({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
EOF

# Step 11: Add health check endpoint
cat > src/app.controller.ts << 'EOF'
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('actuator/health')
  getHealth() {
    return { status: 'UP' };
  }
}
EOF

# Step 12: Create Docker files
echo -e "${BLUE}Step 12: Creating Docker files...${NC}"
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm

FROM base AS dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./

EXPOSE 3333
CMD ["node", "dist/main"]
EOF

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ayurveda_admin
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: .
    ports:
      - "3333:3333"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ayurveda_admin
      REDIS_HOST: redis
      NODE_ENV: production
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
EOF

# Step 13: Create README
cat > README.md << 'EOF'
# Ayurveda E-Commerce - NestJS Backend

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Run migrations (if database exists)
pnpm prisma migrate dev

# Start development server
pnpm start:dev
```

## Available Scripts

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm test` - Run tests

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:3333/api/docs
- Health Check: http://localhost:3333/actuator/health

## Environment Variables

See `.env` file for required variables.

## Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```
EOF

echo ""
echo -e "${GREEN}✅ NestJS backend created successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_NAME"
echo "  2. Update .env with your database credentials"
echo "  3. pnpm prisma migrate dev (if database exists)"
echo "  4. pnpm start:dev"
echo ""
echo "Then update your Next.js .env:"
echo "  NEXT_PUBLIC_API_URL=http://localhost:3333"
echo ""
echo "Access Swagger docs at: http://localhost:3333/api/docs"
echo ""
