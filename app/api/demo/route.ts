// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/_backend/db/mongoose";

export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test DB route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}