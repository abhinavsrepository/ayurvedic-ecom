/**
 * App Configuration
 * Central configuration for the mobile app
 */

import Constants from 'expo-constants';

const ENV = {
  development: {
    API_URL: 'http://localhost:3333/api',
    ML_SERVICE_URL: 'http://localhost:5000/api/ml',
    WEB_URL: 'http://localhost:3000',
    ENABLE_DEV_MENU: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ANALYTICS: false,
    LOG_LEVEL: 'debug',
  },
  staging: {
    API_URL: 'https://staging-api.ayurvedahaven.com/api',
    ML_SERVICE_URL: 'https://staging-ml.ayurvedahaven.com/api/ml',
    WEB_URL: 'https://staging.ayurvedahaven.com',
    ENABLE_DEV_MENU: false,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ANALYTICS: true,
    LOG_LEVEL: 'info',
  },
  production: {
    API_URL: 'https://api.ayurvedahaven.com/api',
    ML_SERVICE_URL: 'https://ml.ayurvedahaven.com/api/ml',
    WEB_URL: 'https://ayurvedahaven.com',
    ENABLE_DEV_MENU: false,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ANALYTICS: true,
    LOG_LEVEL: 'error',
  },
};

const getEnvVars = () => {
  const appVariant = Constants.expoConfig?.extra?.appVariant || 'development';
  return ENV[appVariant as keyof typeof ENV] || ENV.development;
};

export default {
  ...getEnvVars(),

  // App Info
  APP_NAME: 'Ayurveda Haven',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  APP_BUILD_NUMBER: Constants.expoConfig?.ios?.buildNumber || '1',

  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds

  // Cache Configuration
  CACHE_EXPIRY: {
    PRODUCTS: 60 * 60 * 1000, // 1 hour
    CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
    USER_PROFILE: 30 * 60 * 1000, // 30 minutes
    CART: 5 * 60 * 1000, // 5 minutes
    SEARCH_RESULTS: 15 * 60 * 1000, // 15 minutes
    ML_RECOMMENDATIONS: 30 * 60 * 1000, // 30 minutes
  },

  // Pagination
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,

  // Images
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB

  // Auth
  ACCESS_TOKEN_KEY: '@ayurveda_access_token',
  REFRESH_TOKEN_KEY: '@ayurveda_refresh_token',
  USER_KEY: '@ayurveda_user',
  BIOMETRIC_ENABLED_KEY: '@ayurveda_biometric_enabled',

  // Offline Sync
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  MAX_SYNC_RETRIES: 3,

  // Payment
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',

  // Firebase
  FIREBASE_CONFIG: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  },

  // Analytics
  SENTRY_DSN: process.env.SENTRY_DSN || '',

  // Deep Linking
  DEEP_LINK_SCHEME: 'ayurveda://',
  UNIVERSAL_LINK_DOMAIN: 'ayurvedahaven.com',

  // Feature Flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    ML_RECOMMENDATIONS: true,
    SEMANTIC_SEARCH: true,
    DOSHA_QUIZ: true,
    CHAT_SUPPORT: true,
    SOCIAL_LOGIN: true,
    APPLE_PAY: true,
    GOOGLE_PAY: true,
  },
};
