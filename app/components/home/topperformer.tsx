"use client";

import React, { useState, useEffect } from "react";
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

interface FormattedProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  badge: string;
  discount: string | null;
  soldOut: boolean;
}

// ==================== HELPER FUNCTIONS ====================
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getRandomBadge = (): string => {
  const badges = ["Best Seller🏆", "New Launch🔥", "Must Have😍", "Popular Choice⭐", "Limited Stock⚡"];
  return badges[Math.floor(Math.random() * badges.length)];
};

const formatProduct = (product: Product): FormattedProduct => {
  const originalPrice = product.price;
  const salePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice !== null && product.salePrice < product.price;
  const discount = hasDiscount ? `${Math.round((1 - product.salePrice! / product.price) * 100)}% OFF` : null;
  const soldOut = product.stock <= 0;

  return {
    id: product._id,
    name: product.title,
    originalPrice,
    salePrice,
    image: product.images && product.images.length > 0 ? product.images[0].url : "https://via.placeholder.com/500x400?text=No+Image",
    badge: getRandomBadge(),
    discount,
    soldOut,
  };
};

// ==================== PRODUCT SECTION COMPONENT ====================
interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: FormattedProduct[];
  highlight: string;
  background?: string;
  onProductClick: (productId: string) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  highlight,
  background = "#fef8f3",
  onProductClick,
}) => (
  <div className="product-section" style={{ background }}>
    <div className="product-section-container">
      <div className="section-header">
        <div className="header-text">
          <h2 className="section-title">
            {title} <span className="highlight">{highlight}</span>
          </h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        <Link href="/all-products" className="view-more-link">
          View More ›
        </Link>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" onClick={() => onProductClick(product.id)}>
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-badge">{product.badge}</div>
              {product.soldOut ? (
                <div className="sold-out-overlay">Sold out</div>
              ) : product.discount ? (
                <div className="discount-badge">{product.discount}</div>
              ) : null}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="price-row">
                <span className="current-price">₹ {formatPrice(product.salePrice)}</span>
                {product.salePrice < product.originalPrice && (
                  <span className="original-price">₹ {formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.soldOut ? (
                <button className="action-btn sold-out">Sold out</button>
              ) : (
                <button className="action-btn add-to-cart">Add to cart</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================
export default function HomePage() {
  const router = useRouter();
  const { products, loading, error } = useProducts();
  const [randomProducts, setRandomProducts] = useState<FormattedProduct[]>([]);
  const [kitchenProducts, setKitchenProducts] = useState<FormattedProduct[]>([]);

  // Process real products when they are loaded
  useEffect(() => {
    if (!products || products.length === 0) return;

    // 1. Random 5 products from all
    const shuffledAll = [...products].sort(() => Math.random() - 0.5);
    const randomItems = shuffledAll.slice(0, 5);
    const formattedRandom = randomItems.map(formatProduct);

    // 2. Kitchen Essentials products (or fallback to any category if none)
    let kitchenItems = products.filter((item) => item.category === "Kitchen Essentials");
    if (kitchenItems.length === 0) {
      // Fallback: if no "Kitchen Essentials", take first category found
      const categories = [...new Set(products.map(p => p.category))];
      if (categories.length > 0) {
        kitchenItems = products.filter((item) => item.category === categories[0]);
      } else {
        kitchenItems = [];
      }
    }
    // Take up to 5 products
    kitchenItems = kitchenItems.slice(0, 5);
    const formattedKitchen = kitchenItems.map(formatProduct);

    setRandomProducts(formattedRandom);
    setKitchenProducts(formattedKitchen);
  }, [products]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 1rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #ea580c;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>⚠️ Unable to load products: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
        <style>{`
          .error-container {
            text-align: center;
            padding: 3rem;
            color: #dc2626;
          }
        `}</style>
      </div>
    );
  }

  // If no products at all
  if (products.length === 0) {
    return (
      <div className="empty-container">
        <p>No products found.</p>
        <style>{`
          .empty-container {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .product-section {
          padding: 3rem 0;
        }
        .product-section:nth-child(even) {
          background: #f8fafc !important;
        }
        .product-section-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .header-text {
          flex: 1;
        }
        .section-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }
        .section-title .highlight {
          color: #ea580c;
        }
        .section-subtitle {
          font-size: 1rem;
          color: #6b7280;
          margin: 0;
        }
        .view-more-link {
          background: transparent;
          border: none;
          color: #1f2937;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.95rem;
          text-decoration: underline;
          padding: 0.5rem 0;
          transition: color 0.2s ease-in-out;
        }
        .view-more-link:hover {
          color: #ea580c;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .section-header {
            flex-direction: column;
          }
          .section-title {
            font-size: 1.5rem;
          }
        }
        .product-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          position: relative;
        }
        .product-card:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f9fafb;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease-in-out;
        }
        .product-card:hover .product-image {
          transform: scale(1.08);
        }
        .product-badge {
          position: absolute;
          top: 0.625rem;
          left: 0.625rem;
          background: white;
          color: #1f2937;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-weight: 600;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          z-index: 2;
        }
        .sold-out-overlay {
          position: absolute;
          bottom: 0.625rem;
          left: 0.625rem;
          background: #6b7280;
          color: white;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
        }
        .discount-badge {
          position: absolute;
          bottom: 0.625rem;
          left: 0.625rem;
          background: #ea580c;
          color: white;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
        }
        .product-info {
          padding: 1rem;
        }
        .product-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.625rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.4em;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .current-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }
        .original-price {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .action-btn {
          width: 100%;
          padding: 0.625rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          font-size: 0.875rem;
        }
        .action-btn.sold-out {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .action-btn.add-to-cart {
          background: #fed7aa;
          color: #7c2d12;
        }
        .action-btn.add-to-cart:hover {
          background: #fdba74;
        }
      `}</style>

      <div className="home-page">
        <ProductSection
          title="Fresh Picks:"
          subtitle="Discover 5 random products from our collection!"
          products={randomProducts}
          highlight="Random Selection"
          background="#fef8f3"
          onProductClick={handleProductClick}
        />

        <ProductSection
          title="Give New Look to Your"
          subtitle="Refresh your kitchen with our essential tools"
          products={kitchenProducts}
          highlight="Kitchen Essentials"
          background="#f8fafc"
          onProductClick={handleProductClick}
        />
      </div>
    </>
  );
}