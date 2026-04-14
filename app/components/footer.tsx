"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// Place the logo image in your public folder (e.g., public/logo.png) and adjust the import path
import logo from "@/public/logo.png"; // Change to your actual logo path

interface FooterLink {
  name: string;
  href: string;
}

export default function Footer() {
  const companyLinks: FooterLink[] = [
    { name: "About Us", href: "/about" },
    { name: "Store Locator", href: "/store-locator" },
    { name: "Frequently Asked Questions", href: "/faq" },
    { name: "Blog", href: "/blog" },
    { name: "Return, Exchange & Refund Policy", href: "/returns" },
    { name: "privacy-policy", href: "https://plastcare.in/privacy-policy" },
    { name: "refund-policy", href: "https://plastcare.in/refund-policy" },
    { name: "return-policy", href: "https://plastcare.in/return-policy" },
    { name: "shipping-policy", href: "https://plastcare.in/shipping-policy" },
    { name: "Terms & Conditions", href: "https://plastcare.in/terms" },
    { name: "Reviews", href: "/reviews" },
  ];

  const resourceLinks: FooterLink[] = [
    { name: "Instant WhatsApp Support", href: "/whatsapp" },
    { name: "Call 09667022185 (Mon-Sat 10am-7pm)", href: "tel:+919667022185" },
    { name: "Contact Us Form", href: "/contact" },
    { name: "Track Your Order", href: "/track-order" },
  ];

  const collectionLinks: FooterLink[] = [
    { name: "Bedroom Organisers", href: "/category/bedroom-organisers" },
    { name: "Wardrobe Organisers", href: "/category/wardrobe-organisers" },
    { name: "Living Room Organisers", href: "/category/living-room-organisers" },
    { name: "Shoe Racks", href: "/category/shoe-racks" },
    { name: "Storage Trolleys", href: "/category/storage-trolleys" },
    { name: "Bins, Boxes & Baskets", href: "/category/bins-boxes-baskets" },
    { name: "Sofa Covers", href: "/category/sofa-covers" },
    { name: "Bathroom Essentials", href: "/category/bathroom-essentials" },
  ];

  const categoryLinks: FooterLink[] = [
    { name: "Cast Iron Cookware", href: "/category/cast-iron-cookware" },
    { name: "Stainless Steel Cookware", href: "/category/stainless-steel-cookware" },
    { name: "Cookers", href: "/category/cookers" },
    { name: "Maifan Stone Cookware", href: "/category/maifan-stone-cookware" },
    { name: "Storage and Containers", href: "/category/storage-containers" },
    { name: "Metal Racks", href: "/category/metal-racks" },
    { name: "Plastic Racks", href: "/category/plastic-racks" },
    { name: "Serveware", href: "/category/serveware" },
    { name: "Kitchen Tools", href: "/category/kitchen-tools" },
    { name: "Kitchen Appliances", href: "/category/kitchen-appliances" },
    { name: "Drinkware", href: "/category/drinkware" },
  ];

  return (
    <>
      <style jsx>{`
        .footer {
          background: #956250;
          color: white;
          padding: 3rem 0 1.5rem;
        }
        .footer-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .footer-main {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
        @media (max-width: 640px) {
          .footer-main {
            grid-template-columns: 1fr;
          }
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .logo-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 0.25rem;
          object-fit: contain;
        }
        .logo-subtitle {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.9);
        }
        .tagline {
          font-size: 0.95rem;
          color: white;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .promo-section {
          margin-bottom: 1rem;
        }
        .promo-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .promo-text {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.95);
        }
        .app-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .app-button {
          height: 2.5rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .app-button:hover {
          opacity: 0.9;
        }
        .footer-section {
          display: flex;
          flex-direction: column;
        }
        .footer-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: white;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .footer-link:hover {
          color: white;
          text-decoration: underline;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-bottom-left {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .language-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
        }
        .country-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
        }
        .flag {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0.125rem;
        }
        .copyright {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          text-align: right;
        }
        .copyright p {
          margin: 0;
        }
        .developer-credit {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }
        .developer-credit a {
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .developer-credit a:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-bottom-left {
            justify-content: center;
          }
          .copyright {
            text-align: center;
          }
          .developer-credit {
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <Image
                  src={logo}
                  alt="PlastCare Logo"
                  className="logo-icon"
                  width={64}
                  height={64}
                  priority={false}
                />
                <div>
                  <div className="logo-subtitle">SHOP • ORGANISE • BASICS</div>
                </div>
              </div>
              <p className="tagline">Elevate Your Home With Smart Products.</p>

              <div className="promo-section">
                <h3 className="promo-title">Want 10% off on your order today?</h3>
                <p className="promo-text">
                  Download our app and get 10% off on your first in-app purchase, to avail Use Code -
                  APP10
                </p>
                <div className="app-buttons">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="app-button"
                    />
                  </a>
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                      className="app-button"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <div className="footer-links">
                {companyLinks.map((link, index) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link key={index} href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Resources Links */}
            <div className="footer-section">
              <h3 className="footer-title">Resources</h3>
              <div className="footer-links">
                {resourceLinks.map((link, index) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link key={index} href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  )
                )}
              </div>

              <h3 className="footer-title" style={{ marginTop: "2rem" }}>
                Collections
              </h3>
              <div className="footer-links">
                {collectionLinks.map((link, index) => (
                  <Link key={index} href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Links */}
            <div className="footer-section">
              <h3 className="footer-title">Our Top Categories</h3>
              <div className="footer-links">
                {categoryLinks.map((link, index) => (
                  <Link key={index} href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <div className="language-selector">
                <span>English</span>
                <span>▼</span>
              </div>
              <div className="country-selector">
                <span className="flag">🇮🇳</span>
                <span>India (INR ₹)</span>
                <span>▼</span>
              </div>
            </div>
            <div className="copyright">
              <p>© 2026 PlastCare</p>
              <p>Operated by Plast Care International Private Limited</p>
              <p>
                B 411 Upper Ground Floor, New Delhi Street No 10
                <br />
                North Delhi – 110042, India
              </p>
              <p>Email: plastcareorders@gmail.com</p>
              <div className="developer-credit">
                Developed & Designed by{" "}
                <a
                  href="https://lucrido.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lucrido
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
