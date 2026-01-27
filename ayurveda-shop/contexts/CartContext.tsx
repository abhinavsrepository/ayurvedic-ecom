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

  const refreshCart = useCallback(async () => {
    if (!mounted) return;

    setIsLoading(true);
    try {
      const cart = await cartApi.getCart();
      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      refreshCart();
    }
  }, [mounted, refreshCart]);

  const addToCart = async (item: Omit<CartItem, "id" | "lineTotal">) => {
    try {
      const cart = await cartApi.addItem({
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId,
      });

      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);

      toast.success("Added to cart", {
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart");
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const cart = await cartApi.removeItem(itemId);

      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);

      toast.success("Removed from cart");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
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
      const cart = await cartApi.updateItem(itemId, { quantity });

      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      toast.error("Failed to update quantity");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const cart = await cartApi.clearCart();

      const transformedItems = cart.items.map(transformApiCartItem);
      setItems(transformedItems);
      setSubtotal(cart.subtotal);
      setItemCount(cart.itemCount);

      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
      throw error;
    }
  };

  const getCartTotal = () => {
    return subtotal;
  };

  const getCartCount = () => {
    return itemCount;
  };

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
