/**
 * User Service
 * Handles all user profile and related API calls
 */

import apiClient, { ApiResponse } from './apiClient';
import { User, Address, Product, DoshaType } from '../../types';
import { PaginatedResponse, PaginationParams } from './productService';

/**
 * Update profile data
 */
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  doshaType?: DoshaType;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

/**
 * User preferences
 */
export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

/**
 * User activity log
 */
export interface UserActivity {
  id: string;
  type: 'login' | 'logout' | 'order' | 'review' | 'wishlist' | 'profile_update';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * User notification
 */
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'reminder';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

/**
 * Dosha quiz result
 */
export interface DoshaQuizResult {
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  scores: {
    Vata: number;
    Pitta: number;
    Kapha: number;
  };
  recommendations: string[];
}

/**
 * Get user profile
 * @returns User profile data
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch profile');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch profile');
  }
};

/**
 * Update user profile
 * @param data - Profile data to update
 * @returns Updated user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>('/user/profile', data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update profile');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Upload profile avatar
 * @param imageUri - Local image URI
 * @returns Updated user profile with new avatar URL
 */
export const uploadAvatar = async (imageUri: string): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await apiClient.post<ApiResponse<User>>('/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to upload avatar');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload avatar');
  }
};

/**
 * Delete user account
 * @param password - User password for confirmation
 * @returns Success status
 */
export const deleteAccount = async (password: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>('/user/account', {
      data: { password },
    });

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to delete account');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete account');
  }
};

// ==================== Addresses ====================

/**
 * Get user addresses
 * @returns List of user addresses
 */
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Address[]>>('/user/addresses');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch addresses');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch addresses');
  }
};

/**
 * Get single address by ID
 * @param id - Address ID
 * @returns Address details
 */
export const getAddress = async (id: string): Promise<Address> => {
  try {
    const response = await apiClient.get<ApiResponse<Address>>(`/user/addresses/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch address');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch address');
  }
};

/**
 * Add new address
 * @param address - Address data
 * @returns Created address
 */
export const addAddress = async (address: Omit<Address, 'id'>): Promise<Address> => {
  try {
    const response = await apiClient.post<ApiResponse<Address>>('/user/addresses', address);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to add address');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add address');
  }
};

/**
 * Update address
 * @param id - Address ID
 * @param address - Updated address data
 * @returns Updated address
 */
export const updateAddress = async (
  id: string,
  address: Partial<Omit<Address, 'id'>>
): Promise<Address> => {
  try {
    const response = await apiClient.put<ApiResponse<Address>>(`/user/addresses/${id}`, address);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update address');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update address');
  }
};

/**
 * Delete address
 * @param id - Address ID
 * @returns Success status
 */
export const deleteAddress = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/user/addresses/${id}`);

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to delete address');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete address');
  }
};

/**
 * Set default address
 * @param id - Address ID
 * @returns Updated address
 */
export const setDefaultAddress = async (id: string): Promise<Address> => {
  try {
    const response = await apiClient.put<ApiResponse<Address>>(
      `/user/addresses/${id}/set-default`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to set default address');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to set default address');
  }
};

// ==================== Wishlist ====================

/**
 * Get user wishlist
 * @returns List of wishlist products
 */
export const getWishlist = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/user/wishlist');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch wishlist');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch wishlist');
  }
};

/**
 * Add product to wishlist
 * @param productId - Product ID to add
 * @returns Success status
 */
export const addToWishlist = async (productId: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/user/wishlist', { productId });

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to add to wishlist');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add to wishlist');
  }
};

/**
 * Remove product from wishlist
 * @param productId - Product ID to remove
 * @returns Success status
 */
