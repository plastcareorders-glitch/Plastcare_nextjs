"use client";

import React from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Bell,
  Settings,
  Calendar,
  Target,
  Zap,
  Menu,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  Plus,
  Edit2,
  X,
} from "lucide-react";

export default function AdminHomePage() {
  // Static data for the dashboard
  const stats = [
    { icon: ShoppingCart, title: "Pending Orders", value: "23/45", progress: 51, color: "yellow", gradient: "bg-gradient-yellow" },
    { icon: TrendingUp, title: "New Customers", value: "12/30", progress: 40, color: "green", gradient: "bg-gradient-green" },
    { icon: Package, title: "Products in Stock", value: "1,247/1,500", progress: 83, color: "blue", gradient: "bg-gradient-blue" },
    { icon: DollarSign, title: "Cart Abandonments", value: "67/89", progress: 75, color: "red", gradient: "bg-gradient-red" },
  ];

  const overviewCards = [
    {
      icon: ShoppingCart,
      title: "Order Status Overview",
      items: [
        { label: "Processing", value: "25 (28.33%)", bar: 28 },
        { label: "Shipped", value: "33.33%", bar: 33 },
        { label: "Delivered", value: "25.00%", bar: 25 },
        { label: "Cancelled", value: "11.67%", bar: 12 },
        { label: "Refunded", value: "2.00%", bar: 2 },
      ],
    },
    {
      icon: Package,
      title: "Product Category Overview",
      items: [
        { label: "Electronics", value: "45 (32.14%)", bar: 32 },
        { label: "Clothing", value: "28.57%", bar: 29 },
        { label: "Home & Garden", value: "22.14%", bar: 22 },
        { label: "Books", value: "10.00%", bar: 10 },
        { label: "Sports", value: "7.14%", bar: 7 },
      ],
    },
    {
      icon: BarChart3,
      title: "Sales Channel Overview",
      items: [
        { label: "Website", value: "65.00%", bar: 65 },
        { label: "Mobile App", value: "20.00%", bar: 20 },
        { label: "Social Media", value: "10.00%", bar: 10 },
        { label: "Marketplace", value: "5.00%", bar: 5 },
      ],
    },
  ];

  const revenueSummary = [
    { icon: DollarSign, title: "Total Revenue", amount: "$128,450.00", color: "green" },
    { icon: Clock, title: "Pending Payouts", amount: "$12,340.00", color: "yellow" },
    { icon: AlertCircle, title: "Refunds Issued", amount: "$1,890.00", color: "red" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Alice Johnson", amount: "$89.99", date: "Nov 28, 2025", status: "processing" },
    { id: "ORD-002", customer: "Bob Smith", amount: "$245.50", date: "Nov 27, 2025", status: "shipped" },
    { id: "ORD-003", customer: "Carol Davis", amount: "$112.00", date: "Nov 26, 2025", status: "delivered" },
  ];

  const pendingTasks = [
    { title: "Update product listings for holiday sale", time: "Nov 28, 2025 14:00" },
    { title: "Process pending refunds for batch #RF-045", time: "Nov 27, 2025 09:30" },
    { title: "Review ad campaign performance", time: "Nov 26, 2025 17:45" },
  ];

  const completedTasks = [
    { title: "Ship out express orders for Black Friday", time: "Nov 25, 2025 18:00" },
    { title: "Optimize checkout flow for mobile users", time: "Nov 24, 2025 12:20" },
  ];

  return (
    <div className="admin-home">
      <style>{`
        /* Custom gradient backgrounds */
        .bg-gradient-yellow { background: linear-gradient(135deg, #eab308, #ca8a04); }
        .bg-gradient-green { background: linear-gradient(135deg, #10b981, #059669); }
        .bg-gradient-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .bg-gradient-red { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .bg-gradient-purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }
        .bg-gradient-indigo { background: linear-gradient(135deg, #6366f1, #4f46e5); }
        
        /* Tailwind-like utilities (if Tailwind not fully configured) */
        .min-h-screen { min-height: 100vh; }
        .bg-gray-50 { background-color: #f8fafc; }
        .bg-white { background-color: #ffffff; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
        .border { border-width: 1px; }
        .border-gray-100 { border-color: #f3f4f6; }
        .border-gray-200 { border-color: #e5e7eb; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mr-2 { margin-right: 0.5rem; }
        .ml-auto { margin-left: auto; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .w-full { width: 100%; }
        .w-5 { width: 1.25rem; }
        .h-5 { height: 1.25rem; }
        .w-6 { width: 1.5rem; }
        .h-6 { height: 1.5rem; }
        .w-8 { width: 2rem; }
        .h-8 { height: 2rem; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-700 { color: #374151; }
        .text-gray-900 { color: #111827; }
        .text-green-600 { color: #059669; }
        .text-red-600 { color: #dc2626; }
        .text-yellow-600 { color: #ca8a04; }
        .text-blue-600 { color: #2563eb; }
        .text-white { color: #ffffff; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
        .line-through { text-decoration: line-through; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        @media (min-width: 640px) { .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .sm\\:flex-row { flex-direction: row; } .sm\\:p-6 { padding: 1.5rem; } }
        @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } .md\\:flex-row { flex-direction: row; } }
        @media (min-width: 1024px) { .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } .lg\\:col-span-2 { grid-column: span 2 / span 2; } .lg\\:flex-row { flex-direction: row; } }
      `}</style>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">E-Commerce Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none max-w-xs sm:max-w-none">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-start">
                <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all sm:flex hidden">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all sm:flex hidden">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all lg:hidden">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">AD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Today's Date</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-gray-100">
              <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Monthly Sales Target</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">82% Complete</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Conversion Rate</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">3.2%</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">YoY Growth</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">+18.7%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-xl hover:scale-105 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 bg-${stat.color}-50 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <div className="text-right min-w-0 ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`${stat.gradient} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${stat.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {overviewCards.map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{card.title}</h3>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {card.items.map((item, i) => {
                      let barColor = "bg-blue-500";
                      if (card.title === "Product Category Overview") {
                        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-indigo-500", "bg-yellow-500"];
                        barColor = colors[i % colors.length];
                      } else if (card.title === "Sales Channel Overview") {
                        const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-indigo-500"];
                        barColor = colors[i % colors.length];
                      } else {
                        const colors = ["bg-blue-500", "bg-green-500", "bg-green-700", "bg-red-500", "bg-red-700"];
                        barColor = colors[i % colors.length];
                      }
                      return (
                        <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-700 truncate mr-2">{item.label}</span>
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[120px] sm:max-w-[140px]">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[40px]">
                              <div className={`${barColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${item.bar}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-[45px] text-right truncate">{item.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Summary */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Summary</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg self-end sm:self-auto">
                  <span>2025</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {revenueSummary.map((item, idx) => (
                  <div key={idx} className={`bg-white rounded-xl shadow-sm border border-${item.color}-200 p-4 sm:p-6 text-center transition-all hover:shadow-md hover:scale-105`}>
                    <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${item.color}-600 mx-auto mb-2 sm:mb-3`} />
                    <div className={`text-xs sm:text-sm text-${item.color}-600 font-medium mb-2`}>{item.title}</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-100 bg-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Orders</h3>
                </div>
                <button className="text-gray-600 hover:text-gray-700 text-xs sm:text-sm font-medium flex items-center gap-1">
                  View All <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {recentOrders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Order #{order.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">Customer: {order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{order.amount}</p>
                        <span className={`text-xs ${order.status === "delivered" ? "text-green-600" : order.status === "shipped" ? "text-blue-600" : "text-yellow-600"}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Products */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Quick Products</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700">Total Products</span>
                  <span className="font-semibold text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700">Low Stock Alerts</span>
                  <span className="font-semibold text-red-600">5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full transition-all duration-1000" style={{ width: "85%" }}></div>
                </div>
                <button className="w-full bg-gray-50 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* My Tasks */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">My Tasks</h3>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <button className="text-gray-600 hover:text-gray-700 font-medium hidden sm:block">View All</button>
                  <button className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1 text-xs sm:text-sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> New
                  </button>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-yellow-600">Pending Tasks (3)</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {pendingTasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3 group transition-all hover:bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-move text-xs">::</div>
                        <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 focus:ring-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.time}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button className="p-1 hover:bg-gray-100 rounded transition-all">
                          <Edit2 className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-all">
                          <X className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-medium text-green-600">Completed (2)</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {completedTasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3 group transition-all hover:bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-move text-xs">::</div>
                        <input type="checkbox" checked readOnly className="w-3 h-3 sm:w-4 sm:h-4 rounded border-green-300 bg-green-100 focus:ring-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-900 line-through leading-tight">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.time}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button className="p-1 hover:bg-gray-100 rounded transition-all">
                          <Edit2 className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-all">
                          <X className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}