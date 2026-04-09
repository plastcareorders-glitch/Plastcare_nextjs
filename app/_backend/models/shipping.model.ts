import mongoose, { Schema, Document, models, model } from "mongoose";

// 👇 Address Type
interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// 👇 Shipping Interface
export interface IShipping extends Document {
  user: mongoose.Types.ObjectId;
  address: IAddress;

  isDefault: boolean;
  label: string;

  createdAt: Date;
  updatedAt: Date;
}

// 👇 Schema
const ShippingSchema = new Schema<IShipping>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: {
        type: String,
        required: true,
        default: "India",
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: "Home",
    },
  },
  { timestamps: true }
);

// 👇 Prevent Overwrite Error in Next.js
export const Shipping =
  models.Shipping || model<IShipping>("Shipping", ShippingSchema);