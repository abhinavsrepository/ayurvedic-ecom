"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  cartApi,
  isValidUUID,
  type CartItem as ApiCartItem,
  type Cart,
} from "@/lib/api/cart";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: string;
  variantId?: string;
  lineTotal: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  subtotal: number;
  itemCount: number;
  addToCart: (item: Omit<CartItem, "id" | "lineTotal">) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemQuantity: (productId: string, variantId?: string) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [apiAvailable, setApiAvailable] = useState(true);

  const transformApiCartItem = (item: ApiCartItem): CartItem => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    slug: item.slug,
    price: item.price,
    originalPrice: item.originalPrice,
    image: item.image,
    quantity: item.quantity,
    variantId: item.variantId,
    lineTotal: item.lineTotal,
  });

  const calculateTotals = useCallback((cartItems: CartItem[]) => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: newSubtotal, count: newCount };
  }, []);

  const refreshCart = useCallback(async () => {
    if (!mounted) return;

    setIsLoading(true);
    try {
      const cart = await cartApi.getCart();
      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);
      setApiAvailable(true);
    } catch (error: any) {
      // Silently handle API unavailability
      if (error?.message === 'API_UNAVAILABLE') {
        setApiAvailable(false);
        // Use local storage for cart if API is down
        const localCart = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('local_cart') || '[]') 
          : [];
        setItems(localCart);
        const { subtotal, count } = calculateTotals(localCart);
        setSubtotal(subtotal);
        setItemCount(count);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mounted, calculateTotals]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      refreshCart();
    }
  }, [mounted, refreshCart]);

  // Save to localStorage whenever cart changes (for offline mode)
  useEffect(() => {
    if (mounted && !apiAvailable && typeof window !== 'undefined') {
      localStorage.setItem('local_cart', JSON.stringify(items));
    }
  }, [items, mounted, apiAvailable]);

  const addToCart = async (item: Omit<CartItem, "id" | "lineTotal">) => {
    // Check if productId is a valid UUID - mock products use simple numeric IDs
    const isMockProduct = !isValidUUID(item.productId);
    
    try {
      if (apiAvailable && !isMockProduct) {
        const cart = await cartApi.addItem({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
        });
        const transformedItems = cart.items.map(transformApiCartItem);
        setItems(transformedItems);
        setSubtotal(cart.subtotal);
        setItemCount(cart.itemCount);
      } else {
        // Use local mode for mock products or when API is unavailable
        if (isMockProduct) {
          console.debug('Using local cart for mock product:', item.name);
        }
        // Local mode
        setItems((prev) => {
          const existingIndex = prev.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          
          let newItems;
          if (existingIndex >= 0) {
            newItems = prev.map((i, idx) => 
              idx === existingIndex 
                ? { ...i, quantity: i.quantity + item.quantity, lineTotal: i.price * (i.quantity + item.quantity) }
                : i
            );
          } else {
            const newItem: CartItem = {
              ...item,
              id: `local_${Date.now()}`,
              lineTotal: item.price * item.quantity,
            };
            newItems = [...prev, newItem];
          }
          
          const { subtotal, count } = calculateTotals(newItems);
          setSubtotal(subtotal);
          setItemCount(count);
          return newItems;
        });
      }

      toast.success("Added to cart", {
        description: `${item.name} has been added to your cart`,
      });
    } catch (error: any) {
      // Fallback to local mode for API errors (validation errors, not found, etc.)
      const statusCode = error?.response?.status || error?.status;
      const isValidationError = statusCode === 400 || statusCode === 404;
      const isNetworkError = error?.message === 'API_UNAVAILABLE' || error?.code === 'ERR_NETWORK' || error?.code === 'ECONNREFUSED';
      
      if (isNetworkError || isValidationError) {
        setApiAvailable(false);
        // Retry with local mode
        setItems((prev) => {
          const existingIndex = prev.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          
          let newItems;
          if (existingIndex >= 0) {
            newItems = prev.map((i, idx) => 
              idx === existingIndex 
                ? { ...i, quantity: i.quantity + item.quantity, lineTotal: i.price * (i.quantity + item.quantity) }
                : i
            );
          } else {
            const newItem: CartItem = {
              ...item,
              id: `local_${Date.now()}`,
              lineTotal: item.price * item.quantity,
            };
            newItems = [...prev, newItem];
          }
          
          const { subtotal, count } = calculateTotals(newItems);
          setSubtotal(subtotal);
          setItemCount(count);
          
          // Save to localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('local_cart', JSON.stringify(newItems));
          }
          
          return newItems;
        });
        
        toast.success("Added to cart", {
          description: `${item.name} has been added to your cart`,
        });
        return;
      }
      toast.error("Failed to add item to cart");
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (apiAvailable) {
        const cart = await cartApi.removeItem(itemId);
        const transformedItems = cart.items.map(transformApiCartItem);
        setItems(transformedItems);
        setSubtotal(cart.subtotal);
        setItemCount(cart.itemCount);
      } else {
        // Local mode
        setItems((prev) => {
          const newItems = prev.filter((i) => i.id !== itemId);
          const { subtotal, count } = calculateTotals(newItems);
          setSubtotal(subtotal);
          setItemCount(count);
          return newItems;
        });
      }

      toast.success("Removed from cart");
    } catch (error: any) {
      if (error?.message === 'API_UNAVAILABLE') {
        setApiAvailable(false);
        await removeFromCart(itemId);
        return;
      }
      toast.error("Failed to remove item from cart");
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      if (apiAvailable) {
        const cart = await cartApi.updateItem(itemId, { quantity });
        const transformedItems = cart.items.map(transformApiCartItem);
        setItems(transformedItems);
        setSubtotal(cart.subtotal);
        setItemCount(cart.itemCount);
      } else {
        // Local mode
        setItems((prev) => {
          const newItems = prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity, lineTotal: item.price * quantity }
              : item
          );
          const { subtotal, count } = calculateTotals(newItems);
          setSubtotal(subtotal);
          setItemCount(count);
          return newItems;
        });
      }
    } catch (error: any) {
      if (error?.message === 'API_UNAVAILABLE') {
        setApiAvailable(false);
        await updateQuantity(itemId, quantity);
        return;
      }
      toast.error("Failed to update quantity");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (apiAvailable) {
        const cart = await cartApi.clearCart();
        const transformedItems = cart.items.map(transformApiCartItem);
        setItems(transformedItems);
        setSubtotal(cart.subtotal);
        setItemCount(cart.itemCount);
      } else {
        // Local mode
        setItems([]);
        setSubtotal(0);
        setItemCount(0);
      }

      toast.success("Cart cleared");
    } catch (error: any) {
      if (error?.message === 'API_UNAVAILABLE') {
        setApiAvailable(false);
        await clearCart();
        return;
      }
      toast.error("Failed to clear cart");
      throw error;
    }
  };

  const getCartTotal = () => subtotal;
  const getCartCount = () => itemCount;

  const getItemQuantity = (productId: string, variantId?: string) => {
    const item = items.find(
      (i) => i.productId === productId && i.variantId === variantId,
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        subtotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
