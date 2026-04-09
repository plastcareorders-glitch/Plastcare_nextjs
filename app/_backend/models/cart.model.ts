// app/_backend/models/cart.model.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

// ✅ Item Interface
interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  variant?: {
    name?: string;
    value?: string;
  };
}

// ✅ Cart Interface
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];

  totalAmount: number;
  totalItems: number;

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Cart Schema
const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true, // price at time of adding
        },
        variant: {
          name: { type: String },
          value: { type: String },
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    totalItems: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index (important for performance)
CartSchema.index({ user: 1 });

// ✅ Prevent overwrite in Next.js (hot reload safe)
export const Cart =
  models.Cart || model<ICart>("Cart", CartSchema);