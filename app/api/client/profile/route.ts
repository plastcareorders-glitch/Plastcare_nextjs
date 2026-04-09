// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/app/_backend/util/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Return user data (excluding sensitive fields already removed in getAuthUser)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // lastLoginIp: user.lastLoginIp, // optional, include if needed
          // registrationIp: user.registrationIp,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}