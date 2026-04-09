// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";
import { sendVerificationEmail } from "@/app/_backend/util/email";
import { generateOTP, getOTPExpiry } from "@/app/_backend/libs/otp";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    // Case 1: Verified user exists
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "Email already registered and verified" },
        { status: 400 }
      );
    }

    // Case 2: Unverified user exists → update OTP and resend
    if (existingUser && !existingUser.isVerified) {
      const otp = generateOTP();
      const otpExpires = getOTPExpiry();

      existingUser.username = username;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otpCode = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();

      await sendVerificationEmail(email, otp);

      return NextResponse.json(
        {
          message:
            "Account already exists but not verified. A new OTP has been sent to your email.",
          requiresVerification: true,
          email,
        },
        { status: 200 }
      );
    }

    // Case 3: New user
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      otpCode: otp,
      otpExpires,
      lastOtpSentAt: new Date(),
      registrationIp: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "",
    });

    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      {
        success: true,
        message: "User registered. Please verify your email using the OTP sent.",
        requiresVerification: true,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Register error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}