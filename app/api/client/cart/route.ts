// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Cart } from "@/app/_backend/models/cart.model";
import { Product } from "@/app/_backend/models/product.model";
import { getAuthUser } from "@/app/_backend/util/auth";
import { recalculateCartTotals } from "@/app/_backend/util/cartHelpers";

// GET /api/cart - Fetch user's cart
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let cart = await Cart.findOne({ user: user._id }).populate(
      "items.product",
      "title images price salePrice"
    );

    if (!cart) {
      // Return empty cart structure
      return NextResponse.json({
        success: true,
        cart: { items: [], totalAmount: 0, totalItems: 0 },
      });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("❌ Fetch cart error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart (or increase quantity if exists)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, variant } = await req.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Product ID and valid quantity are required" },
        { status: 400 }
      );
    }

    // Validate product and get current price
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const price = product.salePrice || product.price;

    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }

    // Check if item already exists (same product and variant)
    const existingItemIndex = cart.items.findIndex(
      (item: { product: { toString: () => any; }; variant: any; }) =>
        item.product.toString() === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant || {})
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        quantity,
        price,
        variant: variant || undefined,
      });
    }

    await recalculateCartTotals(cart);
    await cart.populate("items.product", "title images price salePrice");

    return NextResponse.json(
      { success: true, message: "Item added to cart", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Add to cart error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart?productId=xxx&variant=... (remove single item)
// DELETE /api/cart?clear=true (clear entire cart)
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clear = searchParams.get("clear") === "true";
    const productId = searchParams.get("productId");
    const variantRaw = searchParams.get("variant");

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { success: true, message: "Cart is already empty", cart: { items: [], totalAmount: 0, totalItems: 0 } },
        { status: 200 }
      );
    }

    if (clear) {
      // Clear entire cart
      cart.items = [];
      await recalculateCartTotals(cart);
      return NextResponse.json(
        { success: true, message: "Cart cleared", cart },
        { status: 200 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { message: "productId is required for removal" },
        { status: 400 }
      );
    }

    let variant = null;
    if (variantRaw) {
      try {
        variant = JSON.parse(variantRaw);
      } catch {
        variant = null;
      }
    }

    // Remove specific item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item: { product: { toString: () => string; }; variant: any; }) =>
        !(
          item.product.toString() === productId &&
          JSON.stringify(item.variant) === JSON.stringify(variant || {})
        )
    );

    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    await recalculateCartTotals(cart);
    await cart.populate("items.product", "title images price salePrice");

    return NextResponse.json(
      { success: true, message: "Item removed from cart", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Cart delete error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, variant } = await req.json();

    if (!productId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { message: "Product ID and valid quantity are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: { product: { toString: () => any; }; variant: any; }) =>
        item.product.toString() === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant || {})
    );

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not in cart" }, { status: 404 });
    }

    if (quantity === 0) {
      // Remove item if quantity set to 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await recalculateCartTotals(cart);
    await cart.populate("items.product", "title images price salePrice");

    return NextResponse.json(
      { success: true, message: "Cart updated", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Update cart error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}