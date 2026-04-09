// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Optional: reset failed attempts & unlock account
    user.failedAttempts = 0;
    user.isLocked = false;
    user.lockoutUntil = null;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}