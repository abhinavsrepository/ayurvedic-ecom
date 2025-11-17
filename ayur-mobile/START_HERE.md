# 🚀 Start Your Mobile App - Simple Guide

## ✅ Fixed! Android package configured

The `android.package` error is now fixed!

## 🎯 How to Start the App

### Method 1: Web Browser (Easiest & Fastest!)

```powershell
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\ayur-mobile
npx expo start --web
```

This opens the app directly in your browser - **no phone or emulator needed!**

### Method 2: Expo Go on Phone

```powershell
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\ayur-mobile
npx expo start
```

Then scan the QR code with Expo Go app.

### Method 3: Android Emulator

```powershell
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\ayur-mobile
npx expo run:android
```

Make sure Android Studio emulator is running first.

## 📱 What You'll See

1. **Home Screen** - Green header with "🌿 AyurShop"
   - 2 cards: "Shop Products" and "Dosha Quiz"

2. **Shop Products** - Browse products
   - Fetches from your backend API
   - Shows product name, price, description

3. **Dosha Quiz** - Take the quiz
   - 5 questions about your body type
   - Get Vata/Pitta/Kapha results

## 🔌 Backend Connection

To see real products in the Shop:

```powershell
# Open a NEW PowerShell window
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\ayurveda-api
pnpm run start:dev
```

Backend runs on `http://localhost:3333`

## ⚡ Quick Test (No Setup Needed!)

Just want to see if it works?

```powershell
npx expo start --web
```

Opens in browser in 10 seconds! ✨

## 🐛 If You See Errors

### "Port 8081 in use"
```powershell
npx expo start --port 8082
```

### "Metro bundler error"
```powershell
npx expo start --clear
```

### Kill all old processes
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

## ✅ App is Ready!

- ✅ Android package configured
- ✅ Navigation working
- ✅ 3 screens built
- ✅ Backend API integrated
- ✅ Clean, optimized code

Try: `npx expo start --web` right now! 🚀
