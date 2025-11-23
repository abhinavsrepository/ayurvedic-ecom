/**
 * Navigation Type Definitions
 *
 * Type-safe navigation for React Navigation v6.
 * Defines all navigation routes and their parameters.
 *
 * @see https://reactnavigation.org/docs/typescript/
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Product } from './product.types';
import type { Order } from './order.types';

/**
 * Root Stack Navigator
 * Main app navigation structure
 */
export type RootStackParamList = {
  // Auth flow
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app flow
  Main: NavigatorScreenParams<MainTabParamList>;

  // Onboarding
  Onboarding: undefined;

  // Splash screen
  Splash: undefined;

  // Modal screens (can be accessed from anywhere)
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  ProductFilter: { categoryId?: string };
  ProductSearch: { initialQuery?: string };
  Reviews: { productId: string };
  WriteReview: { productId: string; orderId?: string };

  // Dosha Quiz
  DoshaQuiz: undefined;
  DoshaResults: {
    vataScore: number;
    pittaScore: number;
    kaphaScore: number;
  };

  // Profile related modals
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: { addressId?: string };
  ChangePassword: undefined;
  NotificationSettings: undefined;

  // Order related
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string };
  ReturnOrder: { orderId: string };

  // Wishlist
  Wishlist: undefined;

  // Support
  Support: undefined;
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
  FAQ: undefined;

  // Consultation
  ConsultationBooking: { practitionerId?: string };
  ConsultationDetail: { consultationId: string };
  ConsultationFeedback: { consultationId: string };

  // Blog
  BlogPost: { postId: string };

  // Settings
  Settings: undefined;
  Language: undefined;
  Theme: undefined;
  About: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;

  // Web view for external content
  WebView: { url: string; title: string };
};

/**
 * Auth Stack Navigator
 * Authentication flow screens
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
  OTPVerification: { email: string; purpose: 'register' | 'reset-password' };
};

/**
 * Main Tab Navigator
 * Bottom tab navigation
 */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  ConsultTab: NavigatorScreenParams<ConsultStackParamList>;
  BlogTab: NavigatorScreenParams<BlogStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Home Stack Navigator
 * Home tab screens
 */
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  DoshaProfile: undefined;
};

/**
 * Shop Stack Navigator
 * Shop tab screens
 */
export type ShopStackParamList = {
  Shop: { categoryId?: string };
  Categories: undefined;
  Category: { categoryId: string; categoryName: string };
  Brand: { brandId: string; brandName: string };
  Collection: { collectionId: string; collectionName: string };
  BestSellers: undefined;
  NewArrivals: undefined;
  Deals: undefined;
};

/**
 * Consultation Stack Navigator
 * Consultation tab screens
 */
export type ConsultStackParamList = {
  Consult: undefined;
  Practitioners: undefined;
  PractitionerProfile: { practitionerId: string };
  MyConsultations: undefined;
};

/**
 * Blog Stack Navigator
 * Blog/Content tab screens
 */
export type BlogStackParamList = {
  Blog: undefined;
  BlogCategory: { categoryId: string; categoryName: string };
  SavedArticles: undefined;
};

/**
 * Profile Stack Navigator
 * Profile tab screens
 */
export type ProfileStackParamList = {
  Profile: undefined;
  Orders: undefined;
  Wishlist: undefined;
  Addresses: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  MyReviews: undefined;
};

/**
 * Screen Props Type Helpers
 * Use these to type your screen components
 */

// Root Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Auth Stack Screen Props
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Main Tab Screen Props
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Home Stack Screen Props
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'HomeTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Shop Stack Screen Props
export type ShopStackScreenProps<T extends keyof ShopStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ShopStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'ShopTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Consultation Stack Screen Props
export type ConsultStackScreenProps<T extends keyof ConsultStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ConsultStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'ConsultTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Blog Stack Screen Props
export type BlogStackScreenProps<T extends keyof BlogStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BlogStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'BlogTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Profile Stack Screen Props
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'ProfileTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

/**
 * Navigation Prop Types
 * For use with useNavigation hook
 */
export type RootStackNavigationProp =
  RootStackScreenProps<keyof RootStackParamList>['navigation'];

export type AuthStackNavigationProp =
  AuthStackScreenProps<keyof AuthStackParamList>['navigation'];

export type MainTabNavigationProp =
  MainTabScreenProps<keyof MainTabParamList>['navigation'];

export type HomeStackNavigationProp =
  HomeStackScreenProps<keyof HomeStackParamList>['navigation'];

export type ShopStackNavigationProp =
  ShopStackScreenProps<keyof ShopStackParamList>['navigation'];

export type ConsultStackNavigationProp =
  ConsultStackScreenProps<keyof ConsultStackParamList>['navigation'];

export type BlogStackNavigationProp =
  BlogStackScreenProps<keyof BlogStackParamList>['navigation'];

export type ProfileStackNavigationProp =
  ProfileStackScreenProps<keyof ProfileStackParamList>['navigation'];

/**
 * Route Prop Types
 * For use with useRoute hook
 */
export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RootStackScreenProps<T>['route'];

export type AuthStackRouteProp<T extends keyof AuthStackParamList> =
  AuthStackScreenProps<T>['route'];

export type MainTabRouteProp<T extends keyof MainTabParamList> =
  MainTabScreenProps<T>['route'];

export type HomeStackRouteProp<T extends keyof HomeStackParamList> =
  HomeStackScreenProps<T>['route'];

export type ShopStackRouteProp<T extends keyof ShopStackParamList> =
  ShopStackScreenProps<T>['route'];

export type ConsultStackRouteProp<T extends keyof ConsultStackParamList> =
  ConsultStackScreenProps<T>['route'];

export type BlogStackRouteProp<T extends keyof BlogStackParamList> =
  BlogStackScreenProps<T>['route'];

export type ProfileStackRouteProp<T extends keyof ProfileStackParamList> =
  ProfileStackScreenProps<T>['route'];

/**
 * Declare global navigation types for React Navigation
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
