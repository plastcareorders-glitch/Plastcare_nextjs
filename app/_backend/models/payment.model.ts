import mongoose, { Schema, Document, models, model } from "mongoose";

// 👇 Payment Status Type
export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "order_placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered";

// 👇 Interface
export interface IPayment extends Document {
  Shipping: mongoose.Types.ObjectId;
  ProductId: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;

  paymentMethod: string;

  razorpayPaymentId?: string;
  razorpaySignature?: string;

  transactionId: string;

  amount: number;
  currency: string;

  status: PaymentStatus;

  orderId?: string;

  gateway: string;

  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

// 👇 Schema
const PaymentSchema = new Schema<IPayment>(
  {
    Shipping: {
      type: Schema.Types.ObjectId,
      ref: "Shipping",
      required: true,
    },

    ProductId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "order_placed",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
      ],
      default: "pending",
    },

    orderId: {
      type: String,
      index: true,
    },

    gateway: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// 👇 Indexing (important for scaling)
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });

// 👇 Prevent Overwrite Error (Next.js fix)
export const Payment =
  models.Payment || model<IPayment>("Payment", PaymentSchema);