// app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";

// ------------------- Product Management Component (unchanged) -------------------
const ProductManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
    variants: "[]",
    tags: "[]",
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/products");
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      salePrice: "",
      category: "",
      brand: "",
      stock: "",
      sku: "",
      variants: "[]",
      tags: "[]",
    });
    setImageFiles(null);
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      category: product.category,
      brand: product.brand || "",
      stock: product.stock?.toString() || "",
      sku: product.sku || "",
      variants: JSON.stringify(product.variants || []),
      tags: JSON.stringify(product.tags || []),
    });
    if (product.images && product.images.length) {
      setImagePreviews(product.images.map((img: any) => img.url));
    } else {
      setImagePreviews([]);
    }
    setImageFiles(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          submitData.append("images", imageFiles[i]);
        }
      }

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/admin/products", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

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

  if (loading) return <div className="dashboard-component">Loading products...</div>;
  if (error) return <div className="dashboard-component error-message">{error}</div>;

  return (
    <div className="dashboard-component">
      <div className="component-header">
        <h2 className="component-title">Product Inventory</h2>
        <button className="btn-primary" onClick={openAddModal}>
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.title} width="50" height="50" style={{ objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="font-medium">{product.title}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <div className="action-icons">
                    <Eye size={18} className="action-icon view" />
                    <Edit size={18} className="action-icon edit" onClick={() => openEditModal(product)} />
                    <Trash2 size={18} className="action-icon delete" onClick={() => handleDelete(product._id)} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="close-modal" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-field">
                  <label>Price (₹) *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-field">
                  <label>Sale Price</label>
                  <input type="number" step="0.01" name="salePrice" value={formData.salePrice} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                  <label>SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} />
                </div>
                <div className="form-field full-width">
                  <label>Description *</label>
                  <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} required />
                </div>
                <div className="form-field">
                  <label>Variants (JSON)</label>
                  <textarea name="variants" rows={2} value={formData.variants} onChange={handleInputChange} placeholder='[{"size":"M","price":10}]' />
                </div>
                <div className="form-field">
                  <label>Tags (JSON)</label>
                  <textarea name="tags" rows={2} value={formData.tags} onChange={handleInputChange} placeholder='["new","sale"]' />
                </div>
                <div className="form-field full-width">
                  <label>Product Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((src, idx) => (
                        <img key={idx} src={src} alt="preview" width="60" height="60" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Saving..." : (editingProduct ? "Update" : "Create")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 800px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .close-modal {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
        }
        .product-form .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-field.full-width {
          grid-column: span 2;
        }
        .form-field label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 500;
          color: #1e293b;
        }
        .form-field input, .form-field select, .form-field textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-family: inherit;
        }
        .image-previews {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .image-previews img {
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        @media (max-width: 640px) {
          .product-form .form-grid {
            grid-template-columns: 1fr;
          }
          .form-field.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

// ------------------- Shipping Management Component (unchanged) -------------------
const ShippingManagement = () => {
  const [shippings, setShippings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchShippings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/shipping");
      if (res.data.success) {
        setShippings(res.data.shipping || []);
      } else {
        setError("Failed to load shipping addresses");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching shipping addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  const openDetailsModal = (shipping: any) => {
    setSelectedShipping(shipping);
    setIsDetailsModalOpen(true);
  };

  const getDefaultBadge = (isDefault: boolean) => (isDefault ? "active" : "low");

  if (loading) return <div className="dashboard-component">Loading shipping addresses...</div>;
  if (error) return <div className="dashboard-component error-message">{error}</div>;

  return (
    <div className="dashboard-component">
      <div className="component-header">
        <h2 className="component-title">Shipping Addresses</h2>
        <button className="btn-secondary">
          <Truck size={18} />
          Export Addresses
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Full Address</th>
              <th>Label</th>
              <th>Default</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippings.map((shipping) => {
              const addr = shipping.address;
              const fullAddress = `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
              return (
                <tr key={shipping._id}>
                  <td className="font-medium">{shipping._id.slice(-8)}</td>
                  <td>{shipping.user.username}</td>
                  <td style={{ fontSize: "0.9rem", color: "#64748b" }}>{shipping.user.email}</td>
                  <td style={{ maxWidth: "320px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fullAddress}
                  </td>
                  <td>{shipping.label}</td>
                  <td>
                    <span className={`status-badge ${getDefaultBadge(shipping.isDefault)}`}>
                      {shipping.isDefault ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{new Date(shipping.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <div className="action-icons">
                      <Eye size={18} className="action-icon view" onClick={() => openDetailsModal(shipping)} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {shippings.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>No shipping addresses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDetailsModalOpen && selectedShipping && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Shipping Address Details</h3>
              <button className="close-modal" onClick={() => setIsDetailsModalOpen(false)}>×</button>
            </div>
            <div className="details-content">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  {selectedShipping.user.profilePic ? (
                    <img src={selectedShipping.user.profilePic} alt="Profile" width="60" height="60" style={{ borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <UserCircle size={60} style={{ color: "#64748b" }} />
                  )}
                  <div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{selectedShipping.user.username}</p>
                    <p style={{ color: "#64748b", margin: 0 }}>{selectedShipping.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Address Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p><strong>Label:</strong> {selectedShipping.label}</p>
                    <p><strong>Default:</strong> <span className={`status-badge ${getDefaultBadge(selectedShipping.isDefault)}`}>{selectedShipping.isDefault ? "Yes" : "No"}</span></p>
                  </div>
                  <div>
                    <p><strong>Street:</strong> {selectedShipping.address.street}</p>
                    <p><strong>City:</strong> {selectedShipping.address.city}</p>
                    <p><strong>State:</strong> {selectedShipping.address.state}</p>
                    <p><strong>Postal Code:</strong> {selectedShipping.address.postalCode}</p>
                    <p><strong>Country:</strong> {selectedShipping.address.country}</p>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Timestamps</h4>
                <p><strong>Created At:</strong> {new Date(selectedShipping.createdAt).toLocaleString("en-IN")}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedShipping.updatedAt).toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 20px; width: 90%; max-width: 700px; max-height: 85vh; overflow-y: auto; padding: 1.5rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .close-modal { background: none; border: none; font-size: 1.8rem; cursor: pointer; }
        .details-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .detail-section { background: #f8fafc; padding: 1.25rem; border-radius: 16px; }
        .detail-section h4 { margin-bottom: 1rem; color: #1e293b; font-size: 1.1rem; }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
};

// ------------------- Orders Management Component (unchanged) -------------------
const OrdersManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/order");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDetailsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);

    try {
      await axios.patch(`/api/admin/order/${selectedOrder._id}`, {
        status: newStatus,
      });

      alert("Order status updated successfully!");
      setIsDetailsModalOpen(false);
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case "delivered": return "delivered";
      case "shipped": return "shipped";
      case "processing": return "processing";
      case "pending": return "pending";
      case "cancelled":
      case "returned": return "low";
      default: return "pending";
    }
  };

  if (loading) return <div className="dashboard-component">Loading orders...</div>;
  if (error) return <div className="dashboard-component error-message">{error}</div>;

  return (
    <div className="dashboard-component">
      <div className="component-header">
        <h2 className="component-title">Recent Orders</h2>
        <button className="btn-secondary" onClick={fetchOrders}>
          <Truck size={18} />
          Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="font-medium">{order._id.slice(-8)}</td>
                <td>{order.user?.username || "—"}</td>
                <td>{order.items?.length || 0}</td>
                <td>₹{order.totalAmount?.toFixed(2) || "0.00"}</td>
                <td>
                  <span className={`status-badge ${getOrderStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <div className="action-icons">
                    <Eye size={18} className="action-icon view" onClick={() => openDetailsModal(order)} />
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>No recent orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDetailsModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details • #{selectedOrder._id.slice(-8)}</h3>
              <button className="close-modal" onClick={() => setIsDetailsModalOpen(false)}>×</button>
            </div>

            <div className="details-content">
              <div className="detail-section">
                <h4>Customer</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {selectedOrder.user?.profilePic ? (
                    <img src={selectedOrder.user.profilePic} alt="Profile" width="60" height="60" style={{ borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <UserCircle size={60} style={{ color: "#64748b" }} />
                  )}
                  <div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{selectedOrder.user?.username}</p>
                    <p style={{ color: "#64748b", margin: 0 }}>{selectedOrder.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Order Summary</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p><strong>Status:</strong> <span className={`status-badge ${getOrderStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                    <p style={{ color: "#64748b" }}>Total Amount</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Order Items ({selectedOrder.items?.length || 0})</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {selectedOrder.items?.map((item: any, idx: number) => {
                    const prod = item.product || {};
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px" }}>
                        {prod.images?.[0]?.url && (
                          <img src={prod.images[0].url} alt={prod.name} width="50" height="50" style={{ objectFit: "cover", borderRadius: "8px" }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, margin: 0 }}>{prod.name}</p>
                          {item.variant && (
                            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "2px 0" }}>
                              {item.variant.name}: {item.variant.value}
                            </p>
                          )}
                          <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                            {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 600 }}>
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedOrder.shipping && (
                <div className="detail-section">
                  <h4>Shipping Address</h4>
                  <p><strong>Label:</strong> {selectedOrder.shipping.label}</p>
                  <p>{selectedOrder.shipping.address.street}</p>
                  <p>{selectedOrder.shipping.address.city}, {selectedOrder.shipping.address.state} {selectedOrder.shipping.address.postalCode}</p>
                  <p>{selectedOrder.shipping.address.country}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>Update Order Status</h4>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                  <button onClick={handleStatusUpdate} disabled={updating} className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              {(selectedOrder.trackingNumber || selectedOrder.notes) && (
                <div className="detail-section">
                  <h4>Additional Information</h4>
                  {selectedOrder.trackingNumber && <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>}
                  {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 20px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .close-modal { background: none; border: none; font-size: 1.8rem; cursor: pointer; }
        .details-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .detail-section { background: #f8fafc; padding: 1.25rem; border-radius: 16px; }
        .detail-section h4 { margin-bottom: 1rem; color: #1e293b; font-size: 1.1rem; }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
};

// ------------------- Customers Management Component (NEW) -------------------
const CustomersManagement = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/customers");
      // API returns data inside .data.customers
      if (res.data.success) {
        setCustomers(res.data.data?.customers || []);
      } else {
        setError("Failed to load customers");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openDetailsModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const getVerifiedBadge = (isVerified: boolean) => (isVerified ? "active" : "low");

  if (loading) return <div className="dashboard-component">Loading customers...</div>;
  if (error) return <div className="dashboard-component error-message">{error}</div>;

  return (
    <div className="dashboard-component">
      <div className="component-header">
        <h2 className="component-title">Customers</h2>
        <button className="btn-secondary" onClick={fetchCustomers}>
          <Users size={18} />
          Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Auth Provider</th>
              <th>Verified</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="font-medium">{customer._id.slice(-8)}</td>
                <td>{customer.username}</td>
                <td style={{ fontSize: "0.9rem", color: "#64748b" }}>{customer.email}</td>
                <td>
                  <span className="status-badge" style={{ background: customer.authProvider === "google" ? "#dbeafe" : "#e2e8f0", color: customer.authProvider === "google" ? "#1e40af" : "#475569" }}>
                    {customer.authProvider}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getVerifiedBadge(customer.isVerified)}`}>
                    {customer.isVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td>{new Date(customer.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <div className="action-icons">
                    <Eye
                      size={18}
                      className="action-icon view"
                      onClick={() => openDetailsModal(customer)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {isDetailsModalOpen && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button className="close-modal" onClick={() => setIsDetailsModalOpen(false)}>×</button>
            </div>

            <div className="details-content">
              <div className="detail-section">
                <h4>Profile</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  {selectedCustomer.profilePic ? (
                    <img
                      src={selectedCustomer.profilePic}
                      alt="Profile"
                      width="80"
                      height="80"
                      style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid #f1f5f9" }}
                    />
                  ) : (
                    <UserCircle size={80} style={{ color: "#64748b" }} />
                  )}
                  <div>
                    <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>{selectedCustomer.username}</p>
                    <p style={{ color: "#64748b" }}>{selectedCustomer.email}</p>
                    {selectedCustomer.phone && <p style={{ marginTop: "4px" }}>📱 {selectedCustomer.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Account Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p><strong>Auth Provider:</strong> {selectedCustomer.authProvider}</p>
                    {selectedCustomer.googleId && <p><strong>Google ID:</strong> {selectedCustomer.googleId}</p>}
                    <p>
                      <strong>Verified:</strong>{" "}
                      <span className={`status-badge ${getVerifiedBadge(selectedCustomer.isVerified)}`}>
                        {selectedCustomer.isVerified ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p><strong>Account Locked:</strong> {selectedCustomer.isLocked ? "Yes" : "No"}</p>
                    <p><strong>Failed Attempts:</strong> {selectedCustomer.failedAttempts}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Network &amp; Security</h4>
                <p><strong>Registration IP:</strong> {selectedCustomer.registrationIp || "—"}</p>
                <p><strong>Last Login IP:</strong> {selectedCustomer.lastLoginIp || "—"}</p>
              </div>

              <div className="detail-section">
                <h4>Timestamps</h4>
                <p><strong>Created At:</strong> {new Date(selectedCustomer.createdAt).toLocaleString("en-IN")}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedCustomer.updatedAt).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="modal-buttons">
              <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .close-modal {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
        }
        .details-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .detail-section {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 16px;
        }
        .detail-section h4 {
          margin-bottom: 1rem;
          color: #1e293b;
          font-size: 1.1rem;
        }
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

// ------------------- Dashboard Overview Component (unchanged) -------------------
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalShipping: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/statistics");
        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          setError("Failed to load statistics");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Unable to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "#4f46e5" },
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "#10b981" },
    { title: "Total Shipping", value: stats.totalShipping, icon: Truck, color: "#f59e0b" },
  ];

  return (
    <div className="dashboard-component">
      <h2 className="component-title">Dashboard Overview</h2>
      {loading ? (
        <div className="loading-spinner">Loading statistics...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((card, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: card.color }}>
                  <card.icon size={24} />
                </div>
                <div className="stat-info">
                  <h3>{card.value.toLocaleString()}</h3>
                  <p>{card.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <ul>
              <li><Clock size={14} /> Order #ORD-1005 was placed 10 minutes ago</li>
              <li><Truck size={14} /> Shipment for ORD-1002 is out for delivery</li>
              <li><Package size={14} /> New product "Surgical Mask" added</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

// ------------------- Main Dashboard Page -------------------
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.replace("/admin/login");
      return;
    }
    try {
      const admin = JSON.parse(adminAuth);
      setAdminName(admin.username || admin.email?.split("@")[0] || "Admin");
    } catch (e) {}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManagement />;
      case "shipping":
        return <ShippingManagement />;
      case "orders":
        return <OrdersManagement />;
      case "customers":
        return <CustomersManagement />;
      case "overview":
        return <DashboardOverview />;
      default:
        return (
          <div className="placeholder-card">
            <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
            <p>Content for {activeTab} is under development.</p>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #f3f4f6;
        }
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
        }
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);
          color: #e2e8f0;
          transition: all 0.3s ease;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 20;
        }
        .sidebar.closed {
          width: 80px;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: #8b5cf6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }
        .logo-text {
          font-weight: 700;
          font-size: 1.25rem;
          white-space: nowrap;
        }
        .sidebar.closed .logo-text,
        .sidebar.closed .menu-label {
          display: none;
        }
        .toggle-btn {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
        }
        .nav-menu {
          padding: 1rem 0;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          color: #cbd5e1;
          transition: all 0.2s;
          cursor: pointer;
          margin: 0.25rem 0;
        }
        .nav-item:hover {
          background: rgba(139, 92, 246, 0.2);
          color: white;
        }
        .nav-item.active {
          background: #8b5cf6;
          color: white;
          border-radius: 0 20px 20px 0;
        }
        .main-content {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }
        .main-content.expanded {
          margin-left: 80px;
        }
        .top-bar {
          background: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .search-area {
          display: flex;
          align-items: center;
          background: #f9fafb;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          gap: 0.5rem;
        }
        .search-area input {
          border: none;
          background: transparent;
          outline: none;
          width: 250px;
        }
        .user-area {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .notification-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
        }
        .avatar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .dashboard-component {
          padding: 2rem;
        }
        .component-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .component-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
        }
        .btn-primary {
          background: #8b5cf6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-secondary {
          background: #e2e8f0;
          color: #1e293b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
        }
        .data-table {
          width: 100%;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .data-table th {
          text-align: left;
          padding: 1rem;
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }
        .data-table td {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          color: #1e293b;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.low { background: #fee2e2; color: #991b1b; }
        .status-badge.delivered { background: #d1fae5; color: #065f46; }
        .status-badge.shipped { background: #dbeafe; color: #1e40af; }
        .status-badge.processing { background: #fed7aa; color: #9a3412; }
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .action-icons {
          display: flex;
          gap: 0.5rem;
        }
        .action-icon {
          cursor: pointer;
        }
        .action-icon.view { color: #3b82f6; }
        .action-icon.edit { color: #f59e0b; }
        .action-icon.delete { color: #ef4444; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .stat-info h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
        }
        .stat-info p {
          color: #64748b;
          font-size: 0.875rem;
        }
        .recent-activity {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
        }
        .recent-activity h3 {
          margin-bottom: 1rem;
        }
        .recent-activity ul {
          list-style: none;
        }
        .recent-activity li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        .placeholder-card {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
        }
        .loading-spinner {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          color: #64748b;
        }
        .error-message {
          background: #fee2e2;
          color: #991b1b;
          border-radius: 16px;
          padding: 1rem;
          text-align: center;
        }
        @media (max-width: 768px) {
          .sidebar { width: 80px; }
          .sidebar.closed { width: 0; overflow: hidden; }
          .main-content { margin-left: 80px; }
          .main-content.expanded { margin-left: 0; }
          .sidebar .logo-text, .sidebar .menu-label { display: none; }
          .top-bar { padding: 1rem; }
        }
      `}</style>

      <div className="admin-dashboard">
        <div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-header">
            <div className="logo-area">
              <div className="logo-icon">P</div>
              <span className="logo-text">PlastCare</span>
            </div>
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="nav-menu">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={20} />
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
            <div className="nav-item" onClick={handleLogout}>
              <LogOut size={20} />
              <span className="menu-label">Logout</span>
            </div>
          </div>
        </div>

        <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
          <div className="top-bar">
            <div className="search-area">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
            <div className="user-area">
              <button className="notification-btn">
                <Bell size={20} />
              </button>
              <div className="avatar">
                <UserCircle size={32} />
                <span>{adminName}</span>
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}