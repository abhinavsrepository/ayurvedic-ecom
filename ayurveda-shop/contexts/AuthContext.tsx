'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { UserInfo } from '@/lib/api/types';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, twoFaCode?: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setUser(null);
        return;
      }
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (username: string, password: string, twoFaCode?: string) => {
    const response = await authApi.login({ username, password, twoFaCode });
    localStorage.setItem('admin_access_token', response.accessToken);
    localStorage.setItem('admin_refresh_token', response.refreshToken);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const register = async (data: { username: string; email: string; password: string; fullName: string }) => {
    const response = await authApi.register(data);
    localStorage.setItem('admin_access_token', response.accessToken);
    localStorage.setItem('admin_refresh_token', response.refreshToken);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
