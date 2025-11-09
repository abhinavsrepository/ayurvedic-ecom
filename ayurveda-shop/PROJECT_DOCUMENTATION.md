# Ayurveda E-Commerce Website - Project Documentation

## 🌿 Project Overview

A premium Next.js 15 e-commerce website for Ayurvedic and herbal products with beautiful animations, comprehensive filtering, and personalized dosha recommendations.

**Tech Stack:**
- Next.js 15/16 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion
- react-intersection-observer
- PostgreSQL (planned, not yet implemented)

---

## 📁 Project Structure

```
ayurveda-shop/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── shop/page.tsx            # Shop page with filters
│   ├── dosha-quiz/page.tsx      # Interactive dosha quiz
│   ├── layout.tsx               # Root layout with fonts
│   └── globals.css              # Global styles (Tailwind v3)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Sticky navigation
│   │   └── Footer.tsx           # Footer with newsletter
│   ├── product/
│   │   └── ProductCard.tsx      # Product card with hover effects
│   └── shared/
│       ├── Hero.tsx             # Animated hero section
│       ├── ProductGrid.tsx      # Product grid component
│       ├── BeforeAfter.tsx      # Interactive image slider
│       ├── VideoTestimonials.tsx # Auto-playing video carousel
│       ├── Testimonials.tsx     # Customer testimonials
│       └── WisdomSection.tsx    # Blog/wisdom posts
├── lib/
│   ├── data/
│   │   ├── products.ts          # Featured products (12 items)
│   │   ├── allProducts.ts       # All products (24 items)
│   │   └── doshaQuiz.ts         # Quiz questions & dosha info
│   ├── motion-variants/         # Reusable Framer Motion variants
│   └── utils/                   # Utility functions
├── tailwind.config.js           # Tailwind v3 configuration
├── postcss.config.mjs           # PostCSS config
└── next.config.ts               # Next.js config with image domains
```

---

## 🎨 Color Palette (Ayurvedic Theme)

```javascript
primary: "#2E7D32"        // Deep Herbal Green
primary-light: "#A5D6A7" // Soothing Mint Green
primary-dark: "#1B5E20"   // Dark Earthy Green
secondary: "#F9FBE7"      // Creamy Off-White
accent: "#C9A66B"         // Gold/Bronze
foreground: "#1B5E20"     // Text color
```

---

## 🏠 Homepage Sections (in order)

1. **Hero** - Animated headline with botanical SVG elements
2. **Featured Products** - 8 bestselling products grid
3. **Before/After** - Interactive image comparison slider
4. **Video Testimonials** - Horizontal scrolling auto-play videos
5. **Benefits Section** - Why choose us (static content)
6. **Ayurvedic Wisdom** - Blog posts carousel
7. **Testimonials** - Customer reviews carousel
8. **Footer** - Newsletter, links, social media

---

## 🛍️ Shop Page Features

### **Filters (Desktop Sidebar / Mobile Drawer)**

1. **Category Filter**
   - All Products, Supplements, Herbal Teas, Skincare, Essential Oils, Hair Care

2. **Dosha Type Filter** (Ayurvedic body types)
   - All Doshas 🌿
   - Vata (Air & Space) 🌪️
   - Pitta (Fire & Water) 🔥
   - Kapha (Water & Earth) 🌊

3. **Price Range Filter**
   - Under ₹300
   - ₹300 - ₹600
   - ₹600 - ₹1000
   - Above ₹1000

4. **Benefits Filter** (Multi-select)
   - Stress Relief, Immunity, Digestion, Hair Growth, Clear Skin, Energy Boost, Anti-aging, Sleep Support, Detoxification, Mental Clarity

5. **Availability**
   - In Stock Only checkbox

6. **Search Bar**
   - Real-time search by name/description

### **Sort Options**
- Featured (Bestsellers first)
- Price: Low to High
- Price: High to Low
- Highest Rated
- Newest Arrivals

### **Mobile Experience**
- Sliding filter drawer from right
- Filter button with active count badge
- Full-screen overlay
- Apply filters button

**Total Products:** 24 (with dosha types, benefits, ratings)

**File:** `app/shop/page.tsx` (547 lines)
**Data:** `lib/data/allProducts.ts`

---

## 🧘 Dosha Quiz Features

### **Quiz Flow**
1. **12 comprehensive questions** covering:
   - Physical Build, Skin Type, Hair Quality
   - Energy Levels, Sleep Pattern, Appetite
   - Digestion, Emotional Tendency, Mental Activity
   - Speech Pattern, Temperature Preference, Activity Style

2. **Each question has 3 options:**
   - Vata option (with emoji)
   - Pitta option (with emoji)
   - Kapha option (with emoji)

