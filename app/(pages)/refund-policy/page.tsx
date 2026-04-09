import React from "react";

export default function Refund() {
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
      <h1 style={styles.title}>Refund and Cancellation Policy</h1>

      <p style={styles.paragraph}>
        At <strong style={styles.bold}>PlastCare</strong>, we strive to ensure your satisfaction with every purchase. If you are not completely happy with your order, this policy outlines your options for refunds, returns, and cancellations.
      </p>

      <h2 style={styles.sectionTitle}>1. Eligibility for Refunds</h2>
      <p style={styles.paragraph}>
        You may be eligible for a full or partial refund under the following circumstances:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          The item is damaged, defective, or incorrect upon delivery.
        </li>
        <li style={styles.listItem}>
          You cancel your order before it has been shipped.
        </li>
        <li style={styles.listItem}>
          You return an unused, non‑perishable item in its original packaging within 7 days of delivery.
        </li>
      </ul>

      <h2 style={styles.sectionTitle}>2. Non‑Refundable Items</h2>
      <p style={styles.paragraph}>
        Certain items cannot be refunded or exchanged, including:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          Perishable goods (if any) or items that are not in their original condition.
        </li>
        <li style={styles.listItem}>
          Products that have been used, altered, or damaged after delivery.
        </li>
        <li style={styles.listItem}>
          Gift cards or promotional items.
        </li>
      </ul>

      <h2 style={styles.sectionTitle}>3. Return Process</h2>
      <p style={styles.paragraph}>
        To initiate a return, please contact us within 7 days of receiving your order. Provide your order number, a description of the issue, and photographs if the item is damaged or incorrect. We will guide you through the return procedure.
      </p>
      <p style={styles.paragraph}>
        Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7–10 business days.
      </p>

      <h2 style={styles.sectionTitle}>4. Cancellation Policy</h2>
      <p style={styles.paragraph}>
        Orders can be cancelled free of charge before they are shipped. To cancel, please email us immediately at <strong style={styles.bold}>support@plastcare.in</strong> with your order number. Once an order has been dispatched, it cannot be cancelled, and you will need to follow the return process after delivery.
      </p>

      <h2 style={styles.sectionTitle}>5. Shipping Costs for Returns</h2>
      <p style={styles.paragraph}>
        If the return is due to our error (e.g., wrong or damaged item), PlastCare will cover the return shipping costs. For other reasons (e.g., change of mind), the customer is responsible for return shipping charges. Shipping costs are non‑refundable.
      </p>

      <h2 style={styles.sectionTitle}>6. Late or Missing Refunds</h2>
      <p style={styles.paragraph}>
        If you haven’t received a refund after the stated period, first check your bank account again. Then contact your credit card company or bank – it may take some time before your refund is officially posted. If you’ve done all of this and still have not received your refund, please email us at <strong style={styles.bold}>support@plastcare.in</strong>.
      </p>

      <h2 style={styles.sectionTitle}>7. Contact Information</h2>
      <p style={styles.paragraph}>
        For any questions or to request a refund or cancellation, please reach out to us:
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