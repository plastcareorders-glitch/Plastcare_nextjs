"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/app/context/ProductContext"; // adjust path as needed

// ==================== TYPES ====================
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
  colors: string[];
  materials: string[];
  tags: string[];
  stock: number;
}

// ==================== HELPER FUNCTIONS ====================
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-IN");
};

// Get a random badge (since real data may not have isFeatured)
const getRandomBadge = (product: any): string => {
  if (product.isFeatured) return "Must Have😍";
  if (product.rating && product.rating >= 4.5) return "Best Seller🥇";
  if (product.tags?.includes("new")) return "New Launch🔥";
  return "";
};

const getDiscount = (original: number, sale?: number | null): string => {
  if (!sale || sale >= original) return "";
  return `${Math.round(((original - sale) / original) * 100)}% OFF`;
};

const getNewBadge = (product: any): string => {
  if (product.isFeatured) return "Featured";
  if (product.tags?.includes("new")) return "New Launch 🔥";
  return "";
};

// Extract colors from product (fallback: if no variants, use "Default")
const extractColors = (product: any): string[] => {
  if (product.variants && product.variants.length > 0) {
    const colorVariant = product.variants.find(
      (v: any) => v.name?.toLowerCase().includes("color")
    );
    if (colorVariant && colorVariant.value) {
      return [colorVariant.value];
    }
  }
  // If no color info, return empty array (won't appear in color filter)
  return [];
};

// Extract materials
const extractMaterials = (product: any): string[] => {
  if (product.variants && product.variants.length > 0) {
    const materialVariant = product.variants.find(
      (v: any) => v.name?.toLowerCase().includes("material")
    );
    if (materialVariant && materialVariant.value) {
      return [materialVariant.value];
    }
  }
  // Try to use brand as material? Not ideal, but fallback.
  return [];
};

