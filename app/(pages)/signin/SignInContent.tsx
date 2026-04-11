"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  HelpCircle,
  TrendingUp,
  ShoppingCart,
  Shield,
  ArrowRight,
  Zap,
  Mail,
  Lock,
  ArrowLeft,
} from "lucide-react";
import logo from "@/public/logo.png";
import { useAuth } from "@/app/context/AuthContext";

type AuthMode = "login" | "forgotPassword" | "resetPassword";

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, forgotPassword, resetPassword, loading, error, clearError, user } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [rememberMe, setRememberMe] = useState(false);

  const resetToken = searchParams?.get("token");

  useEffect(() => {
    if (resetToken) setMode("resetPassword");
  }, [resetToken]);

  useEffect(() => {
    if (user) {
      const productId = localStorage.getItem("productId");
      if (productId) {
        localStorage.removeItem("productId");
        router.push(`/product/${productId}`);
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const features = [
    {
      title: "Lightning-Fast Checkout",
      description: "Complete purchases in under 2 seconds with seamless payment integration. Shop smarter, faster.",
      icon: ShoppingCart,
      stat: "2s",
      statLabel: "Avg Checkout",
      color: "#10B981",
    },
    {
      title: "Personalized Recommendations",
      description: "AI-driven suggestions boost your satisfaction by 85%. Discover products you'll love instantly.",
      icon: TrendingUp,
      stat: "85%",
      statLabel: "Satisfaction",
      color: "#F59E0B",
    },
    {
      title: "Secure Shopping Guarantee",
      description: "End-to-end encryption protects every transaction. Shop with total confidence.",
      icon: Shield,
      stat: "100%",
      statLabel: "Secure",
      color: "#EF4444",
    },
  ];

  const firstFeature = features[0];

  const validateLogin = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const validateForgotPassword = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address";
    return errors;
  };

  const validateResetPassword = () => {
    const errors: Record<string, string> = {};
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    clearError();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const result = await login(formData.email, formData.password);
    if (result.success) {
      setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });
    } else {
      setToast({ show: true, message: result.message, type: "error" });
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForgotPassword();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const result = await forgotPassword(formData.email);
    setToast({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });
    if (result.success) {
      setFormData((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateResetPassword();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const token = resetToken || "";
    const result = await resetPassword(token, formData.password);
    setToast({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });
    if (result.success) {
      setTimeout(() => {
        setMode("login");
        setFormData({ email: "", password: "", confirmPassword: "" });
      }, 2000);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
                {validationErrors.email && <span className="text-red-500 text-xs ml-2">{validationErrors.email}</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@plastcare.com"
                  className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all ${
                    validationErrors.email
                      ? "border-red-500"
                      : formData.email
                      ? "border-emerald-500"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
                {validationErrors.password && <span className="text-red-500 text-xs ml-2">{validationErrors.password}</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3.5 border rounded-xl text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all ${
                    validationErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setMode("forgotPassword")}
                className="text-amber-500 hover:text-amber-600 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base shadow-md shadow-amber-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Added: Divider + Google Sign-In button right after Sign In button */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = "/api/client/google"}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-4 rounded-xl border border-gray-300 flex items-center justify-center gap-3 transition-all shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">Don&apos;t have an account?</p>
              <Link href="/signup" className="text-amber-500 hover:text-amber-600 font-semibold">
                Sign up →
              </Link>
            </div>
          </form>
        );

      case "forgotPassword":
        return (
          <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium self-start"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>

            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your email address and we&apos;ll send you a link to reset your password.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
                {validationErrors.email && <span className="text-red-500 text-xs ml-2">{validationErrors.email}</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@plastcare.com"
                  className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all ${
                    validationErrors.email ? "border-red-500" : formData.email ? "border-emerald-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base shadow-md shadow-amber-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        );

      case "resetPassword":
        return (
          <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Set New Password</h2>
              <p className="text-gray-600">Enter your new password below.</p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
                {validationErrors.password && <span className="text-red-500 text-xs ml-2">{validationErrors.password}</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="New password"
                  className={`w-full pl-11 pr-12 py-3.5 border rounded-xl text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all ${
                    validationErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
                {validationErrors.confirmPassword && (
                  <span className="text-red-500 text-xs ml-2">{validationErrors.confirmPassword}</span>
                )}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all ${
                    validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base shadow-md shadow-amber-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-2xl text-white font-medium shadow-2xl flex items-center gap-3 transition-all z-50 ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <Image src={logo} alt="PlastCare Empire" width={48} height={48} className="rounded-2xl" />
              <span className="text-3xl font-bold text-gray-900 tracking-tight">PlastCare Empire</span>
            </div>

            {mode === "login" && (
              <>
                <h1 className="text-4xl font-semibold text-gray-900 mb-3">Welcome Back</h1>
                <p className="text-gray-600 text-lg mb-10">
                  Sign in to your account to start shopping and manage your orders.
                </p>
              </>
            )}

            {renderForm()}
          </div>

          <div className="hidden lg:flex bg-gradient-to-br from-amber-100 to-yellow-200 p-12 flex-col">
            <div className="flex justify-end mb-8">
              <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-3xl font-medium shadow-md hover:shadow-lg transition-all">
                <HelpCircle size={18} />
                Need Help?
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full hover:shadow-2xl transition-all">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {firstFeature.title}
                </h2>
                <p className="text-gray-600 text-base mb-8">{firstFeature.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: firstFeature.color }}
                    >
                      <firstFeature.icon size={22} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{firstFeature.stat}</div>
                      <div className="text-xs font-medium tracking-widest text-gray-500 uppercase">
                        {firstFeature.statLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                  Learn More
                  <Zap size={20} />
                </button>
              </div>
            </div>

            <div className="text-center mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Shop Your World</h3>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Join millions of happy customers. Secure, convenient, and full of amazing deals.
              </p>

              <div className="flex justify-center gap-3 mt-8">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full scale-125"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}