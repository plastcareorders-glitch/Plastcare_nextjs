"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { load as loadCashfreeSDK } from "@cashfreepayments/cashfree-js";
import axios from "axios";

// Helper to get the actual image URL from the product's images array
const getProductImageUrl = (product: any): string | null => {
  if (!product?.images || product.images.length === 0) return null;
  const firstImage = product.images[0];
  if (typeof firstImage === "string") return firstImage;
  if (firstImage.url && typeof firstImage.url === "string") return firstImage.url;
  return null;
};

// Types for shipping address
interface ShippingAddress {
  _id: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, error, removeFromCart, updateQuantity, clearCart, fetchCart } = useCart();

  // Cart state
  const [selectedItemKeys, setSelectedItemKeys] = useState<string[]>([]);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping state
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    label: "Home",
    isDefault: false,
  });
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "cashfree">("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState<any>(null);

  // Initialize Cashfree SDK once on mount
  useEffect(() => {
    const initCashfree = async () => {
      try {
        const cashfree = await loadCashfreeSDK({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox"
        });
        setCashfreeInstance(cashfree);
        console.log("✅ Cashfree SDK initialized via npm package");
      } catch (err) {
        console.error("Failed to initialize Cashfree SDK:", err);
      }
    };
    initCashfree();
  }, []);

  const getItemKey = useCallback((item: any): string => {
    const variantStr = item.variant ? JSON.stringify(item.variant) : "";
    return `${item.product._id}|${variantStr}`;
  }, []);

  // Sync selected items when cart changes
  useEffect(() => {
    if (cart?.items) {
      setSelectedItemKeys(cart.items.map((item) => getItemKey(item)));
    }
  }, [cart, getItemKey]);

  // Fetch shipping addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        setAddressError(null);
        const res = await fetch("/api/client/shipping");
        if (!res.ok) {
          if (res.status === 401) {
            setAddressError("Please log in to manage addresses.");
            return;
          }
          throw new Error("Failed to fetch addresses");
        }
        const data = await res.json();
        setAddresses(data.addresses || []);
        // Auto-select default address
        const defaultAddr = data.addresses?.find((a: ShippingAddress) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (data.addresses?.length > 0) {
          setSelectedAddressId(data.addresses[0]._id);
        }
      } catch (err: any) {
        console.error("Fetch addresses error:", err);
        setAddressError(err.message || "Could not load addresses.");
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const sanitizeSessionId = (sessionId: string): string => sessionId;

  const { subtotal, shipping, tax, total, selectedCount, selectedTotal } = useMemo(() => {
    let calculatedSubtotal = 0;
    let calculatedSelectedCount = 0;
    if (cart?.items) {
      cart.items.forEach((item) => {
        const itemKey = getItemKey(item);
        if (selectedItemKeys.includes(itemKey)) {
          calculatedSubtotal += item.price * item.quantity;
          calculatedSelectedCount += item.quantity;
        }
      });
    }
    const calculatedShipping = calculatedSubtotal > 999 ? 0 : 49;
    const calculatedTax = Math.round(calculatedSubtotal * 0.18);
    const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax;
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
      selectedCount: calculatedSelectedCount,
      selectedTotal: calculatedSubtotal,
    };
  }, [cart, selectedItemKeys, getItemKey]);

  const totalQuantity = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [cart]
  );

  const handleQuantityChange = async (item: any, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    setIsProcessing(true);
    try {
      const success = await updateQuantity(item.product._id, newQuantity, item.variant);
      if (success) await fetchCart();
      else alert("Failed to update quantity. Please try again.");
    } catch (err) {
      console.error("Quantity update error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (item: any) => {
    setIsProcessing(true);
    try {
      const success = await removeFromCart(item.product._id, item.variant);
      if (success) {
        await fetchCart();
        setShowRemoveConfirm(null);
      } else {
        alert("Failed to remove item. Please try again.");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItemKeys.length === 0) return;
    setIsProcessing(true);
    try {
      const itemsToRemove = cart?.items.filter((item) =>
        selectedItemKeys.includes(getItemKey(item))
      );
      if (itemsToRemove) {
        for (const item of itemsToRemove) {
          await removeFromCart(item.product._id, item.variant);
        }
        await fetchCart();
        setSelectedItemKeys([]);
      }
    } catch (err) {
      console.error("Remove selected error:", err);
      alert("Failed to remove selected items. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) return;
    setIsProcessing(true);
    try {
      const success = await clearCart();
      if (success) await fetchCart();
      else alert("Failed to clear cart. Please try again.");
    } catch (err) {
      console.error("Clear cart error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAll = () => {
    if (!cart?.items) return;
    if (selectedItemKeys.length === cart.items.length) {
      setSelectedItemKeys([]);
    } else {
      setSelectedItemKeys(cart.items.map((item) => getItemKey(item)));
    }
  };

  const handleSelectItem = (itemKey: string) => {
    setSelectedItemKeys((prev) =>
      prev.includes(itemKey) ? prev.filter((key) => key !== itemKey) : [...prev, itemKey]
    );
  };

  // Address management
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddressForm({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      label: "Home",
      isDefault: addresses.length === 0,
    });
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr: ShippingAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      street: addr.address.street,
      city: addr.address.city,
      state: addr.address.state,
      postalCode: addr.address.postalCode,
      country: addr.address.country,
      label: addr.label,
      isDefault: addr.isDefault,
    });
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      const url = editingAddress
        ? `/api/client/shipping/${editingAddress._id}`
        : "/api/client/shipping";
      const method = editingAddress ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save address");
      }
      const fetchRes = await fetch("/api/client/shipping");
      const data = await fetchRes.json();
      setAddresses(data.addresses || []);
      const updatedAddr = editingAddress
        ? data.addresses.find((a: ShippingAddress) => a._id === editingAddress._id)
        : data.addresses.find(
            (a: ShippingAddress) =>
              a.address.street === addressForm.street &&
              a.address.city === addressForm.city &&
              a.address.postalCode === addressForm.postalCode
          );
      if (updatedAddr) {
        setSelectedAddressId(updatedAddr._id);
      } else {
        const defaultAddr = data.addresses.find((a: ShippingAddress) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      }
      setShowAddressModal(false);
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/client/shipping/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      const fetchRes = await fetch("/api/client/shipping");
      const data = await fetchRes.json();
      setAddresses(data.addresses || []);
      if (selectedAddressId === id) {
        const defaultAddr = data.addresses.find((a: ShippingAddress) => a.isDefault);
        setSelectedAddressId(defaultAddr?._id || data.addresses[0]?._id || "");
      }
    } catch (err: any) {
      alert(err.message || "Could not delete address");
    }
  };

  // Cashfree payment handler using npm instance
  const handleCashfreePayment = async (orderId: string, paymentId: string, amount: number) => {
    if (!cashfreeInstance) {
      alert("Payment system is still loading. Please try again in a moment.");
      setPlacingOrder(false);
      return;
    }

    try {
      const res = await fetch("/api/client/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create Cashfree order");
      }

      if (data.paymentSessionId) {
        let sessionId = sanitizeSessionId(data.paymentSessionId);
        console.log("Sanitized paymentSessionId:", sessionId);

        const result = await cashfreeInstance.checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        });
        
        console.log("Cashfree checkout result:", result);
        await axios.delete("/api/client/cart?clear=true");
        
        if (result && result.order) {
          // ✅ MANUALLY CLEAR CART AFTER SUCCESSFUL PAYMENT
          await clearCart();
          setSelectedItemKeys([]);
          router.push('/order');
        }
      } else {
        throw new Error("No payment session ID received");
      }
    } catch (err: any) {
      console.error("Cashfree payment error:", err);
      alert(err.message || "Failed to initialize payment gateway. Please try again.");
      setPlacingOrder(false);
    }
  };

  // Order placement
  const handlePlaceOrder = async () => {
    if (selectedItemKeys.length === 0) {
      alert("Please select at least one item to checkout");
      return;
    }
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    setPlacingOrder(true);
    try {
      const selectedItemsData = cart!.items
        .filter((item) => selectedItemKeys.includes(getItemKey(item)))
        .map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          variant: item.variant || null,
        }));

      const payload = {
        shippingAddressId: selectedAddressId,
        paymentMethod,
        selectedItems: selectedItemsData,
        notes: "",
      };

      const res = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      if (paymentMethod === "cod") {
        // ✅ MANUALLY CLEAR CART AFTER SUCCESSFUL COD ORDER
        await clearCart();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        setSelectedItemKeys([]);
        setPlacingOrder(false);
        router.push(`/orders/${data.orderId}`);
      } else if (paymentMethod === "cashfree") {
        await handleCashfreePayment(data.orderId, data.paymentId, total);
      }
    } catch (err: any) {
      console.error("Order placement error:", err);
      alert(err.message || "An error occurred while placing the order.");
      setPlacingOrder(false);
    }
  };

  const handleContinueShopping = () => router.push("/all-products");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-3xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
          <p className="text-slate-600 mb-10">Looks like you haven&apos;t added any items yet.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-4 rounded-3xl text-lg transition-all active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
            <p className="text-xl font-medium text-slate-900 mb-8">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-3xl font-semibold text-slate-700 transition-all"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const itemToRemove = cart.items.find(
                    (item) => getItemKey(item) === showRemoveConfirm
                  );
                  if (itemToRemove) handleRemoveItem(itemToRemove);
                }}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-3xl font-semibold text-white transition-all"
                disabled={isProcessing}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <select
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
                <label htmlFor="isDefault" className="text-sm text-slate-700">
                  Set as default address
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold text-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddress}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all disabled:opacity-50"
                >
                  {submittingAddress ? "Saving..." : editingAddress ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Cart Page */}
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10">
            {/* Cart Items Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between pb-6 border-b">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
                  <p className="text-slate-500 mt-1">{totalQuantity} items</p>
                </div>
                {cart.items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-3xl hover:bg-red-50 transition-colors"
                    disabled={isProcessing || placingOrder}
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between py-6 border-b">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItemKeys.length === cart.items.length && cart.items.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 accent-emerald-500"
                    disabled={isProcessing || placingOrder}
                  />
                  <span className="font-semibold text-slate-700">Select all items</span>
                </label>

                {selectedItemKeys.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-3xl font-semibold transition-colors flex items-center gap-2"
                    disabled={isProcessing || placingOrder}
                  >
                    🗑️ Remove Selected ({selectedItemKeys.length})
                  </button>
                )}
              </div>

              <div className="divide-y">
                {cart.items.map((item) => {
                  const itemKey = getItemKey(item);
                  const isSelected = selectedItemKeys.includes(itemKey);
                  const product = item.product;
                  const imageUrl = getProductImageUrl(product);

                  return (
                    <div key={itemKey} className="py-7 flex gap-6 group">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(itemKey)}
                        className="w-5 h-5 mt-1 accent-emerald-500"
                        disabled={isProcessing || placingOrder}
                      />

                      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector(".image-placeholder");
                                if (placeholder) placeholder.classList.remove("hidden");
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`image-placeholder w-full h-full flex items-center justify-center text-3xl ${
                            imageUrl ? "hidden" : ""
                          }`}
                        >
                          🛒
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 leading-tight mb-1">
                          {product.title}
                          {item.variant?.value && ` • ${item.variant.value}`}
                        </h3>
                        <div className="text-emerald-600 font-bold text-xl">
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>

                        <div className="flex items-center gap-6 mt-5">
                          <div className="flex items-center bg-slate-100 rounded-3xl p-1">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={item.quantity <= 1 || isProcessing || placingOrder}
                              className="w-9 h-9 flex items-center justify-center text-2xl font-light text-slate-700 hover:bg-white rounded-3xl transition-all disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="px-6 font-semibold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={isProcessing || placingOrder}
                              className="w-9 h-9 flex items-center justify-center text-2xl font-light text-slate-700 hover:bg-white rounded-3xl transition-all"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => setShowRemoveConfirm(itemKey)}
                            className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-1 transition-colors"
                            disabled={isProcessing || placingOrder}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-2xl text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Sidebar with Shipping and Payment */}
            <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="h-px bg-slate-200 my-4" />

                <div className="flex justify-between text-2xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-4 rounded-3xl text-center text-sm font-semibold mt-2">
                    🎉 You&apos;ve unlocked free shipping!
                  </div>
                )}
              </div>

              {/* Shipping Address Section */}
              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Shipping Address</h3>
                  <button
                    onClick={openAddAddressModal}
                    className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
                    disabled={placingOrder}
                  >
                    + Add New
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="text-center py-4 text-slate-500">Loading addresses...</div>
                ) : addressError ? (
                  <div className="text-red-500 text-sm py-2">{addressError}</div>
                ) : addresses.length === 0 ? (
                  <div className="text-slate-500 text-sm py-2">
                    No saved addresses. Please add one to proceed.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr._id
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 hover:border-emerald-300"
                        }`}
                        onClick={() => !placingOrder && setSelectedAddressId(addr._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">
                              {addr.address.street}, {addr.address.city}, {addr.address.state} -{" "}
                              {addr.address.postalCode}
                            </p>
                            <p className="text-sm text-slate-600">{addr.address.country}</p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditAddressModal(addr);
                              }}
                              className="text-slate-400 hover:text-emerald-600 text-sm"
                              disabled={placingOrder}
                            >
                              Edit
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(addr._id);
                                }}
                                className="text-slate-400 hover:text-red-600 text-sm"
                                disabled={placingOrder}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashfree"
                      checked={paymentMethod === "cashfree"}
                      onChange={() => setPaymentMethod("cashfree")}
                      className="w-4 h-4 accent-emerald-500"
                      disabled={placingOrder}
                    />
                    <span className="text-slate-700">Cashfree (Card/UPI/NetBanking)</span>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={
                  selectedItemKeys.length === 0 ||
                  isProcessing ||
                  placingOrder ||
                  !selectedAddressId ||
                  loadingAddresses
                }
                className="mt-6 w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold text-xl rounded-3xl transition-all active:scale-95 shadow-xl shadow-emerald-300/30"
              >
                {placingOrder
                  ? "Placing Order..."
                  : selectedItemKeys.length === 0
                  ? "Select items to checkout"
                  : !selectedAddressId
                  ? "Select shipping address"
                  : `Place Order (${selectedCount} items)`}
              </button>

              {selectedItemKeys.length > 0 && selectedAddressId && (
                <div className="mt-4 text-center text-sm font-medium bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl">
                  Selected {selectedCount} items • ₹{selectedTotal.toLocaleString("en-IN")}
                </div>
              )}

              <button
                onClick={handleContinueShopping}
                className="mt-4 w-full py-4 border-2 border-slate-200 hover:border-emerald-300 text-slate-600 font-semibold rounded-3xl transition-all"
                disabled={placingOrder}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}