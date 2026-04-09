"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Hotel,
  Package,
  FileText,
  Folder,
  ClipboardList,
  Search,
  Bell,
  Settings,
  Share2,
  Plus,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Mail,
} from "lucide-react";

// Menu item type
interface MenuItem {
  id: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "Customers", icon: Users, href: "/admin/customers" },
  { id: "Add Products", icon: Hotel, href: "/admin/add-product" },
  { id: "Products", icon: Package, href: "/admin/products" },
  { id: "Payment", icon: FileText, href: "/admin/payments" },
  { id: "Shipping", icon: Folder, href: "/admin/shipping" },
  { id: "Customer Carts", icon: ClipboardList, href: "/admin/carts" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Admin User");
  const [userEmail, setUserEmail] = useState("admin@example.com");

  // Check screen size
  const checkScreenSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    setSidebarOpen(!mobile);
  }, []);

  useEffect(() => {
    checkScreenSize();
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkScreenSize]);

  // Authentication check (mock)
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/admin/login");
      return;
    }
    try {
      const authData = JSON.parse(adminAuth);
      const createdAt = new Date(authData.createdAt);
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (isNaN(createdAt.getTime()) || createdAt < threeDaysAgo) {
        localStorage.removeItem("adminAuth");
        router.push("/admin/login");
        return;
      }
      // Set user info from auth data
      setUserName(authData.user?.name || "Admin User");
      setUserEmail(authData.user?.email || "admin@example.com");
    } catch {
      localStorage.removeItem("adminAuth");
      router.push("/admin/login");
    }
  }, [router]);

  const handleMenuClick = (href: string) => {
    router.push(href);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="admin-container">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
        }
        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        /* Sidebar */
        .sidebar {
          width: 280px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          z-index: 999;
          position: relative;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          border-right: 1px solid #e5e7eb;
          flex-shrink: 0;
        }
        @media (max-width: 1023px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
        .brand-section {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
          flex-shrink: 0;
        }
        .brand-logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }
        .brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.5px;
        }
        .sidebar-toggle {
          margin-left: auto;
          cursor: pointer;
          color: #6b7280;
          font-size: 18px;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-toggle:hover {
          background: #f3f4f6;
          color: #374151;
        }
        .user-profile {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
          flex-shrink: 0;
        }
        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          flex-shrink: 0;
        }
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .user-details .user-name {
          font-weight: 600;
          font-size: 15px;
          color: #1f2937;
          line-height: 1.3;
        }
        .user-details .user-email {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }
        .menu-navigation {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          scrollbar-width: thin;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 24px;
          margin: 2px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: #4b5563;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }
        .menu-item:hover {
          background: #f3f4f6;
          color: #1f2937;
        }
        .menu-item.active {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .menu-icon {
          width: 18px;
          height: 18px;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          min-width: 0;
          width: calc(100vw - 280px);
          transition: all 0.3s ease;
        }
        @media (max-width: 1023px) {
          .main-content {
            width: 100%;
          }
        }
        .header {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
        }
        .mobile-menu-toggle:hover {
          background: #f3f4f6;
          color: #374151;
        }
        @media (max-width: 1023px) {
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .search-container {
          position: relative;
          flex: 0 1 400px;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 12px 20px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: #ffffff;
          color: #374151;
          transition: all 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .action-button {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #3b82f6;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .action-button:hover {
          background: #2563eb;
          transform: scale(1.05);
        }
        .customers-link {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid #dbeafe;
        }
        .customers-link:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }
        .icon-button {
          position: relative;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s;
          color: #6b7280;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-button:hover {
          background: #f3f4f6;
          color: #374151;
        }
        .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #ef4444;
          color: white;
          border-radius: 10px;
          min-width: 20px;
          height: 20px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          padding: 0 5px;
          border: 2px solid white;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s;
          margin-left: 4px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
        }
        .user-profile-menu:hover {
          background: #f3f4f6;
        }
        .user-avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          flex-shrink: 0;
        }
        .user-avatar-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .user-name-small {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .user-name-small {
            display: none;
          }
        }
        .content-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: #f8fafc;
        }
        @media (max-width: 768px) {
          .content-area {
            padding: 16px;
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen && isMobile ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand-section">
          <div className="brand-logo">P</div>
          <span className="brand-name">Plastcare</span>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`}
              alt={userName}
            />
          </div>
          <div className="user-details">
            <div className="user-name">{userName}</div>
            <div className="user-email">{userEmail}</div>
          </div>
        </div>

        <nav className="menu-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <div
                key={item.id}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={() => handleMenuClick(item.href)}
              >
                <Icon className="menu-icon" />
                <span>{item.id}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="action-button">
            <Plus size={20} />
          </button>

          <a href="#" className="customers-link">
            Customers area
          </a>

          <div className="header-right">
            <button className="icon-button">
              <Settings size={20} />
            </button>
            <button className="icon-button">
              <Share2 size={20} />
            </button>
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-badge">/adm3</span>
            </button>
            <button className="icon-button">
              <Mail size={20} />
              <span className="notification-badge">2</span>
            </button>

            <div className="user-profile-menu" onClick={handleLogout}>
              <div className="user-avatar-small">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`}
                  alt={userName}
                />
              </div>
              <span className="user-name-small">{userName}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}