"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, TrendingUp, ShoppingBag, Zap } from "lucide-react";

// ==================== TYPES ====================
interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: ProductImage[];
  category: string;
  isFeatured?: boolean;
  rating?: number;
}

// ==================== STATIC DEMO DATA ====================
const demoProducts: Product[] = [
  // Kitchen Essentials
  {
    _id: "1",
    title: "Premium Non-Stick Cookware Set - 5 Pieces",
    price: 7999,
    salePrice: 5999,
    stock: 20,
    images: [{ url: "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/becca-tapert-A_L2xNKgENg-unsplash_cmgvbg.jpg" }],
    category: "Kitchen Essentials",
    rating: 4.7,
    isFeatured: true,
  },
  {
    _id: "2",
    title: "Stainless Steel Pressure Cooker - 5L",
    price: 3499,
    salePrice: 2799,
    stock: 15,
    images: [{ url: "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/cooker-king-eVpzgSTL6nk-unsplash_t8nncp.jpg" }],
    category: "Cookware",
    rating: 4.5,
  },
  {
    _id: "3",
    title: "Glass Food Storage Containers (Set of 12)",
    price: 1899,
    salePrice: 1299,
    stock: 40,
    images: [{ url: "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481542/douglas-sheppard-CGZbE-Pa1S8-unsplash_f6eubv.jpg" }],
    category: "Home Storage",
    rating: 4.3,
  },
  {
    _id: "4",
    title: "Soft Microfiber Bath Towel Set - 4 Pcs",
    price: 2499,
    salePrice: 1999,
    stock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=400&fit=crop" }],
    category: "Bathroom Essentials",
    rating: 4.4,
  },
  {
    _id: "5",
    title: "Modern Velvet Sofa - 3 Seater",
    price: 49999,
    salePrice: 39999,
    stock: 5,
    images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop" }],
    category: "Home Furnishing",
    rating: 4.8,
  },
  {
    _id: "6",
    title: "Solid Wood Coffee Table",
    price: 12999,
    salePrice: 9999,
    stock: 8,
    images: [{ url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&h=400&fit=crop" }],
    category: "Wooden Furniture",
    rating: 4.6,
  },
  {
    _id: "7",
    title: "Kids Play Mat - Non-Toxic Foam",
    price: 3499,
    salePrice: 2799,
    stock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1596462502278-27bfdc4039ef?w=500&h=400&fit=crop" }],
    category: "Kids & Nursery",
    rating: 4.5,
  },
  {
    _id: "8",
    title: "Decorative Floor Lamp",
    price: 8999,
    salePrice: 6999,
    stock: 12,
    images: [{ url: "https://images.unsplash.com/photo-1507473885765-e6e057f578c8?w=500&h=400&fit=crop" }],
    category: "Living Room",
    rating: 4.7,
  },
  // Additional for variety
  {
    _id: "9",
    title: "Ceramic Dinner Set - 18 Pieces",
    price: 4599,
    salePrice: 3999,
    stock: 18,
    images: [{ url: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500&h=400&fit=crop" }],
    category: "Kitchen Essentials",
    rating: 4.9,
  },
  {
    _id: "10",
    title: "Bamboo Storage Baskets (Set of 3)",
    price: 1499,
    salePrice: 1199,
    stock: 22,
    images: [{ url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=400&fit=crop" }],
    category: "Home Storage",
    rating: 4.2,
  },
];

// ==================== HELPER FUNCTIONS ====================
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Category-specific colors (fallback)
const getCategoryColor = (categoryName: string): { bgColor: string; accentColor: string } => {
  const colorMap: Record<string, { bgColor: string; accentColor: string }> = {
    "Kitchen Essentials": { bgColor: "#FFE0B2", accentColor: "#FF9800" },
    Cookware: { bgColor: "#E8F5E9", accentColor: "#4CAF50" },
    "Home Storage": { bgColor: "#FFF9C4", accentColor: "#FFC107" },
    "Bathroom Essentials": { bgColor: "#E0F2F1", accentColor: "#009688" },
    "Home Furnishing": { bgColor: "#FCE4EC", accentColor: "#E91E63" },
    "Wooden Furniture": { bgColor: "#D7CCC8", accentColor: "#8D6E63" },
    "Kids & Nursery": { bgColor: "#F3E5F5", accentColor: "#9C27B0" },
    "Living Room": { bgColor: "#E3F2FD", accentColor: "#2196F3" },
    Default: { bgColor: "#f5f5f5", accentColor: "#d4825c" },
  };
  return colorMap[categoryName] || colorMap.Default;
};

// ==================== MAIN COMPONENT ====================
export default function EleganceHomeShop() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [displayProducts, setDisplayProducts] = useState<
    Array<{
      id: string;
      name: string;
      productData: Product;
      bgColor: string;
      accentColor: string;
    }>
  >([]);

  // Process static products to create category display (max 8 categories)
  useEffect(() => {
    if (demoProducts.length > 0) {
      const categoriesMap: Record<
        string,
        {
          id: string;
          name: string;
          productData: Product;
          bgColor: string;
          accentColor: string;
        }
      > = {};

      for (const product of demoProducts) {
        const category = product.category || "Uncategorized";
        if (!categoriesMap[category] && Object.keys(categoriesMap).length < 8) {
          categoriesMap[category] = {
            id: product._id,
            name: category,
            productData: product,
            bgColor: getCategoryColor(category).bgColor,
            accentColor: getCategoryColor(category).accentColor,
          };
        }
      }
      setDisplayProducts(Object.values(categoriesMap));
    }
  }, []);

  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    // Fallback images by category
    const fallbackImages: Record<string, string> = {
      "Kitchen Essentials":
        "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/becca-tapert-A_L2xNKgENg-unsplash_cmgvbg.jpg",
      Cookware:
        "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/cooker-king-eVpzgSTL6nk-unsplash_t8nncp.jpg",
      "Home Storage":
        "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481542/douglas-sheppard-CGZbE-Pa1S8-unsplash_f6eubv.jpg",
      Default:
        "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/phillip-goldsberry-fZuleEfeA1Q-unsplash_jcvhgm.jpg",
    };
    return fallbackImages[product.category] || fallbackImages.Default;
  };

  const getProductRating = (product: Product): string => {
    return product.rating?.toFixed(1) || (Math.random() * 0.5 + 4.0).toFixed(1);
  };

  const getDiscountPercent = (product: Product): number => {
    if (product.salePrice && product.price) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100);
    }
    return 0;
  };

  const getProductStats = () => {
    const totalProducts = demoProducts.length;
    const categoriesCount = new Set(demoProducts.map((p) => p.category)).size;
    const totalPrice = demoProducts.reduce((acc, p) => acc + (p.salePrice || p.price), 0);
    const avgPrice = Math.round(totalPrice / totalProducts);
    return { totalProducts, avgPrice, categoriesCount };
  };

  const stats = getProductStats();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product._id}`);
  };

  // Responsive grid columns
  const getGridColumns = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width <= 480) return "1fr";
      if (width <= 768) return "repeat(2, 1fr)";
      if (width <= 1200) return "repeat(3, 1fr)";
      return "repeat(4, 1fr)";
    }
    return "repeat(4, 1fr)";
  };

  const [gridColumns, setGridColumns] = useState(getGridColumns());

  useEffect(() => {
    const handleResize = () => setGridColumns(getGridColumns());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Styles (same as original but moved to inline styles object for brevity)
  const styles: Record<string, React.CSSProperties> = {
    eleganceSection: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      padding: "4rem 1rem",
      position: "relative",
      overflow: "hidden",
    },
    eleganceContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    backgroundDecoration: {
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(212,130,92,0.03) 0%, rgba(212,130,92,0.1) 100%)",
      zIndex: 1,
    },
    backgroundDecoration2: {
      position: "absolute",
      bottom: "-30%",
      left: "-10%",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(212,130,92,0.05) 0%, rgba(212,130,92,0.02) 100%)",
      zIndex: 1,
    },
    eleganceTitle: {
      fontSize: "2.5rem",
      fontWeight: 300,
      color: "#2c3e50",
      textAlign: "center",
      marginBottom: "4rem",
      letterSpacing: "1px",
      position: "relative",
    },
    titleUnderline: {
      width: "80px",
      height: "3px",
      background: "linear-gradient(90deg, #d4825c, #e8b8a8)",
      margin: "1rem auto",
      borderRadius: "2px",
    },
    highlight: {
      color: "#d4825c",
      fontWeight: 400,
      background: "linear-gradient(135deg, #d4825c, #e8b8a8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      margin: "2rem 0",
      flexWrap: "wrap",
    },
    statItem: {
      textAlign: "center",
      padding: "1rem",
      minWidth: "120px",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#d4825c",
      display: "block",
    },
    statLabel: {
      fontSize: "0.875rem",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    categoriesGrid: {
      display: "grid",
      gap: "2.5rem",
    },
    categoryCard: {
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      textAlign: "center",
      position: "relative",
      padding: "1.5rem",
      borderRadius: "20px",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.9)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
    },
    categoryCardHover: {
      transform: "translateY(-12px) scale(1.02)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 0.95)",
    },
    categoryImageWrapper: {
      position: "relative",
      width: "100%",
      marginBottom: "1.5rem",
    },
    categoryBgCircle: {
      position: "absolute",
      width: "100%",
      paddingBottom: "100%",
      borderRadius: "50%",
      opacity: 0.15,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 0,
      transition: "all 0.4s ease",
    },
    categoryBgCircleHover: {
      opacity: 0.25,
      transform: "translate(-50%, -50%) scale(1.1)",
    },
    categoryBgCircleSmall: {
      position: "absolute",
      width: "45%",
      paddingBottom: "45%",
      borderRadius: "50%",
      opacity: 0.2,
      bottom: "-8%",
      right: "8%",
      zIndex: 0,
      transition: "all 0.4s ease",
    },
    categoryBgCircleSmallHover: {
      opacity: 0.3,
      transform: "scale(1.2)",
    },
    categoryImageContainer: {
      position: "relative",
      width: "75%",
      margin: "0 auto",
      paddingBottom: "75%",
      borderRadius: "50%",
      overflow: "hidden",
      background: "white",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
      zIndex: 1,
      transition: "all 0.4s ease",
      border: "3px solid white",
    },
    categoryImageContainerHover: {
      boxShadow: "0 16px 32px rgba(0, 0, 0, 0.15)",
      transform: "scale(1.05)",
    },
    categoryImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.4s ease",
    },
    categoryImageHover: {
      transform: "scale(1.1)",
    },
    categoryDot: {
      position: "absolute",
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      border: "2px solid #d4825c",
      background: "white",
      zIndex: 2,
      transition: "all 0.3s ease",
    },
    dotTopLeft: { top: "12%", left: "18%" },
    dotTopRight: { top: "18%", right: "12%" },
    dotBottomLeft: { bottom: "18%", left: "12%" },
    dotBottomRight: { bottom: "12%", right: "18%" },
    categoryDotHover: {
      transform: "scale(1.3)",
      background: "#d4825c",
    },
    categoryName: {
      fontSize: "1.1rem",
      color: "#2c3e50",
      fontWeight: 500,
      marginTop: "1rem",
      transition: "all 0.3s ease",
      letterSpacing: "0.5px",
    },
    categoryNameHover: {
      color: "#d4825c",
      transform: "translateY(2px)",
    },
    productInfo: {
      marginTop: "1rem",
    },
    productTitle: {
      fontSize: "0.95rem",
      color: "#333",
      fontWeight: 600,
      marginBottom: "0.5rem",
      lineHeight: 1.3,
      height: "2.6em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
    },
    salePrice: {
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "#d4825c",
    },
    originalPrice: {
      fontSize: "0.9rem",
      color: "#999",
      textDecoration: "line-through",
    },
    discountBadge: {
      background: "#4CAF50",
      color: "white",
      fontSize: "0.75rem",
      padding: "2px 8px",
      borderRadius: "10px",
      fontWeight: 600,
    },
    ratingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.25rem",
      marginTop: "0.5rem",
    },
    starIcon: {
      color: "#FFC107",
      width: "14px",
      height: "14px",
    },
    ratingText: {
      fontSize: "0.875rem",
      color: "#666",
    },
    stockBadge: {
      display: "inline-block",
      fontSize: "0.75rem",
      padding: "2px 8px",
      borderRadius: "10px",
      marginTop: "0.5rem",
      fontWeight: 600,
    },
    inStock: {
      background: "#E8F5E9",
      color: "#2E7D32",
    },
    lowStock: {
      background: "#FFF3E0",
      color: "#EF6C00",
    },
    floatingElement: {
      position: "absolute",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "rgba(212, 130, 92, 0.1)",
      zIndex: 1,
    },
    exploreButton: {
      marginTop: "3rem",
      textAlign: "center",
    },
    button: {
      padding: "12px 32px",
      background: "linear-gradient(135deg, #d4825c, #e8b8a8)",
      color: "white",
      border: "none",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 20px rgba(212, 130, 92, 0.3)",
      letterSpacing: "0.5px",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 25px rgba(212, 130, 92, 0.4)",
    },
  };

  // Add keyframes animation for spinner (if needed, but we're not showing loading)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.eleganceSection}>
      <div style={styles.backgroundDecoration} />
      <div style={styles.backgroundDecoration2} />

      {/* Floating decorative elements */}
      <div style={{ ...styles.floatingElement, top: "15%", left: "5%", width: "15px", height: "15px" }} />
      <div style={{ ...styles.floatingElement, top: "25%", right: "8%", width: "25px", height: "25px" }} />
      <div style={{ ...styles.floatingElement, bottom: "20%", left: "8%", width: "20px", height: "20px" }} />

      <div style={styles.eleganceContainer}>
        <h2 style={styles.eleganceTitle}>
          Discover Elegance For Your <span style={styles.highlight}>Home</span>
        </h2>
        <div style={styles.titleUnderline} />

        {/* Product Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalProducts}</span>
            <span style={styles.statLabel}>Products</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>₹{stats.avgPrice}</span>
            <span style={styles.statLabel}>Avg Price</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.categoriesCount}</span>
            <span style={styles.statLabel}>Categories</span>
          </div>
        </div>

        <div
          style={{
            ...styles.categoriesGrid,
            gridTemplateColumns: gridColumns,
          }}
        >
          {displayProducts.map((category) => {
            const product = category.productData;
            const discount = getDiscountPercent(product);
            const stockStatus = product.stock > 10 ? "inStock" : "lowStock";
            const stockText = product.stock > 10 ? "In Stock" : `Only ${product.stock} left`;

            return (
              <div
                key={category.id}
                style={{
                  ...styles.categoryCard,
                  ...(hoveredCard === category.id ? styles.categoryCardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleProductClick(product)}
              >
                <div style={styles.categoryImageWrapper}>
                  <div
                    style={{
                      ...styles.categoryBgCircle,
                      backgroundColor: category.bgColor,
                      ...(hoveredCard === category.id ? styles.categoryBgCircleHover : {}),
                    }}
                  />
                  <div
                    style={{
                      ...styles.categoryBgCircleSmall,
                      backgroundColor: category.bgColor,
                      ...(hoveredCard === category.id ? styles.categoryBgCircleSmallHover : {}),
                    }}
                  />

                  {/* Decorative dots */}
                  <div
                    style={{
                      ...styles.categoryDot,
                      ...styles.dotTopLeft,
                      ...(hoveredCard === category.id ? styles.categoryDotHover : {}),
                    }}
                  />
                  <div
                    style={{
                      ...styles.categoryDot,
                      ...styles.dotTopRight,
                      ...(hoveredCard === category.id ? styles.categoryDotHover : {}),
                    }}
                  />
                  <div
                    style={{
                      ...styles.categoryDot,
                      ...styles.dotBottomLeft,
                      ...(hoveredCard === category.id ? styles.categoryDotHover : {}),
                    }}
                  />
                  <div
                    style={{
                      ...styles.categoryDot,
                      ...styles.dotBottomRight,
                      ...(hoveredCard === category.id ? styles.categoryDotHover : {}),
                    }}
                  />

                  <div
                    style={{
                      ...styles.categoryImageContainer,
                      ...(hoveredCard === category.id ? styles.categoryImageContainerHover : {}),
                    }}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      style={{
                        ...styles.categoryImage,
                        ...(hoveredCard === category.id ? styles.categoryImageHover : {}),
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://res.cloudinary.com/dfzwhnmkf/image/upload/v1764481540/phillip-goldsberry-fZuleEfeA1Q-unsplash_jcvhgm.jpg";
                      }}
                    />
                  </div>
                </div>

                <h3
                  style={{
                    ...styles.categoryName,
                    ...(hoveredCard === category.id ? styles.categoryNameHover : {}),
                  }}
                >
                  {category.name}
                </h3>

                <div style={styles.productInfo}>
                  <div style={styles.productTitle}>
                    {product.title.length > 50 ? product.title.substring(0, 50) + "..." : product.title}
                  </div>

                  <div style={styles.priceContainer}>
                    <span style={styles.salePrice}>{formatPrice(product.salePrice || product.price)}</span>
                    {product.salePrice && product.price > product.salePrice && (
                      <>
                        <span style={styles.originalPrice}>₹{product.price}</span>
                        {discount > 0 && <span style={styles.discountBadge}>-{discount}%</span>}
                      </>
                    )}
                  </div>

                  <div style={styles.ratingContainer}>
                    <Star size={14} style={styles.starIcon} />
                    <span style={styles.ratingText}>{getProductRating(product)}</span>
                  </div>

                  <div style={{ ...styles.stockBadge, ...(stockStatus === "inStock" ? styles.inStock : styles.lowStock) }}>
                    {stockText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.exploreButton}>
          <button
            style={{
              ...styles.button,
              ...(hoveredCard === "button" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHoveredCard("button")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => router.push("/all-products")}
          >
            Explore All Products
          </button>
        </div>
      </div>
    </div>
  );
}