import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured  = searchParams.get("featured");

    await connectDB();

    const query: Record<string, unknown> = { active: true };
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;

    const products = await ProductModel.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
