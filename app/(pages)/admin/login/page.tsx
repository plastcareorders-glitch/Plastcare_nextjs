"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  HelpCircle,
  TrendingUp,
  Users,
  Package,
  Shield,
  BarChart3,
  ArrowRight,
  Database,
  Zap,
  Play,
  Clock,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const features = [
    {
      title: "Lightning-Fast Order Engine",
      description:
        "Process 50K+ transactions per minute with zero downtime. AI-powered routing ensures flawless delivery.",
      icon: ShoppingCart,
      stat: "50K+",
      statLabel: "TPS",
      color: "#10B981",
    },
    {
      title: "Predictive Analytics AI",
      description:
        "Forecast sales with 98% accuracy using ML models. Turn data into decisions that drive explosive growth.",
      icon: BarChart3,
      stat: "98%",
      statLabel: "Accuracy",
      color: "#F59E0B",
    },
    {
      title: "Fortress-Level Security",
      description:
        "Quantum-resistant encryption and real-time threat detection. Your empire stays impenetrable.",
      icon: Shield,
      stat: "0",
      statLabel: "Breaches",
      color: "#EF4444",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock successful login – any credentials work for demo
    const mockAdminData = {
      success: true,
      token: "mock_admin_token_" + Date.now(),
      user: {
        id: "admin_001",
        email: email,
        role: "admin",
      },
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("adminAuth", JSON.stringify(mockAdminData));
    setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });

    setTimeout(() => {
      router.push("/admin/home");
    }, 1500);

    setIsLoading(false);
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const firstFeature = features[0];
  const FirstFeatureIcon = firstFeature.icon;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }
        .page-container {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
        }
        .toast {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
          max-width: 300px;
        }
        .toast.show {
          transform: translateX(0);
        }
        .toast.success {
          background: #10B981;
        }
        .toast.error {
          background: #EF4444;
        }
        .main-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          overflow: hidden;
          max-width: 80rem;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .main-card {
            grid-template-columns: 1fr 1fr;
          }
        }
        .left-side {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 767px) {
          .left-side {
            padding: 2rem;
          }
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          align-self: flex-start;
        }
        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #f59e0b;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
        }
        .logo-name {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .login-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 1rem;
          line-height: 1.5;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-field {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          position: relative;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          color: #374151;
          font-size: 1rem;
          transition: all 0.2s ease-in-out;
        }
        .login-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .login-input::placeholder {
          color: #9ca3af;
        }
        .toggle-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
        }
        .toggle-btn:hover {
          color: #f59e0b;
        }
        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
        }
        .persist-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .persist-checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: #f59e0b;
          cursor: pointer;
        }
        .reset-link {
          font-size: 0.875rem;
          color: #f59e0b;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .reset-link:hover {
          color: #d97706;
        }
        .submit-btn {
          width: 100%;
          background: #f59e0b;
          color: white;
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #d97706;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .arrow-icon {
          transition: transform 0.2s ease;
        }
        .submit-btn:hover .arrow-icon {
          transform: translateX(3px);
        }
        .divider {
          position: relative;
          margin: 2rem 0;
          text-align: center;
        }
        .divider-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }
        .divider-text {
          position: relative;
          padding: 0 1rem;
          background: white;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .social-btn:hover {
          border-color: #f59e0b;
          color: #f59e0b;
        }
        @media (max-width: 767px) {
          .social-buttons {
            grid-template-columns: 1fr;
          }
        }
        .right-side {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #1f2937;
        }
        @media (max-width: 767px) {
          .right-side {
            padding: 2rem;
            display: none;
          }
        }
        .header-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }
        .support-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-weight: 500;
          font-size: 0.875rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .support-btn:hover {
          background: #f9fafb;
          transform: translateY(-1px);
        }
        .promo-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .promo-card {
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          color: #1f2937;
          max-width: 28rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s ease-in-out;
        }
        .promo-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .promo-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .promo-description {
          color: #6b7280;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .metric-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        .metric-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .metric-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }
        .metric-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cta-btn {
          width: 100%;
          background: #f59e0b;
          color: white;
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .cta-btn:hover {
          background: #d97706;
          transform: translateY(-1px);
        }
        .footer-section {
          text-align: center;
        }
        .footer-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }
        .footer-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .indicators {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        .indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background: #d1d5db;
          transition: all 0.2s ease;
        }
        .indicator.active {
          background: #f59e0b;
          transform: scale(1.2);
        }
      `}</style>

      {toast.show && <div className={`toast ${toast.type} show`}>{toast.message}</div>}

      <div className="page-container">
        <div className="main-card">
          {/* Left Side - Login Form */}
          <div className="left-side">
            <div className="logo-section">
              <div className="logo-icon">E</div>
              <span className="logo-name">Empire Admin</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to your account to continue managing your e-commerce empire.
            </p>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-field">
                <label className="field-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@empire.com"
                    className="login-input"
                    required
                  />
                </div>
              </div>
              <div className="input-field">
                <label className="field-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-btn"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="form-options">
                <label className="persist-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="persist-checkbox"
                  />
                  <span className="persist-text">Remember me</span>
                </label>
                <a href="#" className="reset-link">
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <TrendingUp size={20} className="arrow-icon" />
                  </>
                )}
              </button>
              <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">or continue with</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-btn google-btn">
                  <Play size={18} />
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn azure-btn">
                  <Database size={18} />
                  <span>Microsoft</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Promo Section */}
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
                  <h2 className="promo-title">{firstFeature.title}</h2>
                  <p className="promo-description">{firstFeature.description}</p>
                </div>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-icon" style={{ backgroundColor: firstFeature.color }}>
                      <FirstFeatureIcon size={20} />
                    </div>
                    <div>
                      <div className="metric-value">{firstFeature.stat}</div>
                      <div className="metric-label">{firstFeature.statLabel}</div>
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
              <h3 className="footer-title">Command Your Marketplace</h3>
              <p className="footer-description">
                Trusted by thousands of businesses worldwide. Secure, scalable, and ready to grow with you.
              </p>
              <div className="indicators">
                <div className="indicator active"></div>
                <div className="indicator"></div>
                <div className="indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}