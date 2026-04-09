"use client";

import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdPayment,
  MdReceipt,
  MdCreditCard,
  MdLocationOn,
} from "react-icons/md";
import {
  FaFilter,
  FaUser,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBox,
  FaShippingFast,
} from "react-icons/fa";

// Type definitions
interface Product {
  _id?: string;
  title: string;
  price?: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  images?: Array<{ url: string }>;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Payment {
  id: string;
  orderId: string;
  userId: string;
  username: string;
  email: string;
  profilePic: string | null;
  phone: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  metadata: Record<string, any>;
  orderTotal: number;
  orderItems: number;
  productNames: string;
  products: Product[];
  shipping: { address?: ShippingAddress } | null;
  dateCreated: string;
  lastUpdated: string;
  rawDate: Date;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "pay_1",
    orderId: "ord_1",
    userId: "user_1",
    username: "john_doe",
    email: "john.doe@example.com",
    profilePic: null,
    phone: "+1 (555) 123-4567",
    paymentMethod: "credit card",
    transactionId: "txn_8f9a2b3c4d5e",
    amount: 2499.99,
    currency: "USD",
    status: "completed",
    gateway: "Stripe",
    metadata: { card_last4: "4242", receipt_url: "https://receipts.example.com/123" },
    orderTotal: 2499.99,
    orderItems: 3,
    productNames: "Wireless Headphones, Smart Watch, Phone Case",
    products: [
      { title: "Wireless Headphones", salePrice: 199.99, sku: "WH-001", stock: 45 },
      { title: "Smart Watch", salePrice: 299.99, sku: "SW-002", stock: 12 },
      { title: "Phone Case", salePrice: 29.99, sku: "PC-003", stock: 200 },
    ],
    shipping: {
      address: {
        street: "123 Main Street",
        city: "Springfield",
        state: "IL",
        postalCode: "62701",
        country: "United States",
      },
    },
    dateCreated: "Feb 15, 2025, 10:30 AM",
    lastUpdated: "Feb 15, 2025, 10:35 AM",
    rawDate: new Date(2025, 1, 15, 10, 30),
  },
  {
    id: "pay_2",
    orderId: "ord_2",
    userId: "user_2",
    username: "jane_smith",
    email: "jane.smith@example.com",
    profilePic: null,
    phone: "+1 (555) 987-6543",
    paymentMethod: "upi",
    transactionId: "txn_7a1b2c3d4e5f",
    amount: 59.99,
    currency: "INR",
    status: "pending",
    gateway: "Razorpay",
    metadata: { vpa: "jane@okhdfcbank" },
    orderTotal: 59.99,
    orderItems: 1,
    productNames: "Yoga Mat",
    products: [{ title: "Yoga Mat", salePrice: 59.99, sku: "YM-004", stock: 80 }],
    shipping: {
      address: {
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "United States",
      },
    },
    dateCreated: "Feb 16, 2025, 02:15 PM",
    lastUpdated: "Feb 16, 2025, 02:15 PM",
    rawDate: new Date(2025, 1, 16, 14, 15),
  },
  {
    id: "pay_3",
    orderId: "ord_3",
    userId: "user_3",
    username: "mike_wilson",
    email: "mike.wilson@example.com",
    profilePic: null,
    phone: "Not provided",
    paymentMethod: "debit card",
    transactionId: "txn_6g5h4j3k2l1m",
    amount: 899.0,
    currency: "USD",
    status: "failed",
    gateway: "PayPal",
    metadata: { error_code: "INSUFFICIENT_FUNDS" },
    orderTotal: 899.0,
    orderItems: 2,
    productNames: "Gaming Keyboard, Wireless Mouse",
    products: [
      { title: "Gaming Keyboard", salePrice: 129.99, sku: "GK-005", stock: 30 },
      { title: "Wireless Mouse", salePrice: 49.99, sku: "WM-006", stock: 55 },
    ],
    shipping: {
      address: {
        street: "789 Tech Park",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "United States",
      },
    },
    dateCreated: "Feb 14, 2025, 09:45 AM",
    lastUpdated: "Feb 14, 2025, 09:50 AM",
    rawDate: new Date(2025, 1, 14, 9, 45),
  },
  {
    id: "pay_4",
    orderId: "ord_4",
    userId: "user_4",
    username: "sarah_connor",
    email: "sarah.connor@example.com",
    profilePic: null,
    phone: "+1 (555) 456-7890",
    paymentMethod: "wallet",
    transactionId: "txn_9z8y7x6w5v4u",
    amount: 1450.5,
    currency: "USD",
    status: "shipped",
    gateway: "Square",
    metadata: { wallet: "PayPal", promo_code: "SAVE10" },
    orderTotal: 1450.5,
    orderItems: 4,
    productNames: "Smart TV, Soundbar, Streaming Stick, HDMI Cable",
    products: [
      { title: "Smart TV", salePrice: 899.99, sku: "TV-007", stock: 10 },
      { title: "Soundbar", salePrice: 199.99, sku: "SB-008", stock: 25 },
      { title: "Streaming Stick", salePrice: 49.99, sku: "SS-009", stock: 100 },
      { title: "HDMI Cable", salePrice: 19.99, sku: "HC-010", stock: 200 },
    ],
    shipping: {
      address: {
        street: "222 Lakeview Drive",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "United States",
      },
    },
    dateCreated: "Feb 17, 2025, 11:00 AM",
    lastUpdated: "Feb 17, 2025, 01:20 PM",
    rawDate: new Date(2025, 1, 17, 11, 0),
  },
  {
    id: "pay_5",
    orderId: "ord_5",
    userId: "user_5",
    username: "alex_johnson",
    email: "alex.johnson@example.com",
    profilePic: null,
    phone: "+1 (555) 321-0987",
    paymentMethod: "credit card",
    transactionId: "txn_1a2b3c4d5e6f",
    amount: 349.99,
    currency: "USD",
    status: "refunded",
    gateway: "Stripe",
    metadata: { refund_reason: "Customer request" },
    orderTotal: 349.99,
    orderItems: 1,
    productNames: "Fitness Tracker",
    products: [{ title: "Fitness Tracker", salePrice: 349.99, sku: "FT-011", stock: 40 }],
    shipping: {
      address: {
        street: "500 Market Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
      },
    },
    dateCreated: "Feb 13, 2025, 03:30 PM",
    lastUpdated: "Feb 14, 2025, 09:00 AM",
    rawDate: new Date(2025, 1, 13, 15, 30),
  },
  {
    id: "pay_6",
    orderId: "ord_6",
    userId: "user_6",
    username: "emily_brown",
    email: "emily.brown@example.com",
    profilePic: null,
    phone: "Not provided",
    paymentMethod: "upi",
    transactionId: "txn_8h7g6f5d4s3a",
    amount: 1299.0,
    currency: "INR",
    status: "order_placed",
    gateway: "PhonePe",
    metadata: { vpa: "emily@ybl" },
    orderTotal: 1299.0,
    orderItems: 2,
    productNames: "Running Shoes, Sports Socks",
    products: [
      { title: "Running Shoes", salePrice: 89.99, sku: "RS-012", stock: 60 },
      { title: "Sports Socks", salePrice: 12.99, sku: "SS-013", stock: 150 },
    ],
    shipping: {
      address: {
        street: "777 Sports Arena",
        city: "Boston",
        state: "MA",
        postalCode: "02108",
        country: "United States",
      },
    },
    dateCreated: "Feb 18, 2025, 08:20 AM",
    lastUpdated: "Feb 18, 2025, 08:20 AM",
    rawDate: new Date(2025, 1, 18, 8, 20),
  },
];

