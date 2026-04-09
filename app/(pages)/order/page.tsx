"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDollarSign,
  FiMapPin,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiShoppingCart,
  FiDownload,
  FiEye,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";

// ==================== TYPES ====================
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Shipping {
  label: string;
  address: Address;
}

interface ProductImage {
  url: string;
}

interface OrderProduct {
  title: string;
  brand?: string;
  category?: string;
  price: number;
  salePrice?: number;
  images?: ProductImage[];
  variants?: Array<{ name: string; value: string }>;
}

interface Order {
  _id: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  Shipping?: Shipping;
  ProductId?: OrderProduct[];
}

// API Response types
interface ApiOrderItem {
  variant: any;
  product: {
    _id: string;
    title: string;
    images: { url: string; public_id: string; _id: string }[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface ApiOrder {
  _id: string;
  user: string;
  items: ApiOrderItem[];
  shipping: {
    _id: string;
    user: string;
    isDefault: boolean;
    label: string;
    address: Address;
    createdAt: string;
    updatedAt: string;
  };
  payment: {
    _id: string;
    transactionId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  totalAmount: number;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  orders: ApiOrder[];
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  authProvider: string;
  isVerified: boolean;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileApiResponse {
  success: boolean;
  user: UserProfile;
}

// Helper to map API order to component Order type
const mapApiOrderToComponentOrder = (apiOrder: ApiOrder): Order => {
  const productIdList: OrderProduct[] = apiOrder.items.map((item) => ({
    title: item.product.title,
    price: item.price,
    salePrice: undefined,
    images: item.product.images.map((img) => ({ url: img.url })),
    brand: undefined,
    category: undefined,
    variants: item.variant
      ? Object.entries(item.variant).map(([name, value]) => ({ name, value: String(value) }))
      : undefined,
  }));

  return {
    _id: apiOrder._id,
    transactionId: apiOrder.payment.transactionId,
    amount: apiOrder.payment.amount,
    status: apiOrder.status,
    createdAt: apiOrder.createdAt,
    paymentMethod: apiOrder.payment.paymentMethod,
    Shipping: {
      label: apiOrder.shipping.label,
      address: apiOrder.shipping.address,
    },
    ProductId: productIdList,
  };
};

export default function OrderScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    completed: 0,
    averageOrder: 0,
  });

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const calculateStats = (ordersData: Order[]) => {
    const total = ordersData.length;
    const totalValue = ordersData.reduce((sum, order) => sum + order.amount, 0);
    const completed = ordersData.filter((o) => o.status.toLowerCase() === "completed").length;
    const averageOrder = total > 0 ? totalValue / total : 0;
    setStats({ total, totalValue, completed, averageOrder });
  };

  const fetchProfile = async () => {
    try {
      const authToken = localStorage.getItem("clientAuth");
      if (!authToken) {
        router.push("/signin");
        return;
      }

      const response = await axios.get<ProfileApiResponse>("/api/client/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("clientAuth");
      if (!authToken) {
        router.push("/signin");
        return;
      }

      const response = await axios.get<ApiResponse>("/api/client/orders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        const mappedOrders = response.data.orders.map(mapApiOrderToComponentOrder);
        setOrders(mappedOrders);
        calculateStats(mappedOrders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err: any) {
      console.error("Error loading orders:", err);
      if (err.response?.status === 401) {
        router.push("/signin");
      } else {
        setError(err.response?.data?.message || "Failed to load your orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, [router]);

  const handleRefresh = () => {
    fetchProfile();
    fetchOrders();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `Today, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return `Yesterday, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays <= 7) return `${date.toLocaleDateString("en-IN", { weekday: "long" })}, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const getStatusDetails = (status: string) => {
    const statusMap: Record<string, any> = {
      completed: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-100", icon: <FiCheckCircle className="text-emerald-600" />, progress: 100, description: "Your order has been delivered" },
      pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-100", icon: <FiClock className="text-amber-600" />, progress: 20, description: "Waiting for confirmation" },
      processing: { label: "Processing", color: "text-blue-600", bg: "bg-blue-100", icon: <FiRefreshCw className="text-blue-600" />, progress: 40, description: "Preparing your order" },
      shipped: { label: "Shipped", color: "text-violet-600", bg: "bg-violet-100", icon: <FiTruck className="text-violet-600" />, progress: 80, description: "On the way to you" },
      cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-100", icon: <FiXCircle className="text-red-600" />, progress: 0, description: "Order was cancelled" },
    };
    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const getPaymentMethodIcon = (method?: string) => {
    const icons: Record<string, string> = { upi: "💳", card: "💳", netbanking: "🏦", cod: "💰", wallet: "👛", razorpay: "💳" };
    return icons[method?.toLowerCase() || ""] || "💳";
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((order) => {
      if (filter !== "all" && order.status.toLowerCase() !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.transactionId?.toLowerCase().includes(query) ||
          order.Shipping?.label?.toLowerCase().includes(query) ||
          order.ProductId?.some((p) => p.title?.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query)) ||
          order.paymentMethod?.toLowerCase().includes(query)
        );
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    return result;
  }, [orders, filter, searchQuery, sortBy]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-4 h-4 bg-violet-600 rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-violet-600 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-4 h-4 bg-violet-600 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Loading Your Orders</h2>
          <p className="text-slate-500 mt-2">Fetching your purchase history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white pt-12 pb-16 rounded-b-[3rem] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">My Orders</h1>
              <p className="text-violet-200 text-xl mt-2">Track, manage and revisit every purchase</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-3xl font-semibold transition-all active:scale-95"
              >
                <FiRefreshCw className="text-xl" />
                Refresh
              </button>
              <button
                onClick={() => router.push("/all-products")}
                className="flex items-center gap-3 bg-white text-violet-700 hover:bg-amber-100 px-7 py-3 rounded-3xl font-semibold transition-all active:scale-95"
              >
                <FiShoppingCart className="text-xl" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-6 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-3xl">
            <FiUser />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {profile?.username || "User"}
              {profile?.isVerified && (
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                  Verified
                </span>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-slate-600">
              <div className="flex items-center gap-2">
                <FiMail className="text-sm" />
                <span>{profile?.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-sm" />
                <span>{profile?.phone || "No phone"}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "N/A"}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-3xl">
              <FiPackage />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-slate-500 text-sm font-medium">Total Orders</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex items-center justify-center text-3xl">
              <FiDollarSign />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</div>
              <div className="text-slate-500 text-sm font-medium">Total Spent</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center text-3xl">
              <FiCheckCircle />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{stats.completed}</div>
              <div className="text-slate-500 text-sm font-medium">Delivered</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-2xl flex items-center justify-center text-3xl">
              <AiOutlineShopping />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{formatCurrency(stats.averageOrder)}</div>
              <div className="text-slate-500 text-sm font-medium">Avg. Order Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search by Order ID, product or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-5 bg-white border border-slate-200 focus:border-violet-300 rounded-3xl text-lg placeholder:text-slate-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-5 rounded-3xl focus:ring-4 focus:ring-violet-100 outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "processing", "shipped", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 rounded-3xl font-medium transition-all flex items-center gap-2 ${
                  filter === tab
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-violet-200"
                }`}
              >
                {filter === tab && <FiFilter />}
                {tab === "all" ? "All Orders" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="bg-white rounded-3xl p-8 flex items-center gap-6 shadow-xl">
            <div className="text-6xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-red-600">Unable to load orders</h3>
              <p className="text-slate-600 mt-1">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-8 py-4 bg-violet-600 text-white rounded-3xl font-semibold hover:bg-violet-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!error && filteredAndSortedOrders.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl">
            <FiPackage className="mx-auto text-8xl text-slate-300 mb-6" />
            <h3 className="text-3xl font-semibold text-slate-900">No orders found</h3>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't placed any orders yet. Start shopping now!"
                : `No ${filter} orders found.`}
            </p>
            <button
              onClick={() => router.push("/all-products")}
              className="mt-10 px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl font-semibold inline-flex items-center gap-3 hover:shadow-2xl transition-all"
            >
              <FiShoppingCart /> Browse Products
            </button>
          </div>
        </div>
      )}

      {/* ORDERS LIST */}
      {!error && filteredAndSortedOrders.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-10">
          <div className="flex justify-between items-baseline mb-6">
            <p className="text-slate-500 font-medium">
              Showing <span className="text-violet-600 font-semibold">{filteredAndSortedOrders.length}</span> orders
            </p>
          </div>

          <div className="space-y-6">
            {filteredAndSortedOrders.map((order) => {
              const status = getStatusDetails(order.status);
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-transparent hover:border-slate-100 transition-all"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-2xl text-slate-600">#{order.transactionId}</span>
                        <span className="text-slate-400">•</span>
                        <span className="flex items-center gap-2 text-slate-500 text-sm">
                          <FiCalendar />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Status */}
                      <div className={`px-6 py-2 rounded-3xl flex items-center gap-2 text-sm font-semibold ${status.bg} ${status.color}`}>
                        {status.icon}
                        <span>{status.label}</span>
                      </div>

                      {/* Toggle */}
                      <div className="text-3xl text-slate-400">{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</div>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="px-8 py-5 bg-slate-50 border-t flex items-center justify-between text-sm">
                    <div className="flex items-center gap-8">
                      <div>
                        <span className="text-slate-500">Amount</span>
                        <div className="font-semibold text-xl text-slate-900">{formatCurrency(order.amount)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Items</span>
                        <div className="font-semibold text-xl text-slate-900">{order.ProductId?.length || 0}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Payment</span>
                        <div className="flex items-center gap-2 text-lg">
                          <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                          <span className="font-medium">{order.paymentMethod?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                      <FiTruck className="text-base" />
                      {status.description}
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div className="px-8 pb-8">
                      {/* Progress Tracker */}
                      <div className="bg-slate-50 rounded-3xl p-7 mb-8">
                        <div className="flex justify-between text-sm font-medium text-slate-500 mb-4">
                          <div>Order Journey</div>
                          <div className="text-emerald-600">{status.description}</div>
                        </div>

                        <div className="relative h-3 bg-slate-200 rounded-3xl mb-8 overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl transition-all"
                            style={{ width: `${status.progress}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-center">
                          {["Placed", "Confirmed", "Processing", "Shipped", "Delivered"].map((step, i) => {
                            const stepProgress = (i + 1) * 20;
                            const completed = status.progress >= stepProgress;
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xl mb-3 transition-all ${
                                    completed ? "bg-violet-600 text-white" : "bg-white border border-slate-200"
                                  }`}
                                >
                                  {completed ? <FiCheckCircle /> : i + 1}
                                </div>
                                <div className={`text-xs font-medium ${completed ? "text-violet-600" : "text-slate-400"}`}>
                                  {step}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Shipping */}
                        {order.Shipping && (
                          <div>
                            <div className="flex items-center gap-3 mb-4 text-violet-600">
                              <FiMapPin className="text-2xl" />
                              <h5 className="font-semibold text-lg">Shipping Address</h5>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl p-6">
                              <div className="font-semibold">{order.Shipping.label}</div>
                              <div className="mt-4 space-y-1 text-slate-600">
                                <p>{order.Shipping.address.street}</p>
                                <p>
                                  {order.Shipping.address.city}, {order.Shipping.address.state} {order.Shipping.address.postalCode}
                                </p>
                                <p>{order.Shipping.address.country}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <div>
                          <div className="flex items-center gap-3 mb-4 text-violet-600">
                            <FiShoppingBag className="text-2xl" />
                            <h5 className="font-semibold text-lg">
                              Order Items ({order.ProductId?.length || 0})
                            </h5>
                          </div>
                          <div className="space-y-4">
                            {order.ProductId?.map((product, idx) => (
                              <div key={idx} className="flex gap-4 bg-white border border-slate-100 rounded-3xl p-4">
                                <img
                                  src={product.images?.[0]?.url || "https://picsum.photos/id/20/80/80"}
                                  alt={product.title}
                                  className="w-20 h-20 object-cover rounded-2xl"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900">{product.title}</div>
                                  {product.brand && <div className="text-sm text-slate-500">{product.brand}</div>}
                                  {product.variants?.map((v, i) => (
                                    <div key={i} className="inline-block text-xs bg-slate-100 px-3 py-1 rounded-2xl mt-2">
                                      {v.name}: {v.value}
                                    </div>
                                  ))}
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-emerald-600">
                                    {formatCurrency(product.price)}
                                  </div>
                                  {product.salePrice && (
                                    <div className="text-xs text-slate-400 line-through">
                                      {formatCurrency(product.salePrice)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4 mt-10">
                        <button
                          onClick={() => alert(`Downloading invoice for ${order._id}`)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 px-8 py-5 rounded-3xl font-semibold transition-all"
                        >
                          <FiDownload /> Download Invoice
                        </button>
                        <button
                          onClick={() => alert(`Tracking order ${order._id}`)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-5 rounded-3xl font-semibold transition-all hover:shadow-2xl"
                        >
                          <FiEye /> Track Order
                        </button>
                        <button
                          onClick={() => alert(`Contacting support for ${order._id}`)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-3 border border-sky-200 text-sky-600 hover:bg-sky-50 px-8 py-5 rounded-3xl font-semibold transition-all"
                        >
                          <FiMessageSquare /> Need Help?
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}