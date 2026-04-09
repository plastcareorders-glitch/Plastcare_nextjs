"use client";

import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdHome,
  MdBusiness,
  MdLocationOn,
} from "react-icons/md";
import {
  FaFilter,
  FaUser,
  FaGlobe,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

// Type definitions
interface ShippingAddress {
  id: string;
  userId: string;
  username: string;
  email: string;
  profilePic: string | null;
  phone: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  dateCreated: string;
  lastUpdated: string;
}

// Mock data
const mockShippingAddresses: ShippingAddress[] = [
  {
    id: "addr_1",
    userId: "user_1",
    username: "john_doe",
    email: "john.doe@example.com",
    profilePic: null,
    phone: "+1 (555) 123-4567",
    label: "Home",
    street: "123 Main Street",
    city: "Springfield",
    state: "IL",
    postalCode: "62701",
    country: "United States",
    isDefault: true,
    dateCreated: "Jan 15, 2024, 10:30 AM",
    lastUpdated: "Feb 20, 2024, 03:45 PM",
  },
  {
    id: "addr_2",
    userId: "user_1",
    username: "john_doe",
    email: "john.doe@example.com",
    profilePic: null,
    phone: "+1 (555) 123-4567",
    label: "Business",
    street: "456 Corporate Drive",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "United States",
    isDefault: false,
    dateCreated: "Feb 01, 2024, 09:15 AM",
    lastUpdated: "Feb 01, 2024, 09:15 AM",
  },
  {
    id: "addr_3",
    userId: "user_2",
    username: "jane_smith",
    email: "jane.smith@example.com",
    profilePic: null,
    phone: "+1 (555) 987-6543",
    label: "Home",
    street: "789 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    country: "United States",
    isDefault: true,
    dateCreated: "Jan 20, 2024, 14:20 PM",
    lastUpdated: "Feb 18, 2024, 11:20 AM",
  },
  {
    id: "addr_4",
    userId: "user_3",
    username: "mike_wilson",
    email: "mike.wilson@example.com",
    profilePic: null,
    phone: "Not provided",
    label: "Office",
    street: "101 Tech Park",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    country: "United States",
    isDefault: false,
    dateCreated: "Feb 05, 2024, 08:45 AM",
    lastUpdated: "Feb 05, 2024, 08:45 AM",
  },
  {
    id: "addr_5",
    userId: "user_4",
    username: "sarah_connor",
    email: "sarah.connor@example.com",
    profilePic: null,
    phone: "+1 (555) 456-7890",
    label: "Home",
    street: "222 Lakeview Drive",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "United States",
    isDefault: true,
    dateCreated: "Feb 10, 2024, 11:30 AM",
    lastUpdated: "Feb 21, 2024, 04:10 PM",
  },
  {
    id: "addr_6",
    userId: "user_5",
    username: "alex_johnson",
    email: "alex.johnson@example.com",
    profilePic: null,
    phone: "+1 (555) 321-0987",
    label: "Business",
    street: "500 Market Street",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    isDefault: false,
    dateCreated: "Feb 15, 2024, 13:00 PM",
    lastUpdated: "Feb 15, 2024, 13:00 PM",
  },
];

export default function EcommerceShipping() {
  const [shippingAddresses] = useState<ShippingAddress[]>(mockShippingAddresses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredAddresses = shippingAddresses.filter(
    (address) =>
      address.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddressDetails = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedAddress(null);
    setShowDetailsModal(false);
  };

  // Calculate stats
  const totalAddresses = shippingAddresses.length;
  const defaultAddresses = shippingAddresses.filter((address) => address.isDefault).length;
  const homeAddresses = shippingAddresses.filter(
    (address) => address.label === "Home"
  ).length;
  const businessAddresses = shippingAddresses.filter(
    (address) => address.label === "Business" || address.label === "Office"
  ).length;

  const getLabelIcon = (label: string) => {
    switch (label?.toLowerCase()) {
      case "home":
        return <MdHome size={14} />;
      case "business":
      case "office":
        return <MdBusiness size={14} />;
      default:
        return <MdLocationOn size={14} />;
    }
  };

  const getLabelColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "home":
        return { background: "#dcfce7", color: "#166534" };
      case "business":
      case "office":
        return { background: "#dbeafe", color: "#1e40af" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };

  return (
    <div className="ecommerce-shipping-container">
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        
        .ecommerce-shipping-container {
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
        
        .analytics-link {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .analytics-link:hover {
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
        .stat-default { color: #059669; }
        .stat-home { color: #2563eb; }
        .stat-business { color: #7c3aed; }
        
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
          min-width: 1000px;
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
        
        /* Status Badges */
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .status-default {
          background: #dcfce7;
          color: #166534;
        }
        .status-not-default {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .label-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        /* Profile Image */
        .profile-image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }
        
        .profile-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #e5e7eb;
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
        
        /* Address Display */
        .address-display {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }
        
        .address-main {
          font-weight: 500;
          color: #374151;
        }
        
        /* Mobile Cards */
        .mobile-address-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          display: none;
        }
        
        .mobile-address-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .mobile-address-info {
          flex: 1;
        }
        
        .mobile-address-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        
        .mobile-address-email {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        
        .mobile-address-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .mobile-address-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .mobile-address-value {
          color: #6b7280;
          font-size: 14px;
          text-align: right;
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
          width: 600px;
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
        
        .address-details {
          padding: 20px 24px;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .detail-item {
          margin-bottom: 12px;
        }
        
        .detail-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .detail-value {
          color: #6b7280;
          font-size: 14px;
        }
        
        .address-full {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          line-height: 1.5;
        }
        
        /* Mobile Responsive */
        @media (max-width: 767px) {
          .mobile-address-card {
            display: block;
          }
          
          .table-container table {
            display: none;
          }
          
          .ecommerce-shipping-container {
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
          
          .address-details {
            padding: 16px 20px;
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
        }
      `}</style>

      {/* Header */}
      <div className="header-top">
        <h1 className="title">Shipping Addresses</h1>
        <a href="#" className="analytics-link">
          Analytics
          <MdKeyboardArrowDown size={16} />
        </a>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-box stat-total">{totalAddresses} Total addresses</div>
        <div className="stat-box stat-default">{defaultAddresses} Default</div>
        <div className="stat-box stat-home">{homeAddresses} Home addresses</div>
        <div className="stat-box stat-business">{businessAddresses} Business addresses</div>
      </div>

      {/* Actions Row */}
      <div className="actions-row">
        <div className="left-actions">
          <button className="btn-secondary">Export Data</button>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search addresses..."
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
        {filteredAddresses.length === 0 ? (
          <div className="table-empty">
            <h3>No shipping addresses found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "No shipping addresses added yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Customer</th>
                  <th>
                    Label
                    <MdKeyboardArrowDown className="sort-icon" size={16} />
                  </th>
                  <th>Address</th>
                  <th>Default</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAddresses.map((address, index) => {
                  const labelStyle = getLabelColor(address.label);
                  return (
                    <tr key={address.id}>
                      <td>
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {address.profilePic ? (
                            <img
                              src={address.profilePic}
                              alt={address.username}
                              className="profile-image"
                            />
                          ) : (
                            <div className="profile-placeholder">
                              {address.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div
                              style={{ fontWeight: "600", color: "#111827" }}
                            >
                              {address.username}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                              {address.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="label-badge"
                          style={{
                            background: labelStyle.background,
                            color: labelStyle.color,
                          }}
                        >
                          {getLabelIcon(address.label)}
                          {address.label}
                        </span>
                      </td>
                      <td>
                        <div className="address-display">
                          <div className="address-main">{address.street}</div>
                          <div>
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div>{address.country}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            address.isDefault
                              ? "status-default"
                              : "status-not-default"
                          }`}
                        >
                          {address.isDefault ? "Default" : "Not Default"}
                        </span>
                      </td>
                      <td>{address.dateCreated}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn"
                            onClick={() => openAddressDetails(address)}
                            title="View Details"
                          >
                            <FaUser size={14} />
                          </button>
                          <button className="action-btn" title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button className="action-btn" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            {filteredAddresses.map((address) => {
              const labelStyle = getLabelColor(address.label);
              return (
                <div key={address.id} className="mobile-address-card">
                  <div className="mobile-address-header">
                    {address.profilePic ? (
                      <img
                        src={address.profilePic}
                        alt={address.username}
                        className="profile-image"
                        style={{ width: "40px", height: "40px" }}
                      />
                    ) : (
                      <div
                        className="profile-placeholder"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {address.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="mobile-address-info">
                      <h3 className="mobile-address-name">{address.username}</h3>
                      <p className="mobile-address-email">{address.email}</p>
                    </div>
                  </div>

                  <div className="mobile-address-row">
                    <span className="mobile-address-label">
                      {getLabelIcon(address.label)}
                      Label
                    </span>
                    <span className="mobile-address-value">
                      <span
                        className="label-badge"
                        style={{
                          background: labelStyle.background,
                          color: labelStyle.color,
                        }}
                      >
                        {address.label}
                      </span>
                    </span>
                  </div>

                  <div className="mobile-address-row">
                    <span className="mobile-address-label">Address</span>
                    <span
                      className="mobile-address-value"
                      style={{
                        textAlign: "right",
                        fontSize: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {address.street}
                      <br />
                      {address.city}, {address.state}
                      <br />
                      {address.postalCode}, {address.country}
                    </span>
                  </div>

                  <div className="mobile-address-row">
                    <span className="mobile-address-label">Default</span>
                    <span className="mobile-address-value">
                      <span
                        className={`status-badge ${
                          address.isDefault
                            ? "status-default"
                            : "status-not-default"
                        }`}
                      >
                        {address.isDefault ? "Default" : "Not Default"}
                      </span>
                    </span>
                  </div>

                  <div className="mobile-address-row">
                    <span className="mobile-address-label">
                      <FaCalendar size={14} />
                      Created
                    </span>
                    <span
                      className="mobile-address-value"
                      style={{ fontSize: "12px" }}
                    >
                      {address.dateCreated}
                    </span>
                  </div>

                  <div className="mobile-actions">
                    <button
                      className="mobile-action-btn"
                      onClick={() => openAddressDetails(address)}
                    >
                      <FaUser size={14} />
                      Details
                    </button>
                    <button className="mobile-action-btn">
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button className="mobile-action-btn">
                      <FaTrash size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Address Details Modal */}
      {showDetailsModal && selectedAddress && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Shipping Address Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="address-details">
              {/* Customer Section */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaUser />
                  Customer Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Username</div>
                    <div className="detail-value">{selectedAddress.username}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{selectedAddress.email}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{selectedAddress.phone}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">User ID</div>
                    <div
                      className="detail-value"
                      style={{ fontSize: "12px", fontFamily: "monospace" }}
                    >
                      {selectedAddress.userId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="details-section">
                <h3 className="section-title">
                  <MdLocationOn />
                  Address Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Label</div>
                    <div className="detail-value">
                      <span
                        className="label-badge"
                        style={getLabelColor(selectedAddress.label)}
                      >
                        {getLabelIcon(selectedAddress.label)}
                        {selectedAddress.label}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Default Address</div>
                    <div className="detail-value">
                      <span
                        className={`status-badge ${
                          selectedAddress.isDefault
                            ? "status-default"
                            : "status-not-default"
                        }`}
                      >
                        {selectedAddress.isDefault ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Full Address</div>
                  <div className="address-full">
                    {selectedAddress.street}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.postalCode}
                    <br />
                    {selectedAddress.country}
                  </div>
                </div>
              </div>

              {/* Address Breakdown */}
              <div className="details-section">
                <h3 className="section-title">Address Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Street</div>
                    <div className="detail-value">{selectedAddress.street}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">City</div>
                    <div className="detail-value">{selectedAddress.city}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">State/Province</div>
                    <div className="detail-value">{selectedAddress.state}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Postal Code</div>
                    <div className="detail-value">{selectedAddress.postalCode}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Country</div>
                    <div className="detail-value">{selectedAddress.country}</div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaCalendar />
                  Timestamps
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Date Created</div>
                    <div className="detail-value">{selectedAddress.dateCreated}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{selectedAddress.lastUpdated}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}