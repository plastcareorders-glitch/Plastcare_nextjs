"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useProducts } from "@/app/context/ProductContext";
import { useCart } from "@/app/context/CartContext";

// ==================== TYPES ====================
interface ProductImage {
  _id?: string;
  public_id: string;
  url: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: ProductImage[];
  category: string;
  brand?: string;
  rating: number;
  totalReviews: number;
  tags?: string[];
  sku?: string;
  variants?: Array<{ name: string; value: string }>;
}

interface MappedProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  badge: string;
  discount: string;
  newBadge: string;
  rating: number;
  reviews: number;
  freeShipping: boolean;
  inStock: boolean;
  category: string;
  brand: string;
}

// Helper functions
const formatPrice = (price: number): string => price.toLocaleString("en-IN");

const getStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return [...Array(5)].map((_, i) => {
    if (i < fullStars)
      return (
        <span key={i} className="text-amber-500 text-xl">
          ★
        </span>
      );
    if (hasHalfStar && i === fullStars)
      return (
        <span key={i} className="text-amber-500 text-xl relative">
          ½
        </span>
      );
    return (
      <span key={i} className="text-gray-300 text-xl">
        ★
      </span>
    );
  });
};

// Modern Tailwind Loading Skeleton
const LoadingSkeleton = () => (
  <div className="bg-gray-50 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-3xl w-full" />
          <div className="flex gap-3 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 w-16 h-16 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded-full w-28" />
          <div className="h-9 bg-gray-200 rounded-2xl w-4/5" />
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-28" />
            <div className="h-5 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-baseline gap-4">
            <div className="h-10 bg-gray-200 rounded-2xl w-40" />
            <div className="h-6 bg-gray-200 rounded-xl w-24" />
          </div>
          <div className="h-24 bg-gray-200 rounded-3xl" />
          <div className="h-8 bg-gray-200 rounded-3xl w-40" />
          <div className="flex gap-4">
            <div className="h-14 bg-gray-200 rounded-3xl flex-1" />
            <div className="h-14 bg-gray-200 rounded-3xl flex-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { products, loading: contextLoading } = useProducts();
  const { cart, addToCart, loading: cartLoading } = useCart();

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Recommendations
  const [recommendedProducts, setRecommendedProducts] = useState<MappedProduct[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  // UI state
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);

  // Shipping modal
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    label: "Home",
  });
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Quantity
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Refs & swipe
  const scrollRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Toast helper
  const addToast = (message: string, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // Fetch product
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/client/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
          setError(null);
        } else {
          setError("Product not found");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Build recommendations from context
  useEffect(() => {
    if (!contextLoading && products.length > 0 && product) {
      setRecommendationsLoading(true);
      const otherProducts = products
        .filter((p) => p._id !== product._id)
        .slice(0, 10)
        .map((p) => ({
          id: p._id,
          name: p.title,
          originalPrice: p.price,
          salePrice: p.salePrice ?? p.price,
          image: p.images[0]?.url || "",
          badge: p.isFeatured ? "Must Have" : p.rating >= 4.5 ? "Best Seller 🥇" : "",
          discount:
            p.salePrice && p.salePrice < p.price
              ? `${Math.round(((p.price - p.salePrice) / p.price) * 100)}% OFF`
              : "",
          newBadge: p.tags?.includes("new") ? "New Launch 🔥" : "",
          rating: p.rating || 0,
          reviews: p.totalReviews || 0,
          freeShipping: true,
          inStock: p.stock > 0,
          category: p.category,
          brand: p.brand || "Generic",
        }));
      setRecommendedProducts(otherProducts);
      setRecommendationsLoading(false);
    } else if (!contextLoading && products.length === 0) {
      setRecommendationsLoading(false);
    }
  }, [contextLoading, products, product]);

  // Cart quantity calculation
  const cartItem = cart?.items?.find((item: any) => item.product?._id === product?._id);
  const cartQuantity = cartItem?.quantity || 0;
  const maxAdd = product ? Math.max(0, product.stock - cartQuantity) : 0;

  // Quantity handlers
  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    let newQty = selectedQuantity + delta;
    newQty = Math.max(1, Math.min(newQty, maxAdd));
    setSelectedQuantity(newQty);
  };

  // Add to cart logic (actual API call)
  const addToCartLogic = async () => {
    if (!product) return;
    const toAdd = selectedQuantity;
    if (toAdd > maxAdd) {
      addToast(`Cannot add more than ${maxAdd} items. You already have ${cartQuantity} in cart.`, "warning");
      return;
    }
    if (toAdd <= 0) {
      addToast("Please select at least 1 item", "warning");
      return;
    }
    setIsAddingToCart(true);
    const success = await addToCart(product._id, toAdd);
    setIsAddingToCart(false);
    if (success) {
      addToast(`Added ${toAdd} item${toAdd > 1 ? "s" : ""} to cart successfully!`, "success");
      setSelectedQuantity(1);
    } else {
      addToast("Failed to add item. Please try again.", "error");
    }
  };

  // Handle Add to Cart click with localStorage auth check
  const handleAddToCart = () => {
    // Check for authentication using localStorage key "clientAuth"
    const clientAuth = localStorage.getItem("clientAuth");
    if (!clientAuth) {
      // Store pending cart item and redirect to signup
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          productId: product?._id,
          quantity: selectedQuantity,
        })
      );
      router.push("/signup");
      return;
    }

    // User is authenticated (clientAuth exists), check shipping address (demo requirement)
    const shippingId = localStorage.getItem("demoShippingId");
    if (!shippingId) {
      setShowShippingModal(true);
    } else {
      addToCartLogic();
    }
  };

  // WhatsApp
  const handleWhatsAppClick = () => {
    if (!product) return;
    const phoneNumber = "919667022185";
    const displayPrice = product.salePrice ?? product.price;
    const message = `Hello, I'm interested in *${product.title}*.%0A💰 Price: ₹${displayPrice.toLocaleString()}%0A📦 Quantity: ${selectedQuantity}%0A🔗 Product Link: ${window.location.href}%0A%0ACould you please share more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  // Shipping form handlers
  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
    if (shippingErrors[name]) setShippingErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const { street, city, state, postalCode, country } = shippingForm;

    if (!street.trim()) errors.street = "Street address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required";
    else if (!/^\d{6}$/.test(postalCode.trim())) errors.postalCode = "Postal code must be 6 digits";
    if (!country.trim()) errors.country = "Country is required";

    setShippingErrors(errors);

    if (Object.keys(errors).length > 0) {
      addToast("Please fill all required fields correctly", "error");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const shippingId = "shipping_" + Date.now();
    localStorage.setItem("demoShippingId", shippingId);
    setShowShippingModal(false);
    addToast("Shipping address saved successfully!", "success");
    // After saving shipping, add to cart
    await addToCartLogic();
  };

  // Image navigation & swipe
  const nextImage = () => {
    if (!product || product.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };
  const prevImage = () => {
    if (!product || product.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!product || product.images.length <= 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !product || product.images.length <= 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !product || product.images.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    else if (distance < -minSwipeDistance) prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!product || product.images.length <= 1) return;
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!touchStart || !product || product.images.length <= 1) return;
    setTouchEnd(e.clientX);
  };
  const onMouseUp = () => {
    if (!touchStart || !touchEnd || !product || product.images.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    else if (distance < -minSwipeDistance) prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePrev = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const handleNext = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  // Early returns
  if (loading) return <LoadingSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-4 px-8 rounded-3xl transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock === 0 || maxAdd <= 0;

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-4 rounded-3xl text-white flex items-center gap-3 shadow-2xl transition-all duration-300 backdrop-blur-md font-medium ${
              toast.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                : toast.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : toast.type === "warning"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
          >
            <span className="text-xl">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                  ? "✗"
                  : toast.type === "warning"
                    ? "⚠"
                    : "ℹ"}
            </span>
            <span>{toast.message}</span>
            <button
              className="ml-auto text-2xl leading-none hover:scale-110 transition-transform"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 pt-8 pb-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Add Shipping Address</h2>
              <button
                onClick={() => setShowShippingModal(false)}
                className="text-4xl leading-none text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleShippingSubmit} className="p-8 space-y-6">
              <div>
                <input
                  name="street"
                  placeholder="Street Address"
                  value={shippingForm.street}
                  onChange={handleShippingInputChange}
                  className="w-full px-5 py-4 border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-3xl outline-none transition-all"
                />
                {shippingErrors.street && <p className="text-red-500 text-sm mt-1.5">{shippingErrors.street}</p>}
              </div>

              <div>
                <input
                  name="city"
                  placeholder="City"
                  value={shippingForm.city}
                  onChange={handleShippingInputChange}
                  className="w-full px-5 py-4 border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-3xl outline-none transition-all"
                />
                {shippingErrors.city && <p className="text-red-500 text-sm mt-1.5">{shippingErrors.city}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="state"
                    placeholder="State"
                    value={shippingForm.state}
                    onChange={handleShippingInputChange}
                    className="w-full px-5 py-4 border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-3xl outline-none transition-all"
                  />
                  {shippingErrors.state && <p className="text-red-500 text-sm mt-1.5">{shippingErrors.state}</p>}
                </div>
                <div>
                  <input
                    name="postalCode"
                    placeholder="Postal Code"
                    value={shippingForm.postalCode}
                    onChange={handleShippingInputChange}
                    className="w-full px-5 py-4 border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-3xl outline-none transition-all"
                  />
                  {shippingErrors.postalCode && <p className="text-red-500 text-sm mt-1.5">{shippingErrors.postalCode}</p>}
                </div>
              </div>

              <div>
                <input
                  name="country"
                  placeholder="Country"
                  value={shippingForm.country}
                  onChange={handleShippingInputChange}
                  className="w-full px-5 py-4 border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-3xl outline-none transition-all"
                />
                {shippingErrors.country && <p className="text-red-500 text-sm mt-1.5">{shippingErrors.country}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-3xl transition-all active:scale-95 text-lg"
              >
                Save &amp; Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Product Page */}
      <div className="bg-gray-50 min-h-screen py-8 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl cursor-grab aspect-square group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
              >
                <img
                  src={product.images[currentImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {product.images.length > 1 && (
                  <>
                    {/* Navigation arrows */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-3xl w-12 h-12 flex items-center justify-center rounded-3xl shadow-xl transition-all hover:scale-110 active:scale-95"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-3xl w-12 h-12 flex items-center justify-center rounded-3xl shadow-xl transition-all hover:scale-110 active:scale-95"
                    >
                      ›
                    </button>

                    {/* Counter */}
                    <div className="absolute top-6 right-6 bg-black/70 text-white text-sm font-medium px-4 py-1.5 rounded-3xl backdrop-blur-md">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "bg-amber-500 w-8"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.public_id || idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all snap-center ${
                        idx === currentImageIndex
                          ? "border-amber-500 shadow-inner"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-amber-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 flex flex-col">
              <div className="uppercase text-amber-600 font-semibold tracking-[0.5px] text-sm mb-1">{product.category}</div>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">{getStars(product.rating || 0)}</div>
                <div className="text-gray-600 text-lg">
                  {product.rating || 0} <span className="text-gray-400">({product.totalReviews || 0} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline flex-wrap gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{displayPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-5 py-1 text-sm font-semibold rounded-3xl">
                      {Math.round(((product.price - product.salePrice!) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg mb-8">{product.description}</p>

              {/* Stock */}
              <div
                className={`inline-flex items-center px-6 py-2.5 rounded-3xl font-semibold text-sm mb-6 w-fit ${
                  product.stock > 10
                    ? "bg-sky-100 text-sky-700"
                    : product.stock > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                    ? "Low Stock"
                    : "Out of Stock"}{" "}
                • {product.stock} left
              </div>

              {/* Cart info */}
              {cartQuantity > 0 && !isOutOfStock && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-3xl text-sm mb-6">
                  You already have <span className="font-semibold">{cartQuantity}</span> in cart. Can add{" "}
                  <span className="font-semibold">{maxAdd}</span> more.
                </div>
              )}

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center bg-gray-100 rounded-3xl p-2 w-fit mb-8">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={selectedQuantity <= 1}
                    className="w-11 h-11 flex items-center justify-center text-2xl font-semibold hover:bg-white rounded-3xl transition-colors disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="font-bold text-2xl px-8">{selectedQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedQuantity >= maxAdd}
                    className="w-11 h-11 flex items-center justify-center text-2xl font-semibold hover:bg-white rounded-3xl transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart || cartLoading}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-400 text-[#7c2d12] font-bold py-6 rounded-3xl text-xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-lg shadow-amber-300/30"
                >
                  {isAddingToCart || cartLoading ? (
                    "Adding to cart..."
                  ) : isOutOfStock ? (
                    "Out of Stock"
                  ) : cartQuantity > 0 ? (
                    `Add ${selectedQuantity} More`
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-[#25D366] hover:bg-[#20b859] text-white font-bold py-6 rounded-3xl text-xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-lg shadow-green-400/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.414 3.488 2.245 2.248 3.482 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.306 1.654zM12.043 2.032c-5.156 0-9.35 4.194-9.353 9.35 0 1.79.509 3.534 1.475 5.045l-1.004 3.667 3.766-1.002c1.468.908 3.156 1.387 4.877 1.388 5.156 0 9.35-4.194 9.35-9.35 0-2.498-.973-4.846-2.739-6.612-1.765-1.765-4.112-2.738-6.611-2.738l.149.004zM17.24 14.83c-.191-.305-1.108-.693-1.53-.761-.416-.069-.726.099-.922.315-.437.483-.674.618-.968.886-.207.188-.402.22-.736.064-.28-.13-1.175-.536-2.24-1.372-.828-.648-1.387-1.448-1.55-1.693-.163-.245-.128-.39.038-.541.16-.145.32-.324.48-.486.16-.162.213-.278.32-.463.107-.185.054-.347-.027-.486-.08-.139-.691-1.617-.95-2.216-.246-.573-.494-.492-.68-.5-.18-.008-.386-.01-.593-.01-.306 0-.784.109-1.195.542-.411.433-1.57 1.484-1.57 3.618 0 2.134 1.599 4.198 1.823 4.488.224.29 3.152 4.667 7.645 5.421 1.069.18 1.948.108 2.587-.069.643-.177 1.332-.652 1.521-1.282.189-.63.189-1.168.132-1.281-.057-.113-.21-.185-.401-.49z" />
                  </svg>
                  WhatsApp
                </button>
              </div>

              <div className="text-gray-500 flex items-center gap-2 text-sm mt-8">
                <span className="text-2xl">🚚</span>
                Free shipping available on all orders
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-3xl font-semibold text-gray-900">You May Also Like</h2>
              <Link
                href="/all-products"
                className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors"
              >
                View All <span className="text-xl">→</span>
              </Link>
            </div>

            {recommendationsLoading ? (
              <div className="text-center py-12 text-gray-400">Loading recommendations...</div>
            ) : recommendedProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No related products found</div>
            ) : (
              <div className="relative">
                {/* Carousel controls */}
                <button
                  onClick={handlePrev}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white shadow-xl hover:bg-amber-500 hover:text-white w-12 h-12 rounded-3xl text-4xl flex items-center justify-center z-10 transition-all hidden xl:flex"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white shadow-xl hover:bg-amber-500 hover:text-white w-12 h-12 rounded-3xl text-4xl flex items-center justify-center z-10 transition-all hidden xl:flex"
                >
                  ›
                </button>

                <div
                  ref={scrollRef}
                  className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                >
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/product/${p.id}`)}
                      className="min-w-[260px] snap-start bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />

                        {p.badge && (
                          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-3xl">
                            {p.badge}
                          </div>
                        )}
                        {p.discount && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-3xl">
                            {p.discount}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="uppercase text-amber-600 text-xs tracking-widest font-medium mb-1">{p.category}</div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-3 group-hover:text-amber-600 transition-colors">
                          {p.name}
                        </h3>

                        <div className="flex items-center gap-1 text-sm mb-4">
                          <div className="flex">{getStars(p.rating)}</div>
                          <span className="text-gray-500">({p.reviews})</span>
                        </div>

                        <div className="flex items-baseline gap-3">
                          <span className="font-bold text-2xl">₹{p.salePrice.toLocaleString()}</span>
                          {p.originalPrice > p.salePrice && (
                            <span className="text-gray-400 line-through text-base">₹{p.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}