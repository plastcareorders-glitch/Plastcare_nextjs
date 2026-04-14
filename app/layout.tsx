// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import LayoutWrapper from "./LayoutWrapper";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buy Kitchen Essentials Online in Delhi NCR & UP | Best Manual Tools & Cutters",
  description:
    "Shop premium kitchen essentials in Delhi, Noida, Gurgaon, Ghaziabad, Faridabad & UP. Manual vegetable choppers, dry fruit cutters, French fries makers, hung curd makers & more. Free shipping above ₹999. 2-year warranty.",
  keywords: [
    "kitchen essentials Delhi NCR",
    "manual vegetable chopper",
    "dry fruit cutter",
    "French fries maker",
    "hung curd maker",
    "kitchen tools online UP",
    "best kitchen gadgets India",
    "PlastCare kitchen products",
    "sink drainer basket",
    "barbeque stand for gas stove",
  ],
  authors: [{ name: "PlastCare" }],
  openGraph: {
    title: "PlastCare – Kitchen Essentials for Delhi NCR & UP",
    description:
      "Upgrade your kitchen with manual choppers, slicers, peelers & more. Fast delivery across Delhi, NCR, Uttar Pradesh. Shop now!",
    url: "https://plastcare.in",
    siteName: "PlastCare",
    images: [
      {
        url: "https://plastcare.in/_next/image?url=%2Flogo.png&w=128&q=75",
        width: 1200,
        height: 630,
        alt: "PlastCare Kitchen Essentials Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Essentials Online – Free Shipping in Delhi NCR & UP",
    description:
      "Manual vegetable choppers, dry fruit slicers, hung curd makers & more. Order now!",
    images: ["https://plastcare.in/_next/image?url=%2Flogo.png&w=128&q=75"],
  },
  alternates: {
    canonical: "https://plastcare.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code if available
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON‑LD structured data for LocalBusiness / OnlineStore
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "PlastCare",
    url: "https://plastcare.in",
    logo: "https://plastcare.in/_next/image?url=%2Flogo.png&w=128&q=75",
    description:
      "Online store for kitchen essentials serving Delhi NCR and Uttar Pradesh.",
    areaServed: [
      { "@type": "City", name: "Delhi" },
      { "@type": "City", name: "Noida" },
      { "@type": "City", name: "Ghaziabad" },
      { "@type": "City", name: "Gurgaon" },
      { "@type": "City", name: "Faridabad" },
      { "@type": "State", name: "Uttar Pradesh" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi NCR",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "INR",
        price: "690",
      },
      availability: "https://schema.org/InStock",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://plastcare.in/all-products",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON‑LD structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ProductProvider>
          <AuthProvider>
            <CartProvider>
              {/* ✅ Conditional Layout Here */}
              <LayoutWrapper>{children}</LayoutWrapper>
            </CartProvider>
          </AuthProvider>
        </ProductProvider>
      </body>
    </html>
  );
}