import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Verify the user is authenticated
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { message: "Authorization code is required" },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Ensure the Google email matches the user's email (optional but recommended)
    if (data.email !== user.email) {
      return NextResponse.json(
        { message: "Google account email does not match current user email." },
        { status: 400 }
      );
    }

    user.googleId = data.id!;
    user.profilePic = data.picture || user.profilePic;
    if (user.authProvider === "local") {
      user.authProvider = "google"; // or keep as "local" if you want both
    }
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Google account linked successfully.",
    });
  } catch (error: any) {
    console.error("❌ Link Google error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}