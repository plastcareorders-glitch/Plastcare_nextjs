// app/shipping-policy/page.tsx (or components/ShippingPolicy.tsx)
import React from "react";

export default function ShippingPolicy() {
  const styles: { [key: string]: React.CSSProperties } = {
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
      <h1 style={styles.title}>Shipping Policy</h1>

      <p style={styles.paragraph}>
        At <strong style={styles.bold}>PlastCare</strong>, we are committed to delivering your kitchen
        essentials—like coconut cutters, BBQ tools, and more—quickly and safely. Please read our shipping
        policy to understand how we process and ship your orders.
      </p>

      <h2 style={styles.sectionTitle}>1. Order Processing</h2>
      <p style={styles.paragraph}>
        All orders are processed within <strong style={styles.bold}>1–2 business days</strong> (excluding
        weekends and holidays). After processing, you will receive a confirmation email with tracking
        information once your order has been shipped.
      </p>

      <h2 style={styles.sectionTitle}>2. Shipping Methods & Delivery Times</h2>
      <p style={styles.paragraph}>
        We currently ship to all addresses within India. Delivery times depend on your location and the
        shipping method selected at checkout:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <strong style={styles.bold}>Standard Shipping:</strong> 3–7 business days.
        </li>
        <li style={styles.listItem}>
          <strong style={styles.bold}>Express Shipping:</strong> 1–3 business days (available in select areas).
        </li>
      </ul>
      <p style={styles.paragraph}>
        Please note that delivery times are estimates and may be affected by factors beyond our control (e.g.,
        weather, courier delays, peak seasons).
      </p>

      <h2 style={styles.sectionTitle}>3. Shipping Costs</h2>
      <p style={styles.paragraph}>
        Shipping charges are calculated based on the weight, dimensions, and destination of your order. The
        exact cost will be displayed at checkout before you complete your purchase.
      </p>
      <p style={styles.paragraph}>
        <strong style={styles.bold}>Free Shipping:</strong> We offer free standard shipping on orders over
        ₹999 (within India). No promo code is needed—the discount will automatically apply at checkout.
      </p>

      <h2 style={styles.sectionTitle}>4. Tracking Your Order</h2>
      <p style={styles.paragraph}>
        Once your order is dispatched, you will receive a shipping confirmation email containing a tracking
        number and a link to track your package. You can also track your order by logging into your PlastCare
        account and visiting the "Order History" section.
      </p>

      <h2 style={styles.sectionTitle}>5. Shipping Areas</h2>
      <p style={styles.paragraph}>
        We currently ship only to addresses within India. We do not ship internationally at this time. If you
        are located outside India and wish to purchase our products, please contact us for possible
        arrangements.
      </p>

      <h2 style={styles.sectionTitle}>6. Undeliverable Packages</h2>
      <p style={styles.paragraph}>
        Occasionally, packages may be returned to us as undeliverable due to incorrect addresses, failed
        delivery attempts, or other reasons. If a package is returned, we will contact you to arrange
        reshipment. Additional shipping fees may apply.
      </p>

      <h2 style={styles.sectionTitle}>7. Damaged or Lost Shipments</h2>
      <p style={styles.paragraph}>
        PlastCare is not liable for lost or damaged packages once they are in the custody of the carrier.
        However, if your order arrives damaged, please contact us immediately at{" "}
        <strong style={styles.bold}>support@plastcare.in</strong> with your order number and photos of the
        damage. We will work with you to resolve the issue.
      </p>

      <h2 style={styles.sectionTitle}>8. Contact Us</h2>
      <p style={styles.paragraph}>
        If you have any questions about our shipping policy or need assistance with your order, please reach
        out:
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