# 🌿 AyurShop Mobile App

Simple, fast, and optimized React Native app for Ayurvedic e-commerce.

## ✅ Features

- 🏠 **Home Screen** - Welcome page with navigation
- 🛒 **Product Shop** - Browse products from your NestJS backend
- 🧘 **Dosha Quiz** - Interactive 5-question assessment

## 🚀 Quick Start

```bash
# 1. Navigate to app folder
cd ayur-mobile

# 2. Start the app
npm start

# 3. Options:
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
# - Press 'w' for web browser
```

## 📱 Testing on Device

1. **Install Expo Go** on your phone
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scan QR code** from terminal

3. **App loads** in Expo Go

## 🔌 Backend Connection

The app connects to your NestJS backend at:
- **Android Emulator**: `http://10.0.2.2:3333/api`
- **iOS Simulator**: `http://localhost:3333/api`
- **Physical Device**: Update `api.ts` with your IP

### Start Backend

```bash
cd ../ayurveda-api
pnpm run start:dev
```

## 📂 Structure

```
ayur-mobile/
├── App.tsx              # Main app with navigation
├── api.ts               # Backend API client
├── screens/
│   ├── HomeScreen.tsx   # Landing page
│   ├── ProductsScreen.tsx  # Product list
│   └── QuizScreen.tsx   # Dosha quiz
└── package.json
```

## 🎨 Customize

### Change API URL

Edit `api.ts`:
```typescript
const API_URL = 'http://YOUR_IP:3333/api';
```

### Change Colors

Edit screen files, change `#10b981` to your brand color.

## 📦 Build for Production

```bash
# Android APK
npm run android

# Build with EAS (requires account)
npm install -g eas-cli
eas build --platform android
```

## 🐛 Troubleshooting

### "Can't fetch products"
- Start backend: `cd ../ayurveda-api && pnpm run start:dev`
- Check backend is on port 3333

### "Port already in use"
```bash
npm start -- --port 8082
```

### Clear cache
```bash
npm start -- --clear
```

## 📊 App Size

- **Expo Go**: ~20MB (development)
- **Standalone APK**: ~25-30MB (production)
- **Optimized**: Fast performance, minimal dependencies

## 🎯 Next Steps

1. Test all features
2. Customize branding
3. Add more screens
4. Build for Play Store/App Store

Happy coding! 🚀