3. **Progress tracking:**
   - Question counter (e.g., "Question 3 of 12")
   - Animated progress bar
   - Previous/Next navigation

4. **Results page shows:**
   - Dominant dosha with large icon
   - Percentage breakdown for all 3 doshas (animated bars)
   - Dosha characteristics (elements, qualities, strengths)
   - Common imbalances (with warning icons)
   - Personalized recommendations (with checkmarks)
   - CTA: "Shop Products for [Dosha]" + "Retake Quiz"

**File:** `app/dosha-quiz/page.tsx`
**Data:** `lib/data/doshaQuiz.ts`

---

## 🎬 Key Components

### **BeforeAfter.tsx** (Interactive Image Slider)
- Drag/touch slider to reveal before/after images
- Uses `clipPath` CSS for image reveal
- Mobile hint: "👆 Slide to compare"
- Desktop hint below image

**Location:** `components/shared/BeforeAfter.tsx`

### **VideoTestimonials.tsx** (Auto-play Video Carousel)
- Horizontal scrolling carousel
- Videos auto-play when 50% in viewport (using `useInView`)
- Videos pause when scrolled out
- Mute/unmute toggle per video
- All videos start muted (browser auto-play policy)
- Navigation arrows (desktop)
- Swipe hint (mobile)

**Location:** `components/shared/VideoTestimonials.tsx`

### **ProductCard.tsx** (Product Display)
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
  doshaType?: "vata" | "pitta" | "kapha" | "all";
  benefits?: string[];
}
```

**Features:**
- Hover effects: image zoom, button reveal
- Badges: NEW, BESTSELLER, DISCOUNT
- Wishlist toggle
- Out of stock overlay
- Rating stars

---

## 🔧 Critical Technical Decisions

### **Tailwind CSS v3 (NOT v4)**
- **Issue:** Initially used Tailwind v4 beta which caused styling issues (text stacking vertically)
- **Solution:** Downgraded to stable Tailwind v3
- **Config:** `tailwind.config.js` (not inline `@theme`)
- **Directives:** `@tailwind base/components/utilities` (not `@theme inline`)

### **Fonts**
- **Body:** Inter (Google Fonts)
- **Headings:** Playfair Display (Google Fonts)
- Configured in `app/layout.tsx`

### **Image Optimization**
- Remote patterns configured in `next.config.ts`:
  - Unsplash (product images)
  - Pravatar (customer avatars)
  - Google storage (video thumbnails)

### **Animations**
- **Library:** Framer Motion
- **Reusable variants:** `lib/motion-variants/index.ts`
  - fadeInUp, fadeInLeft, scaleIn, staggerContainer, productCard, scrollReveal
- **Auto-play videos:** `react-intersection-observer` with threshold 0.5

---

## 📋 Navigation Structure

**Navbar links** (`components/layout/Navbar.tsx:10-17`):
1. Home (`/`)
2. Shop (`/shop`)
3. **Dosha Quiz** (`/dosha-quiz`)
4. Wisdom (`/blog`) - not yet implemented
5. About (`/about`) - not yet implemented
6. Contact (`/contact`) - not yet implemented

**Mobile menu:** Hamburger with slide-in drawer

---

## 🗂️ Data Files

### **products.ts** (Featured products for homepage)
- 12 featured products
- Testimonials (4)
- Wisdom posts (3)
- Before/after data
- Video testimonials (5)

### **allProducts.ts** (Complete catalog for shop)
- 24 products with dosha types
- Categories array
- Dosha types array with icons
- Benefits array
- Price ranges

### **doshaQuiz.ts** (Quiz data)
- 12 quiz questions
- Dosha information (characteristics, strengths, imbalances, recommendations)
- Type definitions

---

## 🎯 Product Examples by Dosha

**Vata Products:**
- Ashwagandha Powder (stress relief)
- Vata Balancing Massage Oil
- Jasmine Night Repair Serum
- Lavender Calm Tea

**Pitta Products:**
- Neem & Turmeric Face Pack
- Brahmi Mind Wellness Oil
- Sandalwood & Rose Face Cream
- Pitta Cooling Body Lotion
- Shatavari Women's Wellness

**Kapha Products:**
- Kapha Balancing Herbal Tea
- Trikatu Digestive Fire Tablets
- Neem Antibacterial Soap
- Ginger & Lemon Immunity Tea

**All Doshas:**
- Triphala Capsules
- Detox Tea
- Chyawanprash
- Kumkumadi Oil
- Bhringraj Hair Oil

---

## 🚀 Features Implemented

✅ Complete homepage with all sections
✅ Interactive dosha quiz (12 questions + results)
✅ Shop page with 6 filter types
✅ 24 products with dosha categorization
✅ Search functionality
✅ Sort options (5 types)
✅ Mobile-responsive design
✅ Auto-playing video testimonials
✅ Before/after image slider
✅ Smooth animations throughout
✅ Sticky navigation
✅ Product cards with hover effects

---

## 📝 Not Yet Implemented (Future)

- Database integration (PostgreSQL + Prisma)
- User authentication (NextAuth.js)
- Shopping cart functionality
- Checkout flow (Razorpay/Stripe)
- Product detail pages
- Blog/wisdom pages
- About/Contact pages
- Admin dashboard
- Order management
- User reviews system

---

## 🔗 Key File Locations

| Feature | File Path | Lines |
|---------|-----------|-------|
| Homepage | `app/page.tsx` | 104 |
| Shop Page | `app/shop/page.tsx` | 547 |
| Dosha Quiz | `app/dosha-quiz/page.tsx` | 380 |
| Navbar | `components/layout/Navbar.tsx` | 206 |
| Product Card | `components/product/ProductCard.tsx` | 150+ |
| Before/After | `components/shared/BeforeAfter.tsx` | 198 |
| Video Testimonials | `components/shared/VideoTestimonials.tsx` | 386 |
| All Products Data | `lib/data/allProducts.ts` | 375 |
| Dosha Quiz Data | `lib/data/doshaQuiz.ts` | 253 |
| Tailwind Config | `tailwind.config.js` | ~80 |
| Motion Variants | `lib/motion-variants/index.ts` | ~100 |

---

## 🎨 Design Philosophy

- **Calming & Premium:** Soft green palette, ample white space
- **Nature-inspired:** Botanical elements, organic shapes
- **Trust-building:** Verified badges, real testimonials, ratings
- **Educational:** Dosha quiz, wisdom section, product benefits
- **Mobile-first:** Responsive design, touch-friendly interactions
- **Performance:** Optimized images, lazy loading, smooth animations

---

## 🌐 URLs

- **Homepage:** `http://localhost:3000/`
- **Shop:** `http://localhost:3000/shop`
- **Dosha Quiz:** `http://localhost:3000/dosha-quiz`

