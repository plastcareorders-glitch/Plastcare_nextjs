// app/api/admin/orders/recent/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Order } from "@/app/_backend/models/order.model";

const JWT_SECRET = process.env.JWT_SECRET || "wddcdscnddiv";

export async function GET(req: NextRequest) {
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

    // 2. Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // optional: start of that day

    // 3. Fetch orders created in the last 7 days with populated references
    const recentOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("user", "username email profilePic")
      .populate("items.product", "name price images")
      .populate("shipping") // full shipping details
      .populate("payment")  // full payment details
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({
      success: true,
      count: recentOrders.length,
      orders: recentOrders,
    });
  } catch (error) {
    console.error("Admin Recent Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching orders data." },
      { status: 500 }
    );
  }
}
