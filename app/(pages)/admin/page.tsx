// app/admin/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import axios from "axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  // Redirect if already logged in
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "error" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/admin/login", { email, password });
      if (response.data.success) {
        // Store admin data in localStorage as "adminAuth"
        localStorage.setItem("adminAuth", JSON.stringify(response.data.admin));
        setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });
        // Redirect to admin dashboard
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      } else {
        setError(response.data.message || "Login failed");
        setToast({ show: true, message: response.data.message || "Login failed", type: "error" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Server error. Please try again.";
      setError(msg);
      setToast({ show: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; }
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-card {
          max-width: 28rem;
          width: 100%;
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: transform 0.2s;
        }
        .login-card:hover {
          transform: translateY(-2px);
        }
        .card-header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          padding: 2rem 1.5rem;
          text-align: center;
          color: white;
        }
        .card-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }
        .card-header p {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0;
        }
        .card-body {
          padding: 2rem 1.5rem;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .admin-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }
        .admin-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .toggle-password {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
        }
        .toggle-password:hover {
          color: #7c3aed;
        }
        .error-message {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #ef4444;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 0.2s, transform 0.1s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .footer-links {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
        }
        .footer-links a {
          color: #7c3aed;
          text-decoration: none;
          font-weight: 500;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .toast {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
          max-width: 300px;
        }
        .toast.show {
          transform: translateX(0);
        }
        .toast.success {
          background: #10b981;
        }
        .toast.error {
          background: #ef4444;
        }
      `}</style>

      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}

      <div className="admin-login-container">
        <div className="login-card">
          <div className="card-header">
            <h1>Admin Portal</h1>
            <p>Sign in to manage your store</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="admin@plastcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="admin-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="footer-links">
              <Link href="/">← Back to Main Site</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}