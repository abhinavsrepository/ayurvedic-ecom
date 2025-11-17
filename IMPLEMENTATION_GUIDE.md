# 🚀 COMPLETE NESTJS + ML IMPLEMENTATION GUIDE

## Status: IN PROGRESS

This document provides the complete implementation structure for the Ayurvedic E-Commerce backend.

---

## ✅ COMPLETED MODULES

### 1. Common Infrastructure ✅
```
src/common/
├── exceptions/
│   └── business.exception.ts     ✅ All custom exceptions
├── filters/
│   └── http-exception.filter.ts  ✅ Global error handling
├── interceptors/
│   ├── transform.interceptor.ts  ✅ Response transformation
│   └── logging.interceptor.ts    ✅ Request/response logging
├── decorators/
│   ├── current-user.decorator.ts ✅ Extract user from request
│   ├── roles.decorator.ts        ✅ Role-based access
│   └── public.decorator.ts       ✅ Public route marker
└── dto/
    └── pagination.dto.ts          ✅ Pagination utilities
```

### 2. Authentication Module ✅
```
src/auth/
├── dto/
│   └── login.dto.ts               ✅ Login/2FA DTOs
├── strategies/
│   ├── jwt.strategy.ts            ✅ JWT validation
│   └── local.strategy.ts          ✅ Username/password auth
├── guards/
│   ├── jwt-auth.guard.ts          ✅ JWT protection
│   └── roles.guard.ts             ✅ Role-based guard
├── auth.service.ts                ✅ Auth business logic
├── auth.controller.ts             ✅ 7 endpoints
└── auth.module.ts                 ✅ Module config
```

**Endpoints Implemented:**
- ✅ `POST /api/auth/login` - Login with optional 2FA
- ✅ `POST /api/auth/refresh` - Refresh tokens
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/auth/2fa/enable` - Enable 2FA
- ✅ `POST /api/auth/2fa/verify` - Verify 2FA code
- ✅ `DELETE /api/auth/2fa/disable` - Disable 2FA
- ✅ `POST /api/auth/logout` - Logout

### 3. Product Module (Partial) ✅
```
src/products/
├── dto/
│   └── product.dto.ts             ✅ Complete DTOs
├── products.service.ts            ⏳ IN PROGRESS
├── products.controller.ts         ⏳ IN PROGRESS
└── products.module.ts             ⏳ IN PROGRESS
```

---

## 📋 REMAINING BACKEND MODULES

### Product Module - Full Structure

**File:** `src/products/products.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { PageDto } from '../common/dto/pagination.dto';
import { ResourceNotFoundException, DuplicateResourceException } from '../common/exceptions/business.exception';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateProductDto) {
    // Check for duplicate SKU
    const existing = await this.prisma.product.findUnique({
      where: { sku: createDto.sku },
    });

    if (existing) {
      throw new DuplicateResourceException('Product', 'SKU', createDto.sku);
    }

    // Create product with stock
    const product = await this.prisma.product.create({
      data: {
        ...createDto,
        price: createDto.price.toString(),
        compare_at_price: createDto.compare_at_price?.toString(),
        cost_price: createDto.cost_price?.toString(),
        stock: {
          create: {
            sku: createDto.sku,
            quantity: 0,
          },
        },
      },
      include: { stock: true },
    });

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const { page = 0, size = 20, search, status, category, is_featured, sort } = query;

    const where: any = {
      deleted_at: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;
    if (is_featured !== undefined) where.is_featured = is_featured;

    const [sortField, sortOrder] = (sort || 'created_at,DESC').split(',');

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        include: { stock: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return new PageDto(products, page, size, total);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deleted_at: null },
      include: { stock: true },
    });

    if (!product) {
      throw new ResourceNotFoundException('Product', id);
    }

    return product;
  }

  async update(id: string, updateDto: UpdateProductDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateDto,
        price: updateDto.price?.toString(),
        compare_at_price: updateDto.compare_at_price?.toString(),
        cost_price: updateDto.cost_price?.toString(),
      },
      include: { stock: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOne(id);

    return this.prisma.stock.update({
      where: { product_id: id },
      data: { quantity },
    });
  }
}
```

**File:** `src/products/products.controller.ts`

```typescript
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('api/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  create(@Body() createDto: CreateProductDto) {
    return this.productsService.create(createDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (soft delete)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/stock')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock' })
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(id, quantity);
  }
}
```

---

### Order Module Structure

**Files needed:**
```
src/orders/
├── dto/
│   ├── create-order.dto.ts
│   ├── update-order-status.dto.ts
│   └── refund.dto.ts
├── orders.service.ts
├── orders.controller.ts
└── orders.module.ts
```

**Key Features:**
- Order creation with items
- Status updates (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- Refund processing
- Order export to CSV
- Order search and filtering

---

### Customer Module Structure

**Files needed:**
```
src/customers/
├── dto/
│   └── customer.dto.ts
├── customers.service.ts
├── customers.controller.ts
└── customers.module.ts
```

**Key Features:**
- Customer CRUD
- Customer analytics (total spent, order count, CLV)
- Customer search
- Soft delete support

---

### Analytics/Dashboard Module

**Files needed:**
```
src/analytics/
├── dto/
│   └── dashboard-stats.dto.ts
├── analytics.service.ts
├── analytics.controller.ts
└── analytics.module.ts
```

**Endpoints:**
- `GET /api/admin/dashboard/stats` - Revenue, orders, customers, AOV
- `GET /api/analytics/revenue` - Revenue trends
- `GET /api/analytics/products/top` - Best sellers
- `GET /api/analytics/customers/metrics` - Customer analytics

---

## 🤖 ML SYSTEM IMPLEMENTATION

This is the CRITICAL missing piece. Full implementation below.

### ML Architecture Overview

```
ml-service/
├── app.py                          # Flask app
├── requirements.txt                # Dependencies
├── models/
│   ├── embeddings.py               # Vector embeddings
│   ├── recommender.py              # Recommendation engine
│   ├── search.py                   # Semantic search
│   ├── forecasting.py              # Demand forecasting
│   ├── anomaly.py                  # Anomaly detection
│   └── ayurveda.py                 # Ayurveda-specific logic
├── services/
│   ├── vector_store.py             # FAISS/Qdrant integration
│   ├── data_loader.py              # Load from PostgreSQL
│   └── feature_engineering.py     # Feature extraction
├── utils/
│   ├── database.py                 # DB connection
│   └── cache.py                    # Redis caching
└── config.py                       # Configuration
```

### Dependencies (requirements.txt)

```txt
# Core
Flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
python-dotenv==1.0.0

