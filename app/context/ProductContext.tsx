"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface IProductImage {
  public_id: string;
  url: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  images: IProductImage[];
  price: number;
  salePrice: number | null;
  category: string;
  brand?: string;
  stock: number;
  sku?: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductContextType {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  // For client‑side search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: IProduct[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);

  // Fetch all products once (increase limit to get everything)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        // Use a high limit to fetch all products (adjust if you have more)
        const response = await axios.get("/api/client/products/fetch-all-products?limit=200&sort=title");
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err: any) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Client‑side search whenever searchQuery or products change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      // Search in title, description, tags, and category
      return (
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    });
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const value: ProductContextType = {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchResults,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}