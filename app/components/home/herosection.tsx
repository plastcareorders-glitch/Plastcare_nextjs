"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/app/context/ProductContext"; // adjust path as needed

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

// ==================== HELPER FUNCTIONS ====================
const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

const calculateDiscount = (originalPrice: number, salePrice?: number | null): string | null => {
  if (!salePrice || salePrice >= originalPrice) return null;
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  return `${discount}% OFF`;
};

const getProductBadge = (product: Product): string => {
  if (product.isFeatured) return "Must Have😍";
  if (product.rating && product.rating >= 4) return "Best Seller🏆";
  return "New Launch🔥";
};

// ==================== MAIN COMPONENT ====================
export default function ProductGrid() {
  const router = useRouter();
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Products");

  // Dynamically extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return ["All Products", ...uniqueCategories.sort()];
  }, [products]);

  // Get products based on selected category (max 4 items)
  const getProductsByCategory = (category: string): Product[] => {
    let filtered: Product[];
    if (category === "All Products") {
      filtered = [...products];
    } else {
      filtered = products.filter((product) => product.category === category);
    }
    // Return first 4 products (or all if less than 4)
    return filtered.slice(0, 5);
  };

  const categoryProducts = getProductsByCategory(selectedCategory);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleShopNowClick = () => {
    router.push("/all-products");
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="loading-spinner">Loading products...</div>
          <style>{`
            .loading-spinner {
              font-size: 1.2rem;
              color: #1a365d;
              padding: 2rem;
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-grid-container">
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="error-message">Error loading products: {error}</div>
          <style>{`
            .error-message {
              color: #e53e3e;
              font-size: 1rem;
              padding: 1rem;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .product-grid-container {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
        }
        .container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .banner-section {
          margin-bottom: 3rem;
        }
        .banner-container {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 1rem;
          overflow: hidden;
          background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
        }
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3rem;
        }
        .banner-content {
          max-width: 60%;
          color: white;
        }
        .banner-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          line-height: 1.6;
          max-width: 90%;
        }
        .banner-button {
          background: #f59e0b;
          color: white;
          padding: 0.875rem 2.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .banner-button:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
        }
        .banner-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 35%;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          opacity: 0.9;
        }
        .feature-icon {
          font-size: 1.5rem;
        }
        .categories-section {
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: #1a202c;
          position: relative;
        }
        .section-title:after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #f59e0b;
          margin: 0.5rem auto;
          border-radius: 2px;
        }
        .categories-flex {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .category-btn {
          padding: 0.875rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 0.9375rem;
          min-width: 160px;
          text-align: center;
        }
        .category-btn.active {
          background: #1a365d;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 54, 93, 0.2);
          border-color: #1a365d;
        }
        .category-btn:not(.active) {
          background: white;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }
        .category-btn:not(.active):hover {
          background: #f7fafc;
          border-color: #cbd5e0;
          transform: translateY(-2px);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        /* Tablet: 2 items per row */
        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        /* Desktop: 4 items per row */
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .product-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #e2e8f0;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border-color: #cbd5e0;
        }
        .product-image-container {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f8fafc;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(255, 255, 255, 0.95);
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 2;
          backdrop-filter: blur(4px);
        }
        .status-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
        }
        .status-sold-out {
          background: rgba(239, 68, 68, 0.95);
        }
        .status-discount {
          background: rgba(234, 88, 12, 0.95);
        }
        .product-details {
          padding: 1.25rem;
        }
        .product-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.625rem;
        }
        .price-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .sale-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
        }
        .original-price {
          font-size: 0.9375rem;
          color: #718096;
          text-decoration: line-through;
        }
        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9375rem;
          position: relative;
          overflow: hidden;
        }
        .add-to-cart-btn:not(:disabled) {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }
        .add-to-cart-btn:not(:disabled):hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }
        .add-to-cart-btn:disabled {
          background: #e2e8f0;
          color: #a0aec0;
          cursor: not-allowed;
        }
        .view-more-container {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }
        .view-more-btn {
          padding: 1rem 3rem;
          border: 2px solid #1a365d;
          border-radius: 9999px;
          font-weight: 600;
          color: #1a365d;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .view-more-btn:hover {
          background: #1a365d;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(26, 54, 93, 0.2);
        }
        .no-products {
          text-align: center;
          padding: 3rem;
          color: #718096;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .banner-container {
            height: 300px;
          }
          .banner-overlay {
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem;
            text-align: center;
          }
          .banner-content {
            max-width: 100%;
            margin-bottom: 1.5rem;
          }
          .banner-features {
            display: none;
          }
          .banner-subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
            max-width: 100%;
          }
          .banner-button {
            padding: 0.75rem 2rem;
            font-size: 0.9375rem;
            width: 100%;
            max-width: 250px;
          }
          .categories-flex {
            gap: 0.5rem;
          }
          .category-btn {
            min-width: 120px;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
          }
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .product-grid-container {
            padding: 1rem 0;
          }
        }
        @media (max-width: 640px) {
          .banner-container {
            height: 280px;
          }
          .banner-subtitle {
            font-size: 0.9375rem;
          }
          .banner-button {
            padding: 0.75rem 1.5rem;
          }
          .categories-flex {
            flex-direction: column;
            align-items: center;
          }
          .category-btn {
            width: 100%;
            max-width: 280px;
          }
          .products-grid {
            gap: 1rem;
          }
        }
        @media (max-width: 480px) {
          .banner-container {
            height: 250px;
          }
          .banner-overlay {
            padding: 1rem;
          }
          .banner-subtitle {
            font-size: 0.875rem;
            margin-bottom: 1.25rem;
          }
          .banner-button {
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
          }
          .section-title {
            font-size: 1.25rem;
          }
          .product-details {
            padding: 1rem;
          }
          .add-to-cart-btn {
            padding: 0.625rem;
            font-size: 0.875rem;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .banner-container {
            height: 350px;
          }
          .banner-overlay {
            padding: 2rem;
          }
          .banner-content {
            max-width: 55%;
          }
          .banner-features {
            max-width: 40%;
          }
          .banner-subtitle {
            font-size: 1.125rem;
          }
        }
      `}</style>
      <div className="product-grid-container">
        <div className="container">
          {/* Banner Section */}
          <div className="banner-section">
            <div className="banner-container">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Home Essentials Banner"
                className="banner-image"
              />
              <div className="banner-overlay">
                <div className="banner-content">
                  <p className="banner-subtitle">
                    Transform your Kitchen with our curated collection of quality products that combine style,
                    durability, and functionality.
                  </p>
                  <button className="banner-button" onClick={handleShopNowClick}>
                    Shop Now
                  </button>
                </div>
                <div className="banner-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Premium Quality</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Free Shipping</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="categories-section">
            <h2 className="section-title">Explore Our Collections</h2>
            <div className="categories-flex">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-btn ${category === selectedCategory ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="products-section">
            <h2 className="section-title">
              {selectedCategory === "All Products" ? "Featured Products" : selectedCategory}
            </h2>
            {categoryProducts.length > 0 ? (
              <div className="products-grid">
                {categoryProducts.map((product) => {
                  const discount = calculateDiscount(product.price, product.salePrice);
                  const badge = getProductBadge(product);
                  const isSoldOut = product.stock === 0;
                  return (
                    <div
                      key={product._id}
                      className="product-card"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <div className="product-image-container">
                        <img
                          src={
                            product.images[0]?.url ||
                            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=400&fit=crop"
                          }
                          alt={product.title}
                          className="product-image"
                        />
                        <div className="product-badge">{badge}</div>
                        {isSoldOut ? (
                          <div className="status-badge status-sold-out">Sold Out</div>
                        ) : discount ? (
                          <div className="status-badge status-discount">{discount}</div>
                        ) : null}
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{product.title}</h3>
                        <div className="price-container">
                          <span className="sale-price">₹ {formatPrice(product.salePrice || product.price)}</span>
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="original-price">₹ {formatPrice(product.price)}</span>
                          )}
                        </div>
                        {isSoldOut ? (
                          <button disabled className="add-to-cart-btn">
                            Sold Out
                          </button>
                        ) : (
                          <button className="add-to-cart-btn">Add to Cart</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>

          {/* View More Button */}
          <div className="view-more-container">
            <Link href="/all-products" className="view-more-btn">
              View All Products →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}