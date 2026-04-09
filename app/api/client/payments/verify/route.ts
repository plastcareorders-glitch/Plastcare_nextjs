import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Payment } from "@/app/_backend/models/payment.model";
import { Order } from "@/app/_backend/models/order.model";
import { Product } from "@/app/_backend/models/product.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { orderId, paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    // Update payment
    const payment = await Payment.findById(paymentId);
    if (!payment) return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 });

    payment.status = "completed";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Update order status
    const order = await Order.findById(orderId);
    if (order) {
      order.status = "processing";
      await order.save();

      // Deduct stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }

    return NextResponse.json({ success: true, message: "Payment verified and order confirmed" });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}