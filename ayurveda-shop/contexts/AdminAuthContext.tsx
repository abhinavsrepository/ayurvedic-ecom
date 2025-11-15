'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, LoginRequest, UserInfo, apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface AdminAuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = localStorage.getItem('admin_user');
      const accessToken = localStorage.getItem('admin_access_token');

      if (storedUser && accessToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);

        // Verify token is still valid by fetching current user
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('admin_user', JSON.stringify(currentUser));
        } catch (error) {
          // Token invalid, clear auth state
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);

      // Store tokens
      apiClient.setTokens(response.accessToken, response.refreshToken);

      // Store user info
      localStorage.setItem('admin_user', JSON.stringify(response.user));

      // Update state
      setUser(response.user);
      setIsAuthenticated(true);

      toast.success('Login successful', {
        description: `Welcome back, ${response.user.fullName}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error('Login failed', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
      toast.success('Logged out successfully');
    }
  };

  const handleLogout = () => {
    apiClient.clearTokens();
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('admin_user', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      handleLogout();
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
