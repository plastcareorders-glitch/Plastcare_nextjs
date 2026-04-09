// app/_backend/models/order.model.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // price at purchase time
  variant?: { name?: string; value?: string };
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        variant: { name: String, value: String },
      },
    ],
    shipping: { type: Schema.Types.ObjectId, ref: 'Shipping', required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    trackingNumber: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
export const Order = models.Order || model<IOrder>('Order', OrderSchema);