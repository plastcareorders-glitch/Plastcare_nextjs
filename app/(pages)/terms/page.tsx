import React from "react";

export default function Terms() {
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
      <h1 style={styles.title}>Terms and Conditions</h1>

      <p style={styles.paragraph}>
        Welcome to <strong style={styles.bold}>PlastCare</strong>. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
      </p>

      <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
      <p style={styles.paragraph}>
        By using PlastCare, you confirm that you accept these terms and that you agree to comply with them. If you do not agree, you must not use our services.
      </p>

      <h2 style={styles.sectionTitle}>2. Use of Our Services</h2>
      <p style={styles.paragraph}>
        You agree to use PlastCare only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our services.
      </p>

      <h2 style={styles.sectionTitle}>3. Accounts and Registration</h2>
      <p style={styles.paragraph}>
        When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
      </p>

      <h2 style={styles.sectionTitle}>4. Intellectual Property</h2>
      <p style={styles.paragraph}>
        The content on PlastCare, including but not limited to text, graphics, logos, images, and software, is the property of PlastCare or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
      </p>

      <h2 style={styles.sectionTitle}>5. Prohibited Activities</h2>
      <p style={styles.paragraph}>You may not engage in any of the following:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Using the service for any illegal purpose.</li>
        <li style={styles.listItem}>Attempting to gain unauthorized access to our systems.</li>
        <li style={styles.listItem}>Interfering with or disrupting the integrity or performance of the service.</li>
        <li style={styles.listItem}>Uploading or transmitting viruses, malware, or any other harmful code.</li>
        <li style={styles.listItem}>Collecting or tracking personal information of others without consent.</li>
      </ul>

      <h2 style={styles.sectionTitle}>6. Termination</h2>
      <p style={styles.paragraph}>
        We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
      </p>

      <h2 style={styles.sectionTitle}>7. Disclaimer of Warranties</h2>
      <p style={styles.paragraph}>
        Our services are provided on an "AS IS" and "AS AVAILABLE" basis. PlastCare makes no representations or warranties of any kind, express or implied, regarding the operation or availability of the website, or the information, content, and materials included therein.
      </p>

      <h2 style={styles.sectionTitle}>8. Limitation of Liability</h2>
      <p style={styles.paragraph}>
        To the fullest extent permitted by law, PlastCare shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein.
      </p>

      <h2 style={styles.sectionTitle}>9. Governing Law</h2>
      <p style={styles.paragraph}>
        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to or use of the website or these Terms shall be instituted in a court in Bangalore, India.
      </p>

      <h2 style={styles.sectionTitle}>10. Changes to Terms</h2>
      <p style={styles.paragraph}>
        PlastCare reserves the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>

      <h2 style={styles.sectionTitle}>11. Contact Us</h2>
      <p style={styles.paragraph}>
        If you have any questions about these Terms, please contact us:
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