// app/return-policy/page.tsx (or components/ReturnPolicy.tsx)
import React from "react";

export default function ReturnPolicy() {
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
      <h1 style={styles.title}>Return Policy</h1>

      <p style={styles.paragraph}>
        At <strong style={styles.bold}>PlastCare</strong>, we want you to love your purchase. If for any
        reason you are not completely satisfied, our return policy makes it easy to return eligible items.
      </p>

      <h2 style={styles.sectionTitle}>1. Return Window</h2>
      <p style={styles.paragraph}>
        You have <strong style={styles.bold}>7 days from the date of delivery</strong> to initiate a return.
        Items must be unused, in their original condition, and in the original packaging.
      </p>

      <h2 style={styles.sectionTitle}>2. Eligible Items for Return</h2>
      <p style={styles.paragraph}>
        Most products sold on PlastCare are eligible for return, including kitchen items such as coconut
        cutters, BBQ tools, utensils, and other non‑perishable goods. However, the following are not eligible:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Perishable items (if any) or products that have been used.</li>
        <li style={styles.listItem}>Items without original packaging or with missing parts.</li>
        <li style={styles.listItem}>Gift cards or promotional merchandise.</li>
      </ul>

      <h2 style={styles.sectionTitle}>3. How to Return an Item</h2>
      <p style={styles.paragraph}>
        To start a return, please email us at <strong style={styles.bold}>support@plastcare.in</strong> with
        your order number and the reason for return. We will provide you with a return authorization and
        instructions on where to send the package.
      </p>
      <p style={styles.paragraph}>
        Pack the item securely in its original packaging, including all accessories and tags. Ship the
        package to the address provided. We recommend using a trackable shipping service, as PlastCare is
        not responsible for lost or damaged return shipments.
      </p>

      <h2 style={styles.sectionTitle}>4. Return Shipping Costs</h2>
      <p style={styles.paragraph}>
        If the return is due to a defect, error on our part, or damage during transit, PlastCare will cover
        the return shipping cost. For returns initiated for other reasons (e.g., change of mind), the
        customer is responsible for return shipping fees. Original shipping charges are non‑refundable.
      </p>

      <h2 style={styles.sectionTitle}>5. Inspection and Refund</h2>
      <p style={styles.paragraph}>
        Once we receive your return, we will inspect the item. If the return meets our policy criteria, we
        will process a refund to your original payment method within 7–10 business days. You will receive a
        confirmation email once the refund is issued.
      </p>
      <p style={styles.paragraph}>
        If the returned item is damaged, worn, or missing parts, we may reject the refund or deduct a
        restocking fee. In such cases, we will notify you via email.
      </p>

      <h2 style={styles.sectionTitle}>6. Exchanges</h2>
      <p style={styles.paragraph}>
        If you received a defective or incorrect item, we will gladly exchange it for the correct product.
        Please contact us to arrange an exchange. For other cases, it is usually faster to return the
        unwanted item for a refund and place a new order separately.
      </p>

      <h2 style={styles.sectionTitle}>7. Contact Us</h2>
      <p style={styles.paragraph}>
        If you have any questions about our return policy or need assistance, please reach out:
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