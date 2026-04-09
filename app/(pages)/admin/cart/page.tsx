"use client";

import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdShoppingCart,
  MdDelete,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import {
  FaFilter,
  FaUser,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaBox,
  FaTag,
  FaEye,
  FaShoppingBag,
} from "react-icons/fa";

// Type definitions
interface CartItem {
  id?: string;
  title: string;
  name?: string;
  price?: number;
  salePrice?: number;
  quantity: number;
  category?: string;
  sku?: string;
  stock?: number;
}

interface Cart {
  id: string;
  cartId: string;
  userId: string;
  username: string;
  email: string;
  profilePic: string | null;
  items: CartItem[];
  itemCount: number;
  totalValue: number;
  estimatedTotal: number;
  currency: string;
  status: "active" | "abandoned" | "purchased";
  lastActivity: Date;
  createdAt: Date;
  paymentAttempted: boolean;
  paymentStatus: string;
  shippingAddress?: any;
  metadata?: any;
  dateCreated: string;
  lastUpdated: string;
  rawDate: Date;
}

// Generate mock cart data
const generateDemoCarts = (): Cart[] => {
  const demoUsers = [
    { id: "user1", username: "john_doe", email: "john@example.com" },
    { id: "user2", username: "jane_smith", email: "jane@example.com" },
    { id: "user3", username: "alex_wong", email: "alex@example.com" },
    { id: "user4", username: "sara_miller", email: "sara@example.com" },
    { id: "user5", username: "mike_brown", email: "mike@example.com" },
  ];

  const demoProducts = [
    { id: "prod1", title: "Smartphone X", price: 699, salePrice: 649, category: "Electronics" },
    { id: "prod2", title: "Laptop Pro", price: 1299, salePrice: 1199, category: "Electronics" },
    { id: "prod3", title: "Wireless Headphones", price: 199, salePrice: 149, category: "Electronics" },
    { id: "prod4", title: "Coffee Maker", price: 89, salePrice: 79, category: "Home Appliances" },
    { id: "prod5", title: "Yoga Mat", price: 39, salePrice: 29, category: "Fitness" },
    { id: "prod6", title: "Backpack", price: 59, salePrice: 49, category: "Fashion" },
    { id: "prod7", title: "Desk Lamp", price: 45, salePrice: 35, category: "Home" },
    { id: "prod8", title: "Water Bottle", price: 25, salePrice: 19, category: "Fitness" },
  ];

  const statuses: ("active" | "abandoned" | "purchased")[] = ["active", "abandoned", "purchased"];

  return Array.from({ length: 8 }, (_, index) => {
    const user = demoUsers[index % demoUsers.length];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items: CartItem[] = Array.from({ length: itemCount }, () => {
      const product = demoProducts[Math.floor(Math.random() * demoProducts.length)];
      return {
        id: product.id,
        title: product.title,
        salePrice: product.salePrice,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        category: product.category,
      };
    });

    const estimatedTotal = items.reduce(
      (sum, item) => sum + ((item.salePrice || item.price || 0) * item.quantity),
      0
    );

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    const lastActivity = new Date(createdDate);
    lastActivity.setHours(lastActivity.getHours() + Math.floor(Math.random() * 48));

    const cartId = `CART_${1000 + index}`;

    return {
      id: `cart_${Date.now()}_${index}`,
      cartId,
      userId: user.id,
      username: user.username,
      email: user.email,
      profilePic: null,
      items,
      itemCount,
      totalValue: estimatedTotal * 0.95,
      estimatedTotal,
      currency: "INR",
      status,
      lastActivity,
      createdAt: createdDate,
      paymentAttempted: status !== "active",
      paymentStatus:
        status === "purchased" ? "completed" : status === "active" ? "pending" : "failed",
      dateCreated: createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      lastUpdated: lastActivity.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      rawDate: createdDate,
    };
  });
};

