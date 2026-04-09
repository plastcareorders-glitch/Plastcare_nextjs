"use client";

import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdEmail,
  MdPhone,
  MdLock,
  MdLockOpen,
} from "react-icons/md";
import { FaFilter, FaUser, FaGlobe, FaCalendar } from "react-icons/fa";

// Type definitions
interface Client {
  id: string;
  username: string;
  email: string;
  phone: string;
  profilePic: string | null;
  isVerified: boolean;
  isLocked: boolean;
  failedAttempts: number;
  registrationIp: string;
  lastLoginIp: string;
  dateCreated: string;
  lastUpdated: string;
  lockoutUntil: string | null;
}

// Mock data
const mockClients: Client[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profilePic: null,
    isVerified: true,
    isLocked: false,
    failedAttempts: 0,
    registrationIp: "192.168.1.100",
    lastLoginIp: "203.0.113.45",
    dateCreated: "Jan 15, 2024, 10:30 AM",
    lastUpdated: "Feb 20, 2024, 03:45 PM",
    lockoutUntil: null,
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    profilePic: null,
    isVerified: false,
    isLocked: true,
    failedAttempts: 5,
    registrationIp: "192.168.1.105",
    lastLoginIp: "198.51.100.22",
    dateCreated: "Jan 20, 2024, 09:15 AM",
    lastUpdated: "Feb 18, 2024, 11:20 AM",
    lockoutUntil: "2024-02-25T10:00:00Z",
  },
  {
    id: "3",
    username: "mike_wilson",
    email: "mike.wilson@example.com",
    phone: "Not provided",
    profilePic: null,
    isVerified: true,
    isLocked: false,
    failedAttempts: 1,
    registrationIp: "192.168.1.110",
    lastLoginIp: "203.0.113.78",
    dateCreated: "Feb 01, 2024, 14:20 PM",
    lastUpdated: "Feb 19, 2024, 09:30 AM",
    lockoutUntil: null,
  },
  {
    id: "4",
    username: "sarah_connor",
    email: "sarah.connor@example.com",
    phone: "+1 (555) 456-7890",
    profilePic: null,
    isVerified: true,
    isLocked: false,
    failedAttempts: 0,
    registrationIp: "192.168.1.115",
    lastLoginIp: "198.51.100.67",
    dateCreated: "Feb 05, 2024, 11:45 AM",
    lastUpdated: "Feb 21, 2024, 04:10 PM",
    lockoutUntil: null,
  },
  {
    id: "5",
    username: "alex_johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 321-0987",
    profilePic: null,
    isVerified: false,
    isLocked: false,
    failedAttempts: 2,
    registrationIp: "192.168.1.120",
    lastLoginIp: "Never logged in",
    dateCreated: "Feb 10, 2024, 08:00 AM",
    lastUpdated: "Feb 10, 2024, 08:00 AM",
    lockoutUntil: null,
  },
  {
    id: "6",
    username: "emily_brown",
    email: "emily.brown@example.com",
    phone: "Not provided",
    profilePic: null,
    isVerified: true,
    isLocked: true,
    failedAttempts: 3,
    registrationIp: "192.168.1.125",
    lastLoginIp: "203.0.113.99",
    dateCreated: "Jan 25, 2024, 16:30 PM",
    lastUpdated: "Feb 15, 2024, 10:15 AM",
    lockoutUntil: "2024-02-22T08:00:00Z",
  },
];