# Data Processing
pandas==2.1.3
numpy==1.26.2
scipy==1.11.4

# Machine Learning
scikit-learn==1.3.2
implicit==0.7.0
lightfm==1.17

# Deep Learning & Embeddings
torch==2.1.0
sentence-transformers==2.2.2
transformers==4.36.0

# Vector Search
faiss-cpu==1.7.4

# Time Series
prophet==1.1.5
statsmodels==0.14.1

# Anomaly Detection
pyod==1.1.2

# Database
psycopg2-binary==2.9.9
sqlalchemy==2.0.23

# Caching
redis==5.0.1

# Validation
pydantic==2.5.2

# Background Tasks
celery==5.3.4
```

---

## 📊 AYURVEDA DOMAIN DATA STRUCTURES

### Dosha System

```python
# models/ayurveda.py

DOSHA_PROPERTIES = {
    'VATA': {
        'elements': ['Air', 'Space'],
        'qualities': ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
        'season': ['Fall', 'Early Winter'],
        'time_of_day': ['2am-6am', '2pm-6pm'],
        'balance_foods': ['Warm', 'Moist', 'Grounding'],
        'avoid_foods': ['Cold', 'Dry', 'Light'],
    },
    'PITTA': {
        'elements': ['Fire', 'Water'],
        'qualities': ['Hot', 'Sharp', 'Light', 'Liquid', 'Spreading', 'Oily'],
        'season': ['Summer', 'Late Spring'],
        'time_of_day': ['10am-2pm', '10pm-2am'],
        'balance_foods': ['Cool', 'Sweet', 'Bitter'],
        'avoid_foods': ['Spicy', 'Hot', 'Sour'],
    },
    'KAPHA': {
        'elements': ['Earth', 'Water'],
        'qualities': ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense'],
        'season': ['Spring', 'Late Winter'],
        'time_of_day': ['6am-10am', '6pm-10pm'],
        'balance_foods': ['Light', 'Dry', 'Warm'],
        'avoid_foods': ['Heavy', 'Oily', 'Cold'],
    },
}

