// app/api/shipping/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Shipping } from "@/app/_backend/models/shipping.model";
import { getAuthUser } from "@/app/_backend/util/auth";
import { setDefaultAddress } from "@/app/_backend/util/shippingHelpers";

// GET /api/shipping - Fetch all shipping addresses for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await Shipping.find({ user: user._id }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    console.error("❌ Fetch shipping addresses error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/shipping - Add a new shipping address
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { street, city, state, postalCode, country, label, isDefault } = await req.json();

    if (!street || !city || !state || !postalCode) {
      return NextResponse.json(
        { message: "Street, city, state, and postal code are required" },
        { status: 400 }
      );
    }

    // If this is the first address for the user, force it to be default
    const addressCount = await Shipping.countDocuments({ user: user._id });
    const shouldBeDefault = addressCount === 0 ? true : (isDefault || false);

    const newAddress = await Shipping.create({
      user: user._id,
      address: { street, city, state, postalCode, country: country || "India" },
      label: label || "Home",
      isDefault: shouldBeDefault,
    });

    // If this address is set as default, update other addresses
    if (shouldBeDefault) {
      await setDefaultAddress(user._id, newAddress._id);
    }

    return NextResponse.json(
      { success: true, message: "Address added successfully", address: newAddress },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Add shipping address error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}