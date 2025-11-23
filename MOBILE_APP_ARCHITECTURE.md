# 🧘‍♂️ Ayurveda eCommerce Mobile App - Architecture Documentation

**Version:** 1.0.0
**Last Updated:** 2025-11-17
**Platform:** React Native + Expo
**Status:** Production-Ready Architecture

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Mobile App Architecture](#mobile-app-architecture)
5. [Data Flow](#data-flow)
6. [Offline-First Architecture](#offline-first-architecture)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [ML Integration](#ml-integration)
10. [Security Architecture](#security-architecture)
11. [Performance Optimization](#performance-optimization)
12. [File Structure](#file-structure)

---

## 🎯 System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE APPLICATION LAYER                      │
│                    (React Native + Expo)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   UI Layer   │  │  Navigation  │  │  Animations  │          │
│  │  Components  │  │  React Nav   │  │  Reanimated  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│  ┌──────┴─────────────────┴──────────────────┴───────┐          │
│  │            State Management Layer                  │          │
│  │   Zustand Stores | React Query Cache | Context    │          │
│  └──────┬─────────────────────────────────────────────┘          │
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────┐         │
│  │              Business Logic Layer                    │         │
│  │   Hooks | Services | Utilities | Validators         │         │
│  └──────┬───────────────────────────────────────────────┘         │
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────┐         │
│  │            Data & Networking Layer                   │         │
│  │   React Query | Axios | WebSockets | GraphQL        │         │
│  └──────┬───────────────────────────────────────────────┘         │
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────┐         │
│  │              Persistence Layer                       │         │
│  │   MMKV | Encrypted Storage | SQLite (WatermelonDB)  │         │
│  └─────────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │  NestJS  │    │    ML    │    │ Firebase │
    │ Backend  │    │ Service  │    │   FCM    │
    │  :3333   │    │  :5000   │    │          │
    │          │    │          │    │  Push    │
    │ - Auth   │    │ - Search │    │  Notif.  │
    │ - Orders │    │ - Recom  │    │ Analytics│
    │ - Products│   │ - Dosha  │    │          │
    └────┬─────┘    └──────────┘    └──────────┘
         │
    ┌────▼─────┐
    │PostgreSQL│
    │  Redis   │
    └──────────┘
```

---

## 🏗️ Architecture Principles

### 1. **Offline-First**
- All data cached locally using MMKV
- SQLite for complex queries (WatermelonDB)
- Background sync when online
- Optimistic updates with rollback

### 2. **Performance-First**
- Code splitting & lazy loading
- Image optimization (react-native-fast-image)
- List virtualization (FlashList)
- Memoization (React.memo, useMemo, useCallback)
- Reanimated for 60fps animations

### 3. **Type-Safe**
- TypeScript everywhere
- Zod for runtime validation
- API types auto-generated
- Props validation

### 4. **Testable**
- Unit tests (Jest)
- E2E tests (Detox)
- Component tests (React Native Testing Library)
- API mocks (MSW)

### 5. **Scalable**
- Feature-based folder structure
- Dependency injection
- Repository pattern for data access
- Clear separation of concerns

### 6. **Secure**
- EncryptedStorage for tokens
- Certificate pinning
- Biometric authentication
- Input validation & sanitization

---

## 🛠️ Technology Stack

### Core Framework
```json
{
  "platform": "React Native 0.81.5",
  "framework": "Expo 54",
  "language": "TypeScript 5.9.2",
  "runtime": "Hermes Engine"
}
```

### State Management
```json
{
  "global": "Zustand 5.0",
  "server": "React Query 5.x (TanStack Query)",
  "form": "React Hook Form 7.x",
  "context": "React Context (Auth, Theme)"
}
```

### Navigation
```json
{
  "library": "React Navigation 7.x",
  "types": ["Stack", "Bottom Tabs", "Drawer", "Modal"],
  "deepLinking": "true",
  "universalLinks": "true"
}
```

### Networking
```json
{
  "http": "Axios 1.13.2",
  "realtime": "Socket.io-client",
  "graphql": "Apollo Client (optional)",
  "interceptors": "Auth, Refresh Token, Error Handling"
}
```

### Persistence
```json
{
  "keyValue": "MMKV (fast, encrypted)",
  "encrypted": "react-native-encrypted-storage",
  "database": "WatermelonDB (SQLite)",
  "cache": "React Query Cache"
}
```

### UI Components
```json
{
  "components": "React Native Elements, Custom",
  "icons": "React Native Vector Icons",
  "animations": "Reanimated 3, Moti",
  "gestures": "React Native Gesture Handler",
  "images": "react-native-fast-image",
  "lists": "FlashList"
}
```

### Notifications
```json
{
  "push": "Firebase Cloud Messaging",
  "local": "react-native-push-notification",
  "badges": "react-native-notifications"
}
```

### Payment
```json
{
  "razorpay": "react-native-razorpay",
  "stripe": "@stripe/stripe-react-native"
}
```

### Authentication
```json
{
  "biometric": "react-native-biometrics",
  "oauth": "react-native-app-auth",
  "otp": "react-native-otp-inputs"
}
```

### Analytics & Monitoring
```json
{
  "analytics": "Firebase Analytics",
  "crashReporting": "Sentry",
  "performance": "Firebase Performance"
}
```

### Testing
```json
{
  "unit": "Jest 29",
  "e2e": "Detox",
  "component": "React Native Testing Library",
  "mocking": "MSW (Mock Service Worker)"
}
```

### Build & Deployment
```json
{
  "build": "EAS Build",
  "updates": "EAS Update (OTA)",
  "distribution": "EAS Submit",
  "ci": "GitHub Actions"
}
```

---

## 📱 Mobile App Architecture

### Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  - Screens (30+ screens)                                 │
│  - Components (100+ components)                          │
│  - Navigation (Stack, Tabs, Drawer)                      │
│  - Theme & Styling (Light/Dark mode)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                   APPLICATION LAYER                      │
│  - Custom Hooks (useAuth, useCart, useProducts)         │
│  - State Management (Zustand stores)                     │
│  - Business Logic (Cart calculations, Dosha logic)       │
│  - Form Validation (Zod schemas)                         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                    DOMAIN LAYER                          │
│  - Models (User, Product, Order, Cart)                   │
│  - Types (TypeScript interfaces)                         │
│  - Constants (API endpoints, Config)                     │
│  - Utilities (Formatters, Validators)                    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                INFRASTRUCTURE LAYER                      │
│  - API Services (REST clients)                           │
│  - ML Services (Recommendation, Search)                  │
│  - Repositories (Data access layer)                      │
│  - Storage (MMKV, EncryptedStorage, WatermelonDB)       │
│  - Notifications (FCM, Local)                            │
│  - Analytics (Firebase, Sentry)                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### User Action Flow

```
User Interaction
      │
      ├──► Screen Component
      │         │
      │         ├──► Custom Hook (useProducts)
      │         │         │
      │         │         ├──► React Query (Server State)
      │         │         │         │
      │         │         │         ├──► API Service
      │         │         │         │         │
      │         │         │         │         ├──► Backend API
      │         │         │         │         │         │
      │         │         │         │         │         └──► Response
      │         │         │         │         └──► Transform Data
      │         │         │         └──► Update Cache
      │         │         │
      │         │         └──► Zustand Store (Client State)
      │         │                   │
      │         │                   └──► Update Local State
      │         │
      │         └──► Re-render with New Data
      │
      └──► Update UI
```

### Offline-First Flow

```
User Action (Add to Cart)
      │
      ├──► Optimistic Update (Immediate UI change)
      │         │
      │         ├──► Save to Local Storage (MMKV)
      │         │         │
      │         │         └──► Queue Sync Action
      │         │
      │         └──► Update UI (Success state)
      │
      └──► Background Sync
                │
                ├──► Check Network Status
                │         │
                │         ├──► Online?
                │         │      │
                │         │      ├─ YES ──► Sync to Backend
                │         │      │              │
                │         │      │              ├─ Success ──► Clear Queue
                │         │      │              │
                │         │      │              └─ Error ──► Retry with Backoff
                │         │      │
                │         │      └─ NO ──► Keep in Queue
                │         │
                │         └──► Listen for Network Changes
                │
                └──► Auto-sync when Online
```

---

## 💾 Offline-First Architecture

### Storage Strategy

```typescript
// Storage Hierarchy
┌─────────────────────────────────────────────────┐
│  1. MMKV - Fast Key-Value Storage               │
│     - User preferences                          │
│     - Session data                              │
│     - Cache metadata                            │
│     - Small data (<1MB)                         │
│     Performance: 30x faster than AsyncStorage   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  2. EncryptedStorage - Secure Storage           │
│     - Auth tokens (access, refresh)             │
│     - User credentials                          │
│     - API keys                                  │
│     - Sensitive data                            │
│     Security: AES-256 encryption                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  3. WatermelonDB - Local Database               │
│     - Product catalog (1000+ products)          │
│     - Order history                             │
│     - Cart items                                │
│     - Blog posts                                │
│     Performance: Optimized for large datasets   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  4. React Query Cache - In-Memory Cache         │
│     - API responses                             │
│     - Temporary data                            │
│     - Automatic invalidation                    │
│     Performance: Instant access                 │
└─────────────────────────────────────────────────┘
```

### Sync Strategy

```typescript
interface SyncStrategy {
  // Immediate sync (critical data)
  immediate: ['cart', 'orders', 'payments'];

  // Batch sync (non-critical)
  batch: ['wishlist', 'search_history', 'viewed_products'];

  // Periodic sync (background)
  periodic: {
    catalog: '1 hour',
    orders: '5 minutes',
    profile: '30 minutes',
  };

  // Conflict resolution
  resolution: 'server-wins' | 'client-wins' | 'merge';
}
```

---

## 🏪 State Management

### Zustand Store Architecture

```typescript
// 1. Auth Store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data) => Promise<void>;
}

// 2. Cart Store
interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product, quantity) => void;
  removeItem: (productId) => void;
  updateQuantity: (productId, quantity) => void;
  applyCoupon: (code) => Promise<void>;
  clearCart: () => void;
}

// 3. UI Store
interface UIStore {
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  currency: 'INR' | 'USD';
  loading: boolean;
  toast: ToastConfig | null;
  setTheme: (theme) => void;
  setLanguage: (lang) => void;
  showToast: (config) => void;
}

// 4. Dosha Store
interface DoshaStore {
  quiz: DoshaQuizState;
  results: DoshaResults | null;
  startQuiz: () => void;
  answerQuestion: (questionId, answer) => void;
  calculateResults: () => DoshaResults;
  saveResults: () => Promise<void>;
}

// 5. Wishlist Store
interface WishlistStore {
  items: Product[];
  addToWishlist: (product) => void;
  removeFromWishlist: (productId) => void;
  isInWishlist: (productId) => boolean;
}
```

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        // Global error handling
        showErrorToast(error);
      },
    },
  },
});

// Query Keys
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters) => ['products', 'list', filters] as const,
    detail: (id) => ['products', 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: () => ['orders', 'list'] as const,
    detail: (id) => ['orders', 'detail', id] as const,
  },
  user: {
    profile: () => ['user', 'profile'] as const,
    orders: () => ['user', 'orders'] as const,
  },
};
```

---

## 🌐 API Integration

### API Service Architecture

```typescript
// Base API Client
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Config.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor (add auth token)
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (handle errors, refresh token)
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 (refresh token)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Logout user
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// Feature-specific API services
class ProductService {
  async getProducts(params: ProductQueryParams): Promise<ProductListResponse> {
    return apiClient.get('/products', { params });
  }

  async getProduct(id: string): Promise<Product> {
    return apiClient.get(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return apiClient.post('/products/search', { query });
  }
}

class OrderService {
  async createOrder(data: CreateOrderDto): Promise<Order> {
    return apiClient.post('/orders', data);
  }

  async getOrders(): Promise<Order[]> {
    return apiClient.get('/orders');
  }

  async getOrder(id: string): Promise<Order> {
    return apiClient.get(`/orders/${id}`);
  }
}
```

### API Endpoints Mapping

```typescript
// NestJS Backend (Port 3333)
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    otp: {
      send: '/api/auth/otp/send',
      verify: '/api/auth/otp/verify',
    },
    oauth: {
      google: '/api/auth/oauth/google',
      apple: '/api/auth/oauth/apple',
    },
    twoFactor: {
      enable: '/api/auth/2fa/enable',
      verify: '/api/auth/2fa/verify',
      disable: '/api/auth/2fa/disable',
    },
  },

  // Products
  products: {
    list: '/api/products',
    detail: (id) => `/api/products/${id}`,
    bySlug: (slug) => `/api/products/slug/${slug}`,
    search: '/api/products/search',
    categories: '/api/products/categories',
    featured: '/api/products/featured',
    bestSellers: '/api/products/best-sellers',
  },

  // Orders
  orders: {
    create: '/api/orders',
    list: '/api/orders',
    detail: (id) => `/api/orders/${id}`,
    track: (id) => `/api/orders/${id}/track`,
  },

  // Cart
  cart: {
    get: '/api/cart',
    add: '/api/cart/items',
    update: (itemId) => `/api/cart/items/${itemId}`,
    remove: (itemId) => `/api/cart/items/${itemId}`,
    clear: '/api/cart/clear',
    applyCoupon: '/api/cart/coupon',
  },

  // User
  user: {
    profile: '/api/user/profile',
    updateProfile: '/api/user/profile',
    addresses: '/api/user/addresses',
    wishlist: '/api/user/wishlist',
    orderHistory: '/api/user/orders',
  },

  // Mobile-specific
  mobile: {
    feed: '/api/mobile/feed',
    notifications: '/api/mobile/notifications',
    recommendations: '/api/mobile/recommendations',
    search: '/api/mobile/search/semantic',
    doshaResults: '/api/mobile/dosha/results',
  },
};

// ML Service (Port 5000)
export const ML_ENDPOINTS = {
  recommend: {
    user: (id) => `/api/ml/recommend/user/${id}`,
    product: (id) => `/api/ml/recommend/product/${id}`,
  },
  search: {
    semantic: '/api/ml/search/semantic',
  },
  ayurveda: {
    dosha: '/api/ml/ayurveda/dosha',
    goals: '/api/ml/ayurveda/goals',
  },
  forecast: '/api/ml/forecast',
  anomaly: '/api/ml/anomaly',
};
```

---

## 🤖 ML Integration

### ML Service Integration

```typescript
class MLService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.ML_SERVICE_URL,
      timeout: 10000,
    });
  }

  // Personalized recommendations
  async getUserRecommendations(userId: string): Promise<Product[]> {
    const response = await this.client.post(`/recommend/user/${userId}`, {
      user_id: userId,
      limit: 10,
      preferences: await this.getUserPreferences(),
    });
    return response.data.recommendations;
  }

  // Similar products
  async getSimilarProducts(productId: string): Promise<Product[]> {
    const response = await this.client.post(`/recommend/product/${productId}`, {
      product_id: productId,
      limit: 6,
    });
    return response.data.similar_products;
  }

  // Semantic search
  async semanticSearch(query: string, filters?: SearchFilters): Promise<Product[]> {
    const response = await this.client.post('/search/semantic', {
      query,
      filters,
      ayurveda_aware: true,
    });
    return response.data.results;
  }

  // Dosha recommendations
  async getDoshaRecommendations(doshaProfile: DoshaProfile): Promise<Product[]> {
    const response = await this.client.post('/ayurveda/dosha', {
      vata: doshaProfile.vata,
      pitta: doshaProfile.pitta,
      kapha: doshaProfile.kapha,
      health_goals: doshaProfile.healthGoals,
    });
    return response.data.recommendations;
  }
}

// React Query hooks for ML
export const useUserRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['ml', 'recommendations', userId],
    queryFn: () => mlService.getUserRecommendations(userId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!userId,
  });
};

export const useSimilarProducts = (productId: string) => {
  return useQuery({
    queryKey: ['ml', 'similar', productId],
    queryFn: () => mlService.getSimilarProducts(productId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!productId,
  });
};
```

---

## 🔒 Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│  1. Transport Security                               │
│     - HTTPS/TLS 1.3                                  │
│     - Certificate Pinning                            │
│     - Secure WebSockets                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  2. Authentication & Authorization                   │
│     - JWT tokens (access + refresh)                  │
│     - Biometric authentication                       │
│     - OAuth 2.0 (Google, Apple)                      │
│     - 2FA support                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  3. Data Encryption                                  │
│     - EncryptedStorage (AES-256)                     │
│     - Keychain/Keystore                              │
│     - Encrypted database                             │
│     - End-to-end encryption for sensitive data       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  4. Input Validation                                 │
│     - Zod schemas                                    │
│     - XSS prevention                                 │
│     - SQL injection prevention                       │
│     - CSRF protection                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  5. Secure Storage                                   │
│     - No sensitive data in logs                      │
│     - No sensitive data in screenshots               │
│     - Secure deletion of data                        │
│     - Auto-logout on inactivity                      │
└─────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Login Attempt
      │
      ├──► Enter Credentials
      │         │
      │         ├──► Validate Input (Zod)
      │         │         │
      │         │         ├─ Valid ──► Send to Backend
      │         │         │              │
      │         │         │              ├──► NestJS Auth API
      │         │         │              │         │
      │         │         │              │         ├──► Validate Credentials
      │         │         │              │         │         │
      │         │         │              │         │         ├─ Success ──► Generate Tokens
      │         │         │              │         │         │                 │
      │         │         │              │         │         │                 ├─ Access Token (15min)
      │         │         │              │         │         │                 ├─ Refresh Token (7days)
      │         │         │              │         │         │                 │
      │         │         │              │         │         │                 └──► Return to App
      │         │         │              │         │         │
      │         │         │              │         │         └─ Fail ──► Return Error
      │         │         │              │         │
      │         │         │              │         └──► Store Tokens Securely
      │         │         │              │                   │
      │         │         │              │                   ├─ Access: EncryptedStorage
      │         │         │              │                   └─ Refresh: EncryptedStorage
      │         │         │              │
      │         │         │              └──► Update Auth State (Zustand)
      │         │         │                         │
      │         │         │                         ├─ Set user data
      │         │         │                         ├─ Set isAuthenticated = true
      │         │         │                         │
      │         │         │                         └──► Navigate to Home
      │         │         │
      │         │         └─ Invalid ──► Show Error
      │         │
      │         └──► Optional: Enable Biometric
      │                   │
      │                   └──► Store biometric flag
      │
      └──► Future Logins: Use Biometric ──► Same Flow
```

---

## ⚡ Performance Optimization

### Optimization Strategies

```typescript
// 1. List Optimization
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={products}
  renderItem={renderProduct}
  estimatedItemSize={200}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
/>

// 2. Image Optimization
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: product.image,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>

// 3. Memoization
const ProductCard = React.memo(({ product, onPress }) => {
  const formattedPrice = useMemo(
    () => formatCurrency(product.price),
    [product.price]
  );

  const handlePress = useCallback(() => {
    onPress(product.id);
  }, [product.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{product.name}</Text>
      <Text>{formattedPrice}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});

// 4. Code Splitting
const ProductDetails = React.lazy(() => import('./screens/ProductDetails'));
const Checkout = React.lazy(() => import('./screens/Checkout'));

// 5. Animation Performance
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(visible.value ? 1 : 0),
    transform: [
      { translateY: withTiming(visible.value ? 0 : 50) }
    ],
  };
}, [visible]);
```

---

## 📁 File Structure

```
ayur-mobile/
├── app.json                          # Expo config
├── eas.json                          # EAS Build config
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
│
├── .env.development
├── .env.staging
├── .env.production
│
├── assets/                           # Static assets
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   ├── animations/                   # Lottie files
│   └── splash.png
│
├── src/
│   ├── app/                          # App entry & navigation
│   │   ├── index.tsx                 # App root
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx     # Root stack
│   │   │   ├── AuthNavigator.tsx     # Auth flow
│   │   │   ├── MainNavigator.tsx     # Main app (tabs)
│   │   │   ├── ShopNavigator.tsx     # Shop stack
│   │   │   └── ProfileNavigator.tsx  # Profile stack
│   │   └── deepLinking.ts            # Deep link config
│   │
│   ├── screens/                      # Screen components (30+)
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── OTPScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── SocialLoginScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── FeedScreen.tsx
│   │   │   └── DailyTipsScreen.tsx
│   │   ├── shop/
│   │   │   ├── ProductListScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   ├── CategoryScreen.tsx
│   │   │   └── FilterScreen.tsx
│   │   ├── search/
│   │   │   ├── SearchScreen.tsx
│   │   │   └── SearchResultsScreen.tsx
│   │   ├── cart/
│   │   │   ├── CartScreen.tsx
│   │   │   ├── CheckoutScreen.tsx
│   │   │   ├── AddressScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   └── OrderSuccessScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── OrderHistoryScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   ├── WishlistScreen.tsx
│   │   │   ├── AddressesScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── dosha/
│   │   │   ├── DoshaQuizScreen.tsx
│   │   │   ├── DoshaResultsScreen.tsx
│   │   │   └── DoshaRecommendationsScreen.tsx
│   │   ├── blog/
│   │   │   ├── BlogListScreen.tsx
│   │   │   └── BlogDetailScreen.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsScreen.tsx
│   │   └── chat/
│   │       └── ChatSupportScreen.tsx
│   │
│   ├── components/                   # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── SafeArea.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductImageCarousel.tsx
│   │   │   ├── ProductRating.tsx
│   │   │   ├── ProductReviews.tsx
│   │   │   └── AddToCartButton.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CouponInput.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── TabBar.tsx
│   │   ├── ayurveda/
│   │   │   ├── DoshaIndicator.tsx
│   │   │   ├── IngredientBadge.tsx
│   │   │   └── BenefitsList.tsx
│   │   └── animations/
│   │       ├── FadeIn.tsx
│   │       ├── SlideIn.tsx
│   │       ├── ScaleIn.tsx
│   │       └── Shimmer.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   ├── useWishlist.ts
│   │   ├── useSearch.ts
│   │   ├── useRecommendations.ts
│   │   ├── useDosha.ts
│   │   ├── useOfflineSync.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useBiometric.ts
│   │   ├── useNotifications.ts
│   │   ├── useDeepLink.ts
│   │   └── useTheme.ts
│   │
│   ├── store/                        # Zustand stores
│   │   ├── index.ts
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │   ├── doshaStore.ts
│   │   ├── uiStore.ts
│   │   └── syncStore.ts
│   │
│   ├── services/                     # API & external services
│   │   ├── api/
│   │   │   ├── apiClient.ts          # Axios instance
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── userService.ts
│   │   │   ├── cartService.ts
│   │   │   └── blogService.ts
│   │   ├── ml/
│   │   │   ├── mlClient.ts
│   │   │   ├── recommendationService.ts
│   │   │   ├── searchService.ts
│   │   │   └── doshaService.ts
│   │   ├── storage/
│   │   │   ├── mmkvStorage.ts
│   │   │   ├── encryptedStorage.ts
│   │   │   └── databaseService.ts
│   │   ├── notifications/
│   │   │   ├── fcmService.ts
│   │   │   └── localNotificationService.ts
│   │   ├── payment/
│   │   │   ├── razorpayService.ts
│   │   │   └── stripeService.ts
│   │   ├── analytics/
│   │   │   ├── firebaseAnalytics.ts
│   │   │   └── sentryService.ts
│   │   └── sync/
│   │       ├── syncService.ts
│   │       └── syncQueue.ts
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── utils/
│   │   │   ├── formatting.ts         # Date, currency, number
│   │   │   ├── validation.ts         # Input validators
│   │   │   ├── helpers.ts            # Generic helpers
│   │   │   └── asyncStorage.ts       # Storage helpers
│   │   ├── constants/
│   │   │   ├── config.ts             # App config
│   │   │   ├── endpoints.ts          # API endpoints
│   │   │   ├── colors.ts             # Theme colors
│   │   │   ├── spacing.ts            # Spacing system
│   │   │   └── typography.ts         # Font styles
│   │   └── schemas/
│   │       ├── authSchemas.ts        # Zod schemas
│   │       ├── productSchemas.ts
│   │       └── orderSchemas.ts
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── user.types.ts
│   │   ├── navigation.types.ts
│   │   └── ayurveda.types.ts
│   │
│   ├── theme/                        # Theme configuration
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   └── animations.ts
│   │
│   └── database/                     # WatermelonDB
│       ├── schema.ts
│       ├── models/
│       │   ├── Product.ts
│       │   ├── Order.ts
│       │   ├── Cart.ts
│       │   └── BlogPost.ts
│       └── sync/
│           └── synchronize.ts
│
├── e2e/                              # Detox E2E tests
│   ├── config.json
│   ├── firstTest.e2e.ts
│   └── helpers/
│
└── __tests__/                        # Jest unit tests
    ├── components/
    ├── hooks/
    ├── services/
    └── utils/
```

---

## 🎨 Design System

### Ayurvedic Color Palette

```typescript
export const colors = {
  // Primary (Ayurvedic Green)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main primary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Secondary (Earth Brown)
  secondary: {
    50: '#fdf8f6',
    100: '#f2e8e5',
    200: '#eaddd7',
    300: '#e0cec7',
    400: '#d2bab0',
    500: '#bfa094',
    600: '#a18072',
    700: '#977669',  // Main secondary
    800: '#846358',
    900: '#43302b',
  },

  // Accent (Turmeric Gold)
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',  // Main accent
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Neutrals
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },

  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Backgrounds
  background: {
    light: '#ffffff',
    dark: '#0f172a',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    display: 'Playfair-Display',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};
```

---

## 📊 Performance Metrics

### Target Metrics

```yaml
App Launch Time: < 2 seconds
Time to Interactive: < 3 seconds
JS Bundle Size: < 5 MB
Memory Usage: < 200 MB
CPU Usage: < 30%
Frame Rate: 60 FPS
Network Requests: Cached & optimized
Battery Impact: Low
```

---

## 🧪 Testing Strategy

```
Unit Tests (70% coverage)
  ├── Components (React Native Testing Library)
  ├── Hooks (renderHook)
  ├── Services (Jest mocks)
  └── Utils (Pure functions)

Integration Tests (50% coverage)
  ├── API integration
  ├── Store integration
  └── Navigation flows

E2E Tests (Critical paths)
  ├── User registration & login
  ├── Product search & browse
  ├── Add to cart & checkout
  ├── Order placement
  └── Profile management

Performance Tests
  ├── Component render time
  ├── List scroll performance
  ├── Animation frame rate
  └── Memory leaks
```

---

## 🚀 Deployment Strategy

### Build Variants

```json
{
  "development": {
    "apiUrl": "http://localhost:3333",
    "mlUrl": "http://localhost:5000",
    "bundleId": "com.ayurveda.app.dev"
  },
  "staging": {
    "apiUrl": "https://staging-api.ayurveda.com",
    "mlUrl": "https://staging-ml.ayurveda.com",
    "bundleId": "com.ayurveda.app.staging"
  },
  "production": {
    "apiUrl": "https://api.ayurveda.com",
    "mlUrl": "https://ml.ayurveda.com",
    "bundleId": "com.ayurveda.app"
  }
}
```

### Release Process

```
1. Development
   ↓
2. Feature Branch
   ↓
3. Pull Request
   ↓
4. Code Review
   ↓
5. Automated Tests (CI)
   ↓
6. Merge to Staging
   ↓
7. EAS Build (Staging)
   ↓
8. QA Testing
   ↓
9. Merge to Production
   ↓
10. EAS Build (Production)
    ↓
11. App Store/Play Store Review
    ↓
12. Production Release
    ↓
13. Monitor (Sentry, Firebase)
```

---

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [WatermelonDB](https://watermelondb.dev/)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-17
**Maintained by:** Senior Mobile Architect
