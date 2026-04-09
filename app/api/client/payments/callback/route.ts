import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Payment } from "@/app/_backend/models/payment.model";
import { Order } from "@/app/_backend/models/order.model";
import { Product } from "@/app/_backend/models/product.model";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return NextResponse.redirect(new URL("/cart?error=missing_order_id", req.url));
    }

    // Verify payment status with Cashfree
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
    const baseUrl = isProd
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    const response = await fetch(`${baseUrl}/orders/${order_id}/payments`, {
      method: "GET",
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": appId!,
        "x-client-secret": secretKey!,
      },
    });

    console.log(response)
    if (!response.ok) {
      throw new Error("Failed to fetch payment status");
    }

    const paymentsData = await response.json();
    // Find the most recent successful payment
    const successfulPayment = paymentsData.find((p: any) => p.payment_status === "SUCCESS");

    const payment = await Payment.findOne({ transactionId: order_id });
    if (!payment) {
      return NextResponse.redirect(new URL("/cart?error=payment_not_found", req.url));
    }

    if (successfulPayment) {
      // Update payment status
      payment.status = "completed";
      payment.cashfreePaymentId = successfulPayment.cf_payment_id;
      await payment.save();

      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = "processing";
        await order.save();

        // Deduct stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
      }

      // Redirect to order success page
      return NextResponse.redirect(new URL(`/orders/${order._id}?payment=success`, req.url));
    } else {
      // Payment failed or pending
      return NextResponse.redirect(new URL(`/cart?error=payment_failed`, req.url));
    }
  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.redirect(new URL("/cart?error=server_error", req.url));
  }
}