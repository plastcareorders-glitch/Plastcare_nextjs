import React from "react";

export default function Policy() {
  const styles = {
    container: {
      maxWidth: "1024px",
      margin: "0 auto",
      padding: "48px 24px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: "#2d3748",
      lineHeight: 1.6,
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "24px",
      color: "#1a202c",
      borderBottom: "2px solid #3182ce",
      paddingBottom: "12px",
      display: "inline-block",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      marginTop: "40px",
      marginBottom: "16px",
      color: "#2c5282",
    },
    paragraph: {
      marginBottom: "16px",
    },
    list: {
      listStyleType: "disc",
      paddingLeft: "24px",
      marginBottom: "20px",
    },
    listItem: {
      marginBottom: "8px",
    },
    bold: {
      fontWeight: 600,
      color: "#1a202c",
    },
    lastUpdated: {
      marginTop: "48px",
      fontSize: "0.875rem",
      color: "#718096",
      fontStyle: "italic",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "16px",
    },
    contactList: {
      listStyleType: "disc",
      paddingLeft: "24px",
      marginTop: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>

      <p style={styles.paragraph}>
        Welcome to <strong style={styles.bold}>PlastCare</strong>. Your privacy
        is important to us. This Privacy Policy explains how we collect, use,
        and protect your personal information when you use our website and
        services.
      </p>

      <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
      <p style={styles.paragraph}>
        When you use PlastCare, we may collect the following information:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          Name and contact details (email address, phone number).
        </li>
        <li style={styles.listItem}>Shipping and billing address.</li>
        <li style={styles.listItem}>Payment information when making purchases.</li>
        <li style={styles.listItem}>Account login details.</li>
        <li style={styles.listItem}>
          Device information such as IP address, browser type, and operating system.
        </li>
      </ul>

      <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
      <p style={styles.paragraph}>We use your information to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Process and deliver your orders.</li>
        <li style={styles.listItem}>Provide customer support.</li>
        <li style={styles.listItem}>Improve our website and user experience.</li>
        <li style={styles.listItem}>Send order updates and promotional offers.</li>
        <li style={styles.listItem}>Prevent fraud and ensure security.</li>
      </ul>

      <h2 style={styles.sectionTitle}>3. Sharing Your Information</h2>
      <p style={styles.paragraph}>
        We do not sell or rent your personal information. However, we may share
        your data with trusted third parties such as:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Payment processors to complete transactions.</li>
        <li style={styles.listItem}>Shipping and logistics partners to deliver orders.</li>
        <li style={styles.listItem}>Analytics providers to improve our services.</li>
      </ul>

      <h2 style={styles.sectionTitle}>4. Cookies and Tracking</h2>
      <p style={styles.paragraph}>
        PlastCare uses cookies and similar technologies to improve website
        functionality, remember user preferences, and analyze website traffic.
      </p>

      <h2 style={styles.sectionTitle}>5. Data Security</h2>
      <p style={styles.paragraph}>
        We implement appropriate security measures to protect your personal
        information from unauthorized access, alteration, or disclosure.
        However, no online transmission is 100% secure.
      </p>

      <h2 style={styles.sectionTitle}>6. Your Rights</h2>
      <p style={styles.paragraph}>
        You have the right to access, update, or delete your personal
        information. You may also unsubscribe from promotional emails at any
        time.
      </p>

      <h2 style={styles.sectionTitle}>7. Changes to This Policy</h2>
      <p style={styles.paragraph}>
        PlastCare may update this Privacy Policy from time to time. Any changes
        will be posted on this page with an updated revision date.
      </p>

      <h2 style={styles.sectionTitle}>8. Contact Us</h2>
      <p style={styles.paragraph}>
        If you have any questions about this Privacy Policy, you can contact us:
      </p>

      <ul style={styles.contactList}>
        <li style={styles.listItem}>Email: support@plastcare.in</li>
        <li style={styles.listItem}>Phone: 09667022185</li>
        <li style={styles.listItem}>Website: www.plastcare.in</li>
      </ul>

      <div style={styles.lastUpdated}>Last Updated: March 2026</div>
    </div>
  );
}