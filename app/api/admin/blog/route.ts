import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/mongodb";
import { BlogModel }  from "@/lib/models/Blog";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const posts = await BlogModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: "title and slug required" }, { status: 400 });
  }

  await connectDB();
  const existing = await BlogModel.findOne({ slug: body.slug });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const post = await BlogModel.create(body);
  return NextResponse.json({ post }, { status: 201 });
}
