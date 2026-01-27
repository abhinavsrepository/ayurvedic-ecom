The plan is complete with your preferences:
  - Razorpay as the primary payment gateway
  - Guest + authenticated cart with merge on login
  - All 6 modules to be implemented

  The plan covers:
  1. Cart Module - Guest/authenticated cart with session handling and merge functionality
  2. Reviews Module - Product reviews with ratings and helpful votes
  3. Blog Module - Content management for Ayurveda wisdom posts
  4. Address Module - Multiple address management with default selection
  5. User Profile Module - Profile editing, password change, avatar
  6. Payment Module - Complete Razorpay integration with webhooks

● User approved Claude's plan             
  ⎿  Plan saved to: ~\.claude\plans\vivid-wiggling-codd.md · /plan to edit
     Implementation Plan: Backend-Frontend Gap Resolution                                                                                                                                                       
     Overview                                                                                                                                                                                                
                                                                                                                                                                                                             
     This plan addresses the critical gaps between the frontend and backend of the Ayurveda e-commerce platform, implementing all 6 missing API modules.

     User Preferences

     - Payment Gateway: Razorpay (primary)
     - Cart Authentication: Both guest (session-based) and authenticated users with merge on login
     - Scope: All 6 modules (Cart, Reviews, Blog, Addresses, Profile, Payments)

     Current State

     - Backend: NestJS + Prisma + PostgreSQL with existing modules (Auth, Products, Orders, Customers, Payments, Analytics)
     - Frontend: Next.js with localStorage-based cart, mock checkout flow
     - Gap: 6 critical modules missing backend implementation

     ---
     Phase 1: Cart Management Module (CRITICAL)

     1.1 Database Schema (schema.prisma)

     Add new models:
     model Cart {
       id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       user_id     String?    @db.Uuid
       session_id  String?    @db.VarChar(255)
       created_at  DateTime   @default(now())
       updated_at  DateTime   @default(now())
       expires_at  DateTime?
       cart_items  CartItem[]

       @@unique([user_id])
       @@index([session_id])
       @@map("carts")
     }

     model CartItem {
       id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       cart_id     String   @db.Uuid
       product_id  String   @db.Uuid
       quantity    Int      @default(1)
       variant_id  String?  @db.VarChar(100)
       created_at  DateTime @default(now())
       updated_at  DateTime @default(now())
       cart        Cart     @relation(fields: [cart_id], references: [id], onDelete: Cascade)
       product     Product  @relation(fields: [product_id], references: [id])

       @@unique([cart_id, product_id, variant_id])
       @@map("cart_items")
     }

     1.2 Backend Files to Create

     ayurveda-api/src/cart/
     ├── cart.module.ts
     ├── cart.controller.ts
     ├── cart.service.ts
     └── dto/
         ├── add-cart-item.dto.ts
         ├── update-cart-item.dto.ts
         └── cart-response.dto.ts

     1.3 API Endpoints
     ┌────────┬─────────────────────────┬──────────────────────────────┬──────────┐
     │ Method │        Endpoint         │         Description          │   Auth   │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ GET    │ /api/cart               │ Get current cart             │ Optional │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ POST   │ /api/cart/items         │ Add item to cart             │ Optional │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ PATCH  │ /api/cart/items/:itemId │ Update item quantity         │ Optional │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ DELETE │ /api/cart/items/:itemId │ Remove item                  │ Optional │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ DELETE │ /api/cart               │ Clear cart                   │ Optional │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ POST   │ /api/cart/merge         │ Merge guest cart after login │ Required │
     ├────────┼─────────────────────────┼──────────────────────────────┼──────────┤
     │ GET    │ /api/cart/summary       │ Get cart totals              │ Optional │
     └────────┴─────────────────────────┴──────────────────────────────┴──────────┘
     1.4 Frontend Changes

     - Update lib/api/cart.ts - new API module
     - Update contexts/CartContext.tsx - sync with backend
     - Update app/cart/page.tsx - use API
     - Update app/checkout/page.tsx - use API

     ---
     Phase 2: Reviews & Ratings Module (CRITICAL)

     2.1 Database Schema

     model Review {
       id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       product_id   String   @db.Uuid
       customer_id  String   @db.Uuid
       rating       Int      @db.SmallInt
       title        String?  @db.VarChar(200)
       comment      String?
       is_verified  Boolean  @default(false)
       helpful_count Int     @default(0)
       status       String   @default("PENDING") @db.VarChar(20)
       created_at   DateTime @default(now())
       updated_at   DateTime @default(now())
       product      Product  @relation(fields: [product_id], references: [id])
       customer     Customer @relation(fields: [customer_id], references: [id])

       @@unique([product_id, customer_id])
       @@index([product_id])
       @@index([customer_id])
       @@map("reviews")
     }

     model ReviewHelpful {
       id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       review_id  String   @db.Uuid
       user_id    String   @db.Uuid
       created_at DateTime @default(now())

       @@unique([review_id, user_id])
       @@map("review_helpful")
     }

     2.2 Backend Files

     ayurveda-api/src/reviews/
     ├── reviews.module.ts
     ├── reviews.controller.ts
     ├── reviews.service.ts
     └── dto/
         ├── create-review.dto.ts
         ├── update-review.dto.ts
         └── query-review.dto.ts

     2.3 API Endpoints
     ┌────────┬─────────────────────────────────┬─────────────────────┬──────────────────┐
     │ Method │            Endpoint             │     Description     │       Auth       │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ GET    │ /api/reviews/product/:productId │ Get product reviews │ Public           │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ POST   │ /api/reviews                    │ Submit review       │ Required         │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ PATCH  │ /api/reviews/:id                │ Update review       │ Required (owner) │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ DELETE │ /api/reviews/:id                │ Delete review       │ Required (owner) │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ POST   │ /api/reviews/:id/helpful        │ Mark helpful        │ Required         │
     ├────────┼─────────────────────────────────┼─────────────────────┼──────────────────┤
     │ GET    │ /api/reviews/user               │ Get user's reviews  │ Required         │
     └────────┴─────────────────────────────────┴─────────────────────┴──────────────────┘
     2.4 Frontend Changes

     - Create lib/api/reviews.ts
     - Update product detail page with reviews component
     - Add review form component

     ---
     Phase 3: Blog Management Module (HIGH)

     3.1 Database Schema

     model BlogPost {
       id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       title          String   @db.VarChar(500)
       slug           String   @unique @db.VarChar(200)
       excerpt        String?  @db.VarChar(1000)
       content        String
       featured_image String?  @db.VarChar(1000)
       author_id      String   @db.Uuid
       category       String?  @db.VarChar(100)
       status         String   @default("DRAFT") @db.VarChar(20)
       published_at   DateTime?
       seo_title      String?  @db.VarChar(200)
       seo_description String? @db.VarChar(500)
       created_at     DateTime @default(now())
       updated_at     DateTime @default(now())
       author         User     @relation(fields: [author_id], references: [id])
       tags           BlogTag[]

       @@index([slug])
       @@index([status])
       @@index([category])
       @@map("blog_posts")
     }

     model BlogTag {
       id      String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       post_id String   @db.Uuid
       tag     String   @db.VarChar(100)
       post    BlogPost @relation(fields: [post_id], references: [id], onDelete: Cascade)

       @@unique([post_id, tag])
       @@map("blog_tags")
     }

     3.2 Backend Files

     ayurveda-api/src/blog/
     ├── blog.module.ts
     ├── blog.controller.ts
     ├── blog.service.ts
     └── dto/
         ├── create-post.dto.ts
         ├── update-post.dto.ts
         └── query-post.dto.ts

     3.3 API Endpoints
     ┌────────┬──────────────────────────┬──────────────────┬────────┐
     │ Method │         Endpoint         │   Description    │  Auth  │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ GET    │ /api/blog/posts          │ Get all posts    │ Public │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ GET    │ /api/blog/posts/:slug    │ Get post by slug │ Public │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ GET    │ /api/blog/categories     │ Get categories   │ Public │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ GET    │ /api/blog/posts/tag/:tag │ Get by tag       │ Public │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ POST   │ /api/blog/posts          │ Create post      │ Admin  │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ PUT    │ /api/blog/posts/:id      │ Update post      │ Admin  │
     ├────────┼──────────────────────────┼──────────────────┼────────┤
     │ DELETE │ /api/blog/posts/:id      │ Delete post      │ Admin  │
     └────────┴──────────────────────────┴──────────────────┴────────┘
     3.4 Frontend Changes

     - Create lib/api/blog.ts
     - Update app/blog/page.tsx to use API
     - Update app/blog/[slug]/page.tsx to use API

     ---
     Phase 4: Address Management Module (MEDIUM-HIGH)

     4.1 Database Schema

     model Address {
       id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
       customer_id  String   @db.Uuid
       label        String?  @db.VarChar(50)
       first_name   String   @db.VarChar(100)
       last_name    String   @db.VarChar(100)
       phone        String?  @db.VarChar(20)
       address_line1 String  @db.VarChar(255)
       address_line2 String? @db.VarChar(255)
       city         String   @db.VarChar(100)
       state        String   @db.VarChar(100)
       postal_code  String   @db.VarChar(20)
       country      String   @default("India") @db.VarChar(100)
       is_default   Boolean  @default(false)
       address_type String   @default("SHIPPING") @db.VarChar(20)
       created_at   DateTime @default(now())
       updated_at   DateTime @default(now())
       customer     Customer @relation(fields: [customer_id], references: [id], onDelete: Cascade)

       @@index([customer_id])
       @@map("addresses")
     }

     4.2 Backend Files

     ayurveda-api/src/addresses/
     ├── addresses.module.ts
     ├── addresses.controller.ts
     ├── addresses.service.ts
     └── dto/
         ├── create-address.dto.ts
         └── update-address.dto.ts

     4.3 API Endpoints
     ┌────────┬────────────────────────────┬───────────────────┬──────────┐
     │ Method │          Endpoint          │    Description    │   Auth   │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ GET    │ /api/addresses             │ Get all addresses │ Required │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ POST   │ /api/addresses             │ Create address    │ Required │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ PATCH  │ /api/addresses/:id         │ Update address    │ Required │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ DELETE │ /api/addresses/:id         │ Delete address    │ Required │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ POST   │ /api/addresses/:id/default │ Set default       │ Required │
     ├────────┼────────────────────────────┼───────────────────┼──────────┤
     │ GET    │ /api/addresses/default     │ Get default       │ Required │
     └────────┴────────────────────────────┴───────────────────┴──────────┘
     ---
     Phase 5: User Profile Management (MEDIUM-HIGH)

     5.1 Backend Files

     ayurveda-api/src/users/
     ├── users.module.ts
     ├── users.controller.ts
     ├── users.service.ts
     └── dto/
         ├── update-profile.dto.ts
         └── change-password.dto.ts

     5.2 API Endpoints
     ┌────────┬────────────────────────┬─────────────────┬──────────┐
     │ Method │        Endpoint        │   Description   │   Auth   │
     ├────────┼────────────────────────┼─────────────────┼──────────┤
     │ GET    │ /api/users/me          │ Get profile     │ Required │
     ├────────┼────────────────────────┼─────────────────┼──────────┤
     │ PATCH  │ /api/users/me          │ Update profile  │ Required │
     ├────────┼────────────────────────┼─────────────────┼──────────┤
     │ POST   │ /api/users/me/password │ Change password │ Required │
     ├────────┼────────────────────────┼─────────────────┼──────────┤
     │ POST   │ /api/users/me/avatar   │ Update avatar   │ Required │
     ├────────┼────────────────────────┼─────────────────┼──────────┤
     │ DELETE │ /api/users/me/account  │ Delete account  │ Required │
     └────────┴────────────────────────┴─────────────────┴──────────┘
     ---
     Phase 6: Payment Enhancement - Razorpay (CRITICAL)

     6.1 Backend Files to Update

     ayurveda-api/src/payments/
     ├── payments.controller.ts (add new endpoints)
     ├── payments.service.ts (enhance)
     ├── razorpay/razorpay.service.ts (complete implementation)
     └── dto/
         ├── create-payment-intent.dto.ts
         └── payment-webhook.dto.ts

     6.2 Razorpay Integration

     - Create Razorpay order with order_id
     - Frontend opens Razorpay checkout modal
     - Verify signature on callback
     - Update order payment status

     6.3 Additional Endpoints
     ┌────────┬────────────────────────────────┬──────────────────────────┬───────────────────┐
     │ Method │            Endpoint            │       Description        │       Auth        │
     ├────────┼────────────────────────────────┼──────────────────────────┼───────────────────┤
     │ POST   │ /api/payments/razorpay/order   │ Create Razorpay order    │ Required          │
     ├────────┼────────────────────────────────┼──────────────────────────┼───────────────────┤
     │ POST   │ /api/payments/razorpay/verify  │ Verify payment signature │ Required          │
     ├────────┼────────────────────────────────┼──────────────────────────┼───────────────────┤
     │ POST   │ /api/payments/webhook/razorpay │ Razorpay webhook         │ Public (verified) │
     ├────────┼────────────────────────────────┼──────────────────────────┼───────────────────┤
     │ GET    │ /api/payments/status/:orderId  │ Get payment status       │ Required          │
     ├────────┼────────────────────────────────┼──────────────────────────┼───────────────────┤
     │ POST   │ /api/payments/refund           │ Process refund           │ Admin             │
     └────────┴────────────────────────────────┴──────────────────────────┴───────────────────┘
     ---
     Implementation Order

     Week 1-2: Critical

     1. Cart Module - Backend + Frontend integration
     2. Reviews Module - Backend + Frontend integration

     Week 2-3: Critical

     3. Blog Module - Backend + Frontend integration
     4. Payment Enhancement - Complete Razorpay integration

     Week 3-4: High Priority

     5. Address Module - Backend + Frontend integration
     6. User Profile Module - Backend + Frontend integration

     ---
     Files to Modify/Create

     Backend (ayurveda-api)

     prisma/schema.prisma                    - Add 6 new models
     src/app.module.ts                       - Register new modules
     src/cache/cache.constants.ts            - Add cache keys
     src/cart/                               - NEW module (5 files)
     src/reviews/                            - NEW module (5 files)
     src/blog/                               - NEW module (5 files)
     src/addresses/                          - NEW module (4 files)
     src/users/                              - NEW module (4 files)
     src/payments/                           - UPDATE existing (3 files)

     Frontend (ayurveda-shop)

     lib/api/cart.ts                         - NEW API module
     lib/api/reviews.ts                      - NEW API module
     lib/api/blog.ts                         - NEW API module
     lib/api/addresses.ts                    - NEW API module
     lib/api/users.ts                        - NEW API module
     lib/api/types.ts                        - Add new types
     contexts/CartContext.tsx                - UPDATE for API sync
     app/cart/page.tsx                       - UPDATE
     app/checkout/page.tsx                   - UPDATE
     app/product/[slug]/ProductClient.tsx    - ADD reviews
     app/blog/page.tsx                       - UPDATE
     app/blog/[slug]/page.tsx                - UPDATE

     ---
     Verification Plan

     After Each Module:

     1. Run npx prisma migrate dev to apply schema changes
     2. Start backend: npm run start:dev
     3. Test endpoints via Swagger UI at http://localhost:3333/api
     4. Test frontend integration in browser

     End-to-End Tests:

     1. Cart Flow: Add items → Update quantity → Remove → Clear → Checkout
     2. Reviews Flow: Submit review → Edit → Mark helpful → Delete
     3. Blog Flow: List posts → View post → Filter by category/tag
     4. Address Flow: Create → Update → Set default → Delete
     5. Profile Flow: View → Update → Change password

     ---
     Dependencies & Notes

     - All new modules follow existing patterns from Products/Orders modules
     - Use existing CacheService for Redis caching
     - Use existing auth guards (JwtAuthGuard, RolesGuard)
     - Use existing Prisma patterns for transactions
     - Frontend uses existing apiClient for all API calls

● The plan is approved. Let me create tasks to track progress and start implementing.
