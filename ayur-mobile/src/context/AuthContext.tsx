import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types';

const AUTH_STORAGE_KEY = '@ayurveda_user';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Context Provider
 * Manages authentication state with AsyncStorage persistence
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in real app, call API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData: User = {
            id: 'user_' + Date.now(),
            email,
            name: email.split('@')[0],
          };
          setUser(userData);
          saveUser(userData);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    // Mock signup - in real app, call API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          const userData: User = {
            id: 'user_' + Date.now(),
            email,
            name,
          };
          setUser(userData);
          saveUser(userData);
          resolve();
        } else {
          reject(new Error('Invalid data'));
        }
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await saveUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
