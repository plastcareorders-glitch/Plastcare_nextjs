// app/api/resend-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";
import { sendVerificationEmail } from "@/app/_backend/util/email";
import { generateOTP, getOTPExpiry } from "@/app/_backend/libs/otp";

const COOLDOWN_MINUTES = 1; // cannot resend within 1 minute

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
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

    // Cooldown check
    if (user.lastOtpSentAt) {
      const timeSinceLast = Date.now() - new Date(user.lastOtpSentAt).getTime();
      const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
      if (timeSinceLast < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLast) / 1000);
        return NextResponse.json(
          { message: `Please wait ${remainingSeconds} seconds before requesting another OTP.` },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const newOtp = generateOTP();
    const newExpiry = getOTPExpiry();

    user.otpCode = newOtp;
    user.otpExpires = newExpiry;
    user.lastOtpSentAt = new Date();
    await user.save();

    // Send email
    await sendVerificationEmail(email, newOtp);

    return NextResponse.json(
      {
        success: true,
        message: `A new OTP has been sent to your email. Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Resend OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}