import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, WishlistContextType } from '../types';

const WISHLIST_STORAGE_KEY = '@ayurveda_wishlist';

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

/**
 * Wishlist Context Provider
 * Manages wishlist state with AsyncStorage persistence
 */
export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load wishlist from AsyncStorage on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    saveWishlist();
  }, [wishlist]);

  const loadWishlist = async () => {
    try {
      const wishlistData = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (wishlistData) {
        setWishlist(JSON.parse(wishlistData));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const saveWishlist = async () => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
