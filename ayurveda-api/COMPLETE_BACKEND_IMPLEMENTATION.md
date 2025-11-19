# 🚀 Complete NestJS Backend Implementation Guide

## ✅ Completed So Far

1. **Common Utilities** ✅
   - HTTP Exception Filter
   - Prisma Exception Filter
   - Logging Interceptor
   - Roles Guard
   - Decorators (@CurrentUser, @Roles, @Public)

2. **Auth Module** ✅
   - Complete JWT authentication
   - 2FA with TOTP
   - Refresh tokens
   - Role-based access control
   - All DTOs, strategies, guards

## 📋 Remaining Implementation

To complete today, run these NestJS CLI commands in sequence:

```bash
cd ayurveda-api

# Generate all modules
nest g module products
nest g module orders
nest g module customers
nest g module payments
nest g module admin
nest g module ml
nest g module files

# Generate all services
nest g service products
nest g service orders
nest g service customers
nest g service payments
nest g service admin
nest g service ml
nest g service files

# Generate all controllers
nest g controller products
nest g controller orders
nest g controller customers
nest g controller payments
nest g controller admin
nest g controller ml
```

This will create the scaffolding. Then I'll provide the complete implementations for each.

## 🔧 Environment Variables

Update `.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ayurveda_admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-production

# Server
PORT=3333
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Payments
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=ayurveda-media

# ML Service (Python)
ML_SERVICE_URL=http://localhost:5000

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## 📦 Quick Implementation Files

### Products Module

Create `src/products/dto/create-product.dto.ts`:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty() @IsString() sku: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsOptional() @IsString() short_description?: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty() @IsOptional() @IsNumber() compare_at_price?: number;
  @ApiProperty() @IsOptional() @IsNumber() cost_price?: number;
  @ApiProperty() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsOptional() @IsString() category?: string;
  @ApiProperty() @IsOptional() @IsString() brand?: string;
  @ApiProperty() @IsOptional() @IsNumber() weight_grams?: number;
  @ApiProperty() @IsOptional() @IsBoolean() is_featured?: boolean;
  @ApiProperty() @IsOptional() @IsString() seo_title?: string;
  @ApiProperty() @IsOptional() @IsString() seo_description?: string;
}
```

Create `src/products/dto/update-product.dto.ts`:
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

Create `src/products/dto/product-query.dto.ts`:
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brand?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number = 20;
}
```

### Orders Module DTOs

Create `src/orders/dto/order-query.dto.ts`:
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payment_status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fulfillment_status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customer_email?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() from_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to_date?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number = 20;
}
```

Create `src/orders/dto/update-order-status.dto.ts`:
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty() @IsString() @IsNotEmpty() status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
```

Create `src/orders/dto/refund.dto.ts`:
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class RefundDto {
  @ApiProperty() @IsNumber() @Min(0) amount: number;
  @ApiProperty() @IsString() reason: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
```

## 🎯 Main Files to Update

Update `src/main.ts` (enhanced version):
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Prisma shutdown
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ayurveda E-Commerce API')
    .setDescription('Complete enterprise backend with Auth, Products, Orders, Payments, ML')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-Refresh-Token', in: 'header' }, 'refresh-token')
    .addTag('Authentication')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Customers')
    .addTag('Payments')
    .addTag('Admin')
    .addTag('ML')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
    },
  });

  const port = configService.get('PORT') || 3333;
  await app.listen(port);

  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀  Ayurveda E-Commerce API');
  console.log('🚀 ========================================');
  console.log(`🚀  Application: http://localhost:${port}`);
  console.log(`📚  Swagger: http://localhost:${port}/api-docs`);
  console.log(`❤️   Health: http://localhost:${port}/actuator/health`);
  console.log(`🔐  Auth: JWT + 2FA + RBAC`);
  console.log(`💳  Payments: Razorpay + Stripe`);
  console.log(`🤖  AI/ML: Recommendations + Analytics`);
  console.log('🚀 ========================================');
  console.log('');
}

bootstrap();
```

Update `src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    // ProductsModule,    // Add after generation
    // OrdersModule,      // Add after generation
    // CustomersModule,   // Add after generation
    // PaymentsModule,    // Add after generation
    // AdminModule,       // Add after generation
    // MlModule,          // Add after generation
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // Global JWT guard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,     // Global roles guard
    },
  ],
})
export class AppModule {}
```

## 🚀 Quick Start

1. **Generate modules** (run the nest g commands above)
2. **Copy DTOs** (create the DTO files I provided)
3. **Update main.ts and app.module.ts**
4. **Implement services** (I'll provide complete implementations)
5. **Test endpoints**

## ⏭️ Next: Complete Service Implementations

Would you like me to:
A. Continue with complete Products service implementation?
B. Generate all module files at once via script?
C. Focus on specific high-priority modules first?

Let me know and I'll complete the entire backend today!
