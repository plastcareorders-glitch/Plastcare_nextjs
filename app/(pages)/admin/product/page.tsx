"use client";

import React, { useState, useEffect } from "react";
import {
  MdKeyboardArrowDown,
  MdCameraAlt,
  MdMoreVert,
  MdClose,
  MdStar,
  MdStarBorder,
  MdEdit,
  MdDelete,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==================== TYPES ====================
interface ProductImage {
  url: string;
}

interface ProductVariant {
  name: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: string;
  brand: string;
  stock: number;
  sku: string;
  variants: ProductVariant[];
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  tags: string[];
  images: ProductImage[];
  dateCreated: string;
  hasDiscount: boolean;
}

// ==================== STATIC MOCK PRODUCTS ====================
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Premium Non-Stick Fry Pan",
    description: "High-quality non-stick fry pan for perfect cooking every day.",
    price: 2499,
    salePrice: 1999,
    category: "Cookware",
    brand: "Prestige",
    stock: 25,
    sku: "COOK-001",
    variants: [{ name: "Color", value: "Black" }],
    rating: 4.5,
    totalReviews: 128,
    isFeatured: true,
    tags: ["non-stick", "best-seller"],
    images: [{ url: "https://images.unsplash.com/photo-1584990347449-3b2a37a7f0e1?w=200&h=200&fit=crop" }],
    dateCreated: "2025-01-15",
    hasDiscount: true,
  },
  {
    id: "2",
    title: "Stainless Steel Saucepan Set - 3 Pcs",
    description: "Durable stainless steel saucepan set for all your cooking needs.",
    price: 4599,
    salePrice: 3999,
    category: "Cookware",
    brand: "Hawkins",
    stock: 15,
    sku: "COOK-002",
    variants: [],
    rating: 4.7,
    totalReviews: 89,
    isFeatured: false,
    tags: ["stainless steel", "set"],
    images: [{ url: "https://images.unsplash.com/photo-1584990347449-3b2a37a7f0e1?w=200&h=200&fit=crop" }],
    dateCreated: "2025-02-20",
    hasDiscount: true,
  },
  {
    id: "3",
    title: "Bamboo Drawer Organizer",
    description: "Eco-friendly bamboo organizer for your drawers.",
    price: 899,
    salePrice: 699,
    category: "Home Storage",
    brand: "SimpleHouseware",
    stock: 0,
    sku: "STOR-003",
    variants: [],
    rating: 4.3,
    totalReviews: 56,
    isFeatured: false,
    tags: ["bamboo", "organizer"],
    images: [{ url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop" }],
    dateCreated: "2025-03-10",
    hasDiscount: true,
  },
  {
    id: "4",
    title: "Ceramic Soap Dispenser",
    description: "Stylish ceramic soap dispenser for your bathroom.",
    price: 899,
    salePrice: null,
    category: "Bathroom Essentials",
    brand: "Cera",
    stock: 30,
    sku: "BATH-004",
    variants: [{ name: "Color", value: "White" }],
    rating: 4.6,
    totalReviews: 42,
    isFeatured: true,
    tags: ["ceramic", "bathroom"],
    images: [{ url: "https://images.unsplash.com/photo-1584622650111-993ef87606e4?w=200&h=200&fit=crop" }],
    dateCreated: "2025-04-05",
    hasDiscount: false,
  },
  {
    id: "5",
    title: "Modern Velvet Sofa - 3 Seater",
    description: "Luxurious velvet sofa to elevate your living room.",
    price: 49999,
    salePrice: 39999,
    category: "Home Furnishing",
    brand: "UrbanLadder",
    stock: 8,
    sku: "FURN-005",
    variants: [{ name: "Color", value: "Teal" }],
    rating: 4.8,
    totalReviews: 210,
    isFeatured: true,
    tags: ["sofa", "furniture"],
    images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop" }],
    dateCreated: "2025-05-12",
    hasDiscount: true,
  },
  {
    id: "6",
    title: "Electric Kettle - 1.5L",
    description: "Fast boiling electric kettle with auto shut-off.",
    price: 2499,
    salePrice: 1999,
    category: "Kitchen Essentials",
    brand: "Pigeon",
    stock: 12,
    sku: "KIT-006",
    variants: [{ name: "Color", value: "Silver" }],
    rating: 4.4,
    totalReviews: 77,
    isFeatured: false,
    tags: ["electric", "kettle"],
    images: [{ url: "https://images.unsplash.com/photo-1597662865519-1d6d7b2bb222?w=200&h=200&fit=crop" }],
    dateCreated: "2025-06-18",
    hasDiscount: true,
  },
];

// ==================== HELPER FUNCTIONS ====================
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<MdStar key={i} className="star filled" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<MdStar key={i} className="star half" />);
    } else {
      stars.push(<MdStarBorder key={i} className="star" />);
    }
  }
  return stars;
};