export default function EcommerceCarts() {
  const [carts, setCarts] = useState<Cart[]>(generateDemoCarts());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Cart | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "abandoned" | "purchased">("all");

  const handleSort = (key: keyof Cart) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCarts = [...carts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "rawDate" || sortConfig.key === "lastActivity" || sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(aValue as Date).getTime() - new Date(bValue as Date).getTime()
        : new Date(bValue as Date).getTime() - new Date(aValue as Date).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const filteredCarts = sortedCarts.filter((cart) => {
    const matchesSearch =
      cart.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.cartId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || cart.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const openCartDetails = (cart: Cart) => {
    setSelectedCart(cart);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedCart(null);
    setShowDetailsModal(false);
  };

  // Calculate stats
  const totalCarts = carts.length;
  const activeCarts = carts.filter((cart) => cart.status === "active").length;
  const abandonedCarts = carts.filter((cart) => cart.status === "abandoned").length;
  const purchasedCarts = carts.filter((cart) => cart.status === "purchased").length;
  const totalCartValue = carts.reduce((sum, cart) => sum + cart.estimatedTotal, 0);
  const averageCartValue = totalCarts > 0 ? totalCartValue / totalCarts : 0;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <MdShoppingCart size={14} />;
      case "purchased":
        return <MdCheckCircle size={14} />;
      case "abandoned":
        return <MdCancel size={14} />;
      default:
        return <MdShoppingCart size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { background: "#dbeafe", color: "#1e40af" };
      case "purchased":
        return { background: "#dcfce7", color: "#166534" };
      case "abandoned":
        return { background: "#fee2e2", color: "#dc2626" };
      default:
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  const formatCurrency = (amount: number, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const refreshData = () => {
    setCarts(generateDemoCarts());
  };

  const handleExport = () => {
    const csvData = filteredCarts.map((c) => ({
      "Cart ID": c.cartId,
      Customer: c.username,
      Email: c.email,
      "Items Count": c.itemCount,
      "Total Value": c.estimatedTotal,
      Currency: c.currency,
      Status: c.status,
      "Created Date": c.dateCreated,
      "Payment Attempted": c.paymentAttempted ? "Yes" : "No",
      "Payment Status": c.paymentStatus,
    }));

    const csv =
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteCart = (cartId: string) => {
    if (window.confirm("Are you sure you want to delete this cart?")) {
      setCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== cartId));
      if (selectedCart?.id === cartId) closeModal();
    }
  };

  const handleClearAbandoned = () => {
    if (window.confirm("Are you sure you want to clear all abandoned carts?")) {
      setCarts((prevCarts) => prevCarts.filter((cart) => cart.status !== "abandoned"));
    }
  };

  const convertCartToOrder = (cart: Cart) => {
    alert(`Converting cart ${cart.cartId} to order...`);
    // In a real app, you would make an API call here
  };

  const sendCartReminder = (cart: Cart) => {
    alert(`Sending reminder email for cart ${cart.cartId}...`);
    // In a real app, you would make an API call here
  };

  return (
    <div className="ecommerce-carts-container">
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        
        .ecommerce-carts-container {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        /* Header */
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-direction: column;
          gap: 16px;
        }
        
        @media (min-width: 768px) {
          .header-top {
            flex-direction: row;
            align-items: center;
            margin-bottom: 20px;
          }
        }
        
        .title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        
        .refresh-btn {
          background: white;
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s;
        }
        
        .refresh-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .analytics-link {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .analytics-link:hover {
          text-decoration: underline;
        }
        
        /* Stats Row */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-box {
          padding: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin: 8px 0 4px 0;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        
        .stat-total .stat-value { color: #111827; }
        .stat-value .stat-value { color: #3b82f6; }
        .stat-active .stat-value { color: #1e40af; }
        .stat-abandoned .stat-value { color: #dc2626; }
        .stat-purchased .stat-value { color: #059669; }
        
        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .filter-tab {
          padding: 8px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-tab:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        
        .filter-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        /* Actions Row */
        .actions-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        @media (min-width: 768px) {
          .actions-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        
        .left-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
          background: white;
          color: #374151;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        
        .btn-danger {
          background: #dc2626;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #dc2626;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .btn-danger:hover {
          background: #b91c1c;
          border-color: #b91c1c;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .filters-btn {
          background: white;
          border: 1px solid #d1d5db;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          white-space: nowrap;
          transition: all 0.2s;
          font-weight: 500;
        }
        .filters-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        
        /* Table Container */
        .table-container {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .table-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .table-count {
          font-size: 14px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
        
        .table-empty {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
          text-align: center;
          flex: 1;
        }
        
        .table-empty h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
        }
        
        .table-empty p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1200px;
        }
        
        th {
          background: #f9fafb;
          color: #374151;
          text-align: left;
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
          position: sticky;
          top: 0;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
        }
        
        th:hover {
          background: #f3f4f6;
        }
        
        .sort-icon {
          margin-left: 4px;
          font-size: 16px;
          color: #9ca3af;
          display: inline-flex;
          align-items: center;
        }
        
        td {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
          vertical-align: middle;
        }
        
        tr:hover {
          background: #f9fafb;
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        /* Status Badges */
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-transform: capitalize;
        }
        
        .cart-id {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: #6b7280;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }
        
        /* Profile Image */
        .profile-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }
        
        .profile-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #e5e7eb;
        }
        
        /* Action Buttons */
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: #f3f4f6;
          color: #374151;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .action-btn.primary:hover {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .action-btn.success:hover {
          background: #dcfce7;
          color: #166534;
        }
        
        .action-btn.warning:hover {
          background: #fef3c7;
          color: #92400e;
        }
        
        .action-btn.danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }
        
        /* Amount Display */
        .amount-display {
          font-weight: 700;
          font-size: 14px;
          color: #059669;
        }
        
        /* Items Display */
        .items-display {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .items-count {
          width: 28px;
          height: 28px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        
        .items-text {
          font-size: 13px;
          color: #6b7280;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          position: relative;
          width: 800px;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .modal-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .close-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .cart-details {
          padding: 24px;
        }
        
        .details-section {
          margin-bottom: 32px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .detail-item {
          margin-bottom: 16px;
        }
        
        .detail-label {
          font-weight: 500;
          color: #374151;
          font-size: 13px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          color: #111827;
          font-size: 15px;
          font-weight: 500;
        }
        
        .cart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          border: 1px solid #bbf7d0;
          margin: 24px 0;
        }
        
        .cart-summary-item {
          text-align: center;
        }
        
        .cart-summary-value {
          font-size: 28px;
          font-weight: 700;
          color: #059669;
        }
        
        .cart-summary-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Products Grid */
        .products-grid {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }
        
        .product-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }
        
        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .product-details {
          flex: 1;
        }
        
        .product-title {
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .product-price {
          color: #059669;
          font-weight: 600;
          font-size: 14px;
        }
        
        .product-quantity {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .ecommerce-carts-container {
            padding: 16px;
          }
          
          .title {
            font-size: 24px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .stat-box {
            padding: 12px;
          }
          
          .stat-value {
            font-size: 20px;
          }
          
          .btn-primary, .btn-secondary, .btn-danger {
            padding: 8px 16px;
            font-size: 13px;
          }
          
          .search-input {
            min-width: 120px;
          }
          
          .modal-content {
            max-width: 95vw;
            max-height: 95vh;
            width: 95vw;
            margin: 20px 10px;
          }
          
          .modal-header {
            padding: 20px;
          }
          
          .cart-details {
            padding: 20px;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .cart-summary {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .left-actions {
            justify-content: center;
            width: 100%;
          }
          
          .btn-primary, .btn-secondary, .btn-danger {
            flex: 1;
            justify-content: center;
          }
          
          .search-container {
            width: 100%;
          }
          
          .search-input {
            flex: 1;
            min-width: auto;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header-top">
        <div className="title-section">
          <h1 className="title">Shopping Carts</h1>
          <button className="refresh-btn" onClick={refreshData} title="Refresh Data">
            <MdRefresh size={16} />
            Refresh
          </button>
        </div>
        <a href="#" className="analytics-link">
          Cart Analytics
          <MdKeyboardArrowDown size={16} />
        </a>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-box stat-total">
          <div className="stat-label">Total Carts</div>
          <div className="stat-value">{totalCarts}</div>
        </div>
        <div className="stat-box stat-value">
          <div className="stat-label">Total Value</div>
          <div className="stat-value">{formatCurrency(totalCartValue)}</div>
        </div>
        <div className="stat-box stat-active">
          <div className="stat-label">Active Carts</div>
          <div className="stat-value">{activeCarts}</div>
        </div>
        <div className="stat-box stat-purchased">
          <div className="stat-label">Purchased</div>
          <div className="stat-value">{purchasedCarts}</div>
        </div>
        <div className="stat-box stat-abandoned">
          <div className="stat-label">Abandoned</div>
          <div className="stat-value">{abandonedCarts}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All Carts ({totalCarts})
        </button>
        <button
          className={`filter-tab ${filterStatus === "active" ? "active" : ""}`}
          onClick={() => setFilterStatus("active")}
        >
          Active ({activeCarts})
        </button>
        <button
          className={`filter-tab ${filterStatus === "purchased" ? "active" : ""}`}
          onClick={() => setFilterStatus("purchased")}
        >
          Purchased ({purchasedCarts})
        </button>
        <button
          className={`filter-tab ${filterStatus === "abandoned" ? "active" : ""}`}
          onClick={() => setFilterStatus("abandoned")}
        >
          Abandoned ({abandonedCarts})
        </button>
      </div>

      {/* Actions Row */}
      <div className="actions-row">
        <div className="left-actions">
          <button className="btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
          <button className="btn-danger" onClick={handleClearAbandoned}>
            <MdDelete size={14} />
            Clear Abandoned
          </button>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search carts, customers, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filters-btn">
            <FaFilter size={14} />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Shopping Cart Management</h3>
          <div className="table-count">{filteredCarts.length} carts</div>
        </div>

        {filteredCarts.length === 0 ? (
          <div className="table-empty">
            <h3>No shopping carts found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "No shopping carts recorded yet"}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("username")}>
                  Customer
                  {sortConfig.key === "username" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("cartId")}>
                  Cart ID
                  {sortConfig.key === "cartId" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("itemCount")}>
                  Items
                  {sortConfig.key === "itemCount" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("estimatedTotal")}>
                  Total Value
                  {sortConfig.key === "estimatedTotal" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("status")}>
                  Status
                  {sortConfig.key === "status" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("rawDate")}>
                  Created
                  {sortConfig.key === "rawDate" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.map((cart) => {
                const statusStyle = getStatusColor(cart.status);
                return (
                  <tr key={cart.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {cart.profilePic ? (
                          <img
                            src={cart.profilePic}
                            alt={cart.username}
                            className="profile-image"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            {cart.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: "600", color: "#111827" }}>
                            {cart.username}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {cart.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cart-id" title={cart.cartId}>
                        {cart.cartId}
                      </div>
                    </td>
                    <td>
                      <div className="items-display">
                        <div className="items-count">{cart.itemCount}</div>
                        <div className="items-text">items</div>
                      </div>
                    </td>
                    <td>
                      <div className="amount-display">
                        {formatCurrency(cart.estimatedTotal, cart.currency)}
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: statusStyle.background, color: statusStyle.color }}
                      >
                        {getStatusIcon(cart.status)}
                        {cart.status}
                      </span>
                    </td>
                    <td>{cart.dateCreated}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "12px",
                          color: cart.paymentAttempted
                            ? cart.paymentStatus === "completed"
                              ? "#059669"
                              : "#d97706"
                            : "#6b7280",
                        }}
                      >
                        {cart.paymentAttempted ? cart.paymentStatus : "No attempt"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn primary"
                          onClick={() => openCartDetails(cart)}
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        {cart.status === "active" && (
                          <>
                            <button
                              className="action-btn success"
                              onClick={() => convertCartToOrder(cart)}
                              title="Convert to Order"
                            >
                              <FaShoppingBag size={14} />
                            </button>
                            <button
                              className="action-btn warning"
                              onClick={() => sendCartReminder(cart)}
                              title="Send Reminder"
                            >
                              <FaTag size={14} />
                            </button>
                          </>
                        )}
                        <button
                          className="action-btn danger"
                          onClick={() => handleDeleteCart(cart.id)}
                          title="Delete Cart"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Cart Details Modal */}
      {showDetailsModal && selectedCart && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Shopping Cart Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="cart-details">
              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="cart-summary-item">
                  <div className="cart-summary-value">
                    {formatCurrency(selectedCart.estimatedTotal, selectedCart.currency)}
                  </div>
                  <div className="cart-summary-label">Total Value</div>
                </div>
                <div className="cart-summary-item">
                  <div className="cart-summary-value">{selectedCart.itemCount}</div>
                  <div className="cart-summary-label">Items</div>
                </div>
                <div className="cart-summary-item">
                  <div
                    className="cart-summary-value"
                    style={{ color: getStatusColor(selectedCart.status).color }}
                  >
                    {selectedCart.status}
                  </div>
                  <div className="cart-summary-label">Status</div>
                </div>
              </div>

              {/* Customer Section */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaUser />
                  Customer Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Username</div>
                    <div className="detail-value">{selectedCart.username}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{selectedCart.email}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Cart ID</div>
                    <div className="detail-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                      {selectedCart.cartId}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">User ID</div>
                    <div className="detail-value" style={{ fontSize: "12px", fontFamily: "monospace" }}>
                      {selectedCart.userId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Status */}
              <div className="details-section">
                <h3 className="section-title">
                  <MdShoppingCart />
                  Cart Status
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Status</div>
                    <div className="detail-value">
                      <span className="status-badge" style={getStatusColor(selectedCart.status)}>
                        {getStatusIcon(selectedCart.status)}
                        {selectedCart.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Payment Attempted</div>
                    <div className="detail-value">{selectedCart.paymentAttempted ? "Yes" : "No"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Payment Status</div>
                    <div
                      className="detail-value"
                      style={{
                        color:
                          selectedCart.paymentStatus === "completed"
                            ? "#059669"
                            : selectedCart.paymentStatus === "pending"
                            ? "#d97706"
                            : "#dc2626",
                      }}
                    >
                      {selectedCart.paymentStatus || "N/A"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Currency</div>
                    <div className="detail-value">{selectedCart.currency}</div>
                  </div>
                </div>
              </div>

              {/* Items in Cart */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaBox />
                  Cart Items ({selectedCart.itemCount})
                </h3>

                <div className="products-grid">
                  {selectedCart.items.map((item, index) => (
                    <div key={index} className="product-card">
                      <div className="product-details">
                        <div className="product-title">{item.title || item.name || `Item ${index + 1}`}</div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className="product-price">
                            {formatCurrency(item.salePrice || item.price || 0, selectedCart.currency)}
                            {item.quantity > 1 && (
                              <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>
                                × {item.quantity} ={" "}
                                {formatCurrency(
                                  (item.salePrice || item.price || 0) * (item.quantity || 1),
                                  selectedCart.currency
                                )}
                              </span>
                            )}
                          </div>
                          {item.quantity && (
                            <div className="product-quantity">Qty: {item.quantity}</div>
                          )}
                        </div>
                        {item.category && (
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            Category: {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaCalendar />
                  Timestamps
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Date Created</div>
                    <div className="detail-value">{selectedCart.dateCreated}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Activity</div>
                    <div className="detail-value">{selectedCart.lastUpdated}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="details-section">
                <h3 className="section-title">Cart Actions</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {selectedCart.status === "active" && (
                    <>
                      <button className="btn-primary" onClick={() => convertCartToOrder(selectedCart)}>
                        Convert to Order
                      </button>
                      <button className="btn-secondary" onClick={() => sendCartReminder(selectedCart)}>
                        Send Reminder Email
                      </button>
                    </>
                  )}
                  <button className="btn-danger" onClick={() => handleDeleteCart(selectedCart.id)}>
                    Delete Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}