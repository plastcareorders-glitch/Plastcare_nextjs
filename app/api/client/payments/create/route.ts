import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { getAuthUser } from "@/app/_backend/util/auth";
import { Payment } from "@/app/_backend/models/payment.model";

// Helper to generate a Cashfree‑compliant order ID (max 50 chars, alphanumeric + underscore)
function generateCashfreeOrderId(paymentId: string): string {
  // Use payment's MongoDB _id (12 or 24 hex chars) + timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  const shortId = paymentId.slice(-12); // last 12 chars of ObjectId
  return `ORD_${shortId}_${timestamp}`.slice(0, 50);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await req.json();
    const payment = await Payment.findOne({ _id: paymentId, user: user._id, status: "pending" });
    if (!payment) {
      return NextResponse.json({ message: "Invalid or already processed payment" }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) {
      console.error("Missing Cashfree credentials");
      return NextResponse.json({ message: "Payment gateway misconfiguration" }, { status: 500 });
    }

    const env = process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox";
    const isProd = env === "production";
    const baseUrl = isProd
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    // Generate a valid order_id for Cashfree
    const cashfreeOrderId = generateCashfreeOrderId(payment._id.toString());

    // Get customer phone – fallback to user's phone or a valid test number
    let customerPhone = user.phone;
    if (!customerPhone || !/^\d{10}$/.test(customerPhone)) {
      // Use a valid sandbox test number (e.g., 9876543210) – never use "9999999999" as it's often blacklisted
      customerPhone = "9876543210";
      console.warn(`User ${user._id} has no valid phone. Using sandbox test number.`);
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order`;
    const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/client/payments/webhook`;

    const orderPayload = {
      order_id: cashfreeOrderId,
      order_amount: payment.amount,
      order_currency: payment.currency || "INR",
      order_note: payment.metadata?.notes || "",
      customer_details: {
        customer_id: user._id.toString(),
        customer_email: user.email,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
        payment_methods: "cc,dc,upi,nb",
      },
    };

    console.log("📤 Sending to Cashfree:", JSON.stringify(orderPayload, null, 2));

    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();
    console.log("📥 Cashfree response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Cashfree error response:", data);
      throw new Error(data.message || "Cashfree order creation failed");
    }

    // Extract payment_session_id
    const paymentSessionId = data.payment_session_id;
    if (!paymentSessionId) {
      console.error("Cashfree response missing payment_session_id", data);
      throw new Error("Cashfree did not return a payment session ID");
    }

    // Save Cashfree metadata
    payment.metadata = {
      ...payment.metadata,
      cashfreeOrderId: data.order_id,
      paymentSessionId: paymentSessionId,
    };
    await payment.save();

    // Return the exact session ID (no sanitization – Cashfree returns a clean one)
    return NextResponse.json({
      success: true,
      paymentSessionId: paymentSessionId,
      orderId: data.order_id,
      paymentId: payment._id,
    });
  } catch (error: any) {
    console.error("Cashfree order creation error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}