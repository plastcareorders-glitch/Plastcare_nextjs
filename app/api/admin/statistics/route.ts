// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Order } from "@/app/_backend/models/order.model";
import { Product } from "@/app/_backend/models/product.model";
import { Shipping } from "@/app/_backend/models/shipping.model";
import { Payment } from "@/app/_backend/models/payment.model";

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

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token." },
        { status: 401 }
      );
    }

    // 2. Calculate start of current week (Monday 00:00:00)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // days to subtract to get Monday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // 3. Fetch statistics in parallel
    const [totalOrdersThisWeek, totalProducts, totalShipping, paymentAggThisWeek] = await Promise.all([
      // Orders created this week
      Order.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),

      // Total products (all time)
      Product.countDocuments(),

      // Total shipping addresses (all time)
      Shipping.countDocuments(),

      // Completed payments this week
      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startOfWeek },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const totalSalesThisWeek = paymentAggThisWeek.length > 0 ? paymentAggThisWeek[0].total : 0;

    // 4. Return response
    return NextResponse.json({
      success: true,
      stats: {
       
        totalOrders: totalOrdersThisWeek,
        totalProducts,
        totalShipping,
      },
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching statistics." },
      { status: 500 }
    );
  }
}