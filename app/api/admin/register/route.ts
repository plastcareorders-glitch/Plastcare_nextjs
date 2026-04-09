// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Admin } from "@/app/_backend/models/admin.model";

const JWT_SECRET = process.env.JWT_SECRET || "wddcdscnddiv";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields (username, email, password) are required." },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin already exists with this email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get client IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      registrationIp: ip,
    });

    // Generate JWT for auto-login
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Admin registered successfully.",
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Admin Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}