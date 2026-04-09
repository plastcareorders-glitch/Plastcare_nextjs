// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Product } from "@/app/_backend/models/product.model";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});

// ✅ Upload helper
async function uploadToCloudinary(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{ public_id: string; url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      })
      .end(buffer);
  });
}

// ✅ Delete helper
async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

// ✅ Safe JSON parser
function safeParse(input: any, fieldName: string) {
  if (!input) return [];

  try {
    if (typeof input === "string") {
      return JSON.parse(input);
    }
    return input;
  } catch {
    throw new Error(`Invalid ${fieldName} JSON format`);
  }
}

// ✅ PUT (EDIT PRODUCT)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX HERE
) {
  try {
    await dbConnect();

    // ✅ FIX: await params
    const { id: productId } = await params;

    // ✅ Validate Mongo ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const salePrice = formData.get("salePrice") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const stock = formData.get("stock") as string;
    const sku = formData.get("sku") as string;
    const variantsRaw = formData.get("variants");
    const tagsRaw = formData.get("tags");

    const newFiles = formData.getAll("images") as File[];

    // ✅ Validation
    if (title !== null && title.trim() === "") {
      return NextResponse.json({ message: "Title cannot be empty" }, { status: 400 });
    }

    if (price !== null && (isNaN(Number(price)) || Number(price) < 0)) {
      return NextResponse.json({ message: "Invalid price" }, { status: 400 });
    }

    if (category !== null) {
      const allowedCategories = [
        "Cookware",
        "Home Storage",
        "Kitchen Essentials",
        "Bathroom Essentials",
        "Home Furnishing",
        "Wooden Furniture",
        "Kids",
        "Sofa",
      ];

      if (!allowedCategories.includes(category)) {
        return NextResponse.json({ message: "Invalid category" }, { status: 400 });
      }
    }

    // ✅ Parse JSON safely
    let variants = existingProduct.variants;
    let tags = existingProduct.tags;

    try {
      if (variantsRaw !== null) variants = safeParse(variantsRaw, "variants");
      if (tagsRaw !== null) tags = safeParse(tagsRaw, "tags");
    } catch (err: any) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }

    // ✅ Image Handling
    let uploadedImages = existingProduct.images;

    if (newFiles && newFiles.length > 0 && newFiles[0].size > 0) {
      // Delete old images
      for (const img of existingProduct.images) {
        try {
          await deleteFromCloudinary(img.public_id);
        } catch (err) {
          console.warn("Cloudinary delete failed:", err);
        }
      }

      // Upload new images
      const newImages = [];

      for (const file of newFiles) {
        if (file.size === 0) continue;

        const uploaded = await uploadToCloudinary(file, "products");
        newImages.push(uploaded);
      }

      if (newImages.length === 0) {
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
      }

      uploadedImages = newImages;
    }

    // ✅ Build update object
    const updateData: any = {};

    if (title !== null) updateData.title = title.trim();
    if (description !== null) updateData.description = description.trim();
    if (price !== null) updateData.price = Number(price);
    if (salePrice !== null) updateData.salePrice = salePrice ? Number(salePrice) : null;
    if (category !== null) updateData.category = category;
    if (brand !== null) updateData.brand = brand;
    if (stock !== null) updateData.stock = Number(stock);
    if (sku !== null) updateData.sku = sku || null;

    updateData.variants = variants;
    updateData.tags = tags;
    updateData.images = uploadedImages;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("❌ Edit product error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    await dbConnect();

    // ✅ FIX: await params
    const { id: productId } = await params;

    // ✅ Validate MongoDB ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await deleteFromCloudinary(img.public_id);
        } catch (err) {
          console.warn(`⚠️ Failed to delete ${img.public_id}:`, err);
          // continue deleting others
        }
      }
    }

    // ✅ Delete product from DB
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Delete product error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ IMPORTANT FIX
) {
  try {
    await dbConnect();

    const { id: productId } = await params;

    // ✅ Validate ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error("❌ Fetch single product error:", error);

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
