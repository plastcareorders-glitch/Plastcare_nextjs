// app/api/admin/shipping/recent/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Shipping } from "@/app/_backend/models/shipping.model";

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

    // 3. Fetch all shipping addresses created in the last 7 days, populate user
    const recentShipping = await Shipping.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("user", "username email profilePic") // select only needed user fields
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({
      success: true,
      count: recentShipping.length,
      shipping: recentShipping,
    });
  } catch (error) {
    console.error("Admin Recent Shipping Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching shipping data." },
      { status: 500 }
    );
  }
}