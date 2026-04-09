import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Admin } from "@/app/_backend/models/admin.model";

const JWT_SECRET = process.env.JWT_SECRET || "wddcdscnddiv";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found." },
        { status: 404 }
      );
    }

    // Check if account is locked
    if (admin.isLocked && admin.lockoutUntil && admin.lockoutUntil > new Date()) {
      const remaining = Math.ceil((admin.lockoutUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { success: false, message: `Account locked. Try again in ${remaining} minutes.` },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      admin.failedAttempts += 1;
      if (admin.failedAttempts >= 5) {
        admin.isLocked = true;
        admin.lockoutUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      }
      await admin.save();

      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful login
    admin.failedAttempts = 0;
    admin.isLocked = false;
    admin.lockoutUntil = null;

    // Update last login IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    admin.lastLoginIp = ip;
    await admin.save();

    // Generate JWT
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Admin Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}