// ==================== MAIN COMPONENT ====================
export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalType, setModalType] = useState<"images" | "details" | "edit" | "delete" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
    isFeatured: false,
    tags: "",
    variants: "",
  });

  // Simulate loading mock products
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const discountedProducts = products.filter((p) => p.hasDiscount).length;

  // Modal handlers
  const openImageModal = (product: Product) => {
    setSelectedProduct(product);
    setModalType("images");
  };

  const openDetailsModal = (product: Product) => {
    setSelectedProduct(product);
    setModalType("details");
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(product);
    setEditForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock.toString(),
      sku: product.sku || "",
      isFeatured: product.isFeatured || false,
      tags: JSON.stringify(product.tags || [], null, 2),
      variants: JSON.stringify(product.variants || [], null, 2),
    });
    setModalType("edit");
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setModalType("delete");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setEditingProduct(null);
    setModalType(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const payload = {
        ...editForm,
        price: parseFloat(editForm.price),
        salePrice: editForm.salePrice ? parseFloat(editForm.salePrice) : null,
        stock: parseInt(editForm.stock),
        tags: editForm.tags ? JSON.parse(editForm.tags) : [],
        variants: editForm.variants ? JSON.parse(editForm.variants) : [],
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct?.id
            ? {
                ...p,
                ...payload,
                hasDiscount: !!(payload.salePrice && payload.salePrice < payload.price),
              }
            : p
        )
      );
      toast.success("Product updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Invalid JSON format.");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct?.id));
      toast.success("Product deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const toggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isFeatured: !currentStatus } : p))
      );
      toast.success(`Product ${!currentStatus ? "added to" : "removed from"} featured!`);
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Failed to update featured status");
    }
  };

  return (
    <div className="products-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        .products-container {
          padding: 16px;
          background: #f8f9fa;
          min-height: 100vh;
        }
       
        /* Header */
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-direction: column;
          gap: 12px;
        }
       
        @media (min-width: 768px) {
          .header-top {
            flex-direction: row;
            align-items: center;
            margin-bottom: 8px;
          }
        }
       
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
       
        @media (min-width: 768px) {
          .title {
            font-size: 32px;
          }
        }
       
        .categories-link {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .categories-link:hover {
          text-decoration: underline;
        }
       
        /* Stats Row */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
       
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }
       
        .stat-box {
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
       
        @media (min-width: 1024px) {
          .stat-box {
            text-align: left;
          }
        }
       
        .stat-total { color: #111827; }
        .stat-featured { color: #059669; }
        .stat-out-of-stock { color: #dc2626; }
        .stat-discounted { color: #2563eb; }
       
        /* Actions Row */
        .actions-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
       
        @media (min-width: 768px) {
          .actions-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
       
        .left-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
       
        .btn-primary {
          background: #111827;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transition: background 0.2s;
          text-decoration: none;
        }
        .btn-primary:hover {
          background: #1f2937;
        }
       
        .btn-secondary {
          background: #f9fafb;
          color: #111827;
          padding: 10px 16px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #f3f4f6;
        }
       
        .search-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
       
        @media (min-width: 640px) {
          .search-container {
            flex-wrap: nowrap;
          }
        }
       
        .search-input {
          flex: 1;
          min-width: 150px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
       
        @media (min-width: 768px) {
          .search-input {
            width: 240px;
            flex: none;
          }
        }
       
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
       
        .filters-btn {
          background: white;
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #374151;
          white-space: nowrap;
          transition: border-color 0.2s;
        }
        .filters-btn:hover {
          border-color: #9ca3af;
        }
       
        /* Table Container */
        .table-container {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
       
        .table-loading, .table-error, .table-empty {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
          text-align: center;
          flex: 1;
        }
       
        .table-loading {
          color: #374151;
          font-size: 16px;
        }
       
        .table-error {
          color: #dc2626;
          font-size: 16px;
        }
       
        .table-empty h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
        }
       
        .table-empty p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
       
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1200px;
        }
       
        th {
          background: #f9fafb;
          color: #374151;
          text-align: left;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          white-space: nowrap;
        }
       
        th:first-child {
          width: 40px;
        }
       
        .sort-icon {
          margin-left: 4px;
          font-size: 16px;
          color: #9ca3af;
          display: inline-flex;
          align-items: center;
        }
       
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
          vertical-align: middle;
        }
       
        tr:hover {
          background: #f9fafb;
        }
       
        tr:last-child td {
          border-bottom: none;
        }
       
        /* Checkbox */
        .checkbox {
          margin-right: 8px;
          width: 16px;
          height: 16px;
          accent-color: #3b82f6;
        }
       
        /* Price Styles */
        .price-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
       
        .current-price {
          font-weight: 600;
          color: #111827;
        }
       
        .original-price {
          text-decoration: line-through;
          color: #6b7280;
          font-size: 12px;
        }
       
        .discount-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          margin-left: 4px;
        }
       
        /* Stars Rating */
        .stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }
       
        .star {
          color: #d1d5db;
          font-size: 16px;
        }
       
        .star.filled {
          color: #fbbf24;
        }
       
        .star.half {
          color: #fbbf24;
        }
       
        .rating-text {
          margin-left: 4px;
          color: #6b7280;
          font-size: 12px;
        }
       
        /* Status Badge */
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }
        .status-in-stock {
          background: #dcfce7;
          color: #166534;
        }
        .status-low-stock {
          background: #fef3c7;
          color: #92400e;
        }
        .status-out-of-stock {
          background: #fecaca;
          color: #991b1b;
        }
       
        .featured-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .featured-badge:hover {
          background: #bfdbfe;
        }
       
        /* Tags Badges */
        .badge {
          background: #f3f4f6;
          color: #6b7280;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-right: 8px;
          margin-bottom: 4px;
          display: inline-block;
        }
        .badge-primary {
          background: #dbeafe;
          color: #1e40af;
        }
       
        /* Action Buttons */
        .action-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: background 0.2s, color 0.2s;
        }
        .action-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        .actions-cell {
          display: flex;
          gap: 4px;
        }
       
        /* Product Image */
        .product-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }
       
        /* Mobile Cards */
        .mobile-product-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          display: none;
        }
       
        .mobile-product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
       
        .mobile-product-title {
          font-weight: 600;
          color: #111827;
          margin: 0;
          font-size: 16px;
          flex: 1;
        }
       
        .mobile-product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          margin-left: 12px;
        }
       
        .mobile-product-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
       
        .mobile-hotel-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
       
        .mobile-hotel-value {
          color: #6b7280;
          font-size: 14px;
          text-align: right;
          max-width: 60%;
        }
       
        .mobile-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }
       
        .mobile-action-btn {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
       
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          position: relative;
          width: 800px;
        }
        .modal-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
        }
        .close-btn:hover {
          color: #374151;
        }
       
        /* Image Gallery */
        .image-gallery {
          padding: 20px 24px;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .gallery-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }
       
        /* Product Details */
        .product-details {
          padding: 20px 24px;
          max-width: 1000px;
        }
        .details-section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .detail-item {
          margin-bottom: 8px;
        }
        .detail-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        .detail-value {
          color: #6b7280;
          font-size: 14px;
        }
        .price-details {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .current-price-large {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }
        .original-price-large {
          font-size: 18px;
          text-decoration: line-through;
          color: #6b7280;
        }
        .discount-large {
          background: #dcfce7;
          color: #166534;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
        }
       
        /* Edit Form Styles */
        .edit-form {
          padding: 20px 24px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        .form-checkbox {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .btn-danger {
          background: #dc2626;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-danger:hover {
          background: #b91c1c;
        }
        .btn-success {
          background: #059669;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-success:hover {
          background: #047857;
        }
       
        /* Delete Confirmation Modal */
        .delete-confirmation {
          padding: 30px 24px;
          text-align: center;
        }
        .delete-icon {
          font-size: 48px;
          color: #dc2626;
          margin-bottom: 16px;
        }
        .delete-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        .delete-message {
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .delete-product-name {
          font-weight: 600;
          color: #dc2626;
        }
        .delete-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
       
        /* Mobile Responsive */
        @media (max-width: 767px) {
          .mobile-product-card {
            display: block;
          }
         
          .table-container table {
            display: none;
          }
         
          .products-container {
            padding: 12px;
          }
         
          .title {
            font-size: 20px;
          }
         
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
         
          .btn-primary, .btn-secondary {
            padding: 8px 12px;
            font-size: 13px;
          }
         
          .search-input {
            min-width: 120px;
          }
         
          .modal-content {
            max-width: 95vw;
            max-height: 95vh;
            width: 95vw;
            margin: 20px 10px;
          }
         
          .modal-header {
            padding: 16px 20px;
          }
         
          .product-details {
            padding: 16px 20px;
          }
         
          .image-gallery {
            padding: 16px 20px;
          }
         
          .edit-form {
            padding: 16px 20px;
          }
         
          .delete-confirmation {
            padding: 20px 16px;
          }
        }
       
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
         
          .left-actions {
            justify-content: center;
            width: 100%;
          }
         
          .btn-primary, .btn-secondary {
            flex: 1;
            justify-content: center;
          }
         
          .search-container {
            width: 100%;
          }
         
          .search-input {
            flex: 1;
            min-width: auto;
          }
         
          .form-grid {
            grid-template-columns: 1fr;
          }
         
          .delete-actions {
            flex-direction: column;
          }
        }
       
        /* Small mobile adjustments */
        @media (max-width: 360px) {
          .products-container {
            padding: 8px;
          }
         
          .mobile-product-card {
            padding: 12px;
          }
         
          .mobile-product-row {
            flex-direction: column;
            gap: 4px;
          }
         
          .mobile-hotel-value {
            text-align: left;
            max-width: 100%;
          }
         
          .mobile-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header-top">
        <h1 className="title">Products</h1>
        <a href="#" className="categories-link">
          Categories
          <MdKeyboardArrowDown size={16} />
        </a>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-box stat-total">{totalProducts} Total products</div>
        <div className="stat-box stat-featured">{featuredProducts} Featured</div>
        <div className="stat-box stat-out-of-stock">{outOfStockProducts} Out of stock</div>
        <div className="stat-box stat-discounted">{discountedProducts} On sale</div>
      </div>

      {/* Actions Row */}
      <div className="actions-row">
        <div className="left-actions">
          <button className="btn-secondary">Import products</button>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filters-btn">
            <FaFilter size={14} />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">Loading products...</div>
        ) : error ? (
          <div className="table-error">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="table-empty">
            <h3>No products found</h3>
            <p>{searchTerm ? "Try adjusting your search terms" : "Get started by creating your first product"}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Image</th>
                  <th>
                    Product Name
                    <MdKeyboardArrowDown className="sort-icon" size={16} />
                  </th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>SKU</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>
                      <input type="checkbox" className="checkbox" />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      {product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.title} className="product-image" />
                      ) : (
                        <div
                          className="product-image"
                          style={{
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#111827" }}>
                        {product.title}
                        {product.isFeatured && (
                          <span
                            className="featured-badge"
                            onClick={() => toggleFeatured(product.id, product.isFeatured)}
                            title="Click to remove from featured"
                          >
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <div className="price-container">
                        <span className="current-price">
                          {formatCurrency(product.salePrice || product.price)}
                          {product.hasDiscount && (
                            <span className="discount-badge">
                              Save {Math.round((1 - (product.salePrice! / product.price)) * 100)}%
                            </span>
                          )}
                        </span>
                        {product.hasDiscount && (
                          <span className="original-price">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{product.category}</span>
                    </td>
                    <td>{product.brand || "-"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.stock === 0
                            ? "status-out-of-stock"
                            : product.stock < 10
                            ? "status-low-stock"
                            : "status-in-stock"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : product.stock < 10
                          ? `Low (${product.stock})`
                          : `In stock (${product.stock})`}
                      </span>
                    </td>
                    <td>
                      <div className="stars">
                        {renderStars(product.rating)}
                        <span className="rating-text">({product.totalReviews})</span>
                      </div>
                    </td>
                    <td>
                      <code
                        style={{
                          fontSize: "12px",
                          background: "#f3f4f6",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {product.sku}
                      </code>
                    </td>
                    <td>{product.dateCreated}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn"
                          onClick={() => openImageModal(product)}
                          title="View Images"
                        >
                          <MdCameraAlt size={16} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => openEditModal(product)}
                          title="Edit Product"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => openDeleteModal(product)}
                          title="Delete Product"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            {filteredProducts.map((product) => (
              <div key={product.id} className="mobile-product-card">
                <div className="mobile-product-header">
                  <div>
                    <h3 className="mobile-product-title">{product.title}</h3>
                    {product.isFeatured && (
                      <span
                        className="featured-badge"
                        onClick={() => toggleFeatured(product.id, product.isFeatured)}
                        title="Click to remove from featured"
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  {product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.title} className="mobile-product-image" />
                  ) : (
                    <div
                      className="mobile-product-image"
                      style={{
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: "10px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Description</span>
                  <span
                    className="mobile-hotel-value"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "60%",
                    }}
                  >
                    {product.description}
                  </span>
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Price</span>
                  <span className="mobile-hotel-value">
                    <div className="price-container">
                      <span className="current-price">
                        {formatCurrency(product.salePrice || product.price)}
                        {product.hasDiscount && (
                          <span className="discount-badge">
                            Save {Math.round((1 - (product.salePrice! / product.price)) * 100)}%
                          </span>
                        )}
                      </span>
                    </div>
                  </span>
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Category</span>
                  <span className="mobile-hotel-value">
                    <span className="badge">{product.category}</span>
                  </span>
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Brand</span>
                  <span className="mobile-hotel-value">{product.brand || "-"}</span>
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Stock</span>
                  <span
                    className={`status-badge ${
                      product.stock === 0
                        ? "status-out-of-stock"
                        : product.stock < 10
                        ? "status-low-stock"
                        : "status-in-stock"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : product.stock < 10
                      ? `Low (${product.stock})`
                      : `In stock (${product.stock})`}
                  </span>
                </div>

                <div className="mobile-product-row">
                  <span className="mobile-hotel-label">Rating</span>
                  <span className="mobile-hotel-value">
                    <div className="stars">
                      {renderStars(product.rating)}
                      <span className="rating-text">({product.totalReviews})</span>
                    </div>
                  </span>
                </div>

                <div className="mobile-actions">
                  <button className="mobile-action-btn" onClick={() => openImageModal(product)}>
                    <MdCameraAlt size={16} />
                    Images
                  </button>
                  <button className="mobile-action-btn" onClick={() => openEditModal(product)}>
                    <MdEdit size={16} />
                    Edit
                  </button>
                  <button className="mobile-action-btn" onClick={() => openDeleteModal(product)}>
                    <MdDelete size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Image Gallery Modal */}
      {modalType === "images" && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedProduct.title} - Images</h2>
              <button className="close-btn" onClick={closeModal}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="image-gallery">
              {selectedProduct.images.length > 0 ? (
                <div className="gallery-grid">
                  {selectedProduct.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image.url}
                      alt={`${selectedProduct.title} ${idx + 1}`}
                      className="gallery-image"
                    />
                  ))}
                </div>
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {modalType === "details" && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedProduct.title} - Details</h2>
              <button className="close-btn" onClick={closeModal}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="product-details">
              <div className="details-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Description</div>
                    <div className="detail-value">{selectedProduct.description}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Category</div>
                    <div className="detail-value">
                      <span className="badge">{selectedProduct.category}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Brand</div>
                    <div className="detail-value">{selectedProduct.brand || "Not specified"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">SKU</div>
                    <div className="detail-value">
                      <code style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                        {selectedProduct.sku}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3 className="section-title">Pricing</h3>
                <div className="price-details">
                  <div className="current-price-large">
                    {formatCurrency(selectedProduct.salePrice || selectedProduct.price)}
                  </div>
                  {selectedProduct.hasDiscount && (
                    <>
                      <div className="original-price-large">
                        {formatCurrency(selectedProduct.price)}
                      </div>
                      <div className="discount-large">
                        Save {Math.round((1 - (selectedProduct.salePrice! / selectedProduct.price)) * 100)}%
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="details-section">
                <h3 className="section-title">Inventory</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Stock Quantity</div>
                    <div className="detail-value">
                      <span
                        className={`status-badge ${
                          selectedProduct.stock === 0
                            ? "status-out-of-stock"
                            : selectedProduct.stock < 10
                            ? "status-low-stock"
                            : "status-in-stock"
                        }`}
                      >
                        {selectedProduct.stock} units
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Status</div>
                    <div className="detail-value">
                      {selectedProduct.isFeatured ? (
                        <span className="featured-badge">Featured Product</span>
                      ) : (
                        "Standard"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3 className="section-title">Rating & Reviews</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Rating</div>
                    <div className="detail-value">
                      <div className="stars">
                        {renderStars(selectedProduct.rating)}
                        <span style={{ marginLeft: "8px" }}>
                          {selectedProduct.rating}/5 ({selectedProduct.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct.variants.length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">Product Variants</h3>
                  <div>
                    {selectedProduct.variants.map((variant, idx) => (
                      <div key={idx} className="badge" style={{ marginRight: "8px", marginBottom: "8px" }}>
                        <strong>{variant.name}:</strong> {variant.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.tags.length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">Tags</h3>
                  <div>
                    {selectedProduct.tags.map((tag, idx) => (
                      <span key={idx} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {modalType === "edit" && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Product: {selectedProduct.title}</h2>
              <button className="close-btn" onClick={closeModal}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter product title"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    <option value="Cookware">Cookware</option>
                    <option value="Home Storage">Home Storage</option>
                    <option value="Kitchen Essentials">Kitchen Essentials</option>
                    <option value="Bathroom Essentials">Bathroom Essentials</option>
                    <option value="Home Furnishing">Home Furnishing</option>
                    <option value="Wooden Furniture">Wooden Furniture</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sale Price (₹) - Optional</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={editForm.salePrice}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter sale price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={editForm.brand}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={editForm.sku}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="form-input form-textarea"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Tags (JSON array)</label>
                  <textarea
                    name="tags"
                    value={editForm.tags}
                    onChange={handleEditChange}
                    className="form-input form-textarea"
                    placeholder='["tag1", "tag2", "tag3"]'
                    rows={3}
                  />
                  <small style={{ color: "#6b7280", fontSize: "12px" }}>
                    Enter tags as a JSON array of strings
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Variants (JSON array)</label>
                  <textarea
                    name="variants"
                    value={editForm.variants}
                    onChange={handleEditChange}
                    className="form-input form-textarea"
                    placeholder='[{"name": "color", "value": "red"}, {"name": "size", "value": "large"}]'
                    rows={3}
                  />
                  <small style={{ color: "#6b7280", fontSize: "12px" }}>
                    Enter variants as a JSON array of objects with name and value properties
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={editForm.isFeatured}
                    onChange={handleEditChange}
                    className="form-checkbox"
                  />
                  Mark as Featured Product
                </label>
              </div>

              <div className="form-actions">
                <button className="btn-danger" onClick={closeModal}>
                  <MdCancel size={18} /> Cancel
                </button>
                <button className="btn-success" onClick={handleUpdateProduct}>
                  <MdSave size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === "delete" && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Product</h2>
              <button className="close-btn" onClick={closeModal}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="delete-confirmation">
              <MdDelete className="delete-icon" />
              <h3 className="delete-title">Confirm Deletion</h3>
              <p className="delete-message">
                Are you sure you want to delete <span className="delete-product-name">{selectedProduct.title}</span>?
                This action cannot be undone and all product data including images will be permanently removed.
              </p>
              <div className="delete-actions">
                <button className="btn-secondary" onClick={closeModal} style={{ padding: "10px 20px" }}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDeleteProduct} style={{ padding: "10px 20px" }}>
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}