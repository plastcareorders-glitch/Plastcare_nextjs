"use client";

import React, { useState, useEffect } from "react";

// ==================== TYPES ====================
interface Variant {
  name: string;
  value: string;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  salePrice: string;
  category: string;
  brand: string;
  stock: number;
  sku: string;
  variants: Variant[];
  tags: string[];
  isFeatured: boolean;
}

interface Errors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  salePrice?: string;
  images?: string;
  brand?: string;
  sku?: string;
  variants?: string;
  tags?: string;
  isFeatured?: string;
}

// ==================== STATIC DATA ====================
const categories = [
  "Cookware",
  "Home Storage",
  "Kitchen Essentials",
  "Bathroom Essentials",
  "Home Furnishing",
  "Wooden Furniture",
  "Kids",
  "Sofa",
];

// ==================== MAIN COMPONENT ====================
export default function AddProduct() {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const initialFormData: FormData = {
    title: "",
    description: "",
    price: 0,
    salePrice: "",
    category: "",
    brand: "",
    stock: 0,
    sku: "",
    variants: [],
    tags: [],
    isFeatured: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [currentVariant, setCurrentVariant] = useState<Variant>({ name: "", value: "" });
  const [currentTag, setCurrentTag] = useState("");

  // Auto‑hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Validation functions
  const validateField = (name: keyof FormData, value: any): boolean => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Product title is required";
        } else if (value.trim().length < 2) {
          newErrors.title = "Title must be at least 2 characters";
        } else {
          delete newErrors.title;
        }
        break;
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case "price":
        if (!value || value <= 0) {
          newErrors.price = "Price must be greater than 0";
        } else {
          delete newErrors.price;
        }
        break;
      case "category":
        if (!value) {
          newErrors.category = "Category is required";
        } else {
          delete newErrors.category;
        }
        break;
      case "stock":
        if (value < 0) {
          newErrors.stock = "Stock cannot be negative";
        } else {
          delete newErrors.stock;
        }
        break;
      case "salePrice":
        if (value && parseFloat(value) >= formData.price) {
          newErrors.salePrice = "Sale price must be less than regular price";
        } else if (value && parseFloat(value) <= 0) {
          newErrors.salePrice = "Sale price must be greater than 0";
        } else {
          delete newErrors.salePrice;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price required";
    if (!formData.category) newErrors.category = "Category required";
    if (selectedImages.length === 0) newErrors.images = "At least one product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FormData, value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: any;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      val = value === "" ? "" : parseFloat(value) || 0;
    } else {
      val = value;
    }

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      validateField(name as keyof FormData, val);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setToastMessage("Only image files are allowed");
        setToastType("error");
        setShowToast(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setToastMessage(`File ${file.name} is too large. Max 5MB`);
        setToastType("error");
        setShowToast(true);
        return;
      }
      validFiles.push(file);
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    if (currentVariant.name && currentVariant.value) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...currentVariant }],
      }));
      setCurrentVariant({ name: "", value: "" });
    }
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : "PRO";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched
    const requiredFields = ["title", "description", "price", "category"];
    const touchedFields: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    if (!validateForm()) {
      setToastMessage("Please fix the validation errors before submitting");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create mock product object
    const mockProduct = {
      id: Date.now().toString(),
      ...formData,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      images: selectedImages.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      })),
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for demo (optional)
    const existingProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    existingProducts.push(mockProduct);
    localStorage.setItem("adminProducts", JSON.stringify(existingProducts));

    setToastMessage("Product added successfully!");
    setToastType("success");
    setShowToast(true);

    // Reset form
    setFormData(initialFormData);
    setSelectedImages([]);
    setErrors({});
    setTouched({});
    setCurrentVariant({ name: "", value: "" });
    setCurrentTag("");
    setIsSubmitting(false);
  };

  const getFieldError = (fieldName: keyof FormData) => {
    return touched[fieldName] ? errors[fieldName] : "";
  };

  return (
    <div className="container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f5f5f5;
          color: #1a1a1a;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
          background: #ffffff;
          min-height: 100vh;
        }
        
        .header {
          margin-bottom: 24px;
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 24px;
        }
        
        .tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 32px;
        }
        
        .tab {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #666666;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .tab:hover {
          color: #1a1a1a;
        }
        
        .tab.active {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
        }
        
        .form-content {
          max-width: 900px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .form-row.two-col {
          grid-template-columns: 1fr 1fr;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        
        .required::after {
          content: " *";
          color: #dc2626;
        }
        
        .input, select, textarea {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          outline: none;
          transition: all 0.2s ease;
        }
        
        textarea.input {
          height: auto;
          min-height: 100px;
          resize: vertical;
          padding: 12px;
        }
        
        .input::placeholder {
          color: #a3a3a3;
        }
        
        .input:hover, select:hover {
          border-color: #a3a3a3;
        }
        
        .input:focus, select:focus, textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .input.error {
          border-color: #dc2626;
        }
        
        .input.error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        .error-message {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        input[type="file"].input {
          height: auto;
          padding: 8px 12px;
        }
        
        select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        
        .checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #3b82f6;
        }
        
        .checkbox-label {
          font-size: 14px;
          color: #1a1a1a;
          margin: 0;
          cursor: pointer;
        }
        
        .variant-section, .tags-section {
          border: 1px solid #e5e5e5;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 4px;
          background: #fafafa;
        }
        
        .variant-row, .tags-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          margin-bottom: 12px;
          align-items: end;
        }
        
        .tags-input-row {
          grid-template-columns: 1fr auto;
        }
        
        .variant-item, .tag-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        
        .variant-item span, .tag-item span {
          font-size: 14px;
        }
        
        .variant-item strong {
          color: #3b82f6;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 18px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .remove-btn:hover {
          background: #fef2f2;
        }
        
        .images-preview {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        
        .image-preview-item {
          position: relative;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .image-preview-item img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        
        .image-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e5e5;
        }
        
        .btn {
          height: 40px;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn:active {
          transform: scale(0.98);
        }
        
        .btn-secondary {
          background: #ffffff;
          color: #1a1a1a;
          border: 1px solid #d4d4d4;
        }
        
        .btn-secondary:hover {
          background: #f5f5f5;
          border-color: #a3a3a3;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: #ffffff;
          border: 1px solid #3b82f6;
        }
        
        .btn-primary:hover {
          background: #2563eb;
          border-color: #2563eb;
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-outline {
          background: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
        }
        
        .btn-outline:hover {
          background: #3b82f6;
          color: white;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #ffffff;
          color: #1a1a1a;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e5e5;
          z-index: 1000;
          transform: translateX(400px);
          transition: transform 0.3s ease;
          max-width: 400px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        
        .toast.show {
          transform: translateX(0);
        }
        
        .toast.success {
          border-left: 4px solid #10b981;
        }
        
        .toast.error {
          border-left: 4px solid #ef4444;
        }
        
        .toast-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        
        .toast.success .toast-icon {
          background: #d1fae5;
          color: #059669;
        }
        
        .toast.error .toast-icon {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: #666666;
          cursor: pointer;
          font-size: 20px;
          margin-left: auto;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .toast-close:hover {
          background: #f5f5f5;
          color: #1a1a1a;
        }
        
        .selected-info {
          font-size: 14px;
          color: #666666;
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 20px 16px;
          }
          
          .form-row.two-col {
            grid-template-columns: 1fr;
          }
          
          .variant-row, .tags-input-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${toastType} show`}>
          <div className="toast-icon">{toastType === "success" ? "✓" : "✕"}</div>
          {toastMessage}
          <button className="toast-close" onClick={() => setShowToast(false)}>
            ×
          </button>
        </div>
      )}

      <div className="header">
        <h1>Add New Product</h1>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === "basic" ? "active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "advanced" ? "active" : ""}`}
          onClick={() => setActiveTab("advanced")}
        >
          Advanced
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-content">
          {activeTab === "basic" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    className={`input ${getFieldError("title") ? "error" : ""}`}
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter product title"
                    required
                  />
                  {getFieldError("title") && <div className="error-message">{getFieldError("title")}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Description</label>
                  <textarea
                    name="description"
                    className={`input ${getFieldError("description") ? "error" : ""}`}
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Describe your product features, specifications, and benefits"
                    required
                  />
                  {getFieldError("description") && (
                    <div className="error-message">{getFieldError("description")}</div>
                  )}
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label className="required">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    className={`input ${getFieldError("price") ? "error" : ""}`}
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                  {getFieldError("price") && <div className="error-message">{getFieldError("price")}</div>}
                </div>
                <div className="form-group">
                  <label>Sale Price (₹)</label>
                  <input
                    type="number"
                    name="salePrice"
                    className={`input ${errors.salePrice ? "error" : ""}`}
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min="0"
                    step="0.01"
                    placeholder="0.00 (optional)"
                  />
                  {errors.salePrice && <div className="error-message">{errors.salePrice}</div>}
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label className="required">Category</label>
                  <select
                    name="category"
                    className={`input ${getFieldError("category") ? "error" : ""}`}
                    value={formData.category}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {getFieldError("category") && <div className="error-message">{getFieldError("category")}</div>}
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    className="input"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Brand name (optional)"
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    className={`input ${errors.stock ? "error" : ""}`}
                    value={formData.stock}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min="0"
                    placeholder="0"
                  />
                  {errors.stock && <div className="error-message">{errors.stock}</div>}
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      name="sku"
                      className="input"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Product SKU"
                    />
                    <button type="button" className="btn btn-outline" onClick={generateSKU} style={{ whiteSpace: "nowrap" }}>
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`input ${errors.images ? "error" : ""}`}
                    required
                  />
                  {selectedImages.length > 0 && (
                    <>
                      <p className="selected-info">Selected {selectedImages.length} image(s)</p>
                      <div className="images-preview">
                        {selectedImages.map((file, idx) => (
                          <div key={idx} className="image-preview-item">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} />
                            <button type="button" className="image-remove" onClick={() => removeImage(idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {errors.images && <div className="error-message">{errors.images}</div>}
                </div>
              </div>
            </>
          )}

          {activeTab === "advanced" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Variants</label>
                  <div className="variant-section">
                    <div className="variant-row">
                      <div className="form-group">
                        <label>Variant Name</label>
                        <input
                          type="text"
                          className="input"
                          value={currentVariant.name}
                          onChange={(e) => setCurrentVariant({ ...currentVariant, name: e.target.value })}
                          placeholder="e.g., Color, Size"
                        />
                      </div>
                      <div className="form-group">
                        <label>Variant Value</label>
                        <input
                          type="text"
                          className="input"
                          value={currentVariant.value}
                          onChange={(e) => setCurrentVariant({ ...currentVariant, value: e.target.value })}
                          placeholder="e.g., Red, Large"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addVariant}
                        disabled={!currentVariant.name || !currentVariant.value}
                      >
                        Add
                      </button>
                    </div>

                    {formData.variants.length > 0 && (
                      <div>
                        <label>Added Variants:</label>
                        {formData.variants.map((variant, idx) => (
                          <div key={idx} className="variant-item">
                            <span>
                              <strong>{variant.name}:</strong> {variant.value}
                            </span>
                            <button type="button" className="remove-btn" onClick={() => removeVariant(idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Tags</label>
                  <div className="tags-section">
                    <div className="tags-input-row">
                      <div className="form-group">
                        <label>Tag</label>
                        <input
                          type="text"
                          className="input"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          placeholder="e.g., New Arrival, Best Seller"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addTag}
                        disabled={!currentTag.trim()}
                      >
                        Add
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div>
                        <label>Added Tags:</label>
                        {formData.tags.map((tag, idx) => (
                          <div key={idx} className="tag-item">
                            <span>{tag}</span>
                            <button type="button" className="remove-btn" onClick={() => removeTag(idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <div className="checkbox-row">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        className="checkbox"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-label">Feature this product</span>
                    </div>
                  </label>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Featured products will be highlighted on the homepage
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting && <span className="spinner"></span>}
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}