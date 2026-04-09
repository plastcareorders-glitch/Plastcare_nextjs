// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string; email?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("clientAuth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.data && parsed.clientAuth) {
          setUser(parsed.data);
        }
      } catch (e) {
        console.error("Failed to parse auth data");
      }
    }
    setLoading(false);
  }, []);

  const clearError = () => setError(null);

  // Helper: Handle pending cart navigation after successful auth
  const handlePendingCart = () => {
    const pending = localStorage.getItem("pendingCartItem");
    if (pending) {
      try {
        const { productId } = JSON.parse(pending);
        if (productId) {
          // Clean up first to avoid loops
          localStorage.removeItem("pendingCartItem");
          // Navigate to the product page
          router.push(`/product/${productId}`);
        } else {
          localStorage.removeItem("pendingCartItem");
        }
      } catch (e) {
        console.error("Failed to parse pending cart item");
        localStorage.removeItem("pendingCartItem");
      }
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/register", {
        username,
        email,
        password,
      });
      const data = response.data;
      return { success: true, message: data.message, email: data.email };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/verify-otp", {
        email,
        otp,
      });
      const data = response.data;

      const { token, user: userData } = data;
      localStorage.setItem(
        "clientAuth",
        JSON.stringify({
          clientAuth: token,
          data: userData,
          createdAt: Date.now(),
        })
      );
      setUser(userData);

      // Check for pending cart item and redirect if exists
      handlePendingCart();

      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Verification failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/resend-otp", {
        email,
      });
      const data = response.data;
      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to resend OTP";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/forgot-password", {
        email,
      });
      const data = response.data;
      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Request failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/reset-password", {
        token,
        newPassword,
      });
      const data = response.data;
      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Password reset failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/client/login", {
        email,
        password,
      });
      const data = response.data;

      const { token, user: userData } = data;
      localStorage.setItem(
        "clientAuth",
        JSON.stringify({
          clientAuth: token,
          data: userData,
          createdAt: Date.now(),
        })
      );
      setUser(userData);

      // Check for pending cart item and redirect if exists
      handlePendingCart();

      return { success: true, message: "Login successful" };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("clientAuth");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};