---

## 💡 Key Insights

1. **Dosha filtering is unique:** Products can have `doshaType: "all"` which shows in all dosha filters
2. **Multi-select benefits:** Users can select multiple benefits, products matching ANY selected benefit appear (OR logic)
3. **Smart sorting:** Featured sort prioritizes bestsellers, then by rating
4. **Video auto-play:** Only plays when 50% visible, pauses when scrolled away
5. **Mobile UX:** Filter drawer slides from right, not bottom (easier thumb reach)
6. **Clear filters:** Shows count of active filters with one-click clear

---

## 🐛 Known Issues & Solutions

### Issue: Tailwind text appearing vertically
**Cause:** Tailwind v4 beta incompatibility
**Solution:** Downgraded to v3, rewrote config and CSS

### Issue: Videos not auto-playing
**Cause:** Browser auto-play policies
**Solution:** All videos start muted, added mute/unmute toggle

### Issue: Section ordering request
**Cause:** User wanted wisdom/testimonials at bottom
**Solution:** Reordered sections in `app/page.tsx`

---

## 📊 Product Statistics

- **Total Products:** 24
- **Categories:** 6
- **Dosha Types:** 4 (Vata, Pitta, Kapha, All)
- **Benefits:** 10
- **Price Ranges:** 4
- **Featured Products:** 12
- **Bestsellers:** 6
- **New Arrivals:** 4
- **Discounted Products:** 8

---

## 🎯 User Journey Examples

### **New Visitor:**
1. Lands on homepage → sees hero
2. Scrolls through featured products
3. Watches before/after slider
4. Takes dosha quiz → discovers they're Pitta
5. Clicks "Shop Products for Pitta"
6. Filters by Pitta dosha → sees 8 matching products
7. Adds Neem Face Pack to cart

### **Returning Customer:**
1. Goes directly to Shop
2. Searches "hair"
3. Filters by "Hair Growth" benefit
4. Sorts by "Highest Rated"
5. Finds Bhringraj Hair Oil (4.9 stars)
6. Quick add to cart from product card

---

## 🔄 Development Workflow

```bash
# Start dev server
cd ayurveda-shop
npm run dev

# Server runs at http://localhost:3000

# Key commands used:
npm install -D tailwindcss@^3 postcss autoprefixer
npm install framer-motion react-intersection-observer
```

---

**Last Updated:** 2025-01-09
**Project Status:** Core features complete, ready for backend integration
**Next Phase:** Database setup, authentication, cart functionality
