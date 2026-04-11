// app/(auth)/auth/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  HelpCircle,
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Mail,
  Lock,
  User,
  ArrowLeft,
} from "lucide-react";
import logo from "@/public/logo.png";
import { useAuth } from "@/app/context/AuthContext";

type AuthMode = "signup" | "verifyOtp" | "forgotPassword" | "resetPassword";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, verifyOtp, resendOtp, forgotPassword, resetPassword, loading, error, clearError, user } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset token from URL for password reset
  const resetToken = searchParams.get("token");

  useEffect(() => {
    if (resetToken) {
      setMode("resetPassword");
    }
  }, [resetToken]);

  // Redirect if user already logged in
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

  const features = [
    {
      title: "Instant Account Setup",
      description: "Get started in under 30 seconds. Your shopping journey begins immediately after verification.",
      icon: Clock,
      stat: "30s",
      statLabel: "Setup Time",
      color: "#10B981",
    },
    {
      title: "Exclusive Member Benefits",
      description: "Access special discounts, early sales, and personalized offers reserved for registered members.",
      icon: DollarSign,
      stat: "40%",
      statLabel: "Avg Savings",
      color: "#F59E0B",
    },
    {
      title: "Secure Account Protection",
      description: "Military-grade encryption keeps your personal and payment information completely secure.",
      icon: Shield,
      stat: "100%",
      statLabel: "Protected",
      color: "#EF4444",
    },
  ];

  // Rotate feature every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateSignup = () => {
    const errors: Record<string, string> = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    else if (formData.username.length < 3) errors.username = "Username must be at least 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = "Username can only contain letters, numbers, and underscores";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

    return errors;
  };

  const validateForgotPassword = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address";
    return errors;
  };

  const validateResetPassword = () => {
    const errors: Record<string, string> = {};
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const checkPasswordStrength = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength({ score, criteria });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "password") checkPasswordStrength(value);
    if (name === "confirmPassword" && formData.password === value && validationErrors.confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
    clearError();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return "#6B7280";
    if (passwordStrength.score <= 2) return "#EF4444";
    if (passwordStrength.score <= 3) return "#F59E0B";
    if (passwordStrength.score === 4) return "#3B82F6";
    return "#10B981";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return "No password";
    if (passwordStrength.score <= 2) return "Weak";
    if (passwordStrength.score <= 3) return "Good";
    if (passwordStrength.score === 4) return "Strong";
    return "Excellent";
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      setToast({ show: true, message: result.message, type: "success" });
      setMode("verifyOtp");
    } else {
      setToast({ show: true, message: result.message, type: "error" });
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setValidationErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    const result = await verifyOtp(formData.email, formData.otp);
    if (result.success) {
      setToast({ show: true, message: "Email verified! Redirecting...", type: "success" });
      // Redirect handled by user useEffect
    } else {
      setToast({ show: true, message: result.message, type: "error" });
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const result = await resendOtp(formData.email);
    setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    if (result.success) setResendCooldown(60);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForgotPassword();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const result = await forgotPassword(formData.email);
    setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    if (result.success) {
      // Optionally stay on page or show a message
      setFormData({ ...formData, email: "" });
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
    setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    if (result.success) {
      setTimeout(() => router.push("/signin"), 2000);
    }
  };

  const currentFeature = features[currentIndex];
  const CurrentIcon = currentFeature.icon;

  // Render different forms based on mode
  const renderForm = () => {
    switch (mode) {
      case "signup":
        return (
          <form onSubmit={handleSignupSubmit} className="login-form">
            <div className="input-field">
              <label className="field-label">
                Username
                {validationErrors.username && <span className="error-text">{validationErrors.username}</span>}
              </label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className={`login-input ${validationErrors.username ? "error" : formData.username ? "success" : ""}`}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label className="field-label">
                Email Address
                {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
              </label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@plastcare.com"
                  className={`login-input ${validationErrors.email ? "error" : formData.email ? "success" : ""}`}
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label className="field-label">
                Password
                {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className={`login-input ${validationErrors.password ? "error" : formData.password ? "success" : ""}`}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <div className="strength-text">
                    <span>Strength: {getPasswordStrengthText()}</span>
                    <span>{passwordStrength.score}/5</span>
                  </div>
                  <div className="criteria-list">
                    <div className={`criteria-item ${passwordStrength.criteria.length ? "valid" : ""}`}>
                      {passwordStrength.criteria.length ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      At least 8 characters
                    </div>
                    <div className={`criteria-item ${passwordStrength.criteria.uppercase ? "valid" : ""}`}>
                      {passwordStrength.criteria.uppercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      Uppercase letter
                    </div>
                    <div className={`criteria-item ${passwordStrength.criteria.lowercase ? "valid" : ""}`}>
                      {passwordStrength.criteria.lowercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      Lowercase letter
                    </div>
                    <div className={`criteria-item ${passwordStrength.criteria.number ? "valid" : ""}`}>
                      {passwordStrength.criteria.number ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      Number
                    </div>
                    <div className={`criteria-item ${passwordStrength.criteria.special ? "valid" : ""}`}>
                      {passwordStrength.criteria.special ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="input-field">
              <label className="field-label">
                Confirm Password
                {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`login-input ${validationErrors.confirmPassword ? "error" : formData.confirmPassword ? "success" : ""}`}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-btn">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div className="spinner"></div>Creating Account...</> : <>Create Account <ArrowRight size={20} className="arrow-icon" /></>}
            </button>

            {/* Added: Divider + Google Sign-Up button right after Create Account button */}
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
              Sign up with Google
            </button>

            <div className="login-link">
              Already have an account? <Link href="/signin">Sign in</Link>
            </div>
            <div className="login-link" style={{ marginTop: "0.5rem" }}>
              <button type="button" onClick={() => setMode("forgotPassword")} className="text-link">Forgot password?</button>
            </div>
          </form>
        );

      case "verifyOtp":
        return (
          <form onSubmit={handleVerifyOtpSubmit} className="login-form">
            <div style={{ marginBottom: "1rem" }}>
              <button type="button" onClick={() => setMode("signup")} className="back-link">
                <ArrowLeft size={16} /> Back to signup
              </button>
            </div>
            <h2 className="login-title">Verify Your Email</h2>
            <p className="login-subtitle">
              We sent a 6-digit code to <strong>{formData.email}</strong>. Enter it below to verify your account.
            </p>
            <div className="input-field">
              <label className="field-label">
                OTP Code
                {validationErrors.otp && <span className="error-text">{validationErrors.otp}</span>}
              </label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength={6}
                  className={`login-input ${validationErrors.otp ? "error" : formData.otp.length === 6 ? "success" : ""}`}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div className="spinner"></div>Verifying...</> : <>Verify Email <ArrowRight size={20} className="arrow-icon" /></>}
            </button>
            <div className="login-link">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className="text-link"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        );

      case "forgotPassword":
        return (
          <form onSubmit={handleForgotPasswordSubmit} className="login-form">
            <div style={{ marginBottom: "1rem" }}>
              <button type="button" onClick={() => setMode("signup")} className="back-link">
                <ArrowLeft size={16} /> Back to signup
              </button>
            </div>
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="input-field">
              <label className="field-label">
                Email Address
                {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
              </label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@plastcare.com"
                  className={`login-input ${validationErrors.email ? "error" : formData.email ? "success" : ""}`}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div className="spinner"></div>Sending...</> : <>Send Reset Link <ArrowRight size={20} className="arrow-icon" /></>}
            </button>
          </form>
        );

      case "resetPassword":
        return (
          <form onSubmit={handleResetPasswordSubmit} className="login-form">
            <h2 className="login-title">Set New Password</h2>
            <p className="login-subtitle">Enter your new password below.</p>
            <div className="input-field">
              <label className="field-label">
                New Password
                {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="New password"
                  className={`login-input ${validationErrors.password ? "error" : formData.password ? "success" : ""}`}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <div className="strength-text">
                    <span>Strength: {getPasswordStrengthText()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="input-field">
              <label className="field-label">
                Confirm New Password
                {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className={`login-input ${validationErrors.confirmPassword ? "error" : formData.confirmPassword ? "success" : ""}`}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-btn">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div className="spinner"></div>Resetting...</> : <>Reset Password <ArrowRight size={20} className="arrow-icon" /></>}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow-x: hidden; }
        .page-container { min-height: 100vh; background: #f9fafb; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; position: relative; }
        .toast { position: fixed; top: 1rem; right: 1rem; padding: 1rem 1.5rem; border-radius: 0.5rem; color: white; font-weight: 500; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: translateX(100%); transition: transform 0.3s ease-in-out; z-index: 1000; max-width: 300px; }
        .toast.show { transform: translateX(0); }
        .toast.success { background: #10B981; }
        .toast.error { background: #EF4444; }
        .main-card { background: white; border-radius: 1rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 80rem; width: 100%; display: grid; grid-template-columns: 1fr; }
        @media (min-width: 768px) { .main-card { grid-template-columns: 1fr 1fr; } }
        .left-side { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        @media (max-width: 767px) { .left-side { padding: 2rem; } }
        .logo-section { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; align-self: flex-start; }
        .logo-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; }
        .logo-name { font-size: 1.75rem; font-weight: bold; color: #1f2937; }
        .login-title { font-size: 2rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; }
        .login-subtitle { color: #6b7280; margin-bottom: 2rem; font-size: 1rem; line-height: 1.5; }
        .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-field { display: flex; flex-direction: column; }
        .field-label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
        .error-text { color: #ef4444; font-size: 0.75rem; font-weight: 500; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .login-input { width: 100%; padding: 0.75rem 1rem 0.75rem 3rem; border: 1px solid #d1d5db; border-radius: 0.5rem; color: #374151; font-size: 1rem; transition: all 0.2s; }
        .login-input:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
        .login-input.error { border-color: #ef4444; }
        .login-input.success { border-color: #10b981; }
        .toggle-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; padding: 0.25rem; }
        .toggle-btn:hover { color: #8b5cf6; }
        .password-strength { margin-top: 0.5rem; }
        .strength-bar { height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; margin-bottom: 0.25rem; }
        .strength-fill { height: 100%; transition: all 0.3s; }
        .strength-text { font-size: 0.75rem; color: #6b7280; display: flex; justify-content: space-between; }
        .criteria-list { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .criteria-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #6b7280; }
        .criteria-item.valid { color: #10b981; }
        .submit-btn { width: 100%; background: #8b5cf6; color: white; font-weight: 600; padding: 0.75rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .submit-btn:hover:not(:disabled) { background: #7c3aed; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { width: 16px; height: 16px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .arrow-icon { transition: transform 0.2s; }
        .submit-btn:hover .arrow-icon { transform: translateX(3px); }
        .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: #6b7280; }
        .login-link a { color: #8b5cf6; font-weight: 500; text-decoration: none; margin-left: 0.25rem; }
        .login-link a:hover { text-decoration: underline; }
        .text-link { background: none; border: none; color: #8b5cf6; font-weight: 500; cursor: pointer; padding: 0; font-size: inherit; }
        .text-link:hover { text-decoration: underline; }
        .back-link { background: none; border: none; color: #6b7280; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; padding: 0; }
        .back-link:hover { color: #374151; }
        .right-side { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; color: #1f2937; }
        @media (max-width: 767px) { .right-side { display: none; } }
        .header-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
        .support-btn { display: flex; align-items: center; gap: 0.5rem; background: white; color: #374151; padding: 0.5rem 1rem; border-radius: 9999px; border: none; cursor: pointer; transition: all 0.2s; font-weight: 500; font-size: 0.875rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
        .support-btn:hover { background: #f9fafb; transform: translateY(-1px); }
        .promo-section { flex: 1; display: flex; align-items: center; justify-content: center; }
        .promo-card { background: white; border-radius: 0.5rem; padding: 2rem; color: #1f2937; max-width: 28rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s; }
        .promo-card:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .promo-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; line-height: 1.3; }
        .promo-description { color: #6b7280; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .metric-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #f9fafb; border-radius: 0.5rem; }
        .metric-icon { width: 2rem; height: 2rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; }
        .metric-value { font-size: 1.25rem; font-weight: 700; color: #1f2937; }
        .metric-label { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .cta-btn { width: 100%; background: #8b5cf6; color: white; font-weight: 600; padding: 0.75rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.875rem; }
        .cta-btn:hover { background: #7c3aed; transform: translateY(-1px); }
        .footer-section { text-align: center; }
        .footer-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 0.75rem; }
        .footer-description { color: #6b7280; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .indicators { display: flex; justify-content: center; gap: 0.5rem; }
        .indicator { width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #d1d5db; transition: all 0.2s; }
        .indicator.active { background: #8b5cf6; transform: scale(1.2); }
      `}</style>

      {toast.show && <div className={`toast ${toast.type} show`}>{toast.message}</div>}

      <div className="page-container">
        <div className="main-card">
          <div className="left-side">
            <div className="logo-section">
              <Image src={logo} alt="PlastCare Empire" className="logo-icon" width={40} height={40} />
              <span className="logo-name">PlastCare Empire</span>
            </div>
            {renderForm()}
          </div>

          <div className="right-side">
            <div className="header-actions">
              <button className="support-btn">
                <HelpCircle size={16} />
                <span>Need Help?</span>
              </button>
            </div>
            <div className="promo-section">
              <div className="promo-card">
                <div className="promo-content">
                  <h2 className="promo-title">{currentFeature.title}</h2>
                  <p className="promo-description">{currentFeature.description}</p>
                </div>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-icon" style={{ backgroundColor: currentFeature.color }}>
                      <CurrentIcon size={20} />
                    </div>
                    <div>
                      <div className="metric-value">{currentFeature.stat}</div>
                      <div className="metric-label">{currentFeature.statLabel}</div>
                    </div>
                  </div>
                </div>
                <button className="cta-btn">
                  Learn More
                  <Zap size={18} />
                </button>
              </div>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Join PlastCare Empire</h3>
              <p className="footer-description">
                Become part of millions of satisfied customers. Secure, convenient, and packed with great deals.
              </p>
              <div className="indicators">
                {features.map((_, index) => (
                  <div key={index} className={`indicator ${index === currentIndex ? "active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}