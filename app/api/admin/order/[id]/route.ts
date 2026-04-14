// app/api/admin/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Order } from "@/app/_backend/models/order.model";

const JWT_SECRET = process.env.JWT_SECRET || "wddcdscnddiv";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // 1. Admin Authentication
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token." },
        { status: 401 }
      );
    }

    // 2. Get order ID from params (await because params is a Promise in Next.js 15+)
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    // 3. Get new status from request body
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status field is required." },
        { status: 400 }
      );
    }

    // 4. Validate status against allowed enum values
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 5. Find order and update status
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Optional: prevent certain status transitions (e.g., cannot change delivered to pending)
    // Add your business logic here if needed

    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order: {
        id: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin Update Order Status Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while updating order status." },
      { status: 500 }
    );
  }
}