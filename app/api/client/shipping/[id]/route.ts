import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Shipping } from "@/app/_backend/models/shipping.model";
import { getAuthUser } from "@/app/_backend/util/auth";
import { setDefaultAddress } from "@/app/_backend/util/shippingHelpers";

// ✅ Reusable params type (Next.js 15)
type RouteParams<T> = {
  params: Promise<T>;
};

// ======================
// ✏️ UPDATE ADDRESS
// ======================
export async function PUT(
  req: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    await dbConnect();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid address ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      street,
      city,
      state,
      postalCode,
      country,
      label,
      isDefault,
    } = body;

    const address = await Shipping.findOne({
      _id: id,
      user: user._id,
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // ✅ Safe updates
    if (street !== undefined) address.address.street = street;
    if (city !== undefined) address.address.city = city;
    if (state !== undefined) address.address.state = state;
    if (postalCode !== undefined) address.address.postalCode = postalCode;
    if (country !== undefined) address.address.country = country;
    if (label !== undefined) address.label = label;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    // ✅ Handle default logic
    if (address.isDefault) {
      await setDefaultAddress(user._id, address._id);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully",
        address,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Update shipping address error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================
// 🗑 DELETE ADDRESS
// ======================
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    await dbConnect();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid address ID" },
        { status: 400 }
      );
    }

    const address = await Shipping.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // ✅ If deleted default → assign new default
    if (address.isDefault) {
      const newDefault = await Shipping.findOne({
        user: user._id,
      }).sort({ createdAt: -1 });

      if (newDefault) {
        newDefault.isDefault = true;
        await newDefault.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Delete shipping address error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}