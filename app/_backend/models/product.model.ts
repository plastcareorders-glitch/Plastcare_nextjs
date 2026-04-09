import mongoose, { Schema, Document, models, model } from "mongoose";

// 👇 Image Type
interface IImage {
  public_id: string;
  url: string;
}

// 👇 Variant Type
interface IVariant {
  name?: string;
  value?: string;
}

// 👇 Product Interface
export interface IProduct extends Document {
  title: string;
  description: string;

  images: IImage[];

  price: number;
  salePrice?: number | null;

  category:
    | "Cookware"
    | "Home Storage"
    | "Kitchen Essentials"
    | "Bathroom Essentials"
    | "Home Furnishing"
    | "Wooden Furniture"
    | "Kids"
    | "Sofa";

  brand?: string;

  stock: number;
  sku?: string;

  variants: IVariant[];

  rating: number;
  totalReviews: number;

  isFeatured: boolean;

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

// 👇 Schema
const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: null,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Cookware",
        "Home Storage",
        "Kitchen Essentials",
        "Bathroom Essentials",
        "Home Furnishing",
        "Wooden Furniture",
        "Kids",
        "Sofa",
      ],
    },

    brand: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    variants: [
      {
        name: String,
        value: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// 👇 Prevent Overwrite Error (Next.js hot reload fix)
export const Product =
  models.Product || model<IProduct>("Product", ProductSchema);