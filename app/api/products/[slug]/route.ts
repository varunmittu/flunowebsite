import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug: params.slug, active: true }).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