export default function EcommerceCustomers() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.registrationIp?.includes(searchTerm)
  );

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setShowDetailsModal(false);
  };

  // Calculate stats
  const totalClients = clients.length;
  const verifiedClients = clients.filter((client) => client.isVerified).length;
  const lockedClients = clients.filter((client) => client.isLocked).length;
  const clientsWithPhone = clients.filter(
    (client) => client.phone && client.phone !== "Not provided"
  ).length;

  return (
    <div className="ecommerce-customers-container">
      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        
        .ecommerce-customers-container {
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
        .stat-verified { color: #059669; }
        .stat-locked { color: #dc2626; }
        .stat-with-phone { color: #2563eb; }
        
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
          display: inline-block;
        }
        .status-verified {
          background: #dcfce7;
          color: #166534;
        }
        .status-unverified {
          background: #fef3c7;
          color: #92400e;
        }
        .status-locked {
          background: #fecaca;
          color: #991b1b;
        }
        .status-active {
          background: #dbeafe;
          color: #1e40af;
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
        
        /* IP Address */
        .ip-address {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        /* Mobile Cards */
        .mobile-client-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          display: none;
        }
        
        .mobile-client-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .mobile-client-info {
          flex: 1;
        }
        
        .mobile-client-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        
        .mobile-client-email {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        
        .mobile-client-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .mobile-client-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .mobile-client-value {
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
        
        .client-details {
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
        
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        /* Mobile Responsive */
        @media (max-width: 767px) {
          .mobile-client-card {
            display: block;
          }
          
          .table-container table {
            display: none;
          }
          
          .ecommerce-customers-container {
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
          
          .client-details {
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
        <h1 className="title">E-commerce Customers</h1>
        <a href="#" className="analytics-link">
          Analytics
          <MdKeyboardArrowDown size={16} />
        </a>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-box stat-total">{totalClients} Total customers</div>
        <div className="stat-box stat-verified">{verifiedClients} Verified</div>
        <div className="stat-box stat-locked">{lockedClients} Locked</div>
        <div className="stat-box stat-with-phone">{clientsWithPhone} With phone</div>
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
            placeholder="Search customers..."
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
        {filteredClients.length === 0 ? (
          <div className="table-empty">
            <h3>No customers found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "No customers registered yet"}
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
                  <th>Profile</th>
                  <th>
                    Username
                    <MdKeyboardArrowDown className="sort-icon" size={16} />
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Security</th>
                  <th>Registration IP</th>
                  <th>Last Login IP</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={client.id}>
                    <td>
                      <input type="checkbox" className="checkbox" />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      {client.profilePic ? (
                        <img
                          src={client.profilePic}
                          alt={client.username}
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-placeholder">
                          {client.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#111827" }}>
                        {client.username}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <MdEmail size={14} color="#6b7280" />
                        {client.email}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <MdPhone size={14} color="#6b7280" />
                        {client.phone}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          client.isVerified
                            ? "status-verified"
                            : "status-unverified"
                        }`}
                      >
                        {client.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          client.isLocked ? "status-locked" : "status-active"
                        }`}
                      >
                        {client.isLocked ? (
                          <>
                            <MdLock size={12} />
                            Locked
                          </>
                        ) : (
                          <>
                            <MdLockOpen size={12} />
                            Active
                          </>
                        )}
                      </span>
                      {client.failedAttempts > 0 && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#dc2626",
                            marginTop: "2px",
                          }}
                        >
                          {client.failedAttempts} failed attempts
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="ip-address">{client.registrationIp}</span>
                    </td>
                    <td>
                      <span className="ip-address">{client.lastLoginIp}</span>
                    </td>
                    <td>{client.dateCreated}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn"
                          onClick={() => openClientDetails(client)}
                          title="View Details"
                        >
                          <FaUser size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            {filteredClients.map((client) => (
              <div key={client.id} className="mobile-client-card">
                <div className="mobile-client-header">
                  {client.profilePic ? (
                    <img
                      src={client.profilePic}
                      alt={client.username}
                      className="profile-image"
                      style={{ width: "40px", height: "40px" }}
                    />
                  ) : (
                    <div
                      className="profile-placeholder"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {client.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="mobile-client-info">
                    <h3 className="mobile-client-name">{client.username}</h3>
                    <p className="mobile-client-email">{client.email}</p>
                  </div>
                </div>

                <div className="mobile-client-row">
                  <span className="mobile-client-label">
                    <MdPhone size={14} />
                    Phone
                  </span>
                  <span className="mobile-client-value">{client.phone}</span>
                </div>

                <div className="mobile-client-row">
                  <span className="mobile-client-label">Status</span>
                  <span className="mobile-client-value">
                    <span
                      className={`status-badge ${
                        client.isVerified
                          ? "status-verified"
                          : "status-unverified"
                      }`}
                    >
                      {client.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </span>
                </div>

                <div className="mobile-client-row">
                  <span className="mobile-client-label">Security</span>
                  <span className="mobile-client-value">
                    <span
                      className={`status-badge ${
                        client.isLocked ? "status-locked" : "status-active"
                      }`}
                    >
                      {client.isLocked ? "Locked" : "Active"}
                    </span>
                  </span>
                </div>

                <div className="mobile-client-row">
                  <span className="mobile-client-label">
                    <FaGlobe size={14} />
                    Registration IP
                  </span>
                  <span
                    className="mobile-client-value"
                    style={{ fontSize: "12px" }}
                  >
                    {client.registrationIp}
                  </span>
                </div>

                <div className="mobile-client-row">
                  <span className="mobile-client-label">
                    <FaCalendar size={14} />
                    Created
                  </span>
                  <span
                    className="mobile-client-value"
                    style={{ fontSize: "12px" }}
                  >
                    {client.dateCreated}
                  </span>
                </div>

                <div className="mobile-actions">
                  <button
                    className="mobile-action-btn"
                    onClick={() => openClientDetails(client)}
                  >
                    <FaUser size={14} />
                    Details
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Customer Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="client-details">
              {/* Profile Section */}
              <div className="details-section">
                <h3 className="section-title">
                  <FaUser />
                  Profile Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Username</div>
                    <div className="detail-value">{selectedClient.username}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{selectedClient.email}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{selectedClient.phone}</div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="details-section">
                <h3 className="section-title">Account Status</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Verification Status</div>
                    <div className="detail-value">
                      <span
                        className={`security-badge ${
                          selectedClient.isVerified
                            ? "status-verified"
                            : "status-unverified"
                        }`}
                      >
                        {selectedClient.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Account Status</div>
                    <div className="detail-value">
                      <span
                        className={`security-badge ${
                          selectedClient.isLocked
                            ? "status-locked"
                            : "status-active"
                        }`}
                      >
                        {selectedClient.isLocked ? "Locked" : "Active"}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Failed Login Attempts</div>
                    <div className="detail-value">
                      {selectedClient.failedAttempts}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="details-section">
                <h3 className="section-title">
                  <MdLock />
                  Security Information
                </h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Registration IP</div>
                    <div className="detail-value">
                      <span className="ip-address">
                        {selectedClient.registrationIp}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Login IP</div>
                    <div className="detail-value">
                      <span className="ip-address">
                        {selectedClient.lastLoginIp}
                      </span>
                    </div>
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
                    <div className="detail-value">{selectedClient.dateCreated}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{selectedClient.lastUpdated}</div>
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