export default function EcommercePayments() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  const handleSort = (key: keyof Payment) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "rawDate") {
      return sortConfig.direction === "asc"
        ? (a.rawDate as Date).getTime() - (b.rawDate as Date).getTime()
        : (b.rawDate as Date).getTime() - (a.rawDate as Date).getTime();
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

  const filteredPayments = sortedPayments.filter(
    (payment) =>
      payment.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productNames?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
    setStatusUpdateSuccess(false);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setShowDetailsModal(false);
    setStatusUpdateSuccess(false);
  };

  // Calculate stats
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter((payment) => payment.status === "pending").length;
  const completedPayments = payments.filter(
    (payment) => payment.status === "completed" || payment.status === "success"
  ).length;
  const failedPayments = payments.filter((payment) => payment.status === "failed").length;
  const averageOrderValue = totalPayments > 0 ? totalAmount / totalPayments : 0;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return <FaCheckCircle size={14} />;
      case "pending":
        return <FaClock size={14} />;
      case "failed":
        return <FaTimesCircle size={14} />;
      case "refunded":
        return <MdReceipt size={14} />;
      case "order_placed":
      case "confirmed":
      case "processing":
      case "shipped":
      case "delivered":
        return <FaShippingFast size={14} />;
      default:
        return <FaExclamationTriangle size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return { background: "#dcfce7", color: "#166534" };
      case "pending":
        return { background: "#fef3c7", color: "#92400e" };
      case "failed":
        return { background: "#fee2e2", color: "#dc2626" };
      case "refunded":
        return { background: "#e0e7ff", color: "#3730a3" };
      case "order_placed":
        return { background: "#dbeafe", color: "#1e40af" };
      case "confirmed":
        return { background: "#f0f9ff", color: "#0369a1" };
      case "processing":
        return { background: "#fef3c7", color: "#92400e" };
      case "shipped":
        return { background: "#fef3c7", color: "#92400e" };
      case "delivered":
        return { background: "#dcfce7", color: "#166534" };
      default:
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "upi":
        return <MdPayment size={14} />;
      case "credit card":
        return <MdCreditCard size={14} />;
      case "debit card":
        return <MdCreditCard size={14} />;
      case "wallet":
        return <FaMoneyBillWave size={14} />;
      default:
        return <FaMoneyBillWave size={14} />;
    }
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleExport = () => {
    const csvData = filteredPayments.map((p) => ({
      "Transaction ID": p.transactionId,
      Customer: p.username,
      Email: p.email,
      Amount: p.amount,
      Currency: p.currency,
      "Payment Method": p.paymentMethod,
      Status: p.status,
      Gateway: p.gateway,
      Date: p.dateCreated,
      Products: p.productNames,
      "Items Count": p.orderItems,
    }));

    const csv =
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Simulate updating payment status (since no API)
  const updatePaymentStatus = (paymentId: string, newStatus: string) => {
    setUpdatingStatus(true);
    // Simulate API delay
    setTimeout(() => {
      // In a real app, you would update the state. For demo, we just show success.
      setUpdatingStatus(false);
      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 3000);
    }, 800);
  };

  // Status options for dropdown
  const statusOptions = [
    "pending",
    "completed",
    "failed",
    "refunded",
    "order_placed",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  return (
    <div className="ecommerce-payments-container">
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        
        .ecommerce-payments-container {
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
        .stat-amount .stat-value { color: #059669; }
        .stat-pending .stat-value { color: #d97706; }
        .stat-completed .stat-value { color: #059669; }
        .stat-failed .stat-value { color: #dc2626; }
        .stat-average .stat-value { color: #3b82f6; }
        
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
        
        .method-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e0e7ff;
          color: #3730a3;
          text-transform: uppercase;
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
        
        /* Amount Display */
        .amount-display {
          font-weight: 700;
          font-size: 14px;
          color: #059669;
        }
        
        .transaction-id {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: #6b7280;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Product Info */
        .product-info {
          max-width: 200px;
        }
        
        .product-name {
          font-weight: 500;
          color: #111827;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-count {
          font-size: 12px;
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
        
        .payment-details {
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
        
        .amount-highlight {
          font-size: 32px;
          font-weight: 700;
          color: #059669;
          text-align: center;
          padding: 24px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          border: 1px solid #bbf7d0;
          margin: 24px 0;
        }
        
        /* Status Update Section */
        .status-update-section {
          margin: 24px 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          border-radius: 12px;
          border: 1px dashed #667eea;
        }
        
        .status-update-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .status-update-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .status-update-form {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .status-select {
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .status-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .status-update-btn {
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
        }
        
        .status-update-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .status-update-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .status-success-message {
          margin-top: 12px;
          padding: 10px 16px;
          background: #dcfce7;
          color: #166534;
          border-radius: 6px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        .metadata-box {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          white-space: pre-wrap;
          word-break: break-all;
          max-height: 200px;
          overflow: auto;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .ecommerce-payments-container {
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
          
          .btn-primary, .btn-secondary {
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
          
          .payment-details {
            padding: 20px;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .status-update-form {
            flex-direction: column;
            align-items: stretch;
          }
          
          .status-select {
            min-width: 100%;
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
          
          .btn-primary, .btn-secondary {
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
          
          .amount-highlight {
            font-size: 24px;
            padding: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header-top">
        <div className="title-section">
          <h1 className="title">Payment Transactions</h1>
        </div>
        <a href="#" className="analytics-link">
          Analytics Dashboard
          <MdKeyboardArrowDown size={16} />
        </a>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-box stat-total">
          <div className="stat-label">Total Payments</div>
          <div className="stat-value">{totalPayments}</div>
        </div>
        <div className="stat-box stat-amount">
          <div className="stat-label">Total Amount</div>
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="stat-box stat-average">
          <div className="stat-label">Average Order</div>
          <div className="stat-value">{formatCurrency(averageOrderValue)}</div>
        </div>
        <div className="stat-box stat-pending">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pendingPayments}</div>
        </div>
        <div className="stat-box stat-completed">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedPayments}</div>
        </div>
        <div className="stat-box stat-failed">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{failedPayments}</div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="actions-row">
        <div className="left-actions">
          <button className="btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
          <button className="btn-secondary">
            <FaFilter size={14} />
            Advanced Filters
          </button>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search payments, customers, or transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filters-btn">
            <FaFilter size={14} />
            Sort & Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Recent Transactions</h3>
          <div className="table-count">{filteredPayments.length} payments</div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="table-empty">
            <h3>No payment transactions found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "No payment transactions recorded yet"}
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
                <th onClick={() => handleSort("transactionId")}>
                  Transaction ID
                  {sortConfig.key === "transactionId" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("productNames")}>
                  Products
                  {sortConfig.key === "productNames" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("paymentMethod")}>
                  Method
                  {sortConfig.key === "paymentMethod" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th onClick={() => handleSort("amount")}>
                  Amount
                  {sortConfig.key === "amount" && (
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
                <th>Gateway</th>
                <th onClick={() => handleSort("rawDate")}>
                  Date
                  {sortConfig.key === "rawDate" && (
                    <MdKeyboardArrowDown
                      className="sort-icon"
                      style={{
                        transform: sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const statusStyle = getStatusColor(payment.status);
                return (
                  <tr key={payment.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {payment.profilePic ? (
                          <img
                            src={payment.profilePic}
                            alt={payment.username}
                            className="profile-image"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            {payment.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: "600", color: "#111827" }}>
                            {payment.username}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {payment.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="transaction-id" title={payment.transactionId}>
                        {payment.transactionId}
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <div className="product-name" title={payment.productNames}>
                          {payment.productNames}
                        </div>
                        <div className="product-count">
                          {payment.orderItems} item{payment.orderItems !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="method-badge">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <div className="amount-display">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: statusStyle.background, color: statusStyle.color }}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.gateway}</td>
                    <td>{payment.dateCreated}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn"
                          onClick={() => openPaymentDetails(payment)}
                          title="View Details"
                        >
                          <FaUser size={14} />
                        </button>
                        <button className="action-btn" title="Edit Payment">
                          <FaEdit size={14} />
                        </button>
                        <button className="action-btn" title="Refund">
                          <MdReceipt size={14} />
                        </button>
                        <button className="action-btn" title="Delete">
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

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Payment Transaction Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="payment-details">
              {/* Amount Highlight */}
              <div className="amount-highlight">
                {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </div>

              {/* Status Update Section */}
              <div className="status-update-section">
                <div className="status-update-header">
                  <FaEdit size={18} color="#667eea" />
                  <h3 className="status-update-title">Update Payment Status</h3>
                </div>
                <div className="status-update-form">
                  <select
                    className="status-select"
                    value={selectedPayment.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      updatePaymentStatus(selectedPayment.id, newStatus);
                    }}
                    disabled={updatingStatus}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <button
                    className="status-update-btn"
                    onClick={() => updatePaymentStatus(selectedPayment.id, selectedPayment.status)}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? (
                      <>
                        <div
                          className="loading-spinner"
                          style={{ width: "16px", height: "16px", borderWidth: "2px" }}
                        ></div>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
                {statusUpdateSuccess && (
                  <div className="status-success-message">
                    <FaCheckCircle />
                    Payment status updated successfully!
                  </div>
                )}
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
                    <div className="detail-value">{selectedPayment.username}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{selectedPayment.email}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{selectedPayment.phone}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">User ID</div>
                    <div className="detail-value" style={{ fontSize: "12px", fontFamily: "monospace" }}>
                      {selectedPayment.userId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="details-section">
                <h3 className="section-title">
                  <MdPayment />
                  Payment Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Transaction ID</div>
                    <div className="detail-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                      {selectedPayment.transactionId}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Payment Method</div>
                    <div className="detail-value">
                      <span className="method-badge">
                        {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Status</div>
                    <div className="detail-value">
                      <span
                        className="status-badge"
                        style={getStatusColor(selectedPayment.status)}
                      >
                        {getStatusIcon(selectedPayment.status)}
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Payment Gateway</div>
                    <div className="detail-value">{selectedPayment.gateway}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Currency</div>
                    <div className="detail-value">{selectedPayment.currency}</div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaBox />
                  Order Information
                </h3>
                <div className="detail-item">
                  <div className="detail-label">Order ID</div>
                  <div className="detail-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {selectedPayment.orderId}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Total Items</div>
                  <div className="detail-value">{selectedPayment.orderItems} items</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Order Total</div>
                  <div className="detail-value" style={{ fontWeight: "600", fontSize: "16px" }}>
                    {formatCurrency(selectedPayment.orderTotal, selectedPayment.currency)}
                  </div>
                </div>

                <h4 style={{ margin: "20px 0 12px 0", color: "#374151", fontSize: "14px" }}>
                  Products in Order:
                </h4>
                <div className="products-grid">
                  {selectedPayment.products.map((product, index) => (
                    <div key={index} className="product-card">
                      {product.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="product-image"
                        />
                      )}
                      <div className="product-details">
                        <div className="product-title">{product.title}</div>
                        <div className="product-price">
                          {formatCurrency(product.salePrice || product.price || 0, selectedPayment.currency)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                          SKU: {product.sku} | Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              {selectedPayment.shipping?.address && (
                <div className="details-section">
                  <h3 className="section-title">
                    <FaShippingFast />
                    Shipping Information
                  </h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-label">Street</div>
                      <div className="detail-value">{selectedPayment.shipping.address.street}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">City</div>
                      <div className="detail-value">{selectedPayment.shipping.address.city}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">State</div>
                      <div className="detail-value">{selectedPayment.shipping.address.state}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Postal Code</div>
                      <div className="detail-value">{selectedPayment.shipping.address.postalCode}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Country</div>
                      <div className="detail-value">{selectedPayment.shipping.address.country}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">Payment Metadata</h3>
                  <div className="metadata-box">
                    {JSON.stringify(selectedPayment.metadata, null, 2)}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaCalendar />
                  Timestamps
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Date Created</div>
                    <div className="detail-value">{selectedPayment.dateCreated}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{selectedPayment.lastUpdated}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}