// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

const MAX_FAILED_ATTEMPTS = 5;        // lock after 5 wrong attempts
const LOCKOUT_DURATION_MINUTES = 15;  // unlock after 15 minutes

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked && user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        { message: `Account is locked. Try again in ${remainingMinutes} minutes.` },
        { status: 403 }
      );
    }

    // If lockout expired, reset lock fields
    if (user.isLocked && user.lockoutUntil && user.lockoutUntil <= new Date()) {
      user.isLocked = false;
      user.lockoutUntil = null;
      user.failedAttempts = 0;
      await user.save();
    }

    // Check password (only if authProvider is local or has password)
    const isValid = user.password && (await bcrypt.compare(password, user.password));
    if (!isValid) {
      // Increment failed attempts
      user.failedAttempts += 1;
      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        user.isLocked = true;
        user.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }
      await user.save();

      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Successful login – reset failed attempts and lock fields
    user.failedAttempts = 0;
    user.isLocked = false;
    user.lockoutUntil = null;
    user.lastLoginIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "";
    await user.save();

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set cookie and return user info
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
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
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}