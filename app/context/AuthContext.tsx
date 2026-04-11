// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string; email?: string }>;
  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user from cookie-based API
  const refreshUser = async () => {
    try {
      const res = await axios.get("/api/client/profile");
      if (res.data.user) {
        setUser(res.data.user);
        // Sync with localStorage for compatibility
        localStorage.setItem(
          "clientAuth",
          JSON.stringify({
            clientAuth: true,
            data: res.data.user,
            createdAt: Date.now(),
          })
        );
      } else {
        setUser(null);
        localStorage.removeItem("clientAuth");
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("clientAuth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const clearError = () => setError(null);

  const handlePendingCart = () => {
    const pending = localStorage.getItem("pendingCartItem");
    if (pending) {
      try {
        const { productId } = JSON.parse(pending);
        if (productId) {
          localStorage.removeItem("pendingCartItem");
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
      const response = await axios.post("/api/client/verify-otp", { email, otp });
      const data = response.data;

      const { token, user: userData } = data;
      // Store in localStorage for now (cookie is also set by backend)
      localStorage.setItem(
        "clientAuth",
        JSON.stringify({
          clientAuth: token,
          data: userData,
          createdAt: Date.now(),
        })
      );
      setUser(userData);
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
      const response = await axios.post("/api/client/resend-otp", { email });
      return { success: true, message: response.data.message };
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
      const response = await axios.post("/api/client/forgot-password", { email });
      return { success: true, message: response.data.message };
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
      return { success: true, message: response.data.message };
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
      const response = await axios.post("/api/client/login", { email, password });
      const data = response.data;

      // The login endpoint sets an HTTP‑only cookie and also returns token/user.
      // We'll refresh the user state from /api/auth/me for consistency.
      await refreshUser();
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

  const logout = async () => {
    try {
      await axios.post("/api/client/logout"); // optional: clear cookie server-side
    } catch (e) {}
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
        refreshUser,
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