export const removeFromWishlist = async (productId: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/user/wishlist/${productId}`);

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to remove from wishlist');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to remove from wishlist');
  }
};

/**
 * Check if product is in wishlist
 * @param productId - Product ID to check
 * @returns Boolean indicating if product is in wishlist
 */
export const isInWishlist = async (productId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ inWishlist: boolean }>>(
      `/user/wishlist/check/${productId}`
    );

    return response.data.data?.inWishlist ?? false;
  } catch (error: any) {
    console.error('Failed to check wishlist:', error);
    return false;
  }
};

/**
 * Clear entire wishlist
 * @returns Success status
 */
export const clearWishlist = async (): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>('/user/wishlist');

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to clear wishlist');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to clear wishlist');
  }
};

// ==================== Preferences ====================

/**
 * Get user preferences
 * @returns User preferences
 */
export const getPreferences = async (): Promise<UserPreferences> => {
  try {
    const response = await apiClient.get<ApiResponse<UserPreferences>>('/user/preferences');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch preferences');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch preferences');
  }
};

/**
 * Update user preferences
 * @param preferences - Preferences to update
 * @returns Updated preferences
 */
export const updatePreferences = async (
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> => {
  try {
    const response = await apiClient.put<ApiResponse<UserPreferences>>(
      '/user/preferences',
      preferences
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update preferences');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update preferences');
  }
};

// ==================== Notifications ====================

/**
 * Get user notifications
 * @param params - Pagination parameters
 * @returns Paginated notifications
 */
export const getNotifications = async (
  params?: PaginationParams
): Promise<PaginatedResponse<UserNotification>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UserNotification>>>(
      '/user/notifications',
      { params }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch notifications');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

/**
 * Mark notification as read
 * @param id - Notification ID
 * @returns Success status
 */
export const markNotificationRead = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.put<ApiResponse>(`/user/notifications/${id}/read`);

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to mark notification as read');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark notification as read');
  }
};

/**
 * Mark all notifications as read
 * @returns Success status
 */
export const markAllNotificationsRead = async (): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.put<ApiResponse>('/user/notifications/read-all');

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to mark all notifications as read');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }
};

/**
 * Delete notification
 * @param id - Notification ID
 * @returns Success status
 */
export const deleteNotification = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/user/notifications/${id}`);

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to delete notification');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete notification');
  }
};

/**
 * Get unread notification count
 * @returns Count of unread notifications
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      '/user/notifications/unread-count'
    );

    return response.data.data?.count ?? 0;
  } catch (error: any) {
    console.error('Failed to get unread notification count:', error);
    return 0;
  }
};

// ==================== Activity & Analytics ====================

/**
 * Get user activity log
 * @param params - Pagination parameters
 * @returns Paginated activity log
 */
export const getActivityLog = async (
  params?: PaginationParams
): Promise<PaginatedResponse<UserActivity>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UserActivity>>>(
      '/user/activity',
      { params }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch activity log');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch activity log');
  }
};

/**
 * Get user statistics
 * @returns User statistics
 */
export const getUserStatistics = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  totalReviews: number;
  wishlistCount: number;
  joinDate: string;
}> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        totalOrders: number;
        totalSpent: number;
        totalReviews: number;
        wishlistCount: number;
        joinDate: string;
      }>
    >('/user/statistics');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch statistics');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch statistics');
  }
};

// ==================== Dosha Quiz ====================

/**
 * Submit dosha quiz answers
 * @param answers - Quiz answers
 * @returns Dosha quiz result
 */
export const submitDoshaQuiz = async (
  answers: Record<string, string | number>
): Promise<DoshaQuizResult> => {
  try {
    const response = await apiClient.post<ApiResponse<DoshaQuizResult>>(
      '/user/dosha-quiz',
      answers
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to submit quiz');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit quiz');
  }
};

/**
 * Get dosha quiz history
 * @returns List of past quiz results
 */
export const getDoshaQuizHistory = async (): Promise<
  Array<DoshaQuizResult & { takenAt: string }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<Array<DoshaQuizResult & { takenAt: string }>>
    >('/user/dosha-quiz/history');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch quiz history');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch quiz history');
  }
};

// ==================== Support ====================

/**
 * Submit support ticket
 * @param subject - Ticket subject
 * @param message - Ticket message
 * @param category - Support category
 * @returns Ticket details
 */
export const submitSupportTicket = async (
  subject: string,
  message: string,
  category: 'order' | 'product' | 'account' | 'technical' | 'other'
): Promise<{
  ticketId: string;
  status: string;
  message: string;
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        ticketId: string;
        status: string;
        message: string;
      }>
    >('/user/support/ticket', { subject, message, category });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to submit ticket');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit ticket');
  }
};

/**
 * Get FAQ
 * @param category - FAQ category (optional)
 * @returns List of FAQs
 */
export const getFAQ = async (
  category?: string
): Promise<
  Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<
        Array<{
          id: string;
          question: string;
          answer: string;
          category: string;
        }>
      >
    >('/user/support/faq', { params: { category } });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  } catch (error: any) {
    console.error('Failed to fetch FAQ:', error);
    return [];
  }
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  getAddresses,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
  getPreferences,
  updatePreferences,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadNotificationCount,
  getActivityLog,
  getUserStatistics,
  submitDoshaQuiz,
  getDoshaQuizHistory,
  submitSupportTicket,
  getFAQ,
};
