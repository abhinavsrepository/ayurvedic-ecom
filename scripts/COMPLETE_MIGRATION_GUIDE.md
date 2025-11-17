# 🚀 Complete Enterprise NestJS Migration - Production Ready

## ✅ Current Status

You already have:
- ✅ Working NestJS backend (`ayurveda-api/`) on port 3333
- ✅ Database connected (PostgreSQL with 22 models via Prisma)
- ✅ Basic health check and products endpoints
- ✅ All enterprise dependencies installed (JWT, Passport, Bcrypt, Speakeasy, Razorpay, Stripe, S3, CSV)
- ✅ Next.js frontend configured to use NestJS

## 🎯 What We're Adding

To achieve 100% Spring Boot feature parity:
1. **Complete Auth Module** - JWT + 2FA + Refresh Tokens + RBAC
2. **Enhanced Products Module** - Full CRUD + Search + CSV + S3 uploads
3. **Complete Orders Module** - Filtering + Status updates + Refunds + Export
4. **Customers Module** - Customer management
5. **Payments Module** - Razorpay + Stripe webhooks
6. **Admin Module** - Dashboard analytics
7. **Global Utilities** - Guards, Filters, Interceptors, Decorators

---

## 📋 Implementation Checklist

### Phase 1: Foundation (15 minutes)
- [ ] Create directory structure
- [ ] Set up environment variables
- [ ] Create common utilities (guards, filters, decorators)

### Phase 2: Auth Module (30 minutes)
- [ ] JWT strategies (access + refresh)
- [ ] 2FA implementation (TOTP)
- [ ] Role-based access control
- [ ] Auth endpoints (login, register, refresh, 2FA)

### Phase 3: Products Module (25 minutes)
- [ ] Full CRUD operations
- [ ] Search and filtering
- [ ] CSV import/export
- [ ] S3 file uploads (presigned URLs)

### Phase 4: Orders Module (25 minutes)
- [ ] Order listing with advanced filters
- [ ] Order details
- [ ] Status updates
- [ ] Refund processing
- [ ] CSV export

### Phase 5: Supporting Modules (20 minutes)
- [ ] Customers module
- [ ] Payments module (Razorpay + Stripe)
- [ ] Admin analytics

### Phase 6: Deployment (15 minutes)
- [ ] Docker configuration
- [ ] Railway deployment
- [ ] Environment templates
- [ ] Testing & verification

**Total Time: ~2.5 hours**

---

## 🚀 Quick Start Implementation

### Step 1: Create Directory Structure

```bash
cd ayurveda-api

# Create all module directories
mkdir -p src/auth/{strategies,guards,decorators,dto}
mkdir -p src/products/dto
mkdir -p src/orders/dto
mkdir -p src/customers/dto
mkdir -p src/admin
mkdir -p src/payments/{razorpay,stripe}
mkdir -p src/files
mkdir -p src/common/{filters,interceptors,pipes,decorators,guards}
```

### Step 2: Update Environment Variables

**File: `ayurveda-api/.env`**
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ayurveda_admin

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars

# Server
PORT=3333
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Frontend URL
ADMIN_UI_URL=http://localhost:3000

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=ayurveda-media
S3_CDN_URL=https://cdn.your-domain.com

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

---

## 📝 Complete Implementation Files

### 1. Common Utilities

**File: `src/common/filters/http-exception.filter.ts`**
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : exceptionResponse,
    };

    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(errorResponse)}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
```

**File: `src/common/filters/prisma-exception.filter.ts`**
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      default:
        message = exception.message;
    }

    this.logger.error(`Prisma Error: ${exception.code} - ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      code: exception.code,
    });
  }
}
```

**File: `src/common/interceptors/logging.interceptor.ts`**
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${delay}ms`,
        );
      }),
    );
  }
}
```

**File: `src/common/interceptors/transform.interceptor.ts`**
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**File: `src/common/decorators/roles.decorator.ts`**
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

**File: `src/common/decorators/current-user.decorator.ts`**
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

**File: `src/common/decorators/public.decorator.ts`**
```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**File: `src/common/guards/roles.guard.ts`**
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

---

### 2. Auth Module Implementation

**File: `src/auth/auth.module.ts`** (already shown in ENTERPRISE_NESTJS_MIGRATION.md)

**File: `src/auth/dto/login.dto.ts`**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  twoFaCode?: string;
}
```

**File: `src/auth/dto/register.dto.ts`**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
```

**File: `src/auth/strategies/jwt.strategy.ts`**
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; username: string; roles: string[] }) {
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
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };
  }
}
```

**File: `src/auth/strategies/jwt-refresh.strategy.ts`**
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.enabled) {
      throw new UnauthorizedException();
    }

    return { id: user.id, username: user.username };
  }
}
```

**File: `src/auth/guards/jwt-auth.guard.ts`**
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

**File: `src/auth/auth.controller.ts`**
```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refreshToken(@Headers('x-refresh-token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getCurrentUser(@CurrentUser('id') userId: string) {
    return this.authService.getCurrentUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA' })
  enableTwoFa(@CurrentUser('id') userId: string) {
    return this.authService.enableTwoFa(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA code' })
  verifyTwoFa(
    @CurrentUser('id') userId: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyTwoFa(userId, code);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('2fa/disable')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable 2FA' })
  disableTwoFa(@CurrentUser('id') userId: string) {
    return this.authService.disableTwoFa(userId);
  }
}
```

---

## 🎯 Next Steps

Due to character limits, I've created:
1. ✅ Complete foundation (filters, interceptors, guards, decorators)
2. ✅ Complete Auth module (JWT + 2FA + RBAC)
3. 📋 Structure for remaining modules

**To continue the migration:**

1. Review the `ENTERPRISE_NESTJS_MIGRATION.md` file for the complete Auth Service implementation
2. I can generate the remaining modules:
   - Products Module (CRUD + CSV + S3)
   - Orders Module (filtering + refunds)
   - Payments Module (Razorpay + Stripe)
   - Admin Module (analytics)

**Would you like me to:**
A. Continue generating all remaining modules?
B. Focus on specific modules (Products, Orders, Payments)?
C. Create Docker and deployment configs first?

Let me know and I'll continue building out the complete enterprise solution!

