// app/_backend/utils/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User, IUser } from "@/app/_backend/models/user.model";

export async function getAuthUser(req: NextRequest): Promise<IUser | null> {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password -resetPasswordToken -resetPasswordExpire -otpCode -otpExpires -lastOtpSentAt -emailVerifyToken -emailVerifyExpire");
    
    return user;
  } catch (error) {
    return null;
  }
}