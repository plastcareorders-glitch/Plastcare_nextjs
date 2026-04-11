import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { User } from "@/app/_backend/models/user.model";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  // Validate state parameter to prevent CSRF
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", req.url)
    );
  }

  try {
    await dbConnect();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user info from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      throw new Error("Google account did not return an email address.");
    }

    const { email, name, picture, id: googleId } = data;

    // Try to find user by email
    let user = await User.findOne({ email });

    if (user) {
      // User exists – handle linking or just login
      if (user.authProvider === "local") {
        // Option 1: Automatically link Google account to existing local user
        user.googleId = googleId;
        user.profilePic = picture || user.profilePic;
        // Option 2: Or reject with an error – choose based on your business logic
        // return NextResponse.redirect(new URL("/login?error=email_exists_local", req.url));
      }

      // Update user info from Google (if you want to keep it fresh)
      user.username = name || user.username;
      user.profilePic = picture || user.profilePic;
      user.isVerified = true; // Google accounts are pre‑verified
      user.lastLoginIp =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("cf-connecting-ip") ||
        "";
      await user.save();
    } else {
      // Create a new user with Google provider
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        googleId,
        authProvider: "google",
        profilePic: picture || "",
        isVerified: true,
        registrationIp:
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "",
        lastLoginIp:
          req.headers.get("x-forwarded-for") ||
          req.headers.get("cf-connecting-ip") ||
          "",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Clear the OAuth state cookie
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.delete("oauth_state");

    // Set authentication cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("❌ Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", req.url)
    );
  }
}