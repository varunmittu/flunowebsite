import { NextRequest, NextResponse } from "next/server";
import { connectDB }  from "@/lib/mongodb";
import { Order }      from "@/lib/models/Order";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page   = parseInt(searchParams.get("page") || "1");
  const limit  = 20;

  await connectDB();
  const query = status && status !== "all" ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
}
