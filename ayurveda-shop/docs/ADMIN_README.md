# Ayurveda eCommerce - Admin Panel

> Production-grade admin panel built with Next.js 16, TypeScript, shadcn/ui, and Framer Motion

[![CI/CD](https://github.com/abhinavsrepository/ayurvedic-ecom/workflows/Admin%20Panel%20CI%2FCD/badge.svg)](https://github.com/abhinavsrepository/ayurvedic-ecom/actions)
[![codecov](https://codecov.io/gh/abhinavsrepository/ayurvedic-ecom/branch/main/graph/badge.svg)](https://codecov.io/gh/abhinavsrepository/ayurvedic-ecom)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Admin Modules](#admin-modules)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Accessibility](#accessibility)
- [Contributing](#contributing)

---

## ✨ Features

### Core Admin Modules
- **📊 Dashboard**: Real-time KPIs (GMV, AOV, conversion rate), order tracking, inventory alerts
- **🛍️ Products**: Full CRUD, variants, bulk CSV import/export, media manager (S3), draft/stage workflow
- **📦 Orders**: Advanced filtering, timeline view, partial refunds, PDF invoice generation
- **📦 Inventory**: Low-stock alerts, ML-powered reorder suggestions, warehouse management
- **👥 Customers**: Profiles, LTV calculation, segmentation, support tickets, GDPR compliance
- **🎁 Promotions**: Coupons, BOGO deals, scheduled discounts, usage tracking
- **📝 Content**: Blog manager (WYSIWYG/MDX), hero banners with drag-drop reordering
- **📈 Analytics**: Funnels, cohorts, saved reports, CSV export
- **👔 Users & Roles**: Role-based access control, permissions, comprehensive audit logs
- **🔗 Webhooks**: Manage endpoints, delivery history, automatic retries
- **🚩 Feature Flags**: A/B testing, gradual rollouts, percentage-based targeting
- **🤖 ML Panel**: Trigger model retraining, preview recommendations, deploy versions
- **⚙️ Settings**: Payment gateways, shipping rates, integrations, sitemap regeneration

### UI/UX Excellence
- 🎨 **Consistent Design System**: shadcn/ui components with Ayurvedic color palette (greens, creams, earthy browns)
- ✨ **Smooth Animations**: Framer Motion for KPI cards, modals, drag-to-reorder, hover effects
- 📊 **Advanced Data Tables**: Virtualized lists, server-side pagination, column sorting & filtering
- 📱 **Fully Responsive**: Mobile-first design, works seamlessly on all devices
- ♿ **WCAG Compliant**: Accessible to all users, keyboard navigation, screen reader support
- 🌓 **Dark Mode**: Built-in dark mode with persistent user preference

### Developer Experience
- 🧪 **Comprehensive Testing**: Jest (unit), React Testing Library, Playwright (E2E)
- 📚 **Storybook Integration**: Component documentation and visual testing
- 🔍 **Type Safety**: Full TypeScript coverage
- 🎯 **Linting & Formatting**: ESLint, Prettier with pre-commit hooks
- 🚀 **CI/CD Pipeline**: Automated testing, building, and deployment
- 📖 **API Documentation**: OpenAPI contracts for all backend endpoints

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **UI Components** | shadcn/ui, Radix UI, Tailwind CSS 3.4 |
| **Animations** | Framer Motion 12 |
| **Data Fetching** | TanStack Query (React Query), SWR |
| **Forms** | react-hook-form, Zod validation |
| **Auth** | NextAuth.js with role-based access |
| **Charts** | Recharts, Chart.js |
| **Tables** | TanStack Table with virtualization |
| **Testing** | Jest, React Testing Library, Playwright |
| **Dev Tools** | Storybook, ESLint, Prettier, Husky |
| **CI/CD** | GitHub Actions, Vercel |
| **Monitoring** | Sentry (errors), Prometheus (metrics) |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher (or yarn/pnpm)
- **Git**: Latest version
- **Backend API**: NestJS backend running (see backend README)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abhinavsrepository/ayurvedic-ecom.git
cd ayurvedic-ecom/ayurveda-shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database (if needed for NextAuth)
DATABASE_URL=postgresql://user:password@localhost:5432/ayurveda_db

# S3 / Media Storage
NEXT_PUBLIC_S3_BUCKET=ayurveda-products
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1

# Razorpay (for payment management)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_***
RAZORPAY_KEY_SECRET=***

# Sentry (optional - for error tracking)
NEXT_PUBLIC_SENTRY_DSN=https://***@sentry.io/***

# Feature Flags
NEXT_PUBLIC_ENABLE_ML_FEATURES=true
```

### 4. Run Database Migrations (if using NextAuth with database)

```bash
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000/admin`

### 6. Default Admin Credentials (Development Only)

```
Email: admin@ayurveda.com
Password: Test@1234
```

⚠️ **Important**: Change these credentials in production!

---

## 📁 Project Structure

```
ayurveda-shop/
├── app/
│   ├── admin/                   # Admin panel routes
│   │   ├── analytics/           # Analytics page
│   │   ├── banners/             # Banner management
│   │   ├── content/             # Content management (Blog + Banners)
│   │   ├── customers/           # Customer management
│   │   ├── device-analytics/    # Device analytics
│   │   ├── feature-flags/       # Feature flags management
│   │   ├── geographic/          # Geographic analytics
│   │   ├── inventory/           # Inventory management
│   │   ├── login/               # Admin login
│   │   ├── ml/                  # ML & AI panel
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product management
│   │   ├── promotions/          # Promotions & coupons
│   │   ├── register/            # Admin registration
│   │   ├── settings/            # Admin settings
│   │   ├── traffic-sources/     # Traffic source analytics
│   │   ├── users-roles/         # Users & roles management
│   │   ├── webhooks/            # Webhook management
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   └── page.tsx             # Dashboard
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── admin/                   # Admin-specific components
│   └── shared/                  # Shared components
├── lib/
│   ├── api/                     # API client functions
│   │   ├── admin.ts             # Admin API calls
│   │   ├── products.ts          # Products API
│   │   ├── orders.ts            # Orders API
│   │   └── ...
│   ├── utils.ts                 # Utility functions
│   ├── socket.ts                # WebSocket client
│   └── validation.ts            # Zod schemas
├── hooks/
│   ├── useFeatureFlag.ts        # Feature flag hook
│   ├── useAuth.ts               # Authentication hook
│   └── ...
├── contexts/
│   ├── AdminAuthContext.tsx     # Admin auth context
│   └── ...
├── types/
│   ├── admin.ts                 # Admin type definitions
│   ├── product.ts               # Product types
│   └── ...
├── __tests__/                   # Unit tests
│   ├── components/
│   └── lib/
├── e2e/                         # E2E tests
│   ├── admin-login.spec.ts
│   ├── admin-products.spec.ts
│   └── ...
├── .storybook/                  # Storybook configuration
│   ├── main.ts
│   └── preview.tsx
├── docs/                        # Documentation
│   ├── ADMIN_API_CONTRACTS.md   # API contracts
│   ├── ADMIN_README.md          # This file
│   └── ACCESSIBILITY.md         # Accessibility guidelines
├── public/                      # Static assets
├── .env.example                 # Example environment variables
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── components.json              # shadcn/ui configuration
├── jest.config.ts               # Jest configuration
├── playwright.config.ts         # Playwright configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🎯 Admin Modules

### Dashboard
- **KPI Cards**: GMV, AOV, Conversion Rate, Active Users (animated with Framer Motion)
- **Real-time Updates**: WebSocket integration for live order notifications
- **Revenue Chart**: Line chart showing revenue and order trends
- **Recent Orders**: Quick access to latest orders with status badges

### Products
- **CRUD Operations**: Create, read, update, delete products with validation
- **Variants**: Manage product variants (size, color, pack size)
- **Bulk Import**: Upload CSV files to import multiple products at once
- **Bulk Export**: Download products as CSV for external processing
- **Media Manager**: Upload images to S3, crop, resize, optimize
- **Draft/Published**: Workflow for staging products before publishing
- **Ayurvedic Metadata**: Dosha tags, benefits, ingredients, traditional uses
- **SEO**: Meta titles, descriptions, structured data

### Orders
- **Advanced Filters**: Status, date range, customer, payment method
- **Timeline View**: Visual timeline of order status changes
- **Partial Refunds**: Support for partial refunds with reason tracking
- **PDF Invoices**: Generate and download professional invoices
- **Shipping Labels**: Integration with shipping providers
- **Order Notes**: Internal notes for order processing

### Inventory
- **Stock Tracking**: Real-time inventory levels across warehouses
- **Low Stock Alerts**: Automatic notifications when stock falls below threshold
- **ML Forecasting**: AI-powered demand forecasting and reorder suggestions
- **Stock Adjustments**: Manual adjustments with reason tracking
- **Transfer Requests**: Transfer stock between warehouses

### Promotions
- **Coupon Codes**: Create percentage, fixed amount, or BOGO discounts
- **Usage Limits**: Set maximum redemptions per code
- **Scheduled Campaigns**: Start/end dates for automatic activation
- **Minimum Purchase**: Require minimum order value
- **Product Filters**: Apply to specific products or categories
- **Usage Analytics**: Track coupon performance

### Content Management
- **Blog Posts**: WYSIWYG editor (or MDX support) for creating educational content
- **SEO Optimization**: Meta tags, slugs, featured images
- **Banners**: Upload hero banners with drag-and-drop reordering
- **Scheduling**: Schedule content for future publication

### Users & Roles
- **User Management**: Create, edit, deactivate admin users
- **Role-Based Access**: Assign roles (ADMIN, OPS, FINANCE, SUPPORT)
- **Permissions**: Granular permissions per resource
- **Audit Logs**: Track all admin actions with timestamps, IP addresses
- **Session Management**: View and revoke active sessions

### Webhooks
- **Endpoint Management**: Configure webhook URLs and events
- **Event Subscriptions**: Order events, product events, payment events
- **Delivery History**: View success/failure logs
- **Retry Mechanism**: Automatic and manual retry for failed deliveries
- **Secret Validation**: HMAC signatures for secure webhooks

### Feature Flags
- **Progressive Rollout**: Enable features for percentage of users
- **Target Audiences**: All users, staff only, beta testers, percentage
- **Code Examples**: Built-in code snippets for implementation
- **Toggle**: Quickly enable/disable features without deployment

### ML Panel
- **Model Management**: View available ML models and versions
- **Trigger Retraining**: Manually trigger model retraining with new data
- **Preview Recommendations**: Test recommendations for specific users/products
- **Deploy Models**: Deploy new model versions to production
- **Performance Metrics**: View model accuracy, latency, throughput

---

## 🔌 API Integration

All admin features consume REST APIs from the NestJS backend. See [ADMIN_API_CONTRACTS.md](./ADMIN_API_CONTRACTS.md) for complete API documentation.

### Example: Fetching Products

```typescript
// lib/api/products.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsApi = {
  list: async (params: ListProductsParams) => {
    const { data } = await api.get('/admin/products', { params });
    return data;
  },

  create: async (product: CreateProductDto) => {
    const { data } = await api.post('/admin/products', product);
    return data;
  },

  update: async (id: string, product: UpdateProductDto) => {
    const { data } = await api.put(`/admin/products/${id}`, product);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  },

  bulkImport: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/admin/products/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  export: async (filters: any) => {
    const { data } = await api.get('/admin/products/export', {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};
```

### Using React Query

```typescript
// app/admin/products/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

export default function ProductsPage() {
  const queryClient = useQueryClient();

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['products', { page: 0, size: 20 }],
    queryFn: () => productsApi.list({ page: 0, size: 20 }),
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created successfully');
    },
  });

  // ...
}
```

---

## 🔐 Authentication & Authorization

### NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (res.data && res.data.token) {
            return {
              id: res.data.user.id,
              name: res.data.user.fullName,
              email: res.data.user.email,
              roles: res.data.user.roles,
              token: res.data.token,
            };
          }
          return null;
        } catch (error) {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Protected Routes

```typescript
// components/admin/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
  requiredRoles = [],
}: {
  children: React.ReactNode;
  requiredRoles?: string[];
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }

    if (session && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role =>
        session.user.roles.includes(role)
      );
      if (!hasRole) {
        router.push('/admin/unauthorized');
      }
    }
  }, [status, session, router, requiredRoles]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test Button.test.tsx
```

### Test Structure

```typescript
// __tests__/components/KPICard.test.tsx
import { render, screen } from '@testing-library/react';
import KPICard from '@/components/admin/KPICard';

describe('KPICard', () => {
  it('renders KPI data correctly', () => {
    render(
      <KPICard
        title="Total Revenue"
        value={250000}
        change={12.5}
        format="currency"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('₹2,50,000')).toBeInTheDocument();
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('shows positive change indicator', () => {
    const { container } = render(
      <KPICard title="Orders" value={120} change={5.3} />
    );

    const changeIndicator = container.querySelector('.text-green-600');
    expect(changeIndicator).toBeInTheDocument();
  });

  it('shows negative change indicator', () => {
    const { container } = render(
      <KPICard title="Orders" value={120} change={-3.2} />
    );

    const changeIndicator = container.querySelector('.text-red-600');
    expect(changeIndicator).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// e2e/admin-orders.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Orders', () => {
  test('should update order status', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@ayurveda.com');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.click('button[type="submit"]');

    await page.goto('/admin/orders');
    await page.click('table tbody tr:first-child');

    await page.selectOption('select[name="status"]', 'shipped');
    await page.fill('textarea[name="note"]', 'Shipped via BlueDart');
    await page.click('button:has-text("Update Status")');

    await expect(page.locator('text=Order status updated')).toBeVisible();
  });
});
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory and uploaded to Codecov in CI.

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Sign in to [Vercel](https://vercel.com)
   - Import the `ayurvedic-ecom` repository
   - Select the `ayurveda-shop` directory as the root

2. **Configure Environment Variables**
   - Add all variables from `.env.example` in Vercel dashboard
   - Set `NEXTAUTH_URL` to your production URL

3. **Deploy**
   - Push to `main` branch to trigger automatic deployment
   - Preview deployments are created for pull requests

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t ayurveda-admin .
docker run -p 3000:3000 ayurveda-admin
```

### AWS / DigitalOcean / Other

See deployment guides in `docs/deployment/`.

---

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://admin.yourdomain.com
NEXTAUTH_SECRET=generate-a-secure-random-string

# Optional
NEXT_PUBLIC_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=ap-south-1

NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_ENABLE_ML_FEATURES=true
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## ♿ Accessibility

This admin panel is built with accessibility in mind:

- ✅ **WCAG 2.1 AA compliant**
- ✅ **Keyboard navigation** for all interactive elements
- ✅ **Screen reader support** with proper ARIA labels
- ✅ **Focus management** in dialogs and modals
- ✅ **Color contrast ratios** meet WCAG standards
- ✅ **Responsive text sizing** (rem units)
- ✅ **Skip to content** link for keyboard users

Run accessibility audits:

```bash
npm run lighthouse
```

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for detailed guidelines.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) before submitting a pull request.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `npm test && npm run test:e2e`
4. Run linter: `npm run lint`
5. Commit changes: `git commit -m "feat: add feature"`
6. Push to branch: `git push origin feature/my-feature`
7. Create a pull request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/abhinavsrepository/ayurvedic-ecom/issues)
- **Email**: support@ayurveda-shop.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Built with ❤️ for the Ayurveda community**
