// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Product } from "@/app/_backend/models/product.model";
import { getAuthUser } from "@/app/_backend/util/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Optional auth – we don't block unauthenticated users
    const user = await getAuthUser(req);
    const isAuthenticated = !!user;

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "-createdAt"; // e.g., "-price", "title"
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");

    // Build filter object
    const filter: any = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // lean for performance

    const total = await Product.countDocuments(filter);

    // If authenticated, you can attach user-specific data here
    // e.g., check if product is in user's wishlist
    if (isAuthenticated) {
      // Example: Attach wishlist flag (if you have a Wishlist model)
      // const wishlist = await Wishlist.findOne({ user: user._id });
      // const wishlistProductIds = wishlist?.products.map(p => p.toString()) || [];
      // products.forEach(p => { p.inWishlist = wishlistProductIds.includes(p._id.toString()) });
    }

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Fetch products error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}