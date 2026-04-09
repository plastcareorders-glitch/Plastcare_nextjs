import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "@/app/_backend/db/mongoose";
import { Product } from "@/app/_backend/models/product.model";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});

// ✅ Upload helper (NO pipe, NO busboy)
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

// ✅ Safe JSON parser
function safeParse(input: any, fieldName: string) {
  if (!input) return [];
  try {
    return typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    throw new Error(`Invalid ${fieldName} JSON format`);
  }
}

// ✅ POST API
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // ✅ 1. Use built-in formData (IMPORTANT)
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

    const files = formData.getAll("images") as File[];

    // ✅ 2. Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { message: "Title, description, price & category are required" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "Images are required" },
        { status: 400 }
      );
    }

    // ✅ 3. Parse JSON fields
    let variants = [];
    let tags = [];

    try {
      variants = safeParse(variantsRaw, "variants");
      tags = safeParse(tagsRaw, "tags");
    } catch (err: any) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }

    // ✅ 4. Upload images
    const uploadedImages = [];

    for (const file of files) {
      if (file.size === 0) continue;

      const uploaded = await uploadToCloudinary(file, "products");
      uploadedImages.push(uploaded);
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 500 }
      );
    }

    // ✅ 5. Create product
    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      category,
      brand: brand || "",
      stock: stock ? Number(stock) : 0,
      sku: sku || null,
      variants,
      tags,
      images: uploadedImages,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created",
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ addProduct error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}