// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Product } from "@/app/_backend/models/product.model";
import { getAuthUser } from "@/app/_backend/util/auth";

type Params = { id: string };

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> } // ✅ params is async now
) {
  try {
    await dbConnect();

    // ✅ FIX: await params
    const { id } = await context.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // ✅ Optional auth
    const user = await getAuthUser(req);
    const isAuthenticated = !!user;

    // ✅ Fetch product (lean for performance)
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Example: attach user-specific data
    if (isAuthenticated) {
      // You can extend this later (wishlist, cart, etc.)
      // product.inWishlist = false;
    }

    return NextResponse.json(
      { success: true, product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Fetch single product error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}