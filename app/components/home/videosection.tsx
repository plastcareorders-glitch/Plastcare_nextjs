"use client";

import React, { useRef, useState } from "react";
import {
  ArrowRight,
  Star,
  Shield,
  Truck,
  Clock,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProducts } from "@/app/context/ProductContext";

// ==================== TYPES ====================
interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  images: ProductImage[];
  category: string;
  isFeatured?: boolean;
  rating?: number;
}

// Video URL
const cookingVideo =
  "https://res.cloudinary.com/dfzwhnmkf/video/upload/v1763884308/6162038-hd_1080_1920_30fps_uohzwx.mp4";

// Helper
const formatPrice = (price: number): string => price.toLocaleString();

export default function HomeEssentialsHero() {
  const { products, loading, error } = useProducts();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ========== Process categories from real products ==========
  const getCategoriesData = () => {
    if (!products || products.length === 0) return [];

    const categoriesMap: Record<
      string,
      {
        title: string;
        products: Product[];
        minPrice: number;
        images: string[];
      }
    > = {};

    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          title: category,
          products: [],
          minPrice: Infinity,
          images: [],
        };
      }

      categoriesMap[category].products.push(product);
      const productPrice = product.salePrice || product.price;
      if (productPrice < categoriesMap[category].minPrice) {
        categoriesMap[category].minPrice = productPrice;
      }
      if (product.images && product.images.length > 0) {
        categoriesMap[category].images.push(product.images[0].url);
      }
    });

    return Object.keys(categoriesMap).map((category) => {
      const catData = categoriesMap[category];
      return {
        title: category,
        path: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
        price: `Starting @ ₹${Math.round(catData.minPrice)}/-`,
        image:
          catData.images[0] ||
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
        // ✅ STATIC HARDCODED RATING (4.4) – no longer depends on product data
        rating: "4.4",
        products: catData.products,
      };
    });
  };

  const categories = getCategoriesData();
  const singleCategory = categories.length === 1 ? categories[0] : null;

  // Features array (unchanged)
  const features = [
    { icon: <Truck size={24} />, text: "Free Shipping", subtext: "Above ₹999" },
    { icon: <Shield size={24} />, text: "2 Year Warranty", subtext: "On all products" },
    { icon: <Clock size={24} />, text: "24/7 Support", subtext: "Quick response" },
    { icon: <Zap size={24} />, text: "Fast Delivery", subtext: "2-3 days" },
  ];

  // Video handlers
  React.useEffect(() => {
    if (videoRef.current && !hasVideoError) {
      videoRef.current.muted = isMuted;
    }
  }, [hasVideoError, isMuted]);

  const toggleVideoPlayback = async () => {
    if (!videoRef.current) return;
    try {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        setIsLoading(true);
        await videoRef.current.play();
        setIsVideoPlaying(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Video error:", err);
      setHasVideoError(true);
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoError = () => setHasVideoError(true);
  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setHasVideoError(false);
    setIsLoading(false);
  };
  const handleVideoLoadStart = () => setIsLoading(true);

  // Horizontal scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Stats – now using static 4.4 rating
  const stats = {
    totalProducts: products.length,
    avgRating: "4.4", // ✅ HARDCODED STATIC 4.4
    uniqueCategories: new Set(products.map((p) => p.category)).size,
  };

  if (loading) {
    return (
      <div className="home-essentials-hero">
        <div className="loading-screen">Loading collections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-essentials-hero">
        <div className="error-screen">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* ========== GLOBAL STYLES ========== */
        .home-essentials-hero {
          min-height: 100vh;
          background: linear-gradient(135deg, #fffbeb 0%, #fed7aa 50%, #fdba74 100%);
          position: relative;
          overflow-x: hidden;
        }
        .container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .hero-content {
          padding: 0 0 3rem;
        }

        /* Video Banner */
        .video-banner {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          overflow: hidden;
          margin-bottom: 4rem;
          border-radius: 0 0 2rem 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .video-background {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 2rem;
        }
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 2rem;
        }
        .video-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
          animation: fadeInUp 0.8s ease-out;
        }
        .video-subtitle {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        .video-cta-button {
          background: linear-gradient(45deg, #dc2626, #d97706);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 3rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .video-controls {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          gap: 1rem;
          z-index: 3;
        }
        .video-control-btn {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Title & Stats */
        .title-section {
          text-align: center;
          margin-bottom: 4rem;
        }
        .main-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1f2937;
        }
        .gradient-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #dc2626, #ea580c, #d97706);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientShift 3s infinite;
        }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 42rem;
          margin: 0 auto 2rem;
        }
        .stats-display {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .stat-item {
          background: rgba(255,255,255,0.9);
          padding: 1rem 2rem;
          border-radius: 1rem;
          text-align: center;
          min-width: 120px;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #d97706;
          display: block;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 48rem;
          margin: 0 auto 4rem;
        }
        .feature-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          padding: 1.5rem 1rem;
          border-radius: 1rem;
          text-align: center;
          transition: 0.3s;
        }
        .feature-icon { color: #d97706; margin-bottom: 0.75rem; }
        .feature-text { font-weight: 600; color: #1f2937; }
        .feature-subtext { font-size: 0.875rem; color: #6b7280; }

        /* ========== SINGLE CATEGORY – HORIZONTAL FULL-WIDTH ========== */
        .single-category-section {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          background: #ffffff;
          padding: 3rem 0;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
        }
        .category-hero {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .category-title-large {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
        }
        .category-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
        }
        .product-horizontal-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 1.5rem;
          padding-bottom: 1rem;
          scrollbar-width: thin;
        }
        .product-horizontal-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .product-horizontal-scroll::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .product-horizontal-scroll::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 10px;
        }
        .horizontal-product-card {
          flex: 0 0 280px;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          transition: 0.3s;
          cursor: pointer;
        }
        .horizontal-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.1);
        }
        .product-img {
          height: 220px;
          width: 100%;
          object-fit: cover;
        }
        .product-info {
          padding: 1rem;
        }
        .product-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .product-price {
          font-weight: 700;
          color: #d97706;
        }
        .original-price {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: line-through;
          margin-left: 0.5rem;
        }
        .scroll-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }
        .scroll-btn {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .scroll-btn:hover {
          background: #f3f4f6;
          border-color: #d97706;
        }

        /* Multiple categories grid (fallback) */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .category-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          transition: 0.4s;
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-8px);
        }
        .category-image-container {
          position: relative;
          height: 280px;
        }
        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-content {
          padding: 1.5rem;
        }
        .shop-now-section {
          background: linear-gradient(45deg, #dc2626, #d97706);
          padding: 1rem;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .video-title { font-size: 2.5rem; }
          .video-subtitle { font-size: 1.25rem; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .category-title-large { font-size: 1.8rem; }
        }
        @media (max-width: 640px) {
          .video-title { font-size: 2rem; }
          .horizontal-product-card { flex: 0 0 240px; }
        }
        .loading-screen, .error-screen {
          text-align: center;
          padding: 4rem;
          font-size: 1.2rem;
        }

        /* Additional missing styles for completeness */
        .video-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 1.1rem;
          z-index: 10;
        }
        .category-price {
          color: #d97706;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .rating-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #1f2937;
          font-weight: 600;
        }
        .shop-now-btn {
          background: none;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .cta-section {
          margin-top: 4rem;
        }
      `}</style>

      <div className="home-essentials-hero">
        {/* Video Banner */}
        <div className="video-banner">
          {hasVideoError ? (
            <div className="video-fallback">
              <div>
                <h2>PlastCare</h2>
                <p>Transform your kitchen with our curated collection</p>
              </div>
            </div>
          ) : (
            <>
              {(isLoading || !videoLoaded) && <div className="video-loading">Loading video...</div>}
              <video
                ref={videoRef}
                muted={isMuted}
                loop
                playsInline
                className="video-background"
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                onLoadStart={handleVideoLoadStart}
                poster="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80"
              >
                <source src={cookingVideo} type="video/mp4" />
              </video>
            </>
          )}
          <div className="video-overlay">
            <div className="video-content">
              <h1 className="video-title">Transform Your Kitchen</h1>
              <p className="video-subtitle">
                Premium home essentials that blend style, functionality, and comfort
              </p>
              <button
                className="video-cta-button"
                onClick={toggleVideoPlayback}
                disabled={isLoading || hasVideoError}
              >
                {isVideoPlaying ? "Pause Video" : "Play Video"}
              </button>
            </div>
          </div>
          {!hasVideoError && videoLoaded && (
            <div className="video-controls">
              <button className="video-control-btn" onClick={toggleVideoPlayback}>
                {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="video-control-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          )}
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Title & Stats */}
            <div className="title-section">
              <h1 className="main-title">Discover Our Collections</h1>
              <h2 className="gradient-title">Curated Home Essentials</h2>
              <p className="subtitle">
                High-quality products that transform every corner of your home
              </p>
              <div className="stats-display">
                <div className="stat-item">
                  <span className="stat-value">{stats.totalProducts}+</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.avgRating}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.uniqueCategories}+</span>
                  <span className="stat-label">Categories</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feat, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{feat.icon}</div>
                  <div className="feature-text">{feat.text}</div>
                  <div className="feature-subtext">{feat.subtext}</div>
                </div>
              ))}
            </div>

            {/* ========== CATEGORY SECTION ========== */}
            {singleCategory ? (
              // Single category: horizontal product showcase (full width)
              <div className="single-category-section">
                <div className="category-hero">
                  <div className="category-header">
                    <div>
                      <h2 className="category-title-large">{singleCategory.title}</h2>
                      <p className="category-price">{singleCategory.price}</p>
                    </div>
                    <div className="category-rating">
                      <Star size={18} fill="#fbbf24" stroke="#fbbf24" />
                      <span>{singleCategory.rating}</span>
                    </div>
                  </div>

                  <div className="scroll-buttons">
                    <button className="scroll-btn" onClick={scrollLeft}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className="scroll-btn" onClick={scrollRight}>
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="product-horizontal-scroll" ref={scrollContainerRef}>
                    {singleCategory.products.map((product) => {
                      const displayPrice = product.salePrice || product.price;
                      const hasDiscount = product.salePrice && product.salePrice < product.price;
                      return (
                        <div
                          key={product._id}
                          className="horizontal-product-card"
                          onClick={() => (window.location.href = `/product/${product._id}`)}
                        >
                          <img
                            src={product.images[0]?.url || "/placeholder.jpg"}
                            alt={product.title}
                            className="product-img"
                          />
                          <div className="product-info">
                            <div className="product-title">{product.title}</div>
                            <div className="product-price">
                              ₹{formatPrice(displayPrice)}
                              {hasDiscount && (
                                <span className="original-price">
                                  ₹{formatPrice(product.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Multiple categories: original grid layout
              <div className="categories-grid">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="category-card"
                    onClick={() => (window.location.href = cat.path)}
                  >
                    <div className="category-image-container">
                      <img src={cat.image} alt={cat.title} className="category-image" />
                      <div className="category-content">
                        <h3>{cat.title}</h3>
                        <p>{cat.price}</p>
                        {/* ✅ Updated to 4.4 for consistency */}
                        <div className="rating-badge">
                          <Star size={16} fill="#fbbf24" /> 4.4
                        </div>
                      </div>
                    </div>
                    <div className="shop-now-section">
                      <button className="shop-now-btn">
                        Explore Collection <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="cta-section" style={{ textAlign: "center", marginTop: "4rem" }}>
              <div className="cta-banner" style={{ display: "inline-flex", gap: "1rem", background: "#1f2937", color: "white", padding: "1rem 2rem", borderRadius: "2rem" }}>
                <span>🎉</span>
                <span>Free shipping on orders above ₹999 • 30-day returns</span>
                <span>🚚</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}