import { NextRequest, NextResponse } from "next/server";
import { connectDB }     from "@/lib/mongodb";
import { ProductModel }  from "@/lib/models/Product";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.slug || body.price === undefined) {
    return NextResponse.json({ error: "name, slug and price are required" }, { status: 400 });
  }

  await connectDB();

  const existing = await ProductModel.findOne({ slug: body.slug });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const product = await ProductModel.create(body);
  return NextResponse.json({ product }, { status: 201 });
}
