// components/Header.tsx
"use client";

import Image from "next/image";
import { Search, ShoppingCart, User, ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProducts } from "@/app/context/ProductContext";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { products, searchQuery, setSearchQuery, searchResults, loading: productsLoading } = useProducts();
  const { cart, loading: cartLoading } = useCart();

  // Cart item count
  const cartItemCount = cart?.totalItems ?? 0;

  // Dynamic nav items
  const dynamicNavItems = products.slice(0, 3).map((product) => ({
    name: product.title,
    id: product._id,
  }));

  const allProductsItem = { name: "All Products", id: "all" };
  const navItems = [...dynamicNavItems, allProductsItem];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when there is a query
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, searchResults]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Handle cart click with auth check
  const handleCartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const clientAuth = localStorage.getItem("clientAuth");
    if (!clientAuth) {
      toast.info("Please log in to view your cart", { autoClose: 2000 });
      e.preventDefault();
      router.push("/signup");
    }
  };

  // Handle order/user icon click with auth check
  const handleOrderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const clientAuth = localStorage.getItem("clientAuth");
    if (!clientAuth) {
      toast.info("Please log in to view your orders", { autoClose: 2000 });
      e.preventDefault();
      router.push("/signup");
    }
  };

  return (
    <header className="w-full font-sans">
      {/* Announcement Banner */}
      <div
        className="relative overflow-hidden text-white text-center text-[13px] font-semibold py-2.5 tracking-widest uppercase"
        style={{
          background:
            "linear-gradient(90deg,#92400e 0%,#b45309 25%,#d97706 50%,#b45309 75%,#92400e 100%)",
        }}
      >
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)",
            animation: "shimmer 3s infinite",
          }}
        />
        Welcome to PlastCare – Shop Quality Products Online
        <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
      </div>

      {/* Main Nav */}
      <div className="bg-white" style={{ borderBottom: "1px solid rgba(180,83,9,0.12)" }}>
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-[68px] gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
            <Image
              src="/logo.png"
              alt="PlastCare Logo"
              width={100}
              height={32}
              className="object-contain"
            />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5 text-[13px] font-medium">
            {navItems.map((item) => {
              const isAllProducts = item.id === "all";
              const href = isAllProducts ? "/all-products" : `/product/${item.id}`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex items-center gap-0.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 focus:outline-none"
                  style={{
                    color: hovered === item.name ? "#92400e" : "#44403c",
                    background: hovered === item.name ? "rgba(251,191,36,0.1)" : "transparent",
                  }}
                >
                  {item.name}
                  <ChevronDown
                    className="w-3 h-3 mt-0.5 transition-transform duration-200"
                    style={{
                      color: hovered === item.name ? "#b45309" : "#a8a29e",
                      transform: hovered === item.name ? "rotate(-180deg)" : "rotate(0deg)",
                    }}
                  />
                  <span
                    className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full transition-all duration-200 origin-left"
                    style={{
                      background: "linear-gradient(90deg,#f59e0b,#b45309)",
                      opacity: hovered === item.name ? 1 : 0,
                      transform: hovered === item.name ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Cart Button with Auth Check */}
            <Link
              href="/cartitem"
              onClick={handleCartClick}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 focus:outline-none group"
              style={{
                borderColor: "rgba(180,83,9,0.2)",
                background: "rgba(251,191,36,0.06)",
                color: "#78716c",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(251,191,36,0.15)";
                e.currentTarget.style.borderColor = "#d97706";
                e.currentTarget.style.color = "#92400e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(251,191,36,0.06)";
                e.currentTarget.style.borderColor = "rgba(180,83,9,0.2)";
                e.currentTarget.style.color = "#78716c";
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full text-[9px] font-bold text-white leading-none"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Order/User Icon with Auth Check */}
            <Link
              href="/order"
              onClick={handleOrderClick}
              className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 focus:outline-none"
              style={{
                borderColor: "rgba(180,83,9,0.2)",
                background: "rgba(251,191,36,0.06)",
                color: "#78716c",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(251,191,36,0.15)";
                e.currentTarget.style.borderColor = "#d97706";
                e.currentTarget.style.color = "#92400e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(251,191,36,0.06)";
                e.currentTarget.style.borderColor = "rgba(180,83,9,0.2)";
                e.currentTarget.style.color = "#78716c";
              }}
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search Row with Dropdown */}
      <div
        className="py-4 px-6 transition-all duration-300"
        style={{
          background: searchFocused
            ? "linear-gradient(to bottom,rgba(251,191,36,0.07),white)"
            : "white",
          borderBottom: "1px solid rgba(180,83,9,0.07)",
        }}
      >
        <div className="max-w-screen-xl mx-auto flex justify-center" ref={searchRef}>
          <div className="relative w-full max-w-2xl">
            <div
              className="relative transition-all duration-300"
              style={{
                filter: searchFocused
                  ? "drop-shadow(0 4px 16px rgba(180,83,9,0.1))"
                  : "none",
              }}
            >
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200"
                style={{ color: searchFocused ? "#b45309" : "#a8a29e" }}
              />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full rounded-2xl py-3 pl-11 pr-28 text-[13.5px] text-stone-700 placeholder-stone-400 outline-none transition-all duration-200 bg-white"
                style={{
                  border: searchFocused
                    ? "1.5px solid #d97706"
                    : "1.5px solid rgba(180,83,9,0.2)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl text-white text-[12px] font-semibold tracking-wide transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#f59e0b 0%,#b45309 100%)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg,#d97706 0%,#92400e 100%)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg,#f59e0b 0%,#b45309 100%)")
                }
              >
                Search
              </button>
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-amber-200 z-50 max-h-96 overflow-y-auto">
                {productsLoading ? (
                  <div className="p-4 text-center text-stone-500">Loading products...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-stone-500">
                    No products found for "{searchQuery}"
                  </div>
                ) : (
                  <div>
                    <div className="p-2 text-xs font-semibold text-stone-400 border-b">
                      {searchResults.length} result{searchResults.length !== 1 && "s"}
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-amber-50 transition-colors border-b last:border-0"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.title}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-stone-800 truncate">
                            {product.title}
                          </div>
                          <div className="text-sm text-amber-700 font-semibold">
                            ₹{product.salePrice || product.price}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}