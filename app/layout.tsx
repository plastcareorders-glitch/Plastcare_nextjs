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
  title: "PlastCare",
  description: "Shop Quality Products Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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