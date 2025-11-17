import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';

/**
 * useWishlist Hook
 * Provides access to wishlist context
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