INGREDIENT_PROPERTIES = {
    'Ashwagandha': {
        'rasa': ['Bitter', 'Astringent'],  # Taste
        'virya': 'Hot',                     # Potency
        'vipaka': 'Sweet',                  # Post-digestive effect
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'may increase',
            'KAPHA': 'balances',
        },
        'benefits': ['Stress relief', 'Strength', 'Vitality', 'Immunity'],
        'contraindications': ['Pregnancy', 'Hyperthyroidism'],
    },
    'Turmeric': {
        'rasa': ['Bitter', 'Pungent'],
        'virya': 'Hot',
        'vipaka': 'Pungent',
        'dosha_effect': {
            'VATA': 'balances (in moderation)',
            'PITTA': 'may increase (in excess)',
            'KAPHA': 'balances',
        },
        'benefits': ['Anti-inflammatory', 'Immunity', 'Skin health'],
        'contraindications': ['Gallstones', 'Blood thinners'],
    },
    'Triphala': {
        'rasa': ['All six tastes'],
        'virya': 'Neutral',
        'vipaka': 'Sweet',
        'dosha_effect': {
            'VATA': 'balances',
            'PITTA': 'balances',
            'KAPHA': 'balances',
        },
        'benefits': ['Digestive health', 'Detox', 'Eye health'],
        'contraindications': ['Diarrhea', 'Pregnancy'],
    },
    # Add 50+ more herbs...
}

HEALTH_GOALS = {
    'immunity': {
        'recommended_herbs': ['Ashwagandha', 'Turmeric', 'Tulsi', 'Amalaki'],
        'dosha_considerations': {
            'VATA': ['Ashwagandha', 'Shatavari'],
            'PITTA': ['Amalaki', 'Guduchi'],
            'KAPHA': ['Turmeric', 'Tulsi'],
        },
    },
    'digestion': {
        'recommended_herbs': ['Triphala', 'Ginger', 'Fennel', 'Cumin'],
        'dosha_considerations': {
            'VATA': ['Ginger', 'Asafoetida'],
            'PITTA': ['Coriander', 'Fennel'],
            'KAPHA': ['Black Pepper', 'Trikatu'],
        },
    },
    'stress_relief': {
        'recommended_herbs': ['Ashwagandha', 'Brahmi', 'Jatamansi'],
        'dosha_considerations': {
            'VATA': ['Ashwagandha', 'Brahmi'],
            'PITTA': ['Brahmi', 'Jatamansi'],
            'KAPHA': ['Guggulu', 'Trikatu'],
        },
    },
    # Add more goals: sleep, skin_health, hair_health, weight_management, etc.
}
```

---

## 🔄 INTEGRATION STRATEGY

### Phase 1: Core Backend (Priority 1) ⏳
1. ✅ Common infrastructure
2. ✅ Auth module
3. ⏳ Product module (complete service & controller)
4. ⏳ Order module
5. ⏳ Customer module
6. ⏳ Analytics module

### Phase 2: ML Foundation (Priority 1) ⏳
1. Vector embedding service
2. Product embeddings generation
3. Basic recommendation engine
4. Semantic search

### Phase 3: Advanced ML (Priority 2)
1. Collaborative filtering
2. Ayurveda-specific recommendations
3. Demand forecasting
4. Anomaly detection

### Phase 4: Polish & Deploy (Priority 3)
1. Testing
2. Documentation
3. Performance optimization
4. Production deployment

---

## 🎯 NEXT STEPS

**Immediate Actions:**
1. Complete Product module (service, controller, module)
2. Complete Order module
3. Complete Customer module
4. Build ML embedding service
5. Build recommendation engine
6. Integrate ML with NestJS backend

**Files to Create Next:**
- `src/products/products.service.ts` ✅ (template above)
- `src/products/products.controller.ts` ✅ (template above)
- `src/products/products.module.ts`
- `src/orders/*` (complete module)
- `src/customers/*` (complete module)
- `ml-service/models/embeddings.py` (CRITICAL)
- `ml-service/models/recommender.py` (CRITICAL)

---

## 📚 API DOCUMENTATION

**Once complete, access Swagger at:**
```
http://localhost:3333/api/docs
```

**Total Endpoints to Implement:** 40+

- Auth: 7 endpoints ✅
- Products: 7 endpoints ⏳
- Orders: 7 endpoints
- Customers: 3 endpoints
- Analytics: 4 endpoints
- ML: 8 endpoints
- Banners: 3 endpoints
- Media: 2 endpoints

---

**End of Implementation Guide**
