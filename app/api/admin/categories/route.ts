import { NextRequest, NextResponse } from "next/server";
import { connectDB }      from "@/lib/mongodb";
import { CategoryModel }  from "@/lib/models/Category";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const categories = await CategoryModel.find().sort({ order: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const category = await CategoryModel.create(body);
  return NextResponse.json({ category }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...body } = await req.json();
  await connectDB();
  const category = await CategoryModel.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await connectDB();
  await CategoryModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
