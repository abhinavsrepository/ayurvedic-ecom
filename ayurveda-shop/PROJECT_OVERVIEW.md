# 🌿 Ayurveda Haven - Premium Ayurvedic eCommerce Website

A beautiful, modern Next.js 15 eCommerce website for Ayurvedic and herbal products with stunning animations and elegant UI design.

## ✨ Features Implemented

### 🎨 Design & UI
- **Premium Ayurvedic Color Palette**
  - Deep Herbal Green (#2E7D32)
  - Soothing Mint Green (#A5D6A7)
  - Creamy Off-White (#F9FBE7)
  - Gold/Bronze Accent (#C9A66B)

- **Typography**
  - Playfair Display (Elegant serif for headings)
  - Inter (Modern sans-serif for body text)
  - Optimized font loading with next/font

- **Custom Styling**
  - Organic rounded shapes
  - Soft shadows and gradients
  - Custom scrollbar
  - Focus-visible accessibility styles
  - Selection color customization

### 🎭 Animations
- **Framer Motion Integration**
  - Smooth page transitions
  - Scroll-reveal animations
  - Hover effects and micro-interactions
  - Floating botanical elements
  - Stagger animations for lists
  - Testimonial carousel with slide transitions

- **Motion Variants Library**
  - Reusable animation presets
  - Fade in/out variants
  - Scale animations
  - Scroll reveal effects
  - Product card animations
  - Navigation animations

### 🧩 Components Built

#### Layout Components
1. **Navbar** (`components/layout/Navbar.tsx`)
   - Fixed position with scroll-based styling
   - Mobile responsive with animated menu
   - Logo with rotation animation
   - Cart counter badge
   - Search and account icons

2. **Footer** (`components/layout/Footer.tsx`)
   - Newsletter subscription form
   - Multi-column link sections
   - Social media icons with hover effects
   - Trust badges
   - Contact information

#### Shared Components
3. **Hero Section** (`components/shared/Hero.tsx`)
   - Animated headline with underline effect
   - CTA buttons with hover animations
   - Floating decorative elements
   - Trust indicators
   - Scroll indicator

4. **Product Grid** (`components/shared/ProductGrid.tsx`)
   - Responsive grid layout
   - Category filters with animation
   - Stagger animations on scroll

5. **Product Card** (`components/product/ProductCard.tsx`)
   - Image hover zoom effect
   - Quick action buttons (wishlist, quick view)
   - Badge system (NEW, BESTSELLER, DISCOUNT)
   - Add to cart button on hover
   - Star rating display
   - Out of stock overlay

6. **Testimonials** (`components/shared/Testimonials.tsx`)
   - Animated carousel with slide transitions
   - Navigation buttons
   - Dot indicators
   - Star ratings
   - Quote icon

7. **Wisdom Section** (`components/shared/WisdomSection.tsx`)
   - Blog post cards with hover effects
   - Category badges
   - Read time indicators
   - Scroll-reveal animations

### 📊 Data Layer
- Demo product data (12 Ayurvedic products)
- Testimonials data (4 customer reviews)
- Blog posts data (3 wisdom articles)
- Product interface with TypeScript

### 🛠 Utility Functions
- `cn()` - Tailwind class merging
- `formatPrice()` - Indian Rupee formatting
- `calculateDiscount()` - Percentage calculation
- `truncate()` - Text truncation
- `generateSlug()` - URL slug generation

### 📱 Responsiveness
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile
- Responsive grid layouts
- Touch-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd ayurveda-shop
```

2. Install dependencies (already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **Image Optimization**: Next.js Image component

## 📁 Project Structure

```
ayurveda-shop/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles & Tailwind config
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── Footer.tsx      # Footer
│   ├── product/
│   │   └── ProductCard.tsx # Product card component
│   └── shared/
│       ├── Hero.tsx        # Hero section
│       ├── ProductGrid.tsx # Product grid
│       ├── Testimonials.tsx# Testimonials carousel
│       └── WisdomSection.tsx# Blog section
├── lib/
│   ├── utils/
│   │   ├── cn.ts           # Class name utility
│   │   └── index.ts        # Utility functions
│   ├── motion-variants/
│   │   └── index.ts        # Framer Motion variants
│   └── data/
│       └── products.ts     # Demo data
├── public/
│   ├── images/             # Static images
│   └── icons/              # Icon assets
└── next.config.ts          # Next.js configuration
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Herbal Green | #2E7D32 | Primary brand color |
| Soothing Mint Green | #A5D6A7 | Secondary, accents |
| Creamy Off-White | #F9FBE7 | Backgrounds |
| Dark Earthy Green | #1B5E20 | Text, dark elements |
| Gold/Bronze | #C9A66B | Premium accents, CTAs |

## 📋 Pages & Sections

### Homepage (Completed)
- ✅ Hero section with animated CTA
- ✅ Featured products grid (8 products)
- ✅ Testimonials carousel
- ✅ Ayurvedic wisdom blog section
- ✅ Benefits/features section
- ✅ Navbar & Footer

### To Be Built (Future)
- [ ] Shop page with filters & sorting
- [ ] Product detail page
- [ ] Cart page
- [ ] Checkout flow
- [ ] Dosha quiz
- [ ] Blog listing & detail pages
- [ ] About page
- [ ] Contact page
- [ ] User account pages
- [ ] Admin dashboard

## 🔧 Configuration

### Image Optimization
Images are configured in `next.config.ts`:
- Remote patterns: Unsplash, Pravatar
- Device sizes: 640, 750, 1080, 1440, 1920, 2048, 3840
- WebP format support

### Tailwind CSS v4
Custom theme defined in `app/globals.css`:
- CSS variables for colors
- Custom scrollbar styles
- Focus-visible rings
- Selection colors

## 🎯 Next Steps

### Phase 1 - Enhanced Shopping Experience
1. Build full Shop page with:
   - Advanced filters (price range, category, dosha type)
   - Sorting options (popularity, price, newest)
   - Pagination or infinite scroll
   - Search functionality

2. Product Detail Page:
   - Image gallery with zoom
   - 360° product view
   - Variant selection (size, quantity)
   - Ingredient breakdown
   - How to use tabs
   - Related products

3. Shopping Cart:
   - Add/remove items
   - Quantity updates
   - Coupon code input
   - Price breakdown

### Phase 2 - Backend & Database
1. Set up PostgreSQL with Prisma
2. Create API routes:
   - Product CRUD
   - Cart management
   - Order processing
3. Implement authentication (NextAuth.js)

### Phase 3 - Payment & Orders
1. Razorpay integration
2. Order confirmation flow
3. Email notifications
4. Invoice generation (GST compliant)

### Phase 4 - Special Features
1. Dosha Quiz implementation
2. Personalized product recommendations
3. Blog CMS integration (Sanity.io)
4. Shiprocket API for shipping

### Phase 5 - Admin Dashboard
1. Order management
2. Inventory tracking
3. Customer management
4. Analytics dashboard

## 🐛 Known Issues / TODOs

- [ ] Replace placeholder images with actual product photography
- [ ] Add loading states for async operations
- [ ] Implement error boundaries
- [ ] Add SEO meta tags for all pages
- [ ] Set up analytics (GA4, Clarity)
- [ ] Add E2E tests (Playwright)
- [ ] Optimize bundle size
- [ ] Add service worker for offline support

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server (Turbopack)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌟 Design Philosophy

1. **Calming & Natural**: Earthy tones, soft shadows, organic shapes
2. **Premium Feel**: Serif headings, generous whitespace, subtle animations
3. **Health-Focused**: Clean, minimal, trustworthy aesthetic
4. **Mobile-First**: Responsive from the ground up
5. **Accessible**: WCAG 2.1 AA compliant (color contrast, focus states)

## 📄 License

Private project. All rights reserved.

## 👨‍💻 Development Notes

- Using Next.js 16 with Turbopack for fast development
- Tailwind CSS v4 with new `@theme` syntax
- All animations use Framer Motion for performance
- Images lazy-loaded with Next.js Image component
- TypeScript for type safety
- Demo data uses Unsplash for placeholder images

---

**Ready to launch your Ayurvedic wellness journey!** 🌿✨
