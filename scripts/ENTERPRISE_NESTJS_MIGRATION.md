# 🚀 Enterprise NestJS Migration Package

## Complete Spring Boot → NestJS Migration with 100% Feature Parity

This document provides the complete enterprise-grade NestJS monorepo structure for migrating your Ayurveda e-commerce platform from Spring Boot to NestJS.

---

## 📦 Quick Setup (5 Minutes)

Since you already have a working NestJS backend in `ayurveda-api/`, I'll enhance it to enterprise-grade with all Spring Boot features:

### Step 1: Enhance Existing NestJS Backend

```bash
cd ayurveda-api

# Install all required dependencies
pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt speakeasy qrcode
pnpm add @nestjs/throttler class-validator class-transformer zod
pnpm add razorpay stripe @grpc/grpc-js @grpc/proto-loader
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
pnpm add csv-parser csv-stringify

pnpm add -D @types/passport-jwt @types/passport-local @types/bcrypt @types/speakeasy @types/qrcode
```

### Step 2: Generate Module Structure

```bash
# Create all modules
nest g module auth
nest g module products
nest g module orders
nest g module customers
nest g module admin
nest g module payments
nest g module files
nest g module health

# Create services
nest g service auth
nest g service products
nest g service orders
nest g service customers
nest g service admin
nest g service payments
nest g service files

# Create controllers
nest g controller auth
nest g controller products
nest g controller orders
nest g controller customers
nest g controller admin
nest g controller payments
```

---

## 🏗️ Complete File Structure

```
ayurveda-api/
├── src/
│   ├── main.ts                    # ✅ Already exists (enhance)
│   ├── app.module.ts              # ✅ Already exists (enhance)
│   ├── app.controller.ts          # ✅ Already exists
│   │
│   ├── auth/                      # NEW - Complete auth module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── 2fa.guard.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       ├── refresh-token.dto.ts
│   │       └── two-fa.dto.ts
│   │
│   ├── products/                  # NEW - Complete products module
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       ├── update-product.dto.ts
│   │       ├── product-query.dto.ts
│   │       └── product-response.dto.ts
│   │
│   ├── orders/                    # NEW - Complete orders module
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── dto/
│   │       ├── order-query.dto.ts
│   │       ├── order-status-update.dto.ts
│   │       ├── refund.dto.ts
│   │       └── order-response.dto.ts
│   │
│   ├── customers/                 # NEW - Customers module
│   │   ├── customers.module.ts
│   │   ├── customers.controller.ts
│   │   └── customers.service.ts
│   │
│   ├── admin/                     # NEW - Admin dashboard
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   └── admin.service.ts
│   │
│   ├── payments/                  # NEW - Payment integrations
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── razorpay/
│   │   │   ├── razorpay.service.ts
│   │   │   └── razorpay.webhook.controller.ts
│   │   └── stripe/
│   │       ├── stripe.service.ts
│   │       └── stripe.webhook.controller.ts
│   │
│   ├── files/                     # NEW - S3 file uploads
│   │   ├── files.module.ts
│   │   ├── files.service.ts
│   │   └── s3.service.ts
│   │
│   ├── common/                    # NEW - Shared utilities
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts
│   │   └── decorators/
│   │       └── api-paginated-response.decorator.ts
│   │
│   └── prisma/                    # ✅ Already exists
│       ├── prisma.service.ts
│       └── prisma.module.ts
│
├── prisma/
│   └── schema.prisma              # ✅ Already exists (22 models)
│
├── .env                           # ✅ Already exists
├── .env.example                   # NEW
├── package.json                   # ✅ Enhance with new dependencies
├── tsconfig.json                  # ✅ Already exists
├── nest-cli.json                  # ✅ Already exists
│
├── Dockerfile                     # NEW
├── docker-compose.yml             # NEW
├── .dockerignore                  # NEW
│
├── railway.toml                   # NEW - Railway deployment
└── Procfile                       # NEW - Railway process
```

---

## 📝 Implementation Files

