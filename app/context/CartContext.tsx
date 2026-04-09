"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Types
interface CartItem {
  product: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    salePrice: number | null;
  };
  quantity: number;
  price: number;
  variant?: { name?: string; value?: string };
}

interface Cart {
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, variant?: object) => Promise<boolean>;
  removeFromCart: (productId: string, variant?: object) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number, variant?: object) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/client/cart");
      if (response.data.success) {
        setCart(response.data.cart);
        setError(null);
      } else {
        setCart({ items: [], totalAmount: 0, totalItems: 0 });
      }
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      setError(err.response?.data?.message || "Could not load cart");
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId: string, quantity: number, variant?: object): Promise<boolean> => {
    try {
      const response = await axios.post("/api/client/cart", { productId, quantity, variant });
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Add to cart error:", err);
      setError(err.response?.data?.message || "Failed to add item");
      return false;
    }
  };

  const removeFromCart = async (productId: string, variant?: object): Promise<boolean> => {
    try {
      const variantParam = variant ? JSON.stringify(variant) : "";
      const response = await axios.delete(`/api/client/cart?productId=${productId}&variant=${encodeURIComponent(variantParam)}`);
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Remove from cart error:", err);
      setError(err.response?.data?.message || "Failed to remove item");
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      const response = await axios.delete("/api/client/cart?clear=true");
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Clear cart error:", err);
      setError(err.response?.data?.message || "Failed to clear cart");
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number, variant?: object): Promise<boolean> => {
    try {
      // Find current item in cart
      const currentItem = cart?.items.find(
        (item) =>
          item.product._id === productId &&
          JSON.stringify(item.variant || {}) === JSON.stringify(variant || {})
      );

      if (!currentItem) {
        // If item not in cart, just add it
        return await addToCart(productId, quantity, variant);
      }

      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        return await removeFromCart(productId, variant);
      }

      // Remove the existing item first
      const variantParam = variant ? JSON.stringify(variant) : "";
      await axios.delete(`/api/client/cart?productId=${productId}&variant=${encodeURIComponent(variantParam)}`);

      // Then add back with new quantity
      const addRes = await axios.post("/api/client/cart", { productId, quantity, variant });

      if (addRes.data.success) {
        setCart(addRes.data.cart);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Update quantity error:", err);
      setError(err.response?.data?.message || "Failed to update quantity");
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, loading, error, fetchCart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};