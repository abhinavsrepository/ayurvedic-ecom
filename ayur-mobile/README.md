# 🌿 AyurShop - Ayurvedic eCommerce Mobile App

A premium, full-featured Ayurvedic products eCommerce mobile application built with **Expo (React Native)** and **TypeScript**.

## ✨ Features

### 🛍️ Core eCommerce Features
- **Product Browsing**: Grid layout with beautiful product cards
- **Product Details**: Image slider, detailed descriptions, reviews, and related products
- **Shopping Cart**: Add/remove items, quantity management, swipe-to-delete
- **Wishlist**: Save favorite products with heart animation
- **Checkout**: Complete checkout flow with address and payment options
- **Search**: Advanced search with suggestions and filters

### 🎨 Premium UI/UX
- **Ayurvedic Theme**: Calming green colors (#2E7D32, #A5D6A7, #F9FBE7)
- **Smooth Animations**: Fade-in, slide-in, and spring animations
- **Glassmorphism**: Modern UI effects on cards
- **Custom Components**: Reusable, professionally designed components
- **Responsive Design**: Works beautifully on all device sizes

### 🔐 Authentication
- Login and Signup screens
- Social login UI (Google, Facebook)
- Persistent user sessions with AsyncStorage

### 📱 Navigation
- Stack Navigation for main flow
- Bottom Tab Navigation (Home, Products, Wishlist, Profile)
- Smooth transitions between screens

### 🧘 Ayurvedic Features
- **Dosha Tags**: Products tagged with Vata, Pitta, Kapha, or Tridosha
- **Category Browsing**: Oils, Powders, Tablets, Teas, Skincare, Hair Care, Wellness
- **Product Benefits**: Detailed health benefits for each product
- **Natural Ingredients**: Full ingredient lists

### 💾 Data Persistence
- **AsyncStorage**: Cart and wishlist persist across sessions
- **Context API**: Global state management
- **Mock Data**: 15 realistic Ayurvedic products with reviews

## 📁 Project Structure

```
ayur-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── Input.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   ├── context/             # Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── index.ts
│   ├── data/                # Mock data
│   │   ├── products.json    # 15 Ayurvedic products
│   │   └── reviews.json     # Product reviews
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useProducts.ts
│   │   └── index.ts
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/             # All app screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProductListingScreen.tsx
│   │   ├── ProductDetailsScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── index.ts
│   ├── styles/              # Theme and styling
│   │   └── theme.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── utils/               # Utility functions
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Navigate to the mobile app directory**:
   ```bash
   cd ayur-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on device/emulator**:
   - For iOS: Press `i` or run `npm run ios`
   - For Android: Press `a` or run `npm run android`
   - Scan QR code with Expo Go app on your phone

## 📱 Screens Overview

### Authentication Flow
- **Login Screen**: Email/password login with social login options
- **Signup Screen**: User registration with validation

### Main App Flow
- **Home Screen**: Hero banner, categories, featured products, best sellers
- **Product Listing**: Grid view with filters and sorting
- **Product Details**: Full product information with reviews
- **Cart**: Shopping cart with quantity management
- **Checkout**: Address selection and payment options
- **Wishlist**: Saved products
- **Profile**: User profile and settings
- **Search**: Advanced product search

## 🎨 Design System

### Colors
```typescript
Primary Green: #2E7D32
Light Green: #A5D6A7
Herbal Cream: #F9FBE7
Earth Brown: #4E342E
```

### Typography
- **Headings**: Playfair Display (would be loaded via Expo Font)
- **Body**: Inter (would be loaded via Expo Font)

### Spacing
```typescript
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px
```

## 🔧 Technologies Used

- **Framework**: Expo SDK ~54.0
- **Language**: TypeScript
- **Navigation**: React Navigation 7 (Stack + Bottom Tabs)
- **State Management**: Context API
- **Storage**: AsyncStorage
- **UI**: React Native
- **Animations**: React Native Animated API
- **Icons**: @expo/vector-icons (Ionicons)
- **Gradients**: expo-linear-gradient

## 📦 Key Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/native": "^7.1.20",
  "@react-navigation/native-stack": "^7.6.3",
  "expo-linear-gradient": "~14.0.3",
  "react-native-gesture-handler": "~2.22.1",
  "react-native-reanimated": "~4.0.1"
}
```

## 🧪 Sample Products

The app includes 15 realistic Ayurvedic products:
1. Ashwagandha Root Powder
2. Brahmi Memory Oil
3. Triphala Tablets
4. Tulsi Green Tea
5. Kumkumadi Radiance Face Oil
6. Neem & Turmeric Face Wash
7. Shatavari Women's Wellness Tablets
8. Bhringraj Hair Growth Oil
9. Chyawanprash Immune Booster
10. Turmeric Curcumin Capsules
11. Rose & Sandalwood Face Mist
12. Amla Vitamin C Powder
13. Lavender Chamomile Sleep Tea
14. Neem & Aloe Vera Shampoo
15. Giloy Immunity Juice

## 🎯 State Management

The app uses Context API for:
- **AuthContext**: User authentication and profile
- **CartContext**: Shopping cart with AsyncStorage persistence
- **WishlistContext**: Wishlist with AsyncStorage persistence

## 🔐 Mock Authentication

The app includes mock authentication:
- Any email/password combination works for login
- User data is persisted in AsyncStorage
- Logout clears user session

## 📝 Code Quality

- **TypeScript**: Full type safety across the app
- **Clean Architecture**: Separated concerns (screens, components, hooks, context)
- **Reusable Components**: DRY principles
- **Comments**: Comprehensive JSDoc comments
- **Naming Conventions**: Clear and consistent

## 🚧 Future Enhancements

- [ ] Real API integration
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Real-time order tracking
- [ ] Dosha quiz for personalized recommendations
- [ ] Product ratings and reviews (user-generated)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Lottie animations for loading states

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Developer Notes

### Running Tests
```bash
# Tests would be added here
npm test
```

### Building for Production
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### Environment Variables
Create a `.env` file for API endpoints:
```
API_URL=https://api.yourbackend.com
```

## 🆘 Troubleshooting

### Common Issues

1. **Metro bundler not starting**:
   ```bash
   expo start --clear
   ```

2. **Dependencies not installing**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **TypeScript errors**:
   Check `tsconfig.json` and ensure all types are properly imported

## 📞 Support

For issues and questions:
- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Navigation Docs](https://reactnavigation.org/)

---

**Built with ❤️ for Ayurvedic wellness**
