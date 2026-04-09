// app/api/orders/route.ts (or wherever your route lives)

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { getAuthUser } from "@/app/_backend/util/auth";
import { Cart } from "@/app/_backend/models/cart.model";
import { Product } from "@/app/_backend/models/product.model";
import { Shipping } from "@/app/_backend/models/shipping.model";
import { Payment } from "@/app/_backend/models/payment.model";
import { Order } from "@/app/_backend/models/order.model";

function generateTransactionId(): string {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { shippingAddressId, paymentMethod, selectedItems, notes } = await req.json();

    if (!shippingAddressId) {
      return NextResponse.json({ message: "Shipping address required" }, { status: 400 });
    }
    if (!selectedItems || selectedItems.length === 0) {
      return NextResponse.json({ message: "No items selected" }, { status: 400 });
    }

    // Validate shipping address
    const shipping = await Shipping.findOne({
      _id: new mongoose.Types.ObjectId(shippingAddressId),
      user: new mongoose.Types.ObjectId(user._id),
    });
    if (!shipping) {
      return NextResponse.json({ message: "Invalid shipping address" }, { status: 400 });
    }

    // Validate products & stock, prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const sel of selectedItems) {
      const product = await Product.findById(sel.productId);
      if (!product) {
        return NextResponse.json({ message: `Product not found: ${sel.productId}` }, { status: 400 });
      }
      if (product.stock < sel.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${product.title}` }, { status: 400 });
      }
      const price = product.salePrice || product.price;
      orderItems.push({
        product: product._id,
        quantity: sel.quantity,
        price,
        variant: sel.variant,
      });
      totalAmount += price * sel.quantity;
    }

    // Create payment record
    const transactionId = generateTransactionId();
    let gateway: "cod" | "cashfree" | null = null;
    if (paymentMethod === "cod") gateway = "cod";
    else if (paymentMethod === "cashfree") gateway = "cashfree";
    else {
      return NextResponse.json({ message: "Unsupported payment method" }, { status: 400 });
    }

    const payment = await Payment.create({
      Shipping: shipping._id,
      ProductId: orderItems.map(i => i.product),
      user: user._id,
      paymentMethod,
      transactionId,
      amount: totalAmount,
      currency: "INR",
      status: "pending",
      gateway,
      metadata: { notes },
    });

    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shipping: shipping._id,
      payment: payment._id,
      totalAmount,
      status: "pending",
      notes: notes || null,
    });

    payment.orderId = order._id.toString();
    await payment.save();

    // ✅ FIXED: Remove selected items from cart (with correct matching)
    const cart = await Cart.findOne({ user: user._id });
    if (cart && cart.items.length > 0) {
      // Build a set of unique keys for selected items (productId + variant)
      const selectedKeys = new Set(
        selectedItems.map((sel: any) => {
          const variantKey = sel.variant
            ? `${sel.variant.name}|${sel.variant.value}`
            : "";
          return `${sel.productId.toString()}|${variantKey}`;
        })
      );

      // Filter out items that are present in the selected set
      const remainingItems = cart.items.filter((item: any) => {
        const itemProductId = item.product._id
          ? item.product._id.toString()
          : item.product.toString();
        const itemVariantKey = item.variant
          ? `${item.variant.name}|${item.variant.value}`
          : "";
        const itemKey = `${itemProductId}|${itemVariantKey}`;
        return !selectedKeys.has(itemKey);
      });

      // Recalculate cart totals
      let newTotalAmount = 0;
      let newTotalItems = 0;
      for (const item of remainingItems) {
        newTotalAmount += item.price * item.quantity;
        newTotalItems += item.quantity;
      }

      cart.items = remainingItems;
      cart.totalAmount = newTotalAmount;
      cart.totalItems = newTotalItems;
      await cart.save();
    }

    // Handle stock deduction & final status for COD
    if (paymentMethod === "cod") {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
      payment.status = "order_placed";
      await payment.save();
      order.status = "processing";
      await order.save();

      return NextResponse.json({
        success: true,
        message: "Order placed successfully (Cash on Delivery)",
        orderId: order._id,
        paymentId: payment._id,
      });
    } else if (paymentMethod === "cashfree") {
      return NextResponse.json({
        success: true,
        message: "Order created. Proceed to payment.",
        orderId: order._id,
        paymentId: payment._id,
        transactionId,
        amount: totalAmount,
      });
    } else {
      return NextResponse.json({ message: "Unsupported payment method" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET handler remains unchanged (it works correctly)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: user._id })
      .populate("items.product", "title images price")
      .populate("shipping")
      .populate("payment")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}