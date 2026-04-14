// app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

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

    // 2. Parse query parameters for pagination and search
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // 3. Build filter condition
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // 4. Fetch customers with pagination, exclude sensitive fields
    const [customers, total] = await Promise.all([
      User.find(filter)
        .select("-password -otpCode -otpExpires -resetPasswordToken -resetPasswordExpire")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin Fetch Customers Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching customers." },
      { status: 500 }
    );
  }
}