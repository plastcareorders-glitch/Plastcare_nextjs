// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please register first." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email already verified. Please login." },
        { status: 400 }
      );
    }

    // Check if OTP exists
    if (!user.otpCode) {
      return NextResponse.json(
        { message: "No OTP request found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check OTP match
    if (user.otpCode !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check expiry (using stored otpExpires)
    if (!user.otpExpires || user.otpExpires < new Date()) {
      const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || "5";
      return NextResponse.json(
        { message: `OTP expired after ${expiryMinutes} minutes. Please request a new one.` },
        { status: 400 }
      );
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.lastOtpSentAt = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully. You are now logged in.",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("❌ OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}