### 1. Enhanced `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Prisma shutdown hook
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Ayurveda E-Commerce API')
    .setDescription('Complete NestJS backend with JWT, 2FA, Payments, and ML integration')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Refresh-Token',
        in: 'header',
        description: 'Refresh token for obtaining new access token',
      },
      'refresh-token',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Products', 'Product management')
    .addTag('Orders', 'Order processing and management')
    .addTag('Customers', 'Customer management')
    .addTag('Payments', 'Payment processing')
    .addTag('Admin', 'Admin dashboard and analytics')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get('PORT') || 3333;
  await app.listen(port);

  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀  Ayurveda E-Commerce API');
  console.log('🚀 ========================================');
  console.log(`🚀  Application: http://localhost:${port}`);
  console.log(`📚  Swagger Docs: http://localhost:${port}/api-docs`);
  console.log(`❤️   Health Check: http://localhost:${port}/actuator/health`);
  console.log(`🔐  Auth Ready: JWT + 2FA`);
  console.log(`💳  Payments: Razorpay + Stripe`);
  console.log(`🗄️   Database: PostgreSQL + Prisma`);
  console.log('🚀 ========================================');
  console.log('');
}

bootstrap();
```

### 2. Enhanced `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    AdminModule,
    PaymentsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 3. Complete Auth Module

**`src/auth/auth.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m', // Access token expires in 15 minutes
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
```

**`src/auth/auth.service.ts`**:
```typescript
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { email: dto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        full_name: dto.fullName,
        phone_number: dto.phoneNumber,
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        created_at: true,
      },
    });

    // Audit log
    await this.createAuditLog(user.id, 'USER_REGISTERED', 'User', user.id);

    return user;
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user || !user.enabled) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.account_locked) {
      throw new UnauthorizedException('Account is locked');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      // Increment failed attempts
      await this.incrementFailedAttempts(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check 2FA
    if (user.two_fa_enabled && dto.twoFaCode) {
      const valid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: dto.twoFaCode,
      });

      if (!valid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    } else if (user.two_fa_enabled && !dto.twoFaCode) {
      return {
        requires2FA: true,
        userId: user.id,
      };
    }

    // Reset failed attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failed_login_attempts: 0,
        last_login_at: new Date(),
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Audit log
    await this.createAuditLog(user.id, 'USER_LOGIN', 'User', user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        roles: user.user_roles.map((ur) => ur.roles.name),
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          user_roles: {
            include: {
              roles: true,
            },
          },
        },
      });

      if (!user || !user.enabled) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async enableTwoFa(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.two_fa_enabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Ayurveda E-Commerce (${user.username})`,
      length: 32,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret (temporary - not yet enabled)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_secret: secret.base32,
      },
    });

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyTwoFa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.two_fa_secret) {
      throw new BadRequestException('2FA not initialized');
    }

    const valid = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!valid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    // Enable 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_enabled: true,
      },
    });

    // Audit log
    await this.createAuditLog(userId, '2FA_ENABLED', 'User', userId);

    return { success: true };
  }

  async disableTwoFa(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_enabled: false,
        two_fa_secret: null,
      },
    });

    // Audit log
    await this.createAuditLog(userId, '2FA_DISABLED', 'User', userId);

    return { success: true };
  }

  async logout(userId: string) {
    // Audit log
    await this.createAuditLog(userId, 'USER_LOGOUT', 'User', userId);
    return { success: true };
  }

  async getCurrentUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        phone_number: true,
        two_fa_enabled: true,
        last_login_at: true,
        created_at: true,
        user_roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async incrementFailedAttempts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const failedAttempts = (user.failed_login_attempts || 0) + 1;
    const shouldLock = failedAttempts >= 5;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failed_login_attempts: failedAttempts,
        account_locked: shouldLock,
      },
    });
  }

  private async createAuditLog(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    await this.prisma.auditEvent.create({
      data: {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        created_at: new Date(),
      },
    });
  }
}
```

Due to character limits, I'll create a comprehensive implementation document with all remaining modules. Let me continue:

