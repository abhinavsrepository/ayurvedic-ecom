/**
 * User Type Definitions
 *
 * Complete type definitions for users, profiles, addresses, and authentication.
 */

import type { DoshaType } from './product.types';

/**
 * User Role Enum
 */
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  PRACTITIONER = 'practitioner',
  VENDOR = 'vendor',
}

/**
 * User Status Enum
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

/**
 * Gender Enum
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

/**
 * Address Type Enum
 */
export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

/**
 * Authentication Provider Enum
 */
export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

/**
 * Address Interface
 */
export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  isDefault: boolean;

  // Address Details
  fullName: string;
  phone: string;
  email?: string;

  // Location
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Coordinates (for delivery optimization)
  latitude?: number;
  longitude?: number;

  // Flags
  isVerified: boolean;
  isActive: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Dosha Profile
 */
export interface DoshaProfile {
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;

  // Scores (0-100)
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;

  // Analysis
  balanceStatus: 'balanced' | 'imbalanced';
  imbalances?: DoshaType[];

  // Recommendations
  recommendations?: {
    diet: string[];
    lifestyle: string[];
    exercise: string[];
    herbs: string[];
    products: string[];
  };

  // Assessment
  assessmentDate: string;
  assessmentSource: 'quiz' | 'practitioner' | 'ml_analysis';
  confidence?: number; // 0-100 for ML-based assessments

  // Seasonal adjustments
  seasonalGuidance?: {
    season: 'spring' | 'summer' | 'fall' | 'winter';
    recommendations: string[];
  };
}

/**
 * Health Profile
 */
export interface HealthProfile {
  // Basic Info
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  height?: number; // in cm
  weight?: number; // in kg
  bloodGroup?: string;

  // Health Conditions
  conditions?: string[];
  allergies?: string[];
  medications?: string[];
  dietaryRestrictions?: string[];

  // Lifestyle
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleepHours?: number;
  stressLevel?: 'low' | 'moderate' | 'high';

  // Goals
  healthGoals?: string[];

  // Medical History
  medicalHistory?: {
    condition: string;
    diagnosedDate?: string;
    status: 'active' | 'resolved';
    notes?: string;
  }[];

  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Metadata
  lastUpdated: string;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  // Notifications
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    productRecommendations: boolean;
    priceDropAlerts: boolean;
    stockAlerts: boolean;
  };

  // Display
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;

  // Shopping
  defaultAddress?: string;
  defaultPaymentMethod?: string;
  savePaymentMethods: boolean;
  autoApplyDiscounts: boolean;

  // Privacy
  profileVisibility: 'public' | 'private';
  showActivityStatus: boolean;
  allowPersonalization: boolean;
  allowDataCollection: boolean;

  // Communication
  preferredContactMethod: 'email' | 'phone' | 'sms';
  contactTimePref?: 'morning' | 'afternoon' | 'evening';

  // Recommendations
  doshaBasedRecommendations: boolean;
  enableMLRecommendations: boolean;
}

/**
 * User Stats
 */
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  totalSavings: number;
  reviewsWritten: number;
  wishlistItems: number;
  loyaltyPoints: number;
  accountAge: number; // in days
  lastOrderDate?: string;
  averageOrderValue: number;
  mostOrderedCategory?: string;
  favoriteProducts?: string[];
}

/**
 * Main User Interface
 */
export interface User {
  // Basic Info
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
  avatar?: string;

  // Authentication
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  authProvider: AuthProvider;

  // Profile
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;

  // Dosha & Health
  doshaProfile?: DoshaProfile;
  healthProfile?: HealthProfile;

  // Addresses
  addresses: Address[];
  defaultAddressId?: string;

  // Preferences
  preferences: UserPreferences;

  // Stats
  stats: UserStats;

  // Loyalty
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  referralCode?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;

  // Flags
  isVerified: boolean;
  isPremium: boolean;
  isBanned: boolean;

  // Metadata
  metadata?: Record<string, any>;
}

/**
 * User Profile (public view)
 */
export interface UserProfile {
  id: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  primaryDosha?: DoshaType;
  reviewCount: number;
  helpfulVotes: number;
  isVerifiedPurchaser: boolean;
  memberSince: string;
}

/**
 * Authentication Tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: 'Bearer';
}

/**
 * Auth Response
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  isNewUser?: boolean;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

/**
 * Social Login Request
 */
export interface SocialLoginRequest {
  provider: Exclude<AuthProvider, 'email'>;
  accessToken: string;
  idToken?: string;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password Reset Confirm
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  avatar?: string;
}

/**
 * Payment Method
 */
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  isDefault: boolean;

  // Card Details (masked)
  last4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;

  // UPI Details
  upiId?: string;

  // Bank Details (masked)
  bankName?: string;
  accountNumber?: string; // Last 4 digits only

  // Wallet Details
  walletProvider?: string;
  walletId?: string;

  // Metadata
  nickname?: string;
  billingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'order'
    | 'promotion'
    | 'product'
    | 'review'
    | 'consultation'
    | 'account'
    | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  imageUrl?: string;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  expiresAt?: string;
}

/**
 * Activity Log
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action:
    | 'login'
    | 'logout'
    | 'order_placed'
    | 'order_cancelled'
    | 'review_submitted'
    | 'profile_updated'
    | 'address_added'
    | 'password_changed';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  timestamp: string;
}

/**
 * Referral Info
 */
export interface ReferralInfo {
  code: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  currency: string;
  referrals: {
    id: string;
    referredUserId: string;
    referredUserName: string;
    status: 'pending' | 'completed' | 'cancelled';
    reward: number;
    createdAt: string;
    completedAt?: string;
  }[];
}

/**
 * Loyalty Program
 */
export interface LoyaltyProgram {
  userId: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  pointsToNextTier: number;
  benefits: {
    discountPercentage: number;
    freeShipping: boolean;
    prioritySupport: boolean;
    exclusiveAccess: boolean;
    earlyAccess: boolean;
  };
  history: {
    id: string;
    type: 'earned' | 'redeemed' | 'expired';
    points: number;
    description: string;
    timestamp: string;
  }[];
  expiringPoints: {
    points: number;
    expiryDate: string;
  }[];
}

/**
 * Type Guards
 */
export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string'
  );
};

export const isAddress = (obj: any): obj is Address => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.addressLine1 === 'string' &&
    typeof obj.city === 'string'
  );
};

/**
 * Helper Types
 */
export type UserId = User['id'];
export type AddressId = Address['id'];
export type PaymentMethodId = PaymentMethod['id'];

/**
 * Helper Functions
 */
export const getFullAddress = (address: Address): string => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

export const getShortAddress = (address: Address): string => {
  return `${address.addressLine1}, ${address.city}, ${address.postalCode}`;
};

export const getUserInitials = (user: User): string => {
  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number based on country code
  // This is a simple implementation, can be enhanced
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const getLoyaltyTierColor = (
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
): string => {
  const tierColors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  };
  return tier ? tierColors[tier] : '#6B7280';
};