// ==================== LOADING SKELETON ====================
const LoadingSkeleton = () => (
  <div className="all-products-section">
    <div className="section-header">
      <h1>All Products Collection</h1>
      <p>Discover our complete range of products across all categories...</p>
    </div>
    <div className="products-container">
      <div className="filters-sidebar" style={{ background: "#f1f5f9", minHeight: "400px" }}></div>
      <div className="products-main">
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card" style={{ background: "#e2e8f0", height: "280px", animation: "pulse 1.5s infinite" }}></div>
          ))}
        </div>
      </div>
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.3; }
      }
    `}</style>
  </div>
);

// ==================== MAIN COMPONENT ====================
export default function AllProducts() {
  const router = useRouter();
  const { products, loading: contextLoading, error: contextError } = useProducts();
  const [mappedProducts, setMappedProducts] = useState<MappedProduct[]>([]);
  const [showInStock, setShowInStock] = useState(true);
  const [currentMaxPrice, setCurrentMaxPrice] = useState(2000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Map real products to our format when they arrive
  useEffect(() => {
    if (contextLoading) return;
    if (contextError) {
      setLoading(false);
      return;
    }
    if (!products || products.length === 0) {
      setMappedProducts([]);
      setLoading(false);
      return;
    }

    const mapped: MappedProduct[] = products.map((product) => {
      const originalPrice = product.price;
      const salePrice = product.salePrice ?? product.price;
      const inStock = product.stock > 0;
      const discount = getDiscount(originalPrice, product.salePrice);
      const badge = getRandomBadge(product);
      const newBadge = getNewBadge(product);

      return {
        id: product._id,
        name: product.title,
        originalPrice,
        salePrice,
        image: product.images?.[0]?.url || "https://via.placeholder.com/500x400?text=No+Image",
        badge,
        discount,
        newBadge,
        rating: product.rating || 0,
        reviews: product.totalReviews || 0,
        freeShipping: true, // or derive from product if you have a field
        inStock,
        category: product.category || "Uncategorized",
        brand: product.brand || "Generic",
        colors: extractColors(product),
        materials: extractMaterials(product),
        tags: product.tags || [],
        stock: product.stock,
      };
    });

    setMappedProducts(mapped);
    // Set max price slider to the highest sale price
    const maxPrice = Math.max(...mapped.map((p) => p.salePrice), 2000);
    setCurrentMaxPrice(maxPrice);
    setLoading(false);
  }, [products, contextLoading, contextError]);

  // Extract unique categories
  const categories = mappedProducts.reduce((acc, product) => {
    const existing = acc.find((c) => c.name === product.category);
    if (existing) existing.count++;
    else acc.push({ name: product.category, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  // Extract unique brands
  const brands = mappedProducts.reduce((acc, product) => {
    const existing = acc.find((b) => b.name === product.brand);
    if (existing) existing.count++;
    else acc.push({ name: product.brand, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  // Extract colors (only those that appear)
  const colors = mappedProducts.reduce((acc, product) => {
    product.colors.forEach((color) => {
      if (!color || color === "Default") return;
      const existing = acc.find((c) => c.name === color);
      if (existing) existing.count++;
      else acc.push({ name: color, count: 1 });
    });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  // Extract materials
  const materials = mappedProducts.reduce((acc, product) => {
    product.materials.forEach((material) => {
      if (!material || material === "Default") return;
      const existing = acc.find((m) => m.name === material);
      if (existing) existing.count++;
      else acc.push({ name: material, count: 1 });
    });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  const actualMaxPrice = Math.max(...mappedProducts.map((p) => p.salePrice), 2000);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleMaterial = (materialName: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialName) ? prev.filter((m) => m !== materialName) : [...prev, materialName]
    );
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
    );
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const filteredProducts = mappedProducts.filter((product) => {
    const priceMatch = product.salePrice <= currentMaxPrice;
    const stockMatch = !showInStock || product.inStock;
    const colorMatch =
      selectedColors.length === 0 ||
      product.colors.some((color) => selectedColors.includes(color));
    const materialMatch =
      selectedMaterials.length === 0 ||
      product.materials.some((material) => selectedMaterials.includes(material));
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return priceMatch && stockMatch && colorMatch && materialMatch && categoryMatch && brandMatch;
  });

  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return [...Array(5)].map((_, i) => {
      if (i < fullStars) return <span key={i} className="star filled">★</span>;
      if (i === fullStars && hasHalf) return <span key={i} className="star half">½</span>;
      return <span key={i} className="star">☆</span>;
    });
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading || contextLoading) {
    return <LoadingSkeleton />;
  }

  if (contextError) {
    return (
      <div className="all-products-section">
        <div className="section-header">
          <h1>All Products Collection</h1>
          <p>Error loading products: {contextError}</p>
        </div>
      </div>
    );
  }

  if (mappedProducts.length === 0) {
    return (
      <div className="all-products-section">
        <div className="section-header">
          <h1>All Products Collection</h1>
          <p>No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .all-products-section {
          background: #f8fafc;
          padding: 2rem 0;
          min-height: 100vh;
        }
        .section-header {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          padding: 1.5rem;
          color: white;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .section-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        .section-header p {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
        }
        .products-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .products-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        .filters-sidebar {
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 2rem;
          border: 1px solid #e2e8f0;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }
        .filter-group {
          margin-bottom: 1.5rem;
        }
        .filter-group:last-child {
          margin-bottom: 0;
        }
        .filter-group-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-group-title::before {
          content: "•";
          color: #8b5cf6;
          font-size: 1.1rem;
        }
        .availability-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: 0.4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        input:checked + .slider {
          background-color: #10b981;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .price-highest {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        .price-slider {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .filter-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          font-size: 0.8rem;
        }
        .filter-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .filter-item.selected {
          background: #f5f3ff;
          border-color: #8b5cf6;
          color: #5b21b6;
        }
        .filter-name {
          font-weight: 500;
        }
        .filter-count {
          font-size: 0.7rem;
          background: #f1f5f9;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          color: #64748b;
        }
        .filter-item.selected .filter-count {
          background: #ede9fe;
          color: #5b21b6;
        }
        .products-main {
          display: flex;
          flex-direction: column;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
          }
        }
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 0.75rem;
          }
        }
        .product-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          border: 1px solid #f1f5f9;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          border-color: #e2e8f0;
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          overflow: hidden;
          flex-shrink: 0;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease-in-out;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .badge-container {
          position: absolute;
          top: 0.375rem;
          left: 0.375rem;
          right: 0.375rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          z-index: 2;
        }
        .product-badge {
          background: #ea580c;
          color: white;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.65rem;
          font-weight: 600;
          line-height: 1;
        }
        .product-badge.best-seller {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #000;
        }
        .product-badge.new {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }
        .product-badge.featured {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }
        .discount-badge {
          position: absolute;
          top: 0.375rem;
          right: 0.375rem;
          background: #dcfce7;
          color: #166534;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.65rem;
          font-weight: 700;
          z-index: 2;
          border: 1px solid #bbf7d0;
        }
        .product-info {
          padding: 0.75rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .product-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.375rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.1rem;
        }
        .product-category {
          font-size: 0.7rem;
          color: #8b5cf6;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .rating-stars {
          display: flex;
          gap: 0.1rem;
        }
        .star {
          font-size: 0.7rem;
        }
        .star.filled {
          color: #f59e0b;
        }
        .star.half {
          color: #f59e0b;
          position: relative;
        }
        .star:not(.filled):not(.half) {
          color: #cbd5e1;
        }
        .rating-text {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }
        .price-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.375rem;
        }
        .current-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
        }
        .original-price {
          font-size: 0.75rem;
          color: #94a3b8;
          text-decoration: line-through;
        }
        .shipping-badge {
          background: #f0fdf4;
          color: #166534;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.65rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          border: 1px solid #dcfce7;
          width: fit-content;
        }
        .shipping-badge::before {
          content: "🚚";
          font-size: 0.55rem;
        }
        .action-btn {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-size: 0.8rem;
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          margin-top: auto;
        }
        .action-btn:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
        }
        .action-btn::before {
          content: "🛒";
          font-size: 0.8rem;
        }
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .no-products {
          text-align: center;
          padding: 2rem;
          color: #64748b;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .no-products h3 {
          color: #475569;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .no-products p {
          color: #94a3b8;
          font-size: 0.8rem;
        }
        .stock-status {
          position: absolute;
          top: 0.375rem;
          right: 0.375rem;
          background: #10b981;
          color: white;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.65rem;
          font-weight: 600;
          z-index: 2;
        }
        .stock-status.out-of-stock {
          background: #ef4444;
        }
        .results-count {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1rem;
          padding: 0 0.25rem;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .clear-filters {
          font-size: 0.8rem;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        .clear-filters:hover {
          color: #dc2626;
        }
      `}</style>

      <div className="all-products-section">
        <div className="section-header">
          <h1>All Products Collection</h1>
          <p>
            Discover our complete range of products across all categories. Find everything you need for your
            home, kitchen, bathroom, and more.
          </p>
        </div>

        <div className="products-container">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filter-header">
              <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>Filters</h4>
              {(selectedColors.length > 0 ||
                selectedMaterials.length > 0 ||
                selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                currentMaxPrice < actualMaxPrice) && (
                <button
                  className="clear-filters"
                  onClick={() => {
                    setSelectedColors([]);
                    setSelectedMaterials([]);
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setCurrentMaxPrice(actualMaxPrice);
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="filter-group">
              <h4 className="filter-group-title">Availability</h4>
              <div className="availability-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span style={{ fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}>In stock only</span>
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-group-title">Price Range</h4>
              <p className="price-highest">Up to ₹{currentMaxPrice.toLocaleString("en-IN")}</p>
              <input
                type="range"
                min="0"
                max={Math.max(2000, actualMaxPrice)}
                value={currentMaxPrice}
                onChange={(e) => setCurrentMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
            </div>

            {categories.length > 0 && (
              <div className="filter-group">
                <h4 className="filter-group-title">Categories ({categories.length})</h4>
                <div className="filter-list">
                  {categories.map((category, idx) => (
                    <div
                      key={idx}
                      className={`filter-item ${selectedCategories.includes(category.name) ? "selected" : ""}`}
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="filter-name">{category.name}</span>
                      <span className="filter-count">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brands.length > 0 && (
              <div className="filter-group">
                <h4 className="filter-group-title">Brands ({brands.length})</h4>
                <div className="filter-list">
                  {brands.map((brand, idx) => (
                    <div
                      key={idx}
                      className={`filter-item ${selectedBrands.includes(brand.name) ? "selected" : ""}`}
                      onClick={() => toggleBrand(brand.name)}
                    >
                      <span className="filter-name">{brand.name}</span>
                      <span className="filter-count">{brand.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="filter-group">
                <h4 className="filter-group-title">Colors ({colors.length})</h4>
                <div className="filter-list">
                  {colors.slice(0, 10).map((color, idx) => (
                    <div
                      key={idx}
                      className={`filter-item ${selectedColors.includes(color.name) ? "selected" : ""}`}
                      onClick={() => toggleColor(color.name)}
                    >
                      <span className="filter-name">{color.name}</span>
                      <span className="filter-count">{color.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {materials.length > 0 && (
              <div className="filter-group">
                <h4 className="filter-group-title">Materials ({materials.length})</h4>
                <div className="filter-list">
                  {materials.slice(0, 10).map((material, idx) => (
                    <div
                      key={idx}
                      className={`filter-item ${selectedMaterials.includes(material.name) ? "selected" : ""}`}
                      onClick={() => toggleMaterial(material.name)}
                    >
                      <span className="filter-name">{material.name}</span>
                      <span className="filter-count">{material.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Main */}
          <div className="products-main">
            <div className="results-count">
              Showing {filteredProducts.length} of {mappedProducts.length} products
              {selectedCategories.length > 0 && ` • ${selectedCategories.length} category filter(s) applied`}
              {selectedBrands.length > 0 && ` • ${selectedBrands.length} brand filter(s) applied`}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or check back later for new arrivals.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="badge-container">
                        {product.badge && (
                          <div
                            className={`product-badge ${product.badge.includes("Best Seller") ? "best-seller" : ""}`}
                          >
                            {product.badge}
                          </div>
                        )}
                        {product.newBadge && (
                          <div
                            className={`product-badge ${
                              product.newBadge.includes("New")
                                ? "new"
                                : product.newBadge.includes("Featured")
                                ? "featured"
                                : ""
                            }`}
                          >
                            {product.newBadge}
                          </div>
                        )}
                      </div>
                      {product.discount && <div className="discount-badge">{product.discount}</div>}
                      <div className={`stock-status ${!product.inStock ? "out-of-stock" : ""}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-rating">
                        <span className="rating-stars">{getStars(product.rating)}</span>
                        <span className="rating-text">
                          {product.rating.toFixed(1)} ({product.reviews})
                        </span>
                      </div>
                      <div className="price-row">
                        <span className="current-price">₹{formatPrice(product.salePrice)}</span>
                        {product.originalPrice > product.salePrice && (
                          <span className="original-price">₹{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.5rem" }}>
                        Brand: {product.brand}
                      </div>
                      {product.freeShipping && <div className="shipping-badge">Free Shipping</div>}
                      <button className="action-btn" disabled={!product.inStock}>
                        {product.inStock ? "View